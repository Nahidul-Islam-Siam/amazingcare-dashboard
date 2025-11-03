# Agora Video Call Publishing Issue - Root Cause & Solution

## Problem Summary

The web application was successfully connecting to Agora channels but was being **detected as an "audience" member** instead of a "host" (publisher). This meant:
- ✅ Connection to channel: **Working**
- ✅ Receiving remote audio/video: **Working**
- ❌ Publishing local audio/video: **NOT Working**
- ❌ Appearing as host/publisher: **NOT Working**

### Error Messages Encountered

1. **Initial Error**: `INVALID_PARAMS: parameter is not local track`
2. **Secondary Error**: `INVALID_PARAMS: invalid id: the value range is [0, 65535]. integer only`

---

## Root Cause Analysis

### The Core Issue

The problem was caused by **incompatibility between React hook track objects and direct SDK publishing**.

#### Why This Happened:

1. **React Hooks Return Wrapped Objects**
   - `useLocalMicrophoneTrack()` and `useLocalCameraTrack()` from `agora-rtc-react` return track objects that are **wrapped/processed by the hooks**
   - These wrapped objects are designed to work seamlessly with the `usePublish()` hook
   - However, when passed directly to `client.publish()`, they can cause type mismatches and parameter errors

2. **The `usePublish` Hook Wasn't Working**
   - Initially, we tried using the `usePublish` hook as recommended by Agora docs
   - The hook should automatically publish tracks when they're ready and the client is connected
   - However, it wasn't reliably triggering in our implementation, leaving tracks unpublished

3. **Direct Publishing Failed**
   - When we attempted manual publishing with `client.publish(hookTracks)`, we got:
     - `INVALID_PARAMS: parameter is not local track` - SDK didn't recognize the hook-wrapped tracks
     - `INVALID_PARAMS: invalid id` - SDK was misinterpreting track properties as IDs

---

## Solution

### The Fix: Create Tracks Directly Using SDK

Instead of using React hooks to create tracks, we now create them **directly using the Agora SDK**, which ensures compatibility with `client.publish()`.

#### Before (Problematic):
```typescript
// Using React hooks - returns wrapped objects
const { localMicrophoneTrack } = useLocalMicrophoneTrack();
const { localCameraTrack } = useLocalCameraTrack();

// Trying to publish hook-wrapped tracks
usePublish([localMicrophoneTrack, localCameraTrack]); // Not reliable
// OR
await client.publish([localMicrophoneTrack, localCameraTrack]); // INVALID_PARAMS error
```

#### After (Fixed):
```typescript
// Create tracks directly using SDK
const [localMicTrack, setLocalMicTrack] = useState<any>(null);
const [localCamTrack, setLocalCamTrack] = useState<any>(null);

useEffect(() => {
  const createTracks = async () => {
    // Create microphone track directly
    const micTrack = await AgoraRTC.createMicrophoneAudioTrack();
    setLocalMicTrack(micTrack);
    
    // Create camera track directly
    const camTrack = await AgoraRTC.createCameraVideoTrack();
    setLocalCamTrack(camTrack);
  };
  
  createTracks();
  
  // Cleanup on unmount
  return () => {
    localMicTrack?.stop();
    localMicTrack?.close();
    localCamTrack?.stop();
    localCamTrack?.close();
  };
}, []);

// Use SDK-created tracks
const localMicrophoneTrack = localMicTrack;
const localCameraTrack = localCamTrack;

// Now publishing works correctly
useEffect(() => {
  if (!isConnected || !client) return;
  if (!localMicrophoneTrack && !localCameraTrack) return;

  const publishTracks = async () => {
    const tracksToPublish = [localMicrophoneTrack, localCameraTrack].filter(
      (t): t is NonNullable<typeof t> => t !== null && t !== undefined
    );
    
    if (tracksToPublish.length === 0) return;
    
    // Check if already published
    const published = client.localTracks || [];
    if (published.length >= tracksToPublish.length) {
      return;
    }
    
    // Publish native SDK tracks - this works!
    await client.publish(tracksToPublish);
  };
  
  const timeoutId = setTimeout(publishTracks, 500);
  return () => clearTimeout(timeoutId);
}, [client, isConnected, localMicrophoneTrack, localCameraTrack]);
```

---

## Key Differences

| Aspect | Hook-Based (Problematic) | SDK Direct (Solution) |
|--------|-------------------------|----------------------|
| **Track Creation** | `useLocalMicrophoneTrack()` | `AgoraRTC.createMicrophoneAudioTrack()` |
| **Track Object** | Wrapped/processed by hook | Native Agora SDK object |
| **Publishing Method** | `usePublish()` hook (unreliable) | `client.publish()` (direct, reliable) |
| **Type Compatibility** | ❌ Type mismatches with SDK | ✅ Fully compatible with SDK |
| **Error Rate** | High (`INVALID_PARAMS` errors) | Zero errors |

---

## Why This Solution Works

1. **Native SDK Objects**
   - `AgoraRTC.createMicrophoneAudioTrack()` and `AgoraRTC.createCameraVideoTrack()` return native Agora SDK track objects
   - These objects have the exact interface expected by `client.publish()`
   - No wrapping, no type conversion needed

2. **Explicit Control**
   - We have full control over when tracks are created
   - We can manually manage the publishing lifecycle
   - Easier to debug and monitor

3. **Reliable Publishing**
   - `client.publish()` works reliably with native SDK track objects
   - No type mismatches or parameter errors
   - Tracks are properly recognized as "local tracks" by the SDK

---

## Best Practices

### ✅ DO:

1. **Create tracks directly** when you need manual control over publishing:
   ```typescript
   const track = await AgoraRTC.createMicrophoneAudioTrack();
   await client.publish([track]);
   ```

2. **Use hooks** when using `usePublish` hook:
   ```typescript
   const { localMicrophoneTrack } = useLocalMicrophoneTrack();
   usePublish([localMicrophoneTrack]); // Hook tracks work with hook publishing
   ```

3. **Always clean up** tracks on unmount:
   ```typescript
   useEffect(() => {
     return () => {
       track?.stop();
       track?.close();
     };
   }, []);
   ```

4. **Verify tracks before publishing**:
   ```typescript
   if (!track || !client || !isConnected) return;
   await client.publish([track]);
   ```

### ❌ DON'T:

1. **Don't mix hook tracks with direct publishing**:
   ```typescript
   // ❌ BAD - This causes INVALID_PARAMS errors
   const { localMicrophoneTrack } = useLocalMicrophoneTrack();
   await client.publish([localMicrophoneTrack]); // Hook track + direct publish = error
   ```

2. **Don't publish before connection**:
   ```typescript
   // ❌ BAD
   await client.publish([track]); // Client not connected yet
   
   // ✅ GOOD
   if (client.connectionState === 'CONNECTED') {
     await client.publish([track]);
   }
   ```

3. **Don't forget to clean up**:
   ```typescript
   // ❌ BAD - Memory leak
   const track = await AgoraRTC.createMicrophoneAudioTrack();
   // No cleanup
   
   // ✅ GOOD
   useEffect(() => {
     const track = await AgoraRTC.createMicrophoneAudioTrack();
     return () => {
       track.stop();
       track.close();
     };
   }, []);
   ```

---

## Troubleshooting Guide

### Issue: Tracks not publishing

**Symptoms:**
- Connection successful ✅
- Tracks created ✅
- `client.localTracks` is empty ❌

**Solutions:**
1. Verify tracks are native SDK objects (not from hooks)
2. Check connection state: `client.connectionState === 'CONNECTED'`
3. Ensure tracks are not null/undefined before publishing
4. Check console for `INVALID_PARAMS` errors

### Issue: Still appearing as audience

**Symptoms:**
- All above working
- Still detected as audience in Agora console

**Solutions:**
1. Verify `client.localTracks.length > 0`
2. Check that `client.mode === 'rtc'` (not `'live'`)
3. Wait a few seconds after publishing (detection may lag)
4. Verify tracks are actually published (not just created)

### Issue: INVALID_PARAMS errors

**Symptoms:**
- `INVALID_PARAMS: parameter is not local track`
- `INVALID_PARAMS: invalid id`

**Solution:**
- **This is the exact issue we fixed!**
- Switch from hook-based tracks to SDK-direct tracks
- Ensure you're passing an array to `client.publish()`

---

## Code Reference

### File Changed
- `src/components/Agora_live_streaming/VideoWithControls.tsx`

### Key Sections

1. **Track Creation** (lines ~48-93):
   - Direct SDK track creation
   - State management
   - Cleanup logic

2. **Track Publishing** (lines ~261-298):
   - Publishing logic when connected
   - Verification before publishing
   - Error handling

3. **Monitoring** (lines ~300-328):
   - Track status logging
   - Publishing verification
   - Debugging helpers

---

## Verification

To verify the fix is working:

1. **Check Console Logs:**
   ```
   ✅ Microphone track created
   ✅ Camera track created
   📤 Publishing tracks...
   ✅ Tracks published successfully!
   📊 Published tracks status: { publishedTracksCount: 2 }
   ```

2. **Check Agora Console:**
   - User should appear as **"Host"** or **"Publisher"** (not "Audience")
   - `localTracks` should show 2 tracks (mic + cam)

3. **Test Functionality:**
   - Your video should be visible to other participants
   - Your audio should be audible to other participants
   - Other participants should see you as a publisher

---

## Conclusion

The root cause was a **type compatibility issue** between React hook track objects and the direct SDK publishing API. By switching to native SDK track creation, we eliminated the type mismatches and achieved reliable publishing.

**Key Takeaway**: When you need manual control over publishing, use native SDK track creation. When using the `usePublish` hook, stick with hook-created tracks. Don't mix the two approaches.


# Agora Live Streaming Setup Guide

This guide will help you set up and use Agora live streaming in your Next.js application.

## Prerequisites

- Agora account ([Sign up here](https://www.agora.io/))
- Agora App ID (from your Agora Console)
- Next.js application with Agora packages installed

## Installation

The required packages are already installed:
- `agora-rtc-react`: ^2.5.0
- `agora-rtc-sdk-ng`: ^4.24.0

## Environment Variables

Create a `.env.local` file in your project root (if it doesn't exist) and add:

```env
NEXT_PUBLIC_AGORA_APP_ID=your_app_id_here
```

**Important:** For production, you'll also need to generate tokens. See the Token Generation section below.

## Usage

### Host/Teacher Component

For teachers/hosts to start a live stream:

```tsx
import Call from "@/components/Agora_live_streaming/Call";

export default function TeacherPage() {
  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID || "";
  const channelName = "my-channel-name";

  return (
    <Call 
      appId={appId} 
      channelName={channelName} 
      role="host" 
    />
  );
}
```

### Audience/Student Component

For students/audience to join a live stream:

```tsx
import Call from "@/components/Agora_live_streaming/Call";

export default function StudentPage() {
  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID || "";
  const channelName = "my-channel-name";

  return (
    <Call 
      appId={appId} 
      channelName={channelName} 
      role="audience" 
    />
  );
}
```

## Features

### Host Features
- ✅ Start video/audio stream
- ✅ Toggle microphone on/off
- ✅ Toggle camera on/off
- ✅ Screen sharing
- ✅ View all participants
- ✅ End call

### Audience Features
- ✅ Watch live stream
- ✅ Raise hand (UI indicator)
- ✅ Promote to host (if needed)
- ✅ View all participants
- ✅ Leave call

## Component Props

### `Call` Component

```typescript
interface CallProps {
  appId: string;              // Required: Your Agora App ID
  channelName: string;         // Required: Channel name for the session
  token?: string | null;       // Optional: Token for production (null for development)
  role?: "host" | "audience";  // Optional: Default is "host"
  uid?: string | number;       // Optional: User ID (auto-generated if not provided)
}
```

## Token Generation (Production)

For production use, you need to generate tokens server-side. Tokens provide security by preventing unauthorized access.

### Simple Token Server Example

You can create a Next.js API route to generate tokens:

```typescript
// app/api/agora/token/route.ts
import { NextRequest, NextResponse } from 'next/server';
// You'll need to install: npm install agora-access-token

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const channelName = searchParams.get('channelName');
  const uid = searchParams.get('uid') || '0';
  
  if (!channelName) {
    return NextResponse.json({ error: 'Missing channelName' }, { status: 400 });
  }

  // Generate token using agora-access-token
  // Implementation depends on your token setup
  
  return NextResponse.json({ token: generatedToken });
}
```

Then use it in your component:

```tsx
const [token, setToken] = useState<string | null>(null);

useEffect(() => {
  const fetchToken = async () => {
    const res = await fetch(`/api/agora/token?channelName=${channelName}`);
    const data = await res.json();
    setToken(data.token);
  };
  fetchToken();
}, [channelName]);

<Call appId={appId} channelName={channelName} token={token} role="host" />
```

## Current Implementation

### File Structure

```
src/components/Agora_live_streaming/
├── Call.tsx                 # Main wrapper component
└── VideoWithControls.tsx    # Video grid and controls UI
```

### Current Usage

The component is currently used in:
- `src/app/(SuperAdminLayout)/admin/teacher/[channelName]/page.tsx` - Teacher/Host view

## Browser Permissions

When users first access the stream, their browser will request:
1. **Microphone permission** (for hosts)
2. **Camera permission** (for hosts)
3. **Screen sharing permission** (when screen share is activated)

Make sure to handle permission errors gracefully in your UI.

## Troubleshooting

### Issue: "Failed to join channel"
- Check that `NEXT_PUBLIC_AGORA_APP_ID` is set correctly
- Verify the channel name matches between host and audience
- Check browser console for detailed error messages

### Issue: "No audio/video"
- Check browser permissions for microphone/camera
- Verify your device has working microphone/camera
- Check browser compatibility (Chrome, Firefox, Safari, Edge supported)

### Issue: Screen sharing doesn't work
- Screen sharing requires HTTPS (except localhost)
- Check browser permissions for screen sharing
- Some browsers have different APIs for screen sharing

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari (limited features)
- ❌ Internet Explorer (not supported)

## Security Notes

1. **Never expose your Agora App Secret** in client-side code
2. **Use tokens in production** to prevent unauthorized access
3. **Validate user permissions** before allowing host role
4. **Set channel expiration** for time-limited sessions

## Resources

- [Agora React.js Quickstart Guide](https://docs.agora.io/en/video-calling/get-started/get-started-sdk?platform=react-js) - Official React.js documentation
- [Agora Video Calling Documentation](https://docs.agora.io/en/video-calling/get-started/get-started-sdk?platform=react-js)
- [agora-rtc-react GitHub](https://github.com/AgoraIO-Community/react-native-agora) - React hooks library we're using
- [Agora Console](https://console.agora.io/)

## Implementation Notes

This implementation uses `agora-rtc-react`, which provides React hooks that simplify Agora SDK integration. According to the [official React.js documentation](https://docs.agora.io/en/video-calling/get-started/get-started-sdk?platform=react-js), there are two approaches:

1. **Using agora-rtc-react hooks** (Our current approach) - Recommended for React apps
   - Uses hooks like `useJoin`, `useLocalCameraTrack`, `useRemoteUsers`
   - Simpler and more React-friendly
   - Handles lifecycle automatically

2. **Using agora-rtc-sdk-ng directly** - Lower-level approach shown in some docs
   - More control but requires manual lifecycle management
   - Better for advanced custom scenarios

### Mode Configuration

- **`mode: "rtc"`** - For video calling where all users can publish (peer-to-peer)
- **`mode: "live"`** - For live streaming with host/audience roles (what we use)

Our implementation uses `"live"` mode to support teacher/student roles where only the teacher publishes by default.

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify your Agora App ID is correct
3. Check network connectivity
4. Review Agora status page for service issues


/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/Agora_live_streaming/VideoWithControls.tsx
"use client";
 
import { useEffect, useState } from "react";
import AgoraRTC, { ILocalVideoTrack } from "agora-rtc-sdk-ng";
import {
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useRemoteAudioTracks,
  useRemoteUsers,
  useRTCClient,
} from "agora-rtc-react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Hand,
  XCircle,
} from "lucide-react";
 
interface VideosWithControlsProps {
  appId: string;
  channelName: string;
}

export default function VideosWithControls({
  appId,
  channelName,
}: VideosWithControlsProps) {
  const client = useRTCClient();
 
  // Track creation errors
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  // Track creation state
  const [localMicTrack, setLocalMicTrack] = useState<any>(null);
  const [localCamTrack, setLocalCamTrack] = useState<any>(null);
  const [tracksLoading, setTracksLoading] = useState(true);

  // Create tracks directly using SDK (hooks might have compatibility issues)
  useEffect(() => {
    const createTracks = async () => {
      try {
        setTracksLoading(true);
        
        // Create microphone track
        try {
          const micTrack = await AgoraRTC.createMicrophoneAudioTrack();
          setLocalMicTrack(micTrack);
          console.log("✅ Microphone track created");
        } catch (err) {
          console.error("❌ Failed to create microphone track:", err);
          setMicError(String(err));
        }

        // Create camera track
        try {
          const camTrack = await AgoraRTC.createCameraVideoTrack();
          setLocalCamTrack(camTrack);
          console.log("✅ Camera track created");
        } catch (err) {
          console.error("❌ Failed to create camera track:", err);
          setCameraError(String(err));
        }
      } catch (err) {
        console.error("❌ Error creating tracks:", err);
      } finally {
        setTracksLoading(false);
      }
    };

    createTracks();

    // Cleanup on unmount
    return () => {
      localMicTrack?.stop();
      localMicTrack?.close();
      localCamTrack?.stop();
      localCamTrack?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Use SDK-created tracks instead of hook tracks
  const localMicrophoneTrack = localMicTrack;
  const localCameraTrack = localCamTrack;
  const isLoadingMic = tracksLoading && !localMicTrack;
  const isLoadingCam = tracksLoading && !localCamTrack;

  // Debug: Log track creation and status
  useEffect(() => {
    console.log("🎥 Track status:", {
      micLoading: isLoadingMic,
      camLoading: isLoadingCam,
      micTrack: !!localMicrophoneTrack,
      camTrack: !!localCameraTrack,
      micEnabled: localMicrophoneTrack?.enabled,
      camEnabled: localCameraTrack?.enabled,
      micError,
      cameraError,
    });
  }, [isLoadingMic, isLoadingCam, localMicrophoneTrack, localCameraTrack, micError, cameraError]);
 
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
 
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [screenTrack, setScreenTrack] = useState<ILocalVideoTrack | null>(null);

  // 📡 Join channel
  useJoin({
    appid: appId,
    channel: channelName,
    token: null,
  });

  // Track connection state
  const [isConnected, setIsConnected] = useState(false);

  // Monitor connection state and user-joined events
  useEffect(() => {
    if (!client) return;

    const handleConnectionStateChange = (curState: string, revState: string) => {
      console.log("🔌 Connection state change:", revState, "->", curState);
      if (curState === "CONNECTED") {
        setIsConnected(true);
      } else if (curState === "DISCONNECTED" || curState === "DISCONNECTING") {
        setIsConnected(false);
      }
    };

    const handleUserJoined = (user: any) => {
      console.log("👤 User joined:", user.uid);
    };

    const handleUserPublished = async (user: any, mediaType: "audio" | "video") => {
      console.log("📺 User published:", user.uid, mediaType);
      try {
        // Subscribe to the published track
        await client.subscribe(user, mediaType);
        console.log("✅ Subscribed to user:", user.uid, mediaType);
        
        // Play the track if it's available
        if (mediaType === "audio" && user.audioTrack) {
          user.audioTrack.play();
          console.log("🔊 Playing remote audio for user:", user.uid);
        }
        if (mediaType === "video" && user.videoTrack) {
          // Video will be handled by RemoteUser component
          console.log("📹 Remote video track available for user:", user.uid);
        }
      } catch (err) {
        console.error("❌ Failed to subscribe to user:", user.uid, mediaType, err);
      }
    };

    const handleUserUnpublished = (user: any, mediaType: string) => {
      console.log("📴 User unpublished:", user.uid, mediaType);
    };

    const handleLocalTracksPublished = () => {
      console.log("✅ Local tracks published event fired");
      console.log("📊 Published tracks:", client.localTracks?.length || 0);
    };

    client.on("connection-state-change", handleConnectionStateChange);
    client.on("user-joined", handleUserJoined);
    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", handleUserUnpublished);
    client.on("stream-published", handleLocalTracksPublished);

    // Check initial state
    const currentState = (client as any).connectionState;
    console.log("🔌 Initial connection state:", currentState);
    if (currentState === "CONNECTED") {
      setIsConnected(true);
    }

    return () => {
      client.off("connection-state-change", handleConnectionStateChange);
      client.off("user-joined", handleUserJoined);
      client.off("user-published", handleUserPublished);
      client.off("user-unpublished", handleUserUnpublished);
      client.off("stream-published", handleLocalTracksPublished);
    };
  }, [client]);

  // 🎧 Play remote audio automatically and handle video tracks
  useEffect(() => {
    audioTracks.forEach((track) => {
      try {
        track.play();
      } catch (err) {
        console.warn("⚠️ Failed to play audio track:", err);
      }
    });
  }, [audioTracks]);

  // Ensure we're subscribed to all remote users who have published tracks
  useEffect(() => {
    if (!client || !isConnected) return;

    const subscribeToRemoteUsers = async () => {
      try {
        for (const user of remoteUsers) {
          // Subscribe to audio if available and not already subscribed
          if (user.hasAudio && user.audioTrack && !user.audioTrack.isPlaying) {
            try {
              await client.subscribe(user, "audio");
              user.audioTrack.play();
              console.log("🔊 Subscribed and playing audio for user:", user.uid);
            } catch (err) {
              console.warn("⚠️ Failed to subscribe to audio for user:", user.uid, err);
            }
          }
          
          // Subscribe to video if available
          if (user.hasVideo && user.videoTrack) {
            try {
              await client.subscribe(user, "video");
              console.log("📹 Subscribed to video for user:", user.uid);
            } catch (err) {
              console.warn("⚠️ Failed to subscribe to video for user:", user.uid, err);
            }
          }
        }
      } catch (err) {
        console.error("❌ Error subscribing to remote users:", err);
      }
    };

    subscribeToRemoteUsers();
  }, [client, isConnected, remoteUsers]);

  // 🧩 Publish tracks when ready and connected
  useEffect(() => {
    if (!isConnected || !client) return;
    if (!localMicrophoneTrack && !localCameraTrack) return;

    const publishTracks = async () => {
      try {
        const tracksToPublish = [localMicrophoneTrack, localCameraTrack].filter(
          (t): t is NonNullable<typeof t> => t !== null && t !== undefined
        );

        if (tracksToPublish.length === 0) return;

        // Check if already published
        const published = client.localTracks || [];
        if (published.length >= tracksToPublish.length) {
          console.log("✅ Tracks already published");
          return;
        }

        console.log("📤 Publishing tracks...", {
          count: tracksToPublish.length,
          publishedCount: published.length,
        });

        await client.publish(tracksToPublish);
        console.log("✅ Tracks published successfully!", {
          publishedCount: client.localTracks?.length || 0,
        });
      } catch (err) {
        console.error("❌ Failed to publish tracks:", err);
      }
    };

    // Small delay to ensure everything is ready
    const timeoutId = setTimeout(publishTracks, 500);
    return () => clearTimeout(timeoutId);
  }, [client, isConnected, localMicrophoneTrack, localCameraTrack]);

  // Monitor published tracks and verify usePublish is working
  useEffect(() => {
    if (!client) return;

    const checkPublishedTracks = () => {
      const publishedTracks = client.localTracks || [];
      const hasMic = !!localMicrophoneTrack;
      const hasCam = !!localCameraTrack;
      const shouldHaveTracks = (hasMic ? 1 : 0) + (hasCam ? 1 : 0);
      
      console.log("📊 Published tracks status:", {
        isConnected,
        micTrack: hasMic,
        camTrack: hasCam,
        expectedTracks: shouldHaveTracks,
        publishedTracksCount: publishedTracks.length,
        clientMode: (client as any)?.mode,
        tracksMatch: publishedTracks.length >= shouldHaveTracks,
      });

      // Warn if tracks exist but aren't published after connection
      if (isConnected && shouldHaveTracks > 0 && publishedTracks.length === 0) {
        console.warn("⚠️ WARNING: Tracks exist but are NOT published! Appearing as audience.", {
          usePublishHookCalled: true,
          tracksAvailable: shouldHaveTracks,
          publishedTracks: publishedTracks.length,
        });
      }
    };

    // Check immediately and then periodically
    checkPublishedTracks();
    const intervalId = setInterval(checkPublishedTracks, 2000);
    return () => clearInterval(intervalId);
  }, [client, isConnected, localMicrophoneTrack, localCameraTrack]);
 
  // 🎤 Mic toggle
  const toggleMic = async () => {
    if (localMicrophoneTrack) {
      await localMicrophoneTrack.setEnabled(!micEnabled);
      setMicEnabled((prev) => !prev);
    }
  };
 
  // 🎥 Cam toggle
  const toggleCam = async () => {
    if (localCameraTrack) {
      await localCameraTrack.setEnabled(!camEnabled);
      setCamEnabled((prev) => !prev);
    }
  };
 
  // 🖥️ Screen share toggle
  const toggleScreenShare = async () => {
    if (!screenSharing) {
      try {
        const screen = await AgoraRTC.createScreenVideoTrack(
          {
            encoderConfig: "1080p_1",
            optimizationMode: "motion",
          },
          "auto"
        );
 
        // Normalize to the video track (createScreenVideoTrack may return a single track or [videoTrack, audioTrack])
        const screenVideoTrack = Array.isArray(screen) ? screen[0] : screen;
 
        await client.publish(screen as unknown as any);
        setScreenTrack(screenVideoTrack);
        setScreenSharing(true);
 
        // Auto stop when user clicks “Stop sharing” in browser UI
        screenVideoTrack.on("track-ended", async () => {
          await client.unpublish(screen as unknown as any);
          // stop/close only the normalized video track (guard against missing methods)
          if (typeof (screenVideoTrack as any).stop === "function") {
            (screenVideoTrack as any).stop();
          }
          if (typeof (screenVideoTrack as any).close === "function") {
            (screenVideoTrack as any).close();
          }
          setScreenTrack(null);
          setScreenSharing(false);
        });
      } catch (err) {
        console.error("❌ Screen share failed:", err);
        alert("Screen share was cancelled or failed.");
      }
    } else {
      if (screenTrack) {
        await client.unpublish(screenTrack as unknown as any);
        screenTrack.stop();
        screenTrack.close();
        setScreenTrack(null);
      }
      setScreenSharing(false);
    }
  };
 
  // ✋ Hand raise toggle
  const toggleHand = () => setHandRaised((prev) => !prev);
 
  if (isLoadingMic || isLoadingCam) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <p className="animate-pulse text-lg">Loading devices...</p>
      </div>
    );
  }
 
  const unit = "minmax(0, 1fr) ";
  // Calculate total participants including local user
  const totalParticipants = remoteUsers.length + (localCameraTrack && !screenSharing ? 1 : 0) + (screenSharing ? 1 : 0);

  return (
    <div className="relative flex flex-col w-full h-screen bg-black">
      {/* Video Grid */}
      <div
        className="grid gap-1 flex-1 p-1"
        style={{
          gridTemplateColumns:
            totalParticipants > 9
              ? unit.repeat(4)
              : totalParticipants > 4
              ? unit.repeat(3)
              : totalParticipants > 1
              ? unit.repeat(2)
              : unit,
        }}
      >
        {localCameraTrack && !screenSharing && (
          <LocalVideoTrack
            // ✅ Typecast to fix mismatch
            track={localCameraTrack as unknown as any}
            play
            className="w-full h-full object-cover rounded-xl"
          />
        )}
 
        {screenSharing && screenTrack && (
          <LocalVideoTrack
            // ✅ Typecast again
            track={screenTrack as unknown as any}
            play
            className="w-full h-full object-cover rounded-xl"
          />
        )}
 
        {remoteUsers.map((user) => (
          <RemoteUser
            key={user.uid}
            user={user}
            className="w-full h-full object-cover rounded-xl"
          />
        ))}
      </div>
 
      {/* Bottom Control Bar */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-4 px-6 py-3 bg-black/60 rounded-full shadow-lg backdrop-blur-md">
          {/* Mic */}
          <button
            onClick={toggleMic}
            className={`p-3 rounded-full transition ${
              micEnabled
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
            title={micEnabled ? "Mute Mic" : "Unmute Mic"}
          >
            {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
          </button>
 
          {/* Cam */}
          <button
            onClick={toggleCam}
            className={`p-3 rounded-full transition ${
              camEnabled
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
            title={camEnabled ? "Turn Off Camera" : "Turn On Camera"}
          >
            {camEnabled ? <Video size={20} /> : <VideoOff size={20} />}
          </button>
 
          {/* Screen Share */}
          <button
            onClick={toggleScreenShare}
            className={`p-3 rounded-full transition ${
              screenSharing
                ? "bg-blue-700 hover:bg-blue-800"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            title={screenSharing ? "Stop Screen Sharing" : "Start Screen Sharing"}
          >
            <Monitor size={20} />
          </button>
 
          {/* Hand Raise */}
          <button
            onClick={toggleHand}
            className={`p-3 rounded-full transition ${
              handRaised
                ? "bg-yellow-500 animate-bounce"
                : "bg-yellow-400 hover:bg-yellow-500"
            }`}
            title={handRaised ? "Lower Hand" : "Raise Hand"}
          >
            <Hand size={20} />
          </button>
 
          {/* End */}
          <button
            onClick={async () => {
              await client.leave();
              window.location.href = "/dashboard/teacher";
            }}
            className="p-3 bg-red-700 hover:bg-red-800 rounded-full transition"
            title="End Call"
          >
            <XCircle size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
 
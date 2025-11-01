// src/components/Agora_live_streaming/VideoWithControls.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import AgoraRTC, { ILocalVideoTrack } from "agora-rtc-sdk-ng";
import {
  LocalVideoTrack,
  RemoteUser,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  useJoin,
  useRemoteAudioTracks,
  useRemoteUsers,
  useRTCClient,
} from "agora-rtc-react";
import { Mic, MicOff, Video, VideoOff, Monitor, Hand, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface VideosWithControlsProps {
  appId: string;
  channelName: string;
  token?: string | null;
  role?: "host" | "audience";
  uid?: string | number;
  lockRole?: boolean; // If true, prevents role changes (useful for teacher pages)
}

export default function VideosWithControls({
  appId,
  channelName,
  token = null,
  role = "host",
  uid,
  lockRole = false, // Lock role to prevent changes (default: false for flexibility)
}: VideosWithControlsProps) {
  const client = useRTCClient();
  const router = useRouter();

  // State declarations (must be before hooks that use them)
  // If lockRole is true, always use the initial role prop, otherwise allow changes
  const [currentRole, setCurrentRole] = useState<"host" | "audience">(role);
  
  // Update role if prop changes and role is not locked
  useEffect(() => {
    if (!lockRole) {
      setCurrentRole(role);
    }
  }, [role, lockRole]);
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [screenTrack, setScreenTrack] = useState<ILocalVideoTrack | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);

  // Local tracks - only create if host (use currentRole state)
  const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack(
    currentRole === "host",
    {}
  );
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack(
    currentRole === "host",
    {
      encoderConfig: {
        width: 960,
        height: 540,
        frameRate: 15,
        bitrateMin: 800,
        bitrateMax: 800, // Match Flutter implementation: single bitrate value of 800
      },
    }
  );

  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  // Track connection state
  const [isConnected, setIsConnected] = useState(false);
  const [roleSet, setRoleSet] = useState(false);

  // Join channel
  useJoin({
    appid: appId,
    channel: channelName,
    token: token || undefined,
    uid: uid,
  } as any);

  // Monitor connection state
  useEffect(() => {
    if (!client) return;

    const handleConnectionStateChange = (curState: string, revState: string) => {
      console.log("Connection state:", curState, revState);
      if (curState === "CONNECTED") {
        setIsConnected(true);
      } else if (curState === "DISCONNECTED") {
        setIsConnected(false);
        setRoleSet(false);
      }
    };

    const handleUserJoined = (user: any) => {
      console.log("User joined:", user);
    };

    client.on("connection-state-change", handleConnectionStateChange);
    client.on("user-joined", handleUserJoined);

    // Check initial connection state
    const connectionState = (client as any).connectionState;
    if (connectionState === "CONNECTED") {
      setIsConnected(true);
    }

    return () => {
      client.off("connection-state-change", handleConnectionStateChange);
      client.off("user-joined", handleUserJoined);
    };
  }, [client]);

  // Set client role when connected and role changes
  useEffect(() => {
    if (!client || !isConnected) return;
    
    const setRole = async () => {
      try {
        // In live mode, use "broadcaster" for host, "audience" for audience
        // Agora SDK expects: "audience" | "broadcaster"
        const agoraRole = currentRole === "host" ? "broadcaster" : "audience";
        await client.setClientRole(agoraRole as any);
        console.log(`✅ Client role set to: ${agoraRole} (${currentRole})`);
        setRoleSet(true);
      } catch (err) {
        console.error("❌ Failed to set client role:", err);
        setRoleSet(false);
      }
    };

    setRole();
  }, [client, currentRole, isConnected]);

  // Publish tracks when host, connected, role is set, and tracks are ready
  useEffect(() => {
    if (!client || currentRole !== "host" || !isConnected || !roleSet) return;
    if (!localMicrophoneTrack || !localCameraTrack) {
      console.log("⏳ Waiting for tracks...", {
        mic: !!localMicrophoneTrack,
        cam: !!localCameraTrack,
      });
      return;
    }

    const publishTracks = async () => {
      try {
        // Check if already published
        const publishedTracks = client.localTracks;
        if (publishedTracks.length > 0) {
          console.log("⚠️ Tracks already published, skipping...");
          return;
        }

        console.log("📤 Publishing tracks...", {
          mic: !!localMicrophoneTrack,
          cam: !!localCameraTrack,
        });

        await client.publish([localMicrophoneTrack, localCameraTrack]);
        console.log("✅ Local tracks published successfully for host");
      } catch (err) {
        console.error("❌ Publish failed:", err);
        // Try again after a short delay
        setTimeout(() => {
          publishTracks();
        }, 1000);
      }
    };

    publishTracks();

    // Cleanup on unmount
    return () => {
      if (client && currentRole === "host") {
        client.unpublish().catch(console.error);
      }
    };
  }, [client, currentRole, isConnected, roleSet, localMicrophoneTrack, localCameraTrack]);

  // Play remote audio automatically
  useEffect(() => {
    audioTracks.forEach((track) => {
      try {
        track.play();
      } catch (err) {
        console.error("Failed to play remote audio:", err);
      }
    });
  }, [audioTracks]);

  // Mic toggle
  const toggleMic = useCallback(async () => {
    if (localMicrophoneTrack) {
      const newState = !micEnabled;
      await localMicrophoneTrack.setEnabled(newState);
      setMicEnabled(newState);
    }
  }, [localMicrophoneTrack, micEnabled]);

  // Cam toggle
  const toggleCam = useCallback(async () => {
    if (localCameraTrack) {
      const newState = !camEnabled;
      await localCameraTrack.setEnabled(newState);
      setCamEnabled(newState);
    }
  }, [localCameraTrack, camEnabled]);

  // Screen share
  const toggleScreenShare = useCallback(async () => {
    if (!client || currentRole !== "host") return;

    if (!screenSharing) {
      try {
        const screen = await AgoraRTC.createScreenVideoTrack(
          {
            encoderConfig: {
              width: 1920,
              height: 1080,
              frameRate: 15,
            },
            optimizationMode: "motion",
          },
          "auto"
        );
        const screenVideoTrack = Array.isArray(screen) ? screen[0] : screen;

        await client.publish([screenVideoTrack] as any);
        setScreenTrack(screenVideoTrack);
        setScreenSharing(true);

        // Handle screen share end (user stops sharing from browser)
        screenVideoTrack.on("track-ended", async () => {
          try {
            await client.unpublish([screenVideoTrack] as any);
            screenVideoTrack.stop();
            screenVideoTrack.close();
            setScreenTrack(null);
            setScreenSharing(false);
          } catch (err) {
            console.error("Error cleaning up screen share:", err);
          }
        });
      } catch (err: unknown) {
        console.error("❌ Screen share failed:", err);
        const error = err as Error;
        if (error.message?.includes("cancel") || error.message?.includes("denied")) {
          // User cancelled or denied permission
          return;
        }
        alert("Screen share failed. Please check your browser permissions.");
      }
    } else if (screenTrack) {
      try {
        await client.unpublish([screenTrack] as any);
        screenTrack.stop();
        screenTrack.close();
        setScreenTrack(null);
        setScreenSharing(false);
      } catch (err) {
        console.error("Error stopping screen share:", err);
      }
    }
  }, [client, currentRole, screenSharing, screenTrack]);

  // Promote audience to host (only if role is not locked)
  const promoteToHost = useCallback(async () => {
    if (!client || lockRole) return; // Don't allow if role is locked
    try {
      setCurrentRole("host");
      // The tracks will be created and published automatically via useEffect
    } catch (err) {
      console.error("Failed to promote to host:", err);
    }
  }, [client, lockRole]);

  const toggleHand = useCallback(() => {
    setHandRaised((prev) => !prev);
  }, []);

  // Leave channel and navigate
  const handleLeave = useCallback(async () => {
    if (isLeaving) return;
    setIsLeaving(true);
    try {
      // Unpublish all tracks
      if (client) {
        await client.unpublish();
        await client.leave();
      }
      // Navigate back
      router.push("/dashboard/teacher");
    } catch (err) {
      console.error("Error leaving channel:", err);
      router.push("/dashboard/teacher");
    }
  }, [client, router, isLeaving]);

  // Show loading state
  if ((currentRole === "host" && (isLoadingMic || isLoadingCam)) || isLeaving) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500 bg-black">
        <p className="animate-pulse text-lg text-white">
          {isLeaving ? "Leaving call..." : "Loading devices..."}
        </p>
      </div>
    );
  }

  // Calculate grid columns based on number of participants
  const totalParticipants = remoteUsers.length + (currentRole === "host" && !screenSharing ? 1 : 0) + (screenSharing ? 1 : 0);
  const getGridCols = () => {
    if (totalParticipants === 0) return "1fr";
    if (totalParticipants === 1) return "1fr";
    if (totalParticipants <= 4) return "repeat(2, 1fr)";
    if (totalParticipants <= 9) return "repeat(3, 1fr)";
    return "repeat(4, 1fr)";
  };

  return (
    <div className="relative flex flex-col w-full h-screen bg-black">
      {/* Video Grid */}
      <div
        className="grid gap-1 flex-1 p-1"
        style={{
          gridTemplateColumns: getGridCols(),
        }}
      >
        {/* Host Camera (only show if not screen sharing) */}
        {currentRole === "host" && localCameraTrack && !screenSharing && (
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-gray-900">
            <LocalVideoTrack
              track={localCameraTrack}
              play
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded text-white text-xs">
              You (Host)
            </div>
          </div>
        )}

        {/* Screen Share */}
        {screenSharing && screenTrack && (
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-gray-900 col-span-full">
            <LocalVideoTrack
              track={screenTrack as any}
              play
              className="w-full h-full object-contain"
            />
            <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded text-white text-xs">
              Screen Share
            </div>
          </div>
        )}

        {/* Remote Users */}
        {remoteUsers.map((user) => (
          <div key={user.uid} className="relative w-full h-full rounded-xl overflow-hidden bg-gray-900">
            <RemoteUser
              user={user}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded text-white text-xs">
              {user.uid}
            </div>
          </div>
        ))}

        {/* Empty state for audience */}
        {currentRole === "audience" && remoteUsers.length === 0 && (
          <div className="flex items-center justify-center col-span-full text-gray-400">
            <p>Waiting for host to start the stream...</p>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
        <div className="flex items-center gap-4 px-6 py-3 bg-black/60 rounded-full shadow-lg backdrop-blur-md">
          {/* Mic control - only for host */}
          {currentRole === "host" && (
            <button
              onClick={toggleMic}
              className={`p-3 rounded-full transition-all ${
                micEnabled
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
              title={micEnabled ? "Mute Mic" : "Unmute Mic"}
              disabled={isLeaving}
            >
              {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
          )}

          {/* Camera control - only for host */}
          {currentRole === "host" && (
            <button
              onClick={toggleCam}
              className={`p-3 rounded-full transition-all ${
                camEnabled
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
              title={camEnabled ? "Turn Off Camera" : "Turn On Camera"}
              disabled={isLeaving}
            >
              {camEnabled ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
          )}

          {/* Screen share - only for host */}
          {currentRole === "host" && (
            <button
              onClick={toggleScreenShare}
              className={`p-3 rounded-full transition-all text-white ${
                screenSharing
                  ? "bg-blue-700 hover:bg-blue-800"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              title={screenSharing ? "Stop Screen Sharing" : "Start Screen Sharing"}
              disabled={isLeaving}
            >
              <Monitor size={20} />
            </button>
          )}

          {/* Raise hand - for audience */}
          {currentRole === "audience" && (
            <button
              onClick={toggleHand}
              className={`p-3 rounded-full transition-all text-white ${
                handRaised
                  ? "bg-yellow-500 animate-bounce"
                  : "bg-yellow-400 hover:bg-yellow-500"
              }`}
              title={handRaised ? "Lower Hand" : "Raise Hand"}
              disabled={isLeaving}
            >
              <Hand size={20} />
            </button>
          )}

          {/* Promote to host button - for audience (only if role is not locked) */}
          {currentRole === "audience" && !lockRole && (
            <button
              onClick={promoteToHost}
              className="p-3 rounded-full transition-all bg-purple-500 hover:bg-purple-600 text-white"
              title="Become Host"
              disabled={isLeaving}
            >
              <Video size={20} />
            </button>
          )}

          {/* End Call */}
          <button
            onClick={handleLeave}
            className="p-3 bg-red-700 hover:bg-red-800 rounded-full transition-all text-white"
            title="End Call"
            disabled={isLeaving}
          >
            <XCircle size={20} />
          </button>
        </div>
      </div>

      {/* Role indicator */}
      <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-black/60 rounded text-white text-sm">
        Role: {currentRole === "host" ? "Host" : "Audience"}
      </div>
    </div>
  );
}

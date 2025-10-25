/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import AgoraRTC, { ILocalVideoTrack } from "agora-rtc-sdk-ng";
import {
  LocalVideoTrack,
  RemoteUser,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
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
  role: "host" | "audience";
  appId: string;
  channelName: string;
}

export default function VideosWithControls({
  role,
  appId,
  channelName,
}: VideosWithControlsProps) {
  const client = useRTCClient();
  const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [screenTrack, setScreenTrack] = useState<ILocalVideoTrack | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  // Auto-play remote audio
  useEffect(() => {
    audioTracks.forEach((track) => track.play());
  }, [audioTracks]);

  // Publish local tracks if host
  usePublish(role === "host" ? [localMicrophoneTrack, localCameraTrack] : []);

  // Join Agora channel
  useJoin({ appid: appId, channel: channelName, token: null });

  // --- Agora Diagnostics & Live Status ---
  useEffect(() => {
    const handleConnection = (cur: string, prev: string) => {
      console.log("Agora connection state changed:", prev, "→", cur);
      setIsStreaming(cur === "CONNECTED");
    };

    const handlePublished = (user: any, mediaType: string) => {
      console.log(`✅ Published: ${user.uid} (${mediaType})`);
    };

    const handleUnpublished = (user: any, mediaType: string) => {
      console.log(`🛑 Unpublished: ${user.uid} (${mediaType})`);
    };

    client.on("connection-state-change", handleConnection);
    client.on("user-published", handlePublished);
    client.on("user-unpublished", handleUnpublished);

    return () => {
      client.off("connection-state-change", handleConnection);
      client.off("user-published", handlePublished);
      client.off("user-unpublished", handleUnpublished);
    };
  }, [client]);

  // --- Track State Diagnostics ---
  useEffect(() => {
    if (localCameraTrack) {
      console.log("📹 Local camera track active:", localCameraTrack.isPlaying);
    }
    if (localMicrophoneTrack) {
      console.log("🎤 Local mic enabled:", localMicrophoneTrack.enabled);
    }
  }, [localCameraTrack, localMicrophoneTrack]);

  // --- Controls ---
  const toggleMic = async () => {
    if (localMicrophoneTrack) {
      await localMicrophoneTrack.setEnabled(!micEnabled);
      setMicEnabled((prev) => !prev);
    }
  };

  const toggleCam = async () => {
    if (localCameraTrack) {
      await localCameraTrack.setEnabled(!camEnabled);
      setCamEnabled((prev) => !prev);
    }
  };

  const toggleScreenShare = async () => {
    if (!screenSharing) {
      try {
        const screen = await AgoraRTC.createScreenVideoTrack(
          { encoderConfig: "1080p_1", optimizationMode: "motion" },
          "auto"
        );
        const screenVideoTrack = Array.isArray(screen) ? screen[0] : screen;
        await client.publish(screen as unknown as any);
        setScreenTrack(screenVideoTrack);
        setScreenSharing(true);

        screenVideoTrack.on("track-ended", async () => {
          await client.unpublish(screen as unknown as any);
          if ((screenVideoTrack as any).stop) (screenVideoTrack as any).stop();
          if ((screenVideoTrack as any).close) (screenVideoTrack as any).close();
          setScreenTrack(null);
          setScreenSharing(false);
        });
      } catch (err) {
        console.error("❌ Screen share failed:", err);
        alert("Screen share failed or cancelled.");
      }
    } else if (screenTrack) {
      await client.unpublish(screenTrack as unknown as any);
      screenTrack.stop();
      screenTrack.close();
      setScreenTrack(null);
      setScreenSharing(false);
    }
  };

  const toggleHand = () => setHandRaised((prev) => !prev);

  if (isLoadingMic || isLoadingCam) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <p className="animate-pulse text-lg">Loading devices...</p>
      </div>
    );
  }

  const unit = "minmax(0, 1fr) ";

  return (
    <div className="relative flex flex-col w-full h-screen bg-black">
      {/* 🟢 LIVE Indicator */}
      <div className="absolute top-4 left-4 z-50">
        {isStreaming ? (
          <span className="bg-green-600 text-white px-3 py-1 rounded-full shadow-md font-semibold animate-pulse">
            🟢 LIVE
          </span>
        ) : (
          <span className="bg-red-600 text-white px-3 py-1 rounded-full shadow-md font-semibold">
            🔴 OFFLINE
          </span>
        )}
      </div>

      {/* Video Grid */}
      <div
        className="grid gap-1 flex-1 p-1"
        style={{
          gridTemplateColumns:
            remoteUsers.length > 9
              ? unit.repeat(4)
              : remoteUsers.length > 4
              ? unit.repeat(3)
              : remoteUsers.length > 1
              ? unit.repeat(2)
              : unit,
        }}
      >
        {/* Host camera */}
        {role === "host" && !screenSharing && localCameraTrack && (
          <LocalVideoTrack
            track={localCameraTrack as unknown as any}
            play
            className="w-full h-full object-cover rounded-xl"
          />
        )}

        {/* Screen share */}
        {screenSharing && screenTrack && (
          <LocalVideoTrack
            track={screenTrack as unknown as any}
            play
            className="w-full h-full object-cover rounded-xl"
          />
        )}

        {/* Remote users */}
        {remoteUsers.map((user) => (
          <RemoteUser
            key={user.uid}
            user={user}
            className="w-full h-full object-cover rounded-xl"
          />
        ))}
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-4 px-6 py-3 bg-black/60 rounded-full shadow-lg backdrop-blur-md">
          {/* Mic */}
          <button
            onClick={toggleMic}
            className={`p-3 rounded-full transition ${micEnabled ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
            title={micEnabled ? "Mute Mic" : "Unmute Mic"}
          >
            {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          {/* Cam */}
          <button
            onClick={toggleCam}
            className={`p-3 rounded-full transition ${camEnabled ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
            title={camEnabled ? "Turn Off Camera" : "Turn On Camera"}
          >
            {camEnabled ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          {/* Screen Share */}
          <button
            onClick={toggleScreenShare}
            className={`p-3 rounded-full transition ${screenSharing ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-500 hover:bg-blue-600"}`}
            title={screenSharing ? "Stop Screen Sharing" : "Start Screen Sharing"}
          >
            <Monitor size={20} />
          </button>

          {/* Hand Raise */}
          <button
            onClick={toggleHand}
            className={`p-3 rounded-full transition ${handRaised ? "bg-yellow-500 animate-bounce" : "bg-yellow-400 hover:bg-yellow-500"}`}
            title={handRaised ? "Lower Hand" : "Raise Hand"}
          >
            <Hand size={20} />
          </button>

          {/* End Call */}
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

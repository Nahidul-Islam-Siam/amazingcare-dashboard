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
import { Mic, MicOff, Video, VideoOff, Monitor, Hand, XCircle } from "lucide-react";

interface VideosWithControlsProps {
  role: "host" | "audience";
  appId: string;
  channelName: string;
}

export default function VideosWithControls({ role, appId, channelName }: VideosWithControlsProps) {
  const clientWrapper = useRTCClient({ codec: "vp8", mode: "rtc" });
  const client = clientWrapper.client;

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

  // Play remote audio automatically
  useEffect(() => {
    audioTracks.forEach((track) => track.play());
  }, [audioTracks]);

  // Join channel
  useJoin({ appid: appId, channel: channelName, token: null });

  // Publish local tracks if host
  usePublish(role === "host" ? [localMicrophoneTrack, localCameraTrack] : []);

  // Log publish state
  useEffect(() => {
    if (role === "host" && localMicrophoneTrack && localCameraTrack) {
      console.log("📡 Publishing local tracks...");
      setIsStreaming(true);
    }
  }, [role, localMicrophoneTrack, localCameraTrack]);

  // Client events
  useEffect(() => {
    if (!client) return;

    client.on("connection-state-change", (cur, prev) =>
      console.log(`🔄 Connection state changed: ${prev} → ${cur}`)
    );
    client.on("user-joined", (user) => console.log("✅ Remote user joined:", user.uid));
    client.on("user-published", (user, mediaType) =>
      console.log("🎥 Remote user published:", user.uid, mediaType)
    );
    client.on("user-unpublished", (user) => console.log("❌ Remote user unpublished:", user.uid));

    return () => {
      client.removeAllListeners();
    };
  }, [client]);

  // Confirm local tracks ready
  useEffect(() => {
    if (localMicrophoneTrack || localCameraTrack) {
      console.log("🎬 Local tracks ready", {
        mic: !!localMicrophoneTrack,
        cam: !!localCameraTrack,
      });
    }
  }, [localMicrophoneTrack, localCameraTrack]);

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
        await client?.publish(screen as unknown as any);
        setScreenTrack(screenVideoTrack);
        setScreenSharing(true);

        screenVideoTrack.on("track-ended", async () => {
          await client?.unpublish(screen as unknown as any);
          screenVideoTrack.stop();
          screenVideoTrack.close();
          setScreenTrack(null);
          setScreenSharing(false);
        });
      } catch (err) {
        console.error("❌ Screen share failed:", err);
        alert("Screen share failed or cancelled.");
      }
    } else if (screenTrack) {
      await client?.unpublish(screenTrack as unknown as any);
      screenTrack.stop();
      screenTrack.close();
      setScreenTrack(null);
      setScreenSharing(false);
    }
  };

  const toggleHand = () => setHandRaised((prev) => !prev);

  // Loading devices
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
      {/* Status */}
      <div className="absolute top-4 left-4 p-2 bg-black/50 rounded text-white z-10">
        Status: {isStreaming ? "🟢 Active" : "🔴 Offline"}
      </div>

      {/* Video grid */}
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

        {/* Screen sharing */}
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

      {/* Bottom controls */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-4 px-6 py-3 bg-black/60 rounded-full shadow-lg backdrop-blur-md">
          <button
            onClick={toggleMic}
            className={`p-3 rounded-full transition ${
              micEnabled ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          <button
            onClick={toggleCam}
            className={`p-3 rounded-full transition ${
              camEnabled ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {camEnabled ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          <button
            onClick={toggleScreenShare}
            className={`p-3 rounded-full transition ${
              screenSharing ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            <Monitor size={20} />
          </button>

          <button
            onClick={toggleHand}
            className={`p-3 rounded-full transition ${
              handRaised ? "bg-yellow-500 animate-bounce" : "bg-yellow-400 hover:bg-yellow-500"
            }`}
          >
            <Hand size={20} />
          </button>

          <button
            onClick={async () => {
              await client?.leave();
              setIsStreaming(false);
              window.location.href = "/dashboard/teacher";
            }}
            className={`p-3 rounded-full transition ${
              isStreaming ? "bg-red-700 hover:bg-red-800" : "bg-gray-600"
            }`}
          >
            <XCircle size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

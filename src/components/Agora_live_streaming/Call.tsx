// src/components/Agora_live_streaming/Call.tsx
"use client";

import {
  AgoraRTCProvider,
  useRTCClient,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useJoin,
  useRemoteAudioTracks,
  useRemoteUsers,
  LocalVideoTrack,
  RemoteUser,
  IAgoraRTCClient,
} from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useEffect, useState } from "react";
import VideosWithControls from "./VideoWithControls";

interface CallProps {
  appId: string;
  channelName: string;
  role?: "host";
}

export default function Call({ appId, channelName, role = "host" }: CallProps) {
  // ✅ Create Agora client
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "live" }) as unknown as IAgoraRTCClient
  );

  // ✅ Set client role and cleanup
  useEffect(() => {
    if (!client) return;
    client.setClientRole(role);
    console.log(`🎭 Agora client role set to: ${role}`);

    return () => {
      client.leave().then(() => console.log("👋 Left Agora channel"));
    };
  }, [client, role]);

  return (
    <AgoraRTCProvider client={client}>
      <VideosWithControls appId={appId} channelName={channelName} role={role} />
    </AgoraRTCProvider>
  );
}

export function Videos({
  appId,
  channelName,
  role,
}: {
  appId: string;
  channelName: string;
  role: "host" ;
}) {
  const [isReady, setIsReady] = useState(false);

  const { isLoading: loadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack();
  const { isLoading: loadingCam, localCameraTrack } = useLocalCameraTrack();

  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  // ✅ Host publishes tracks
  usePublish(role === "host" ? [localMicrophoneTrack, localCameraTrack] : []);

  // ✅ Join channel
  useJoin({ appid: appId, channel: channelName, token: null });

  // ✅ Play remote audio
  useEffect(() => {
    audioTracks.forEach((track) => track.play());
  }, [audioTracks]);

  // ✅ Wait for devices
  useEffect(() => {
    if (!loadingMic && !loadingCam) setIsReady(true);
  }, [loadingMic, loadingCam]);

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <p className="animate-pulse text-lg">Initializing devices...</p>
      </div>
    );
  }

  const unit = "minmax(0, 1fr) ";

  return (
    <div className="flex flex-col justify-between w-full h-screen p-2 bg-black">
      <div
        className="grid gap-1 flex-1"
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
        {/* Host video */}
        {role === "host" && localCameraTrack && (
          <LocalVideoTrack
            track={localCameraTrack}
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
    </div>
  );
}

// src/components/Agora_live_streaming/Call.tsx
"use client";

import { useEffect, useState } from "react";
import AgoraRTC, { ILocalAudioTrack, ILocalVideoTrack } from "agora-rtc-sdk-ng";
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

interface CallProps {
  appId: string;
  channelName: string;
  role?: "host";
}

export default function Call({ appId, channelName, role = "host" }: CallProps) {
  // 1️⃣ Create Agora client explicitly with VP8
  const client = useRTCClient(
    AgoraRTC.createClient({ mode: "live", codec: "vp8" }) as unknown as IAgoraRTCClient
  );

  // 2️⃣ Set host role on mount
  useEffect(() => {
    if (!client) return;
    client.setClientRole(role).then(() => console.log(`🎭 Role set: ${role}`));

    return () => {
      client.leave().then(() => console.log("👋 Left channel"));
    };
  }, [client, role]);

  return (
    <AgoraRTCProvider client={client}>
      <Videos appId={appId} channelName={channelName} role={role} />
    </AgoraRTCProvider>
  );
}

function Videos({ appId, channelName, role }: { appId: string; channelName: string; role: "host" }) {
  const [isReady, setIsReady] = useState(false);

  const { isLoading: micLoading, localMicrophoneTrack } = useLocalMicrophoneTrack();
  const { isLoading: camLoading, localCameraTrack } = useLocalCameraTrack();

  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  // Wait until tracks are ready before publishing
  useEffect(() => {
    if (!micLoading && !camLoading) setIsReady(true);
  }, [micLoading, camLoading]);

  // ✅ Join channel
  useJoin({ appid: appId, channel: channelName, token: null });

  // ✅ Publish tracks once ready and if host
  usePublish(
    role === "host" && isReady && localMicrophoneTrack && localCameraTrack
      ? [localMicrophoneTrack, localCameraTrack]
      : []
  );

  // Play remote audio automatically
  useEffect(() => {
    audioTracks.forEach((track) => track.play());
  }, [audioTracks]);

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
          <LocalVideoTrack track={localCameraTrack} play className="w-full h-full object-cover rounded-xl" />
        )}

        {/* Remote users */}
        {remoteUsers.map((user) => (
          <RemoteUser key={user.uid} user={user} className="w-full h-full object-cover rounded-xl" />
        ))}
      </div>
    </div>
  );
}

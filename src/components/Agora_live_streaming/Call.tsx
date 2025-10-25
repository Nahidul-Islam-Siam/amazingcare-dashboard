// src/components/Agora_live_streaming/Call.tsx
"use client";

import {
  AgoraRTCProvider,
  LocalVideoTrack,
  RemoteUser,
  useRTCClient,
  useJoin,
  usePublish,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  useRemoteAudioTracks,
  useRemoteUsers,
  IAgoraRTCClient, // ✅ we’ll use this type
} from "agora-rtc-react";
import AgoraRTCSDK from "agora-rtc-sdk-ng"; // ✅ import the SDK itself
import Link from "next/link";
import { useEffect, useState } from "react";
import VideosWithControls from "./VideoWithControls";

interface CallProps {
  appId: string;
  channelName: string;
  role?: "host" | "audience"; // teacher = host, student = audience
}

export default function Call({
  appId,
  channelName,
  role = "host",
}: CallProps) {
  // ✅ Client created using Agora from agora-rtc-react (no type conflict)
// ✅ Typecast the client to match agora-rtc-react expectations
const client = useRTCClient(
  AgoraRTCSDK.createClient({ codec: "vp8", mode: "live" }) as unknown as IAgoraRTCClient
);


  // ✅ Assign teacher/student role
  useEffect(() => {
    client.setClientRole(role);
  }, [client, role]);

  return (
    <AgoraRTCProvider client={client}>
<VideosWithControls appId={appId} channelName={channelName} role={role} />


      {/* End Call Button */}
      <div className="fixed z-10 bottom-0 left-0 right-0 flex justify-center pb-4">
        <Link
          href="/dashboard/teacher"
          className="px-5 py-3 text-base font-medium text-center text-white bg-red-500 rounded-lg hover:bg-red-600 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900 w-40"
        >
          End Call
        </Link>
      </div>
    </AgoraRTCProvider>
  );
}

function Videos({
  appId,
  channelName,
  role,
}: {
  appId: string;
  channelName: string;
  role: "host" | "audience";
}) {
  const [isReady, setIsReady] = useState(false);

  // 🎤 & 🎥 setup
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();

  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  // ✅ Host publishes camera + mic
  usePublish(
    role === "host" ? [localMicrophoneTrack, localCameraTrack] : []
  );

  // ✅ Join the channel
  useJoin({
    appid: appId,
    channel: channelName,
    token: null,
  });

  // ✅ Play remote audio
  useEffect(() => {
    audioTracks.forEach((track) => track.play());
  }, [audioTracks]);

  // ✅ Wait until devices are ready
  useEffect(() => {
    if (!isLoadingMic && !isLoadingCam) {
      setIsReady(true);
    }
  }, [isLoadingMic, isLoadingCam]);

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
        {/* Host (Teacher) Video */}
        {role === "host" && localCameraTrack && (
          <LocalVideoTrack
            track={localCameraTrack}
            play
            className="w-full h-full object-cover rounded-xl"
          />
        )}

        {/* Remote (Students) */}
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

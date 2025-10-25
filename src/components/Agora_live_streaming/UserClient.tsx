"use client";

import { useState } from "react";
import {
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  useJoin,
  usePublish,
  useRTCClient,
  useRemoteUsers,
  LocalVideoTrack,
  RemoteUser,
} from "agora-rtc-react";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";

interface UserClientProps {
  appId: string;
  channelName: string;
}

export default function UserClient({ appId, channelName }: UserClientProps) {
  const client = useRTCClient();
  const { localMicrophoneTrack } = useLocalMicrophoneTrack();
  const { localCameraTrack } = useLocalCameraTrack();
  const remoteUsers = useRemoteUsers();

  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);

  // Join and publish tracks
  useJoin({ appid: appId, channel: channelName, token: null });
  usePublish([localMicrophoneTrack, localCameraTrack]);

  const toggleMic = () => {
    if (localMicrophoneTrack) {
      localMicrophoneTrack.setEnabled(!micEnabled);
      setMicEnabled(!micEnabled);
    }
  };

  const toggleCam = () => {
    if (localCameraTrack) {
      localCameraTrack.setEnabled(!camEnabled);
      setCamEnabled(!camEnabled);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white p-4">
      <h2 className="text-center text-blue-400 mb-4">
        👤 User Client — Channel: {channelName}
      </h2>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1">
        {localCameraTrack && (
          <LocalVideoTrack
            track={localCameraTrack}
            play
            className="w-full h-48 object-cover rounded-xl"
          />
        )}
        {remoteUsers.map((user) => (
          <RemoteUser
            key={user.uid}
            user={user}
            className="w-full h-48 object-cover rounded-xl"
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={toggleMic}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-white ${
            micEnabled ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {micEnabled ? <Mic size={18} /> : <MicOff size={18} />}
          {micEnabled ? "Mic On" : "Mic Off"}
        </button>

        <button
          onClick={toggleCam}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-white ${
            camEnabled ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {camEnabled ? <Video size={18} /> : <VideoOff size={18} />}
          {camEnabled ? "Cam On" : "Cam Off"}
        </button>
      </div>
    </div>
  );
}

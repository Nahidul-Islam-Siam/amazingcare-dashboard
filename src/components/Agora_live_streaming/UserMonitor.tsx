/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRemoteUsers } from "agora-rtc-react";
import { Mic, MicOff, Video, VideoOff, Monitor, Hand } from "lucide-react";

interface UserStatus {
  uid: string | number;
  mic: boolean;
  cam: boolean;
  hand: boolean;
  screen: boolean;
}

export default function UserMonitor() {
  const remoteUsers = useRemoteUsers();
  const [userStatuses, setUserStatuses] = useState<UserStatus[]>([]);

  useEffect(() => {
    const statuses: UserStatus[] = remoteUsers.map((user) => ({
      uid: user.uid,
      mic: user.audioTrack ? user.audioTrack.enabled : false,
      cam: user.videoTrack ? user.videoTrack.enabled : false,
      hand: (user as any).handRaised || false,
      screen: (user as any).screenSharing || false,
    }));
    setUserStatuses(statuses);
  }, [remoteUsers]);

  return (
    <div className="p-4 bg-gray-50 h-screen overflow-auto">
      <h2 className="text-xl font-bold mb-4">Students Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userStatuses.map((user) => (
          <div
            key={user.uid}
            className="flex flex-col items-center p-4 border rounded-lg shadow-sm bg-white"
          >
            <p className="font-semibold mb-2">User: {user.uid}</p>
            <div className="flex items-center gap-2 mb-2">
              {user.mic ? <Mic className="text-green-500" /> : <MicOff className="text-red-500" />}
              <span>{user.mic ? "Mic On" : "Mic Off"}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              {user.cam ? <Video className="text-green-500" /> : <VideoOff className="text-red-500" />}
              <span>{user.cam ? "Cam On" : "Cam Off"}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              {user.screen ? <Monitor className="text-blue-500" /> : <Monitor className="text-gray-400" />}
              <span>{user.screen ? "Screen Sharing" : "No Screen"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Hand className={`${user.hand ? "text-yellow-500 animate-bounce" : "text-gray-400"}`} />
              <span>{user.hand ? "Hand Raised" : "No Hand"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

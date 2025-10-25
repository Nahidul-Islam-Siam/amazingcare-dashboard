"use client";

import { useRemoteUsers } from "agora-rtc-react";
import { Mic, MicOff, Video, VideoOff, Hand } from "lucide-react";

export default function UserMonitor() {
  const remoteUsers = useRemoteUsers();

  if (remoteUsers.length === 0) {
    return (
      <div className="p-4 text-gray-500">
        No students connected yet...
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Students</h2>
      <ul className="space-y-4">
        {remoteUsers.map((user) => (
          <li
            key={user.uid}
            className="flex items-center justify-between p-2 bg-gray-800 rounded-lg"
          >
            {/* UID or Name */}
            <span className="text-white font-medium">User {user.uid}</span>

            {/* Status Icons */}
            <div className="flex items-center gap-2">
              {/* Mic status */}
              {user.audioTrack?.enabled ? (
                <Mic size={16} className="text-green-400" />
              ) : (
                <MicOff size={16} className="text-red-400" />
              )}

              {/* Cam status */}
              {user.videoTrack?.enabled ? (
                <Video size={16} className="text-green-400" />
              ) : (
                <VideoOff size={16} className="text-red-400" />
              )}

              {/* Hand raise (optional: can be custom property) */}
              {user.handRaised ? <Hand size={16} className="text-yellow-400" /> : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  LocalVideoTrack,
  RemoteUser,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Hand
} from "lucide-react";

function VideosWithControls({
  role,
}: {
  role: "host" | "audience";
}) {
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();

  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);

  // Toggle mic
  const toggleMic = () => {
    if (localMicrophoneTrack) {
      localMicrophoneTrack.setEnabled(!micEnabled);
      setMicEnabled(!micEnabled);
    }
  };

  // Toggle camera
  const toggleCam = () => {
    if (localCameraTrack) {
      localCameraTrack.setEnabled(!camEnabled);
      setCamEnabled(!camEnabled);
    }
  };

  // Toggle screen share (simple simulation)
  const toggleScreenShare = () => {
    setScreenSharing(!screenSharing);
    alert(
      !screenSharing
        ? "Screen sharing started (demo)"
        : "Screen sharing stopped (demo)"
    );
  };

  // Toggle hand raise (demo)
  const toggleHand = () => {
    setHandRaised(!handRaised);
  };

  useEffect(() => {
    audioTracks.forEach((track) => track.play());
  }, [audioTracks]);

  const deviceLoading = isLoadingMic || isLoadingCam;

  if (deviceLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="animate-pulse text-gray-400 text-lg">
          Initializing devices...
        </p>
      </div>
    );
  }

  const unit = "minmax(0, 1fr) ";

  return (
    <div className="flex flex-col justify-between w-full h-screen p-2 bg-black relative">
      {/* Video Grid */}
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
        {role === "host" && localCameraTrack && (
          <LocalVideoTrack
            track={localCameraTrack}
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

      {/* Floating Controls */}
      {role === "host" && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4 bg-black bg-opacity-50 rounded-full p-3">
          {/* Mic Button */}
          <button
            onClick={toggleMic}
            className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors
              ${micEnabled ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
          >
            {micEnabled ? <Mic className="w-6 h-6 text-white" /> : <MicOff className="w-6 h-6 text-white" />}
          </button>

          {/* Camera Button */}
          <button
            onClick={toggleCam}
            className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors
              ${camEnabled ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
          >
            {camEnabled ? <Video className="w-6 h-6 text-white" /> : <VideoOff className="w-6 h-6 text-white" />}
          </button>

          {/* Screen Share Button */}
          <button
            onClick={toggleScreenShare}
            className={`w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 text-white transition`}
          >
            <Monitor className="w-6 h-6" />
          </button>

          {/* Raise Hand Button */}
          <button
            onClick={toggleHand}
            className={`w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500 hover:bg-yellow-600 text-white transition`}
          >
            <Hand className={`w-6 h-6 ${handRaised ? "animate-bounce" : ""}`} />
          </button>
        </div>
      )}
    </div>
  );
}

export default VideosWithControls;

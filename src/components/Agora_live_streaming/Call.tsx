// src/components/Agora_live_streaming/Call.tsx
"use client";

import {
  AgoraRTCProvider,
  useRTCClient,
} from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useMemo } from "react";
import VideosWithControls from "./VideoWithControls";

interface CallProps {
  appId: string;
  channelName: string;
  token?: string | null; // Optional token for production use
  role?: "host" | "audience"; // host = teacher, audience = student
  uid?: string | number; // Optional user ID
  lockRole?: boolean; // If true, prevents role changes (useful for teacher pages)
}

export default function Call({
  appId,
  channelName,
  token = null,
  role = "host",
  uid,
  lockRole = false,
}: CallProps) {
  // Create the Agora client with proper configuration
  // According to Agora React.js docs: 
  // - mode: "rtc" for video calling (peer-to-peer, all users publish)
  // - mode: "live" for live streaming (host/audience roles)
  // We use "live" mode to support teacher/student roles
  const client = useRTCClient(
    useMemo(
      () =>
        AgoraRTC.createClient({
          mode: "live", // Use live mode for streaming (host/audience roles)
          codec: "vp8", // Better compatibility (docs recommend vp8 or h264)
        }),
      []
    )
  );

  return (
    <AgoraRTCProvider client={client}>
      {/* Video Grid & Controls */}
      <VideosWithControls
        appId={appId}
        channelName={channelName}
        token={token}
        role={role}
        uid={uid}
        lockRole={lockRole}
      />
    </AgoraRTCProvider>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
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
}

export default function Call({
  appId,
  channelName,
}: CallProps) {
  // Create the Agora client with proper configuration
  const client = useRTCClient(
    useMemo(
      () =>
        AgoraRTC.createClient({
          mode: "rtc", // RTC mode for video calling (all users can publish)
          codec: "vp8", // Better compatibility
        }) as any,
      []
    )
  );

  return (
    <AgoraRTCProvider client={client as any}>
      {/* Video Grid & Controls */}
      <VideosWithControls
        appId={appId}
        channelName={channelName}
      />
    </AgoraRTCProvider>
  );
}

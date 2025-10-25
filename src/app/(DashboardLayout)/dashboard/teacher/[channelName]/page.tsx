"use client";

import { AgoraRTCProvider, IAgoraRTCClient } from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import Call from "@/components/Agora_live_streaming/Call";
import UserMonitor from "@/components/Agora_live_streaming/UserMonitor";

export default function TeacherChannelPage({ channelName }: { channelName: string }) {
  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID || "";

  // Create Agora client instance
  const client: IAgoraRTCClient = AgoraRTC.createClient({ codec: "vp8", mode: "live" }) as unknown as IAgoraRTCClient;

  return (
    <AgoraRTCProvider client={client}>
      <main className="flex w-full h-screen">
        {/* Call / Video */}
        <div className="flex-1">
          <Call appId={appId} channelName={channelName} role="host" />
        </div>

        {/* Student Monitoring */}
        <div className="w-80 border-l overflow-auto">
          <UserMonitor />
        </div>
      </main>
    </AgoraRTCProvider>
  );
}

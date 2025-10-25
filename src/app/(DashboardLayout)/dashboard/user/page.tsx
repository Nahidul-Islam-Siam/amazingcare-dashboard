"use client"
import UserClient from "@/components/Agora_live_streaming/UserClient";
import AgoraRTCSDK from "agora-rtc-sdk-ng";
import { AgoraRTCProvider, IAgoraRTCClient, useRTCClient } from "agora-rtc-react";

interface UserClientProps {
  appId: string;
  channelName: string;
}

export default function UserClientWrapper({ appId, channelName }: UserClientProps) {
  const client = useRTCClient(
    AgoraRTCSDK.createClient({ codec: "vp8", mode: "live" }) as unknown as IAgoraRTCClient
  );

  return (
    <AgoraRTCProvider client={client}>
      <UserClient appId={appId} channelName={channelName} />
    </AgoraRTCProvider>
  );
}


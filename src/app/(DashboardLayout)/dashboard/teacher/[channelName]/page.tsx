// src/app/(DashboardLayout)/dashboard/teacher/[channelName]/page.tsx

import Call from "@/components/Agora_live_streaming/Call"

interface TeacherChannelPageProps {
  params: {
    channelName: string
  }
}

export default function TeacherChannelPage({ params }: TeacherChannelPageProps) {
  const channelName = params.channelName

  // Access public env vars with NEXT_PUBLIC_ prefix
  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID || ""

  return (
    <main className="relative flex w-full flex-col min-h-screen bg-gray-50">
      {/* Channel Name */}
      <p className="absolute z-10 top-4 left-8 text-2xl font-bold text-gray-900">
        {channelName}
      </p>

      {/* Agora Call Component */}
      <Call appId={appId} channelName={channelName} />
    </main>
  )
}

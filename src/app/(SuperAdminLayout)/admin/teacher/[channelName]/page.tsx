// src/app/(DashboardLayout)/dashboard/teacher/[channelName]/page.tsx
'use client'
import Call from "@/components/Agora_live_streaming/Call"
import { useParams } from "next/navigation"
 
 
// interface TeacherChannelPageProps {
//   params: {
//     channelName: string
//   }
// }
 
export default function TeacherChannelPage() {
  const channelName = useParams().channelName as string
  // Access public env vars with NEXT_PUBLIC_ prefix
  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID || ""
 
  return (
    <main className="relative flex w-full flex-col min-h-screen bg-gray-50">
      {/* Channel Name */}
      <p className="absolute z-10 top-4 left-8 text-2xl font-bold text-gray-900">
        {channelName}
      </p>
 
      {/* Agora Call Component - Always host for teachers, role is locked */}
      <Call appId={appId} channelName={channelName} role="host" lockRole={true} />
    </main>
  )
}
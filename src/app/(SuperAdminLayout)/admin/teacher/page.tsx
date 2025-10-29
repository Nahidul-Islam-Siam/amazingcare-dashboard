// src/app/(DashboardLayout)/dashboard/teacher/page.tsx
'use client'
 
import { useRouter } from 'next/navigation'
import React from 'react'
 
export default function TeacherDashboard() {
  const router = useRouter()
 
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const channelInput = form.elements.namedItem('channel') as HTMLInputElement
    const channelName = channelInput?.value.trim()
 
    if (!channelName) return
    router.push(`/admin/teacher/${encodeURIComponent(channelName)}`)
  }
 
  return (
    <div className="flex flex-col items-center min-h-screen py-20">
      <h1 className="mb-6 text-4xl font-extrabold leading-none tracking-tight text-gray-900 text-center">
        <span className="text-black">NextJS</span> x{' '}
        <span className="text-blue-500">Agora</span>
      </h1>
 
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-6 rounded-2xl shadow-md"
      >
        <div className="md:flex md:items-center mb-4">
          <label
            htmlFor="channel"
            className="block text-gray-700 font-bold mb-2 md:mb-0 md:w-1/3"
          >
            Channel Name
          </label>
          <div className="md:w-2/3">
            <input
              id="channel"
              name="channel"
              type="text"
              placeholder="Enter channel name"
              required
              className="bg-gray-100 border border-gray-300 rounded w-full py-2 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
 
        <div className="text-center">
          <button
            type="submit"
            className="inline-flex cursor-pointer items-center justify-center px-6 py-3 mt-4 text-base font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
          >
            Start Session
          </button>
        </div>
      </form>
 
      <p className="mt-6 text-gray-500 text-sm text-center">
        Enter a unique channel name to start or join a classroom.
      </p>
    </div>
  )
}
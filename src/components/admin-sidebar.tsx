"use client";

import type * as React from "react";
import {
  LayoutDashboard,
  GraduationCap,   // 🎓 Courses
  HandHeart,      // 💞 Consultation (closest to "help" or "care")
  Video,          // 📺 Live (camera icon)
  Bell,           // 🔔 Reminders
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "John Doe",
    email: "Admin",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "BUZIOS GO",
      logo: () => <span className="font-bold">B</span>,
      plan: "Enterprise",
    },
  ],

  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Courses",
      url: "/dashboard/courses",
      icon: GraduationCap, // 🎓 Matches image
    },
    {
      title: "Consultation",
      url: "/dashboard/consultion",
      icon: HandHeart, // 💞 Closest to “care/help” in image
    },
    {
      title: "Live",
      url: "/dashboard/live",
      icon: Video, // 📺 Matches video camera in image
    },
    {
      title: "Reminders",
      url: "/dashboard/reminders",
      icon: Bell, // 🔔 Matches bell in image
    },
  ],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      className="relative bg-white text-gray-900" // Changed from text-white for readability
      {...props}
    >
      <SidebarHeader className="bg-[#ECECF0]">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent className="bg-[#ECECF0] text-gray-900"> {/* Changed text color */}
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
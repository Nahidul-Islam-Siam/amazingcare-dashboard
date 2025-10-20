"use client";

import type * as React from "react";
import { LayoutDashboard, GraduationCap, Video, Users, BarChart3, CreditCard, HandCoins } from "lucide-react";

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
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Courses",
      url: "/admin/courses",
      icon: GraduationCap, // 🎓 Matches the image
    },
    {
      title: "Live Stream",
      url: "/admin/live-stream",
      icon: Video, // 📹 Matches the image
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users, // 👥 Matches the image
    },
    {
      title: "Reviews",
      url: "/admin/reviews",
      icon: BarChart3, // 📊 Matches the image
    },
    {
      title: "Subscriptions",
      url: "/admin/subscriptions",
      icon: CreditCard, // 💳 Matches the image
    },
    {
      title: "Donations",
      url: "/admin/donations",
      icon: HandCoins, // 🤲 Matches the image
    },
  ],
};

export function SuperAdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      className="relative bg-white text-gray-900" // Updated text color for readability
      {...props}
    >
      <SidebarHeader className="bg-white">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent className="bg-white text-gray-900"> {/* Updated text color */}
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
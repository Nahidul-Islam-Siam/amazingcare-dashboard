"use client";

import { useState } from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";
import { Avatar, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useAppDispatch } from "@/hooks/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useGetProfileQuery } from "@/redux/features/auth/authApi";
import { UserProfile } from "@/redux/features/auth/authApi"; // import the interface

const AppHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Fetch user profile
  const { data: userProfile, isLoading, isSuccess } = useGetProfileQuery();

  // Extract user info safely
  const user: UserProfile | null = isSuccess && userProfile?.data ? userProfile.data : null;

  // Loading state
  if (isLoading) {
    return (
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-white px-4 shadow-sm">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <h1 className="text-lg font-medium text-gray-900">Loading...</h1>
        </div>
        <div className="w-32"></div>
      </header>
    );
  }

  // Handle user data display
  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.email?.split("@")[0] || "Guest";

  const avatarUrl =
    user?.profileImage && user.profileImage.trim() !== ""
      ? user.profileImage
      : "https://github.com/shadcn.png";

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  // If you want to eventually display the real role (if returned from profile API)
  // For now, use a placeholder
  const role = "Teacher"; // or use user?.role if added in profile later

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-white px-4 shadow-sm">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4" />
        <h1 className="text-lg font-medium text-gray-900">
          Welcome Back, {displayName}
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <div className="flex cursor-pointer items-center gap-3 rounded-md p-1 hover:bg-gray-100">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl} alt={`${displayName}'s avatar`} />
              </Avatar>

              <div className="flex flex-col text-sm leading-none">
                <span className="font-semibold text-gray-900">{displayName}</span>
                <span className="text-gray-500">{role}</span>
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-48 rounded-md border bg-white p-1 shadow-lg"
          >
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 size-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AppHeader;

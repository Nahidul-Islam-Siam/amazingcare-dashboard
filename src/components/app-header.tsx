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
import { useGetProfileQuery } from "@/redux/features/dashboard/userApi";
import { useAppDispatch } from "@/hooks/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";



const AppHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: userProfile, isLoading, isSuccess } = useGetProfileQuery();






  const dispatch = useAppDispatch();
  const router = useRouter();
  

  // Only define user if we have successful data
  const user = isSuccess && userProfile?.data ? userProfile.data : null;

  // Show loading state first
  if (isLoading) {
    return (
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-white px-4 shadow-sm">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <h1 className="text-lg font-medium text-gray-900">Loading...</h1>
        </div>
        <div className="w-32"></div> {/* Placeholder for alignment */}
      </header>
    );
  }

  // Once loaded, extract user info safely
  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.email?.split("@")[0] || "Guest";

  const avatarUrl = user?.profileImage || "https://github.com/shadcn.png";

  // Determine if user is admin
  const isAdmin = user?.email === "admin@gmail.com";
  const role = isAdmin ? "Administrator" : "User";

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-white px-4 shadow-sm">
      {/* Left Side */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4" />
        <h1 className="text-lg font-medium text-gray-900">
          Welcome Back, {displayName}
        </h1>
      </div>

      {/* Right Side - User Menu */}
      <div className="flex items-center gap-3">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <div className="flex cursor-pointer items-center gap-3 rounded-md p-1 hover:bg-gray-100">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl} alt={`${displayName}'s avatar`} />
              </Avatar>

              <div className="flex flex-col text-sm leading-none">
                {/* Name + Admin Badge */}
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-gray-900">{displayName}</span>
                  {isAdmin && (
                    <Image
                      src="/badge.png"
                      alt="Admin Badge"
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                  )}
                </div>
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
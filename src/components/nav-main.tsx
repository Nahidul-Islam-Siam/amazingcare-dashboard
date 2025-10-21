/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ChevronDown, ChevronRight } from "lucide-react";

// Nav item shape
export interface NavItem {
  title: string;
  url: string;
icon: React.ComponentType<any>; // ✅ accepts Lucide + custom SVGs

  isActive?: boolean;
  disabled?: boolean;
  children?: Omit<NavItem, "children">[];
}

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [openItem, setOpenItem] = React.useState<string | null>(null);

  // Auto-open the group that contains the active child route
  React.useEffect(() => {
    const parentWithActiveChild = items.find((it) =>
      it.children?.some((ch) => pathname.startsWith(ch.url))
    );
    if (parentWithActiveChild) {
      setOpenItem(parentWithActiveChild.url);
    }
  }, [pathname, items]);

  const toggleOpen = (url: string) =>
    setOpenItem((prev) => (prev === url ? null : url));

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const hasChildren = !!item.children?.length;
          const parentActive =
            (item.isActive ?? pathname === item.url) ||
            item.children?.some((c) => pathname.startsWith(c.url));
          const isOpen = openItem === item.url;

          return (
            <React.Fragment key={item.url}>
              {/* Parent */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild={!hasChildren}
                  tooltip={item.title}
                  onClick={() => hasChildren && toggleOpen(item.url)}
                  className={`flex items-center rounded-md px-3 py-2 transition-colors duration-200 ${
                    parentActive
                      ? "bg-[#2662E6] text-white font-semibold hover:bg-[#2662E6] hover:text-white"
                      : "text-[#797D86] hover:bg-[#2662E6] hover:text-white font-semibold"
                  } ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={item.disabled}
                >
                  {hasChildren ? (
                    <div className="flex items-center gap-2 w-full">
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span className=" ">{item.title}</span>
                      <span className="ml-auto ">
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </span>
                    </div>
                  ) : (
                    <Link href={item.url} className="flex items-center gap-2 w-full">
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span>{item.title}</span>
                    </Link>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Children */}
              {hasChildren && isOpen && (
                <div className="pl-8 mt-1 space-y-1">
                  {item.children!.map((child) => {
                    const childActive =
                      pathname === child.url || pathname.startsWith(child.url);
                    return (
                      <SidebarMenuItem key={child.url}>
                        <SidebarMenuButton
                          asChild
                          className={`flex items-center gap-2 py-1 text-sm ${
                            childActive
                              ? "text-[#080A09] font-medium"
                              : "text-gray-600 hover:text-[#080A09]"
                          }`}
                        >
                          <Link
                            href={child.url}
                            className="flex items-center gap-2"
                            // Removed onClick={collapseAll} to keep open
                          >
                            <span className="w-2 h-2 bg-[#080A09] rounded-full" />
                            <span>{child.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

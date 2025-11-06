"use client"

import {
  IconDots,
  type Icon,
} from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { useFavNotificationStore } from "@/context/updateFavorite"
import Link from "next/link"

export function NavDocuments({
  userId,
}: {
  items?: {
    name: string
    url: string
    icon: Icon
  }[]
  userId: string
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [favorites, setFavorites] = useState<any[]>([])
  const refreshSignal = useFavNotificationStore((state) => state.refreshFavSignal)

  useEffect(() => {
    if (!userId) return
    const fetchFavorites = async () => {
      const res = await fetch(`/api/favorite?userId=${userId}`)
      if (res.ok) {
        const data = await res.json()
        setFavorites(data)
      }
    }
    fetchFavorites()
  }, [userId, refreshSignal])

  // Take only the latest 4 favorites to show in sidebar, newest first
  const latestFavorites = favorites.slice(-4).reverse()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>⭐ Favorite</SidebarGroupLabel>
      <SidebarMenu>
        {latestFavorites.map((fav) => (
          <SidebarMenuItem key={fav.id}>
            <SidebarMenuButton asChild>
              <a href={`/dashboard/notes/${fav.noteId}`} className="flex items-center gap-2">
                <span>{fav.note.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}

        <SidebarMenuItem>
          <SidebarMenuButton asChild className="text-sidebar-foreground/70">
            {/* Link to a dedicated favorites page */}
            <Link
              href="/dashboard/favorites"
              className="flex items-center gap-2 text-sidebar-foreground/70"
            >
              <IconDots className="text-sidebar-foreground/70" />
              <span>More</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

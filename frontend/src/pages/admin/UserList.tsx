import { useEffect, useState, ChangeEvent } from "react"
import { Users, Database, MessageSquare, Search, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAdminAuthStore } from "@/stores/logic/adminAuthStore"
import { useNavigate } from "react-router-dom"
import useUsers from "@/stores/logic/useUsers"
import Spinner from "@/components/ui/spinner"

export default function UsersList() {
  const navigate = useNavigate()
  const { is_authenticated } = useAdminAuthStore((state) => state)
  const { users, loading, getAllUsers } = useUsers()
  const [search_term, set_search_term] = useState("")

  useEffect(() => {
    getAllUsers()
  }, [is_authenticated, navigate])

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    set_search_term(e.target.value)
  }

  const filtered_users = users?.filter((user) =>
    user?.username?.toLowerCase().includes(search_term.toLowerCase()) ||
    user?.email?.toLowerCase().includes(search_term.toLowerCase())
  ) || []

  if (loading) {
    return <Spinner size={"80"} color={"white"} className="h-full w-full" />
  }

  return (
    <div className="p-6 h-full">
      <Card className="bg-ctp-surface0 border-ctp-flamingo">
        <CardHeader>
          <CardTitle className="text-ctp-text">User List</CardTitle>
          <CardDescription className="text-ctp-subtext0">Manage users who have interacted with your chatbot</CardDescription>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-ctp-subtext0" />
            <Input
              placeholder="Search users..."
              className="pl-8 bg-ctp-surface1 border-ctp-flamingo text-ctp-text placeholder:text-ctp-subtext0"
              value={search_term}
              onChange={handleSearchChange}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-ctp-surface1">
                <TableHead className="text-ctp-text">User</TableHead>
                <TableHead className="text-ctp-text">Stats</TableHead>
                <TableHead className="text-ctp-text">Joined</TableHead>
                <TableHead className="text-right text-ctp-text">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!filtered_users?.length ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-ctp-subtext0">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filtered_users.map((user) => (
                  <TableRow key={user?.id} className="hover:bg-ctp-surface1">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${user?.username?.charAt(0) || '?'}`} />
                          <AvatarFallback className="bg-ctp-surface1 text-ctp-text">{user?.username?.charAt(0) || '?'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-ctp-text">{user?.username || 'Unknown User'}</div>
                          <div className="text-sm text-ctp-subtext0">{user?.email || 'No email'}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4 text-ctp-subtext0" />
                          <span className="text-ctp-text">{user?.stats?.conversation_count || 0} conversations</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Database className="h-4 w-4 text-ctp-subtext0" />
                          <span className="text-ctp-text">{user?.stats?.languages_interacted || 0} languages</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-ctp-subtext0" />
                          <span className="text-ctp-text">{user?.stats?.days_used || 0} days</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-ctp-text">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown date'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:bg-ctp-surface1">
                            <MoreHorizontal className="h-4 w-4 text-ctp-text" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-ctp-surface0 border-ctp-flamingo">
                          <DropdownMenuItem className="text-ctp-text hover:bg-ctp-surface1">View Conversations</DropdownMenuItem>
                          <DropdownMenuItem className="text-ctp-text hover:bg-ctp-surface1">Send Message</DropdownMenuItem>
                          <DropdownMenuItem className="text-ctp-text hover:bg-ctp-surface1">Block User</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 
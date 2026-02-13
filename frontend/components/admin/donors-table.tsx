"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Search, Shield, ShieldOff, UserX, Mail, Wind } from "lucide-react"
import supabase from "@/lib/supabaseClient"

export function DonorsTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading,setLoading] = useState(false)


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-accent text-accent-foreground">Verified</Badge>
      case "suspended":
        return <Badge className="bg-red-500 text-red-foreground text-white">Suspended</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="border-yellow-500/50 text-yellow-600">
            Pending
          </Badge>
        )
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }
  useEffect(() => {
    fetchDonorList()
  },[])
  const [donorList, setDonorList] = useState<any>([])
  const filteredDonors = donorList.filter(
    (donor : any) =>
      (donor['full_name']).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (donor['email']).toLowerCase().includes(searchQuery.toLowerCase()),
  )
  async function fetchDonorList() {
    setLoading(true)
    const { data, error } = await supabase
      .from("donors")
      .select("*")

    if (error) {
      console.error(error)
      return
    }

    console.log(data)

    setDonorList(data ?? [])
    setLoading(false)

  }


  async function handleSuspend(id : string){
    setLoading(true)
    const { data, error } = await supabase
      .from("donors")
      .update({ status: "suspended" })
      .eq("id", id)
      .select("*")
    if (error) {
      console.error(error)
      return
    }
    console.log( "sus"  + data)
    setLoading(false)
    fetchDonorList()

  }

  async function handleVerify(id: string) {
    setLoading(true)
    const { data, error } = await supabase
      .from("donors")
      .update({ status: "approved" })
      .eq("id", id)
      .select("*")
    if (error) {
      console.error(error)
      return
    }
    console.log("sus" + data)
    setLoading(false)
    fetchDonorList()
  }

  async function handleRemove(id: string) {
    setLoading(true)
    const { error } = await supabase
      .from("donors")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Failed to delete donor:", error)
      return
    }
    console.log("Deleted donor with ID:", id)
    setLoading(false)
    fetchDonorList()
  }

  if (loading) return (
    <>
      <div className="flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    </>
  )
  return (
    <Card className="border-border/60">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Donor Management</CardTitle>
            <CardDescription>View and manage registered blood donors</CardDescription>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search donors..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Donor</TableHead>
                <TableHead>Blood Group</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>College</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDonors.map((donor : any) => (
                <TableRow key={donor['auth_user_id']}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{donor['full_name']}</p>
                      <p className="text-sm text-muted-foreground">{donor['email']}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-primary">{donor['blood_group']}</span>
                  </TableCell>
                  <TableCell>{getStatusBadge(donor['status'])}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(donor['created_at']).toLocaleDateString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{donor['college']}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {donor['status'] != "approved" && <DropdownMenuItem className="gap-2" onClick={() => handleVerify(donor['id'])}>
                          <Shield className="h-4 w-4" />
                          Verify
                        </DropdownMenuItem>}
                        {/* <DropdownMenuItem className="gap-2">
                          <Mail className="h-4 w-4" />
                          Send Email
                        </DropdownMenuItem> */}
                        <DropdownMenuItem className="gap-2" onClick={() => handleSuspend(donor['id'])}>
                          <ShieldOff className="h-4 w-4" />
                          Suspend
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleRemove(donor['id'])}>
                          <UserX className="h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}

            </TableBody>
          </Table>
          {
            filteredDonors.length === 0 && (
              <div className="flex items-center justify-center py-4">
                <p className="text-muted-foreground">No donors found</p>
              </div>
            )
          }
        </div>
      </CardContent>
    </Card>
  )
}

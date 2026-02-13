"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react"

const mockRequests = [
  {
    id: "REQ001",
    patientName: "Amit Kumar",
    bloodGroup: "A+",
    units: 2,
    urgency: "critical",
    hospital: "City Hospital",
    status: "pending",
    requestedAt: "2024-11-15T10:30:00",
  },
  {
    id: "REQ002",
    patientName: "Sunita Devi",
    bloodGroup: "O-",
    units: 1,
    urgency: "urgent",
    hospital: "General Hospital",
    status: "fulfilled",
    requestedAt: "2024-11-14T14:20:00",
  },
  {
    id: "REQ003",
    patientName: "Rajesh Patel",
    bloodGroup: "B+",
    units: 3,
    urgency: "planned",
    hospital: "Medical Center",
    status: "pending",
    requestedAt: "2024-11-15T08:15:00",
  },
  {
    id: "REQ004",
    patientName: "Meena Sharma",
    bloodGroup: "AB+",
    units: 1,
    urgency: "urgent",
    hospital: "City Hospital",
    status: "cancelled",
    requestedAt: "2024-11-13T16:45:00",
  },
]

export function RequestsTable() {
  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            Critical
          </Badge>
        )
      case "urgent":
        return (
          <Badge variant="outline" className="gap-1 border-orange-500/50 text-orange-600">
            <Clock className="h-3 w-3" />
            Urgent
          </Badge>
        )
      case "planned":
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Planned
          </Badge>
        )
      default:
        return <Badge variant="secondary">{urgency}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "fulfilled":
        return (
          <Badge className="gap-1 bg-accent text-accent-foreground">
            <CheckCircle className="h-3 w-3" />
            Fulfilled
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="secondary" className="gap-1">
            <XCircle className="h-3 w-3" />
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>Blood Requests</CardTitle>
        <CardDescription>Manage incoming blood requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Request ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Blood Group</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-mono text-sm">{request.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{request.patientName}</p>
                      <p className="text-sm text-muted-foreground">{request.hospital}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-primary">{request.bloodGroup}</span>
                  </TableCell>
                  <TableCell>{request.units}</TableCell>
                  <TableCell>{getUrgencyBadge(request.urgency)}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {request.status === "pending" && (
                        <>
                          <Button size="sm" variant="outline" className="h-8 gap-1 bg-transparent">
                            <CheckCircle className="h-3 w-3" />
                            Fulfill
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 gap-1">
                            <XCircle className="h-3 w-3" />
                            Cancel
                          </Button>
                        </>
                      )}
                      {request.status !== "pending" && (
                        <Button size="sm" variant="ghost" className="h-8">
                          View
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

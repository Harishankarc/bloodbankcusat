'use client'
import { Card, CardContent } from "@/components/ui/card"
import supabase from "@/lib/supabaseClient"
import { Users, Activity, Heart, Clock, TrendingUp, TrendingDown } from "lucide-react"
import { useEffect, useState } from "react"



export function StatsCards() {


const [stat, setStat] = useState({
    total: 0,
    willing: 0,
    pending : 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      const [{ count: total }, { count: pending } , { count: willing }] = await Promise.all([
        supabase
          .from("donors")
          .select("*", { count: "exact", head: true })
          .eq("status", "approved"),

        supabase
          .from("donors")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),

        supabase
          .from("donors")
          .select("*", { count: "exact", head: true })
          .eq("status", "approved")
          .eq("is_willing_to_donate", true),

      ])

      setStat({
        total: total ?? 0,
        willing: willing ?? 0,
        pending : pending ?? 0
      })
    }

    fetchStats()
  }, [])




  let stats = [
    {
      title: "Total Donors",
      value: stat.total.toString(),
      change: "+12%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Available Now",
      value: stat.willing.toString(),
      change: "+5%",
      trend: "up",
      icon: Activity,
    },
    {
      title: "Pending Requests",
      value: stat.pending.toString(),
      change: "-3%",
      trend: "down",
      icon: Clock,
    },
    {
      title: "Lives Saved",
      value: "0",
      change: "+8%",
      trend: "up",
      icon: Heart,
    },
  ]


  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-medium ${stat.trend === "up" ? "text-accent" : "text-muted-foreground"}`}
              >
                {stat.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

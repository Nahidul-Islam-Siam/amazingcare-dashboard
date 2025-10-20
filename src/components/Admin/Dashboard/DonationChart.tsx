/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer } from "@/components/ui/chart"

// Mock data matching the image: 8 bars with values
const chartData = [
  { category: "xyz", value: 1200 },
  { category: "xyz", value: 450 },
  { category: "xyz", value: 1600 }, // Top Sale - index 2
  { category: "xyz", value: 850 },
  { category: "xyz", value: 1150 },
  { category: "xyz", value: 800 },
  { category: "xyz", value: 900 },
  { category: "xyz", value: 400 },
]

const chartConfig = {
  value: {
    label: "Donations",
    color: "#93B5FD", // Light blue
  },
  highlight: {
    label: "Top Sale",
    color: "#2563EB", // Dark blue
  },
} satisfies ChartConfig

export default function DonationChart() {
  return (
    <Card className="w-full max-w-full rounded-[12px] border-2  bg-white py-6">
      <CardHeader>
        <CardTitle>Donation</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 40, right: 20, left: 20, bottom: 20 }}>
            {/* Gridlines */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />

            {/* Y-axis */}
            <YAxis
              domain={[0, 1600]}
              ticks={[100, 400, 800, 1200, 1600]}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              className="text-xs text-muted-foreground"
            />

            {/* X-axis */}
            <XAxis dataKey="category" tickLine={false} axisLine={false} className="text-xs text-muted-foreground" />

            {/* Bars with custom coloring */}
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={index === 2 ? "#2563EB" : "#93B5FD"} />
              ))}

              {/* Label for Top Sale */}
              <LabelList
                dataKey="value"
                position="top"
                className="text-xs font-medium"
                offset={8}
                formatter={(value: number, entry: any, index: number) => {
                  if (index === 2) return "Top Sale"
                  return ""
                }}
                fill="#2563EB"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type TimeRange = "24h" | "7d" | "30d" | "90d" | "1y" | "custom";

interface TimeFilterProps {
  onRangeChange: (range: DateRange | undefined) => void
  onComparisonChange: (compare: boolean) => void
  className?: string
}

export function TimeFilter({
  onRangeChange,
  onComparisonChange,
  className,
}: TimeFilterProps) {
  const [date, setDate] = React.useState<DateRange | undefined>()
  const [timeRange, setTimeRange] = React.useState<TimeRange>("7d")
  const [showComparison, setShowComparison] = React.useState(false)

  // Handle quick select time range changes
  const handleQuickSelect = (range: TimeRange) => {
    setTimeRange(range)
    if (range === "custom") return

    const end = new Date()
    const start = new Date()

    switch (range) {
      case "24h":
        start.setDate(start.getDate() - 1)
        break
      case "7d":
        start.setDate(start.getDate() - 7)
        break
      case "30d":
        start.setDate(start.getDate() - 30)
        break
      case "90d":
        start.setDate(start.getDate() - 90)
        break
      case "1y":
        start.setFullYear(start.getFullYear() - 1)
        break
    }

    setDate({ from: start, to: end })
    onRangeChange({ from: start, to: end })
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Select
        value={timeRange}
        onValueChange={(value) => handleQuickSelect(value as TimeRange)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="24h">Last 24 Hours</SelectItem>
          <SelectItem value="7d">Last 7 Days</SelectItem>
          <SelectItem value="30d">Last 30 Days</SelectItem>
          <SelectItem value="90d">Last 90 Days</SelectItem>
          <SelectItem value="1y">Last Year</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>

      {timeRange === "custom" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={(range) => {
                setDate(range)
                onRangeChange(range)
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      )}

      <Button
        variant="outline"
        className={cn(
          showComparison && "bg-accent"
        )}
        onClick={() => {
          setShowComparison(!showComparison)
          onComparisonChange(!showComparison)
        }}
      >
        Compare
      </Button>
    </div>
  )
}

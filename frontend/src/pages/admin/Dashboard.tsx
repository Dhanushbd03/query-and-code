import { Card, Title, Text } from "@tremor/react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import useAnalytics from "@/stores/logic/useAnalytics";
import { Loader2 } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full text-gray-400">
    <p>No data available</p>
  </div>
);

const formatHour = (hour: string) => {
  const [hours, minutes] = hour.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

const formatDay = (day: string) => {
  return day.slice(0, 3); // Convert "Monday" to "Mon"
};

export default function Dashboard() {
  const { 
    hourlyData, 
    weeklyData, 
    languageData, 
    quickStats, 
    loading, 
    error,
    fetchAnalytics 
  } = useAnalytics();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Text className="text-red-500">{error}</Text>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Chat Analytics Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hourly Chat Activity */}
          <Card>
            <Title className="text-white">Hourly Chat Activity</Title>
            <Text className="text-white">Number of chats throughout the day</Text>
            <div className="h-72 mt-4">
              {hourlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="hour" 
                      tickFormatter={formatHour}
                      interval="preserveStartEnd"
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={formatHour}
                      formatter={(value: number) => [`${value} chats`, 'Chats']}
                    />
                    <Area
                      type="monotone"
                      dataKey="chats"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState />
              )}
            </div>
          </Card>

          {/* Weekly Chat Distribution */}
          <Card>
            <Title className="text-white">Weekly Chat Distribution</Title>
            <Text className="text-white">Chat volume by day of the week</Text>
            <div className="h-72 mt-4">
              {weeklyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="day" 
                      tickFormatter={formatDay}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(label) => label}
                      formatter={(value: number) => [`${value} chats`, 'Chats']}
                    />
                    <Bar dataKey="chats" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState />
              )}
            </div>
          </Card>

          {/* Language Distribution */}
          <Card>
            <Title className="text-white">Language Distribution</Title>
            <Text className="text-white">Distribution of programming languages</Text>
            <div className="h-72 mt-4">
              {languageData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={languageData}
                      cx="50%"
                      cy="50%"
                      labelLine
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {languageData.map((_entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value} chats`, 'Chats']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState />
              )}
            </div>
          </Card>

          {/* Summary Stats */}
          <Card>
            <Title className="text-white">Quick Stats</Title>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <Text className="text-blue-600">Total Chats Today</Text>
                <p className="text-2xl font-bold text-blue-600">{quickStats?.totalChats || 0}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <Text className="text-green-600">Avg Response Time</Text>
                <p className="text-2xl font-bold text-green-600">{quickStats?.averageResponseTime || 0} min</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <Text className="text-purple-600">Active Users</Text>
                <p className="text-2xl font-bold text-purple-600">{quickStats?.activeUsers || 0}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <Text className="text-orange-600">Satisfaction Rate</Text>
                <p className="text-2xl font-bold text-orange-600">{quickStats?.satisfactionRate || 0}%</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
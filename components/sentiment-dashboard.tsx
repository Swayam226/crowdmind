"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingUp, TrendingDown, Minus, ExternalLink, Clock, Users, MessageCircle } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"
import WordCloud from "@/components/word-cloud"

interface SentimentData {
  policy: string
  location: string
  totalPosts: number
  totalComments: number
  totalEngagement: number
  sentimentDistribution: {
    positive: number
    negative: number
    neutral: number
  }
  sentimentScore: number
  topKeywords: Array<{ text: string; value: number; sentiment: string }>
  weeklyTrend: Array<{
    date: string
    positive: number
    negative: number
    neutral: number
    total: number
  }>
  hourlyActivity: Array<{ hour: string; posts: number }>
  topSubreddits: Array<{ name: string; posts: number; sentiment: number }>
  recentPosts: Array<{
    id: number
    title: string
    content: string
    sentiment: string
    score: number
    subreddit: string
    timestamp: string
    upvotes: number
    comments: number
    author: string
  }>
  demographicBreakdown: {
    ageGroups: Array<{ group: string; positive: number; negative: number; neutral: number }>
    regions: Array<{ region: string; positive: number; negative: number; neutral: number }>
  }
}

interface SentimentDashboardProps {
  data: SentimentData
  onBack: () => void
}

const COLORS = {
  positive: "#10B981",
  negative: "#EF4444",
  neutral: "#6B7280",
}

const GRADIENT_COLORS = {
  positive: "from-emerald-400 to-emerald-600",
  negative: "from-red-400 to-red-600",
  neutral: "from-gray-400 to-gray-600",
}

export default function SentimentDashboard({ data, onBack }: SentimentDashboardProps) {
  const pieData = [
    { name: "Positive", value: data.sentimentDistribution.positive, color: COLORS.positive },
    { name: "Negative", value: data.sentimentDistribution.negative, color: COLORS.negative },
    { name: "Neutral", value: data.sentimentDistribution.neutral, color: COLORS.neutral },
  ]

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "POSITIVE":
        return <TrendingUp className="h-4 w-4 text-emerald-600" />
      case "NEGATIVE":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getSentimentBadge = (sentiment: string, score: number) => {
    const baseClasses = "flex items-center gap-1 font-medium"
    switch (sentiment) {
      case "POSITIVE":
        return (
          <Badge className={`${baseClasses} bg-emerald-100 text-emerald-800 hover:bg-emerald-200`}>
            {getSentimentIcon(sentiment)}
            Positive ({(score * 100).toFixed(0)}%)
          </Badge>
        )
      case "NEGATIVE":
        return (
          <Badge className={`${baseClasses} bg-red-100 text-red-800 hover:bg-red-200`}>
            {getSentimentIcon(sentiment)}
            Negative ({(score * 100).toFixed(0)}%)
          </Badge>
        )
      default:
        return (
          <Badge className={`${baseClasses} bg-gray-100 text-gray-800 hover:bg-gray-200`}>
            {getSentimentIcon(sentiment)}
            Neutral ({(score * 100).toFixed(0)}%)
          </Badge>
        )
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const positivePercentage = ((data.sentimentDistribution.positive / data.totalPosts) * 100).toFixed(1)
  const negativePercentage = ((data.sentimentDistribution.negative / data.totalPosts) * 100).toFixed(1)
  const neutralPercentage = ((data.sentimentDistribution.neutral / data.totalPosts) * 100).toFixed(1)

  const overallSentiment =
    Number.parseFloat(positivePercentage) > Number.parseFloat(negativePercentage) ? "Positive" : "Negative"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <Button
              variant="outline"
              onClick={onBack}
              className="h-12 px-6 bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {data.policy}
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                {data.location} • {data.totalPosts.toLocaleString()} posts • {data.totalComments.toLocaleString()}{" "}
                comments
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Overall Sentiment</CardTitle>
              <div
                className={`p-2 rounded-lg ${overallSentiment === "Positive" ? "bg-emerald-100" : "bg-red-100"} group-hover:scale-110 transition-transform duration-300`}
              >
                {overallSentiment === "Positive" ? (
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${overallSentiment === "Positive" ? "text-emerald-600" : "text-red-600"}`}
              >
                {overallSentiment}
              </div>
              <p className="text-xs text-gray-500 mt-1">Score: {(data.sentimentScore * 100).toFixed(1)}%</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Positive Sentiment</CardTitle>
              <div className="p-2 bg-emerald-100 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{data.sentimentDistribution.positive}</div>
              <p className="text-xs text-gray-500 mt-1">{positivePercentage}% of total posts</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Negative Sentiment</CardTitle>
              <div className="p-2 bg-red-100 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingDown className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{data.sentimentDistribution.negative}</div>
              <p className="text-xs text-gray-500 mt-1">{negativePercentage}% of total posts</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Engagement</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{(data.totalEngagement / 1000).toFixed(1)}K</div>
              <p className="text-xs text-gray-500 mt-1">Upvotes & interactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Sentiment Distribution */}
          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Sentiment Distribution</CardTitle>
              <CardDescription>Overall sentiment breakdown for {data.policy}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, "Posts"]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Weekly Trend */}
          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Weekly Sentiment Trend</CardTitle>
              <CardDescription>Daily sentiment changes over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={data.weeklyTrend}>
                  <defs>
                    <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.positive} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={COLORS.positive} stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.negative} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={COLORS.negative} stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-IN", { month: "short", day: "numeric" })
                    }
                    stroke="#666"
                  />
                  <YAxis stroke="#666" />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString("en-IN")}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="positive"
                    stackId="1"
                    stroke={COLORS.positive}
                    fillOpacity={1}
                    fill="url(#colorPositive)"
                    name="Positive"
                  />
                  <Area
                    type="monotone"
                    dataKey="negative"
                    stackId="1"
                    stroke={COLORS.negative}
                    fillOpacity={1}
                    fill="url(#colorNegative)"
                    name="Negative"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Additional Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Hourly Activity */}
          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Daily Activity Pattern</CardTitle>
              <CardDescription>Post frequency throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.hourlyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar dataKey="posts" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Subreddits */}
          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Top Discussion Forums</CardTitle>
              <CardDescription>Most active subreddits discussing this policy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topSubreddits.map((subreddit, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{subreddit.name}</div>
                        <div className="text-sm text-gray-500">{subreddit.posts} posts</div>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        subreddit.sentiment > 0.5
                          ? "bg-emerald-100 text-emerald-800"
                          : subreddit.sentiment < 0.4
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {(subreddit.sentiment * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Word Cloud and Recent Posts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Word Cloud */}
          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Trending Keywords</CardTitle>
              <CardDescription>Most frequently mentioned terms in discussions</CardDescription>
            </CardHeader>
            <CardContent>
              <WordCloud words={data.topKeywords} />
            </CardContent>
          </Card>

          {/* Enhanced Recent Posts */}
          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Recent Discussions</CardTitle>
              <CardDescription>Latest social media posts with sentiment analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
              {data.recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="border border-gray-200 rounded-xl p-4 space-y-3 hover:shadow-md transition-all duration-200 bg-white/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-semibold text-gray-900 line-clamp-2 flex-1">{post.title}</h4>
                    {getSentimentBadge(post.sentiment, post.score)}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{post.content}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{post.subreddit}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(post.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {post.upvotes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full bg-white/80 hover:bg-white shadow-sm hover:shadow-md transition-all duration-200"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View All Discussions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

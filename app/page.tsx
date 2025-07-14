"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, TrendingUp, Users, MessageSquare, BarChart3, Brain, Globe } from "lucide-react"
import SentimentDashboard from "@/components/sentiment-dashboard"
import mockData from "@/data/mock-sentiment-data.json"

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
]

const majorCities = {
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
  Karnataka: ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut"],
}

export default function HomePage() {
  const [policy, setPolicy] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleSearch = async () => {
    if (!policy || !selectedState || !selectedCity) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2500))
    setIsLoading(false)
    setShowResults(true)
  }

  const resetSearch = () => {
    setShowResults(false)
    setPolicy("")
    setSelectedState("")
    setSelectedCity("")
  }

  if (showResults) {
    return <SentimentDashboard data={mockData.policies[0]} onBack={resetSearch} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              CrowdMind
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Transform social media conversations into actionable policy insights. Harness the power of AI to understand
            public sentiment and drive data-driven governance across India.
          </p>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>28+ States Covered</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Real-time Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span>AI-Powered Insights</span>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Policies Analyzed</CardTitle>
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">2,847</div>
              <p className="text-xs text-green-600 font-medium">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Social Posts Processed</CardTitle>
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">1.2M</div>
              <p className="text-xs text-green-600 font-medium">+8% from last month</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Policymakers</CardTitle>
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">156</div>
              <p className="text-xs text-green-600 font-medium">+23% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Search Form */}
        <Card className="max-w-3xl mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Analyze Policy Sentiment
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 mt-2">
              Enter a policy name and select location to get comprehensive sentiment insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            <div className="space-y-3">
              <Label htmlFor="policy" className="text-base font-medium text-gray-700">
                Policy Name
              </Label>
              <Input
                id="policy"
                placeholder="e.g., NEP 2020, Digital India, Ayushman Bharat, GST Implementation"
                value={policy}
                onChange={(e) => setPolicy(e.target.value)}
                className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="state" className="text-base font-medium text-gray-700">
                  State
                </Label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianStates.map((state) => (
                      <SelectItem key={state} value={state} className="text-base">
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="city" className="text-base font-medium text-gray-700">
                  City
                </Label>
                <Select value={selectedCity} onValueChange={setSelectedCity} disabled={!selectedState}>
                  <SelectTrigger className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedState &&
                      majorCities[selectedState as keyof typeof majorCities]?.map((city) => (
                        <SelectItem key={city} value={city} className="text-base">
                          {city}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleSearch}
              disabled={!policy || !selectedState || !selectedCity || isLoading}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Analyzing Sentiment...
                </>
              ) : (
                <>
                  <Search className="mr-3 h-5 w-5" />
                  Analyze Policy Sentiment
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Enhanced Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center group">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
              <Search className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-900">Real-time Analysis</h3>
            <p className="text-gray-600 leading-relaxed">
              Get instant sentiment insights from thousands of social media posts and comments with advanced AI
              processing
            </p>
          </div>

          <div className="text-center group">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
              <Globe className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-900">Location-based Insights</h3>
            <p className="text-gray-600 leading-relaxed">
              Filter sentiment by specific states and cities for targeted policy decisions and regional understanding
            </p>
          </div>

          <div className="text-center group">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-900">AI-powered Processing</h3>
            <p className="text-gray-600 leading-relaxed">
              Advanced NLP models analyze sentiment with high accuracy and contextual understanding for reliable
              insights
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { GraduationCap, Plus, Trash2 } from "lucide-react"

export default function GPAConverter() {
  const [gpaSystem, setGpaSystem] = useState("4.0")
  const [targetSystem, setTargetSystem] = useState("percentage")
  const [inputGPA, setInputGPA] = useState("")
  const [result, setResult] = useState("")
  const [courses, setCourses] = useState([{ grade: "", credits: "", points: 0 }])

  const gradeScales = {
    "4.0": {
      name: "4.0 Scale (US)",
      grades: {
        "A+": 4.0,
        A: 4.0,
        "A-": 3.7,
        "B+": 3.3,
        B: 3.0,
        "B-": 2.7,
        "C+": 2.3,
        C: 2.0,
        "C-": 1.7,
        "D+": 1.3,
        D: 1.0,
        F: 0.0,
      },
    },
    "10": {
      name: "10 Point Scale",
      grades: {
        "10": 10,
        "9": 9,
        "8": 8,
        "7": 7,
        "6": 6,
        "5": 5,
        "4": 4,
        "3": 3,
        "2": 2,
        "1": 1,
        "0": 0,
      },
    },
    percentage: {
      name: "Percentage",
      grades: {},
    },
  }

  const convertGPA = () => {
    const gpa = Number.parseFloat(inputGPA)
    if (isNaN(gpa)) return

    let convertedValue: number

    // Convert from input system to percentage first
    let percentage: number
    if (gpaSystem === "4.0") {
      percentage = (gpa / 4.0) * 100
    } else if (gpaSystem === "10") {
      percentage = gpa * 10
    } else {
      percentage = gpa
    }

    // Convert from percentage to target system
    if (targetSystem === "4.0") {
      convertedValue = (percentage / 100) * 4.0
    } else if (targetSystem === "10") {
      convertedValue = percentage / 10
    } else {
      convertedValue = percentage
    }

    setResult(convertedValue.toFixed(2))
  }

  const addCourse = () => {
    setCourses([...courses, { grade: "", credits: "", points: 0 }])
  }

  const removeCourse = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index))
  }

  const updateCourse = (index: number, field: string, value: string) => {
    const updated = [...courses]
    updated[index] = { ...updated[index], [field]: value }

    // Calculate grade points
    if (field === "grade") {
      const gradePoints = gradeScales["4.0"].grades[value as keyof (typeof gradeScales)["4.0"]["grades"]] || 0
      updated[index].points = gradePoints
    }

    setCourses(updated)
  }

  const calculateCumulativeGPA = () => {
    let totalPoints = 0
    let totalCredits = 0

    courses.forEach((course) => {
      const credits = Number.parseFloat(course.credits)
      if (!isNaN(credits) && course.points !== undefined) {
        totalPoints += course.points * credits
        totalCredits += credits
      }
    })

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00"
  }

  const getGradeDescription = (gpa: number) => {
    if (gpa >= 3.7) return { text: "Excellent (A)", color: "text-green-600" }
    if (gpa >= 3.3) return { text: "Good (B+)", color: "text-blue-600" }
    if (gpa >= 3.0) return { text: "Above Average (B)", color: "text-blue-500" }
    if (gpa >= 2.7) return { text: "Average (B-)", color: "text-yellow-600" }
    if (gpa >= 2.0) return { text: "Below Average (C)", color: "text-orange-600" }
    return { text: "Poor (D/F)", color: "text-red-600" }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">GPA Converter</h1>
          <p className="text-gray-600">Convert between different GPA scales and calculate cumulative GPA</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* GPA Converter */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle>GPA Scale Converter</CardTitle>
              <CardDescription>Convert between different GPA systems</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From System</Label>
                  <Select value={gpaSystem} onValueChange={setGpaSystem}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4.0">4.0 Scale (US)</SelectItem>
                      <SelectItem value="10">10 Point Scale</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>To System</Label>
                  <Select value={targetSystem} onValueChange={setTargetSystem}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4.0">4.0 Scale (US)</SelectItem>
                      <SelectItem value="10">10 Point Scale</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Input GPA</Label>
                <Input
                  type="number"
                  placeholder={`Enter GPA in ${gradeScales[gpaSystem as keyof typeof gradeScales].name}`}
                  value={inputGPA}
                  onChange={(e) => setInputGPA(e.target.value)}
                />
              </div>

              <Button
                onClick={convertGPA}
                disabled={!inputGPA}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
              >
                Convert GPA
              </Button>

              {result && (
                <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-2">Converted GPA</p>
                  <p className="text-3xl font-bold text-green-600 mb-2">{result}</p>
                  <p className="text-sm text-gray-600">
                    in {gradeScales[targetSystem as keyof typeof gradeScales].name}
                  </p>
                  {targetSystem === "4.0" && (
                    <p className={`text-sm font-medium mt-2 ${getGradeDescription(Number.parseFloat(result)).color}`}>
                      {getGradeDescription(Number.parseFloat(result)).text}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* GPA Calculator */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle>GPA Calculator</CardTitle>
              <CardDescription>Calculate cumulative GPA from individual courses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Courses</Label>
                <Button size="sm" onClick={addCourse}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Course
                </Button>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {courses.map((course, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center p-3 bg-gray-50 rounded-lg">
                    <div className="col-span-4">
                      <Select value={course.grade} onValueChange={(value) => updateCourse(index, "grade", value)}>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(gradeScales["4.0"].grades).map((grade) => (
                            <SelectItem key={grade} value={grade}>
                              {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        placeholder="Credits"
                        value={course.credits}
                        onChange={(e) => updateCourse(index, "credits", e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <div className="col-span-3 text-center">
                      <span className="text-sm font-medium text-gray-600">{course.points.toFixed(1)}</span>
                    </div>
                    <div className="col-span-2">
                      {courses.length > 1 && (
                        <Button size="sm" variant="outline" onClick={() => removeCourse(index)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-blue-600 mb-2">Cumulative GPA</p>
                  <p className="text-2xl font-bold text-blue-800">{calculateCumulativeGPA()}</p>
                  {Number.parseFloat(calculateCumulativeGPA()) > 0 && (
                    <p
                      className={`text-sm font-medium mt-1 ${getGradeDescription(Number.parseFloat(calculateCumulativeGPA())).color}`}
                    >
                      {getGradeDescription(Number.parseFloat(calculateCumulativeGPA())).text}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* GPA Scale Reference */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50 mt-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-800 mb-4">📊 GPA Scale Reference:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-3">4.0 Scale (US)</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>A (90-100%)</span>
                    <span className="font-medium">4.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>B (80-89%)</span>
                    <span className="font-medium">3.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>C (70-79%)</span>
                    <span className="font-medium">2.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>D (60-69%)</span>
                    <span className="font-medium">1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>F (Below 60%)</span>
                    <span className="font-medium">0.0</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-3">10 Point Scale</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Outstanding</span>
                    <span className="font-medium">9-10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Excellent</span>
                    <span className="font-medium">8-9</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Very Good</span>
                    <span className="font-medium">7-8</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Good</span>
                    <span className="font-medium">6-7</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average</span>
                    <span className="font-medium">5-6</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Tips</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Credit hours affect GPA calculation</li>
                  <li>• Higher credit courses have more impact</li>
                  <li>• Retaking courses can improve GPA</li>
                  <li>• Different schools may use different scales</li>
                  <li>• Graduate programs often require 3.0+ GPA</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

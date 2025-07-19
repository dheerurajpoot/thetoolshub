"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calculator, Percent } from "lucide-react"

export default function PercentageCalculator() {
  const [calculations, setCalculations] = useState({
    // What is X% of Y?
    percentOf: { percent: "", number: "", result: "" },
    // X is what percent of Y?
    whatPercent: { part: "", whole: "", result: "" },
    // What is the percentage increase/decrease?
    percentChange: { original: "", new: "", result: "" },
  })

  const calculatePercentOf = () => {
    const percent = Number.parseFloat(calculations.percentOf.percent)
    const number = Number.parseFloat(calculations.percentOf.number)
    if (!isNaN(percent) && !isNaN(number)) {
      const result = (percent / 100) * number
      setCalculations((prev) => ({
        ...prev,
        percentOf: { ...prev.percentOf, result: result.toFixed(2) },
      }))
    }
  }

  const calculateWhatPercent = () => {
    const part = Number.parseFloat(calculations.whatPercent.part)
    const whole = Number.parseFloat(calculations.whatPercent.whole)
    if (!isNaN(part) && !isNaN(whole) && whole !== 0) {
      const result = (part / whole) * 100
      setCalculations((prev) => ({
        ...prev,
        whatPercent: { ...prev.whatPercent, result: result.toFixed(2) },
      }))
    }
  }

  const calculatePercentChange = () => {
    const original = Number.parseFloat(calculations.percentChange.original)
    const newValue = Number.parseFloat(calculations.percentChange.new)
    if (!isNaN(original) && !isNaN(newValue) && original !== 0) {
      const result = ((newValue - original) / original) * 100
      setCalculations((prev) => ({
        ...prev,
        percentChange: { ...prev.percentChange, result: result.toFixed(2) },
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Percent className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Percentage Calculator</h1>
          <p className="text-gray-600">Calculate percentages, percentage changes, and more</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* What is X% of Y? */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-lg">What is X% of Y?</CardTitle>
              <CardDescription>Calculate a percentage of a number</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Percentage (%)</Label>
                <Input
                  type="number"
                  placeholder="25"
                  value={calculations.percentOf.percent}
                  onChange={(e) =>
                    setCalculations((prev) => ({
                      ...prev,
                      percentOf: { ...prev.percentOf, percent: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Of Number</Label>
                <Input
                  type="number"
                  placeholder="200"
                  value={calculations.percentOf.number}
                  onChange={(e) =>
                    setCalculations((prev) => ({
                      ...prev,
                      percentOf: { ...prev.percentOf, number: e.target.value },
                    }))
                  }
                />
              </div>
              <Button onClick={calculatePercentOf} className="w-full">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate
              </Button>
              {calculations.percentOf.result && (
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-green-600">Result</p>
                  <p className="text-2xl font-bold text-green-800">{calculations.percentOf.result}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* X is what percent of Y? */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-lg">X is what % of Y?</CardTitle>
              <CardDescription>Find what percentage one number is of another</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Part (X)</Label>
                <Input
                  type="number"
                  placeholder="50"
                  value={calculations.whatPercent.part}
                  onChange={(e) =>
                    setCalculations((prev) => ({
                      ...prev,
                      whatPercent: { ...prev.whatPercent, part: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Whole (Y)</Label>
                <Input
                  type="number"
                  placeholder="200"
                  value={calculations.whatPercent.whole}
                  onChange={(e) =>
                    setCalculations((prev) => ({
                      ...prev,
                      whatPercent: { ...prev.whatPercent, whole: e.target.value },
                    }))
                  }
                />
              </div>
              <Button onClick={calculateWhatPercent} className="w-full">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate
              </Button>
              {calculations.whatPercent.result && (
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-blue-600">Result</p>
                  <p className="text-2xl font-bold text-blue-800">{calculations.whatPercent.result}%</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Percentage Change */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-lg">Percentage Change</CardTitle>
              <CardDescription>Calculate percentage increase or decrease</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Original Value</Label>
                <Input
                  type="number"
                  placeholder="100"
                  value={calculations.percentChange.original}
                  onChange={(e) =>
                    setCalculations((prev) => ({
                      ...prev,
                      percentChange: { ...prev.percentChange, original: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>New Value</Label>
                <Input
                  type="number"
                  placeholder="120"
                  value={calculations.percentChange.new}
                  onChange={(e) =>
                    setCalculations((prev) => ({
                      ...prev,
                      percentChange: { ...prev.percentChange, new: e.target.value },
                    }))
                  }
                />
              </div>
              <Button onClick={calculatePercentChange} className="w-full">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate
              </Button>
              {calculations.percentChange.result && (
                <div
                  className={`p-4 rounded-lg text-center ${
                    Number.parseFloat(calculations.percentChange.result) >= 0 ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      Number.parseFloat(calculations.percentChange.result) >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {Number.parseFloat(calculations.percentChange.result) >= 0 ? "Increase" : "Decrease"}
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      Number.parseFloat(calculations.percentChange.result) >= 0 ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {Math.abs(Number.parseFloat(calculations.percentChange.result))}%
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

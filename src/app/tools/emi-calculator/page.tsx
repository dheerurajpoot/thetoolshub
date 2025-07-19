"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { DollarSign, Calculator, PieChart } from "lucide-react"

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState([500000])
  const [interestRate, setInterestRate] = useState([10])
  const [loanTenure, setLoanTenure] = useState([20])
  const [emi, setEmi] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)

  const calculateEMI = () => {
    const principal = loanAmount[0]
    const rate = interestRate[0] / 12 / 100 // Monthly interest rate
    const tenure = loanTenure[0] * 12 // Total months

    if (rate === 0) {
      // If interest rate is 0, EMI is simply principal/tenure
      const calculatedEMI = principal / tenure
      setEmi(calculatedEMI)
      setTotalAmount(principal)
      setTotalInterest(0)
    } else {
      // EMI formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
      const calculatedEMI = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1)
      const calculatedTotalAmount = calculatedEMI * tenure
      const calculatedTotalInterest = calculatedTotalAmount - principal

      setEmi(calculatedEMI)
      setTotalAmount(calculatedTotalAmount)
      setTotalInterest(calculatedTotalInterest)
    }
  }

  useEffect(() => {
    calculateEMI()
  }, [loanAmount, interestRate, loanTenure])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const interestPercentage = totalAmount > 0 ? (totalInterest / totalAmount) * 100 : 0
  const principalPercentage = 100 - interestPercentage

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">EMI Calculator</h1>
          <p className="text-gray-600">Calculate your Equated Monthly Installment for loans</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Loan Details
              </CardTitle>
              <CardDescription>Enter your loan information to calculate EMI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Loan Amount */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Loan Amount</Label>
                  <div className="text-right">
                    <Input
                      type="number"
                      value={loanAmount[0]}
                      onChange={(e) => setLoanAmount([Number.parseInt(e.target.value) || 0])}
                      className="w-32 text-right"
                    />
                    <p className="text-sm text-gray-500 mt-1">{formatCurrency(loanAmount[0])}</p>
                  </div>
                </div>
                <Slider
                  value={loanAmount}
                  onValueChange={setLoanAmount}
                  max={10000000}
                  min={100000}
                  step={50000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>₹1L</span>
                  <span>₹1Cr</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Interest Rate (Annual)</Label>
                  <div className="text-right">
                    <Input
                      type="number"
                      value={interestRate[0]}
                      onChange={(e) => setInterestRate([Number.parseFloat(e.target.value) || 0])}
                      className="w-20 text-right"
                      step="0.1"
                    />
                    <p className="text-sm text-gray-500 mt-1">{interestRate[0]}% p.a.</p>
                  </div>
                </div>
                <Slider
                  value={interestRate}
                  onValueChange={setInterestRate}
                  max={30}
                  min={1}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1%</span>
                  <span>30%</span>
                </div>
              </div>

              {/* Loan Tenure */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Loan Tenure</Label>
                  <div className="text-right">
                    <Input
                      type="number"
                      value={loanTenure[0]}
                      onChange={(e) => setLoanTenure([Number.parseInt(e.target.value) || 0])}
                      className="w-20 text-right"
                    />
                    <p className="text-sm text-gray-500 mt-1">{loanTenure[0]} years</p>
                  </div>
                </div>
                <Slider value={loanTenure} onValueChange={setLoanTenure} max={30} min={1} step={1} className="w-full" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1 year</span>
                  <span>30 years</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {/* EMI Result */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-blue-50">
              <CardHeader>
                <CardTitle className="text-center">Monthly EMI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-4xl font-bold text-green-600 mb-2">{formatCurrency(emi)}</p>
                  <p className="text-gray-600">per month for {loanTenure[0]} years</p>
                </div>
              </CardContent>
            </Card>

            {/* Breakdown */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Loan Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Principal Amount</p>
                    <p className="text-xl font-bold text-blue-900">{formatCurrency(loanAmount[0])}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-red-600 font-medium">Total Interest</p>
                    <p className="text-xl font-bold text-red-900">{formatCurrency(totalInterest)}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium mb-2">Total Amount Payable</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
                </div>

                {/* Visual Breakdown */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      Principal ({principalPercentage.toFixed(1)}%)
                    </span>
                    <span>{formatCurrency(loanAmount[0])}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${principalPercentage}%` }}></div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      Interest ({interestPercentage.toFixed(1)}%)
                    </span>
                    <span>{formatCurrency(totalInterest)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-red-500 h-3 rounded-full" style={{ width: `${interestPercentage}%` }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Facts */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3">💡 Quick Facts</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Total months to pay: {loanTenure[0] * 12} months</p>
                  <p>• Interest saved on prepayment: Significant amount</p>
                  <p>• Consider shorter tenure to save on interest</p>
                  <p>• EMI should not exceed 40% of monthly income</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Keyboard, Clock, Target, RotateCcw, Play, Pause } from "lucide-react"

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet and is commonly used for typing practice.",
  "Technology has revolutionized the way we communicate, work, and live. From smartphones to artificial intelligence, innovation continues to shape our future.",
  "Learning to type efficiently is an essential skill in today's digital world. Practice makes perfect, and consistency is key to improvement.",
  "The art of programming requires patience, logic, and creativity. Every line of code is a step towards solving complex problems and building solutions.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. Persistence and determination are the keys to achieving your goals.",
]

export default function TypingTest() {
  const [testText, setTestText] = useState(sampleTexts[0])
  const [userInput, setUserInput] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [errors, setErrors] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && !isCompleted) {
      interval = setInterval(() => {
        if (startTime) {
          const elapsed = (Date.now() - startTime) / 1000
          setTimeElapsed(elapsed)

          // Calculate WPM (Words Per Minute)
          const wordsTyped = userInput.length / 5 // Standard: 5 characters = 1 word
          const minutes = elapsed / 60
          setWpm(minutes > 0 ? Math.round(wordsTyped / minutes) : 0)
        }
      }, 100)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, startTime, userInput.length, isCompleted])

  useEffect(() => {
    // Calculate accuracy and errors
    let correctChars = 0
    let totalErrors = 0

    for (let i = 0; i < userInput.length; i++) {
      if (i < testText.length) {
        if (userInput[i] === testText[i]) {
          correctChars++
        } else {
          totalErrors++
        }
      }
    }

    setErrors(totalErrors)
    const accuracyPercent = userInput.length > 0 ? (correctChars / userInput.length) * 100 : 100
    setAccuracy(Math.round(accuracyPercent))

    // Check if test is completed
    if (userInput.length === testText.length) {
      setIsCompleted(true)
      setIsActive(false)
    }
  }, [userInput, testText])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value

    // Don't allow input beyond test text length
    if (value.length > testText.length) return

    // Start the test on first keystroke
    if (!isActive && !startTime) {
      setStartTime(Date.now())
      setIsActive(true)
    }

    setUserInput(value)
    setCurrentIndex(value.length)
  }

  const resetTest = () => {
    setUserInput("")
    setCurrentIndex(0)
    setStartTime(null)
    setIsActive(false)
    setTimeElapsed(0)
    setWpm(0)
    setAccuracy(100)
    setErrors(0)
    setIsCompleted(false)
    inputRef.current?.focus()
  }

  const pauseTest = () => {
    setIsActive(!isActive)
    if (!isActive && startTime) {
      // Resume: adjust start time to account for pause duration
      const pauseDuration = Date.now() - (startTime + timeElapsed * 1000)
      setStartTime(startTime + pauseDuration)
    }
  }

  const changeText = () => {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length)
    setTestText(sampleTexts[randomIndex])
    resetTest()
  }

  const renderText = () => {
    return testText.split("").map((char, index) => {
      let className = "text-gray-400"

      if (index < userInput.length) {
        if (userInput[index] === char) {
          className = "text-green-600 bg-green-100"
        } else {
          className = "text-red-600 bg-red-100"
        }
      } else if (index === currentIndex) {
        className = "text-gray-800 bg-blue-200 animate-pulse"
      }

      return (
        <span key={index} className={`${className} px-0.5 rounded`}>
          {char}
        </span>
      )
    })
  }

  const progress = (userInput.length / testText.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Keyboard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Typing Speed Test</h1>
          <p className="text-gray-600">Test your typing speed and accuracy</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-lg border-0">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-600">WPM</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{wpm}</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-600">Accuracy</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{accuracy}%</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-gray-600">Time</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{Math.round(timeElapsed)}s</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-sm font-medium text-gray-600">Errors</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{errors}</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress */}
        <Card className="shadow-xl border-0 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Progress</span>
              <span className="text-sm text-gray-500">
                {userInput.length}/{testText.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Typing Area */}
        <Card className="shadow-xl border-0 mb-6">
          <CardHeader>
            <CardTitle>Type the text below:</CardTitle>
            <CardDescription>
              {isCompleted ? "Test completed! Great job!" : "Click in the text area and start typing"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Display Text */}
            <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 min-h-32">
              <p className="text-lg leading-relaxed font-mono">{renderText()}</p>
            </div>

            {/* Input Area */}
            <textarea
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              disabled={isCompleted}
              placeholder="Start typing here..."
              className="w-full p-4 border-2 border-blue-300 rounded-lg resize-none font-mono text-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button onClick={pauseTest} disabled={!startTime || isCompleted} variant="outline">
            {isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isActive ? "Pause" : "Resume"}
          </Button>

          <Button onClick={resetTest} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Test
          </Button>

          <Button onClick={changeText} variant="outline">
            Change Text
          </Button>
        </div>

        {/* Results */}
        {isCompleted && (
          <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle className="text-center text-green-800">🎉 Test Completed!</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-blue-600">{wpm}</p>
                  <p className="text-gray-600">Words per minute</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-600">{accuracy}%</p>
                  <p className="text-gray-600">Accuracy</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-600">{Math.round(timeElapsed)}s</p>
                  <p className="text-gray-600">Time taken</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg">
                <h3 className="font-semibold mb-2">Performance Rating:</h3>
                <p className="text-gray-600">
                  {wpm >= 80
                    ? "🚀 Excellent! You're a typing master!"
                    : wpm >= 60
                      ? "🔥 Great job! Above average typing speed."
                      : wpm >= 40
                        ? "👍 Good work! Keep practicing to improve."
                        : wpm >= 20
                          ? "📈 Not bad! Practice more to increase speed."
                          : "🎯 Keep practicing! Everyone starts somewhere."}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

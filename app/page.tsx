"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, CheckSquare, FileEdit, Clock, Zap, Bell } from "lucide-react";
import { MobileNav } from "@/components/mobile-nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import GetStartedButton from "@/components/GetStartedButton";
import { useTheme } from "next-themes";
import { AppsCarousel } from "@/components/AppsCarousel";

export default function Home() {
  const { theme } = useTheme();
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5] dark:bg-[#1E1E1E] dark:text-gray-200">
      <div className="container mx-auto flex h-24 items-center justify-between px-4 md:px-6 top-0 z-40 w-full bg-[#F5F5F5]/95 dark:bg-[#1E1E1E]/95">
        <MobileNav />
      </div>

      <main className="flex-1">
        <section className="container mx-auto py-12 md:py-24 px-8">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-gray-900 dark:text-white">
                One App for All Your{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  Productivity
                </span>{" "}
                Needs
              </h1>
              <p className="text-gray-700 dark:text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Combine note-taking, sketching, and task management in one
                powerful app with real-time sync across all your devices.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <GetStartedButton />
              </div>
            </div>
            <div className="relative">
              <AppsCarousel />
              <div className="relative rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                <div className="absolute bottom-4 right-4">
                  <div className="flex items-center gap-2  bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm">
                    <span className="text-sm font-medium dark:text-gray-200 z-40">
                      Real-time Sync
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-4 right-36">
                  <div className="bg-blue-600 dark:bg-blue-500 text-white px-3 py-1 rounded-full shadow-sm">
                    <span className="text-sm font-medium">3-in-1 Solution</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="container mx-auto py-12 px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border-2 border-gray-200 dark:border-gray-800 bg-[#F5F5F5] dark:bg-[#1E1E1E] p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <FileEdit className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold dark:text-white">
                Rich Note Taking
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create beautifully formatted notes with our powerful rich text
                editor.
              </p>
            </div>
            <div className="rounded-lg border-2 border-gray-200 dark:border-gray-800 bg-[#F5F5F5] dark:bg-[#1E1E1E] p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50">
                <Pencil className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold dark:text-white">
                Sketching
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Express your ideas visually with our intuitive sketching tools.
              </p>
            </div>
            <div className="rounded-lg border-2 border-gray-200 dark:border-gray-800 bg-[#F5F5F5] dark:bg-[#1E1E1E] p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50">
                <CheckSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold dark:text-white">
                Todo List
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Stay organized with tasks and receive timely email reminders.
              </p>
            </div>
          </div>
        </section>

        <section
          id="features-detail"
          className="py-16 bg-[#F5F5F5] dark:bg-[#1E1E1E]"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl dark:text-white">
                Features
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Everything you need to boost your productivity in one seamless
                experience
              </p>
            </div>

            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 mt-12">
              <div className="flex flex-col items-start">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-3 mb-4">
                  <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 dark:text-white">
                  Real-time Sync
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Access your notes and tasks from any device with instant
                  synchronization.
                </p>
              </div>
              <div className="flex flex-col items-start">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-3 mb-4">
                  <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 dark:text-white">
                  Fast Performance
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Enjoy a smooth, responsive experience even with large
                  documents.
                </p>
              </div>

              <div className="flex flex-col items-start">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-3 mb-4">
                  <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 dark:text-white">
                  Smart Reminders
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Never miss a deadline with intelligent notification system.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="benefits" className="py-16 bg-[#F5F5F5] dark:bg-[#1E1E1E]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl dark:text-white">
                Benefits
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                How NoteKaro transforms your productivity workflow
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:gap-16 items-center">
              <div className="order-2 md:order-1">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-blue-100 dark:bg-blue-900/50 rounded-full p-1.5">
                      <svg
                        className="h-4 w-4 text-blue-600 dark:text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold dark:text-white">
                        Save Time
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Reduce context switching between different apps and
                        streamline your workflow.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-blue-100 dark:bg-blue-900/50 rounded-full p-1.5">
                      <svg
                        className="h-4 w-4 text-blue-600 dark:text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold dark:text-white">
                        Increase Focus
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Keep all your ideas and tasks in one place to maintain
                        better concentration.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-blue-100 dark:bg-blue-900/50 rounded-full p-1.5">
                      <svg
                        className="h-4 w-4 text-blue-600 dark:text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold dark:text-white">
                        Improve Organization
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Structured system for managing notes and tasks helps you
                        stay organized.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-blue-100 dark:bg-blue-900/50 rounded-full p-1.5">
                      <svg
                        className="h-4 w-4 text-blue-600 dark:text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold dark:text-white">
                        Enhance Creativity
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Seamlessly switch between text and visual thinking to
                        boost creative output.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="relative rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    width={600}
                    height={400}
                    alt="NoteKaro benefits"
                    className="w-full"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-blue-600 dark:bg-blue-500 text-white">
                      Productivity Boost
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="py-16 bg-[#F5F5F5] dark:bg-[#1E1E1E]"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl dark:text-white">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Get started with NoteKaro in three simple steps
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500 text-white text-2xl font-bold">
                    1
                  </div>
                  <div className="absolute top-0 right-0 -mr-2 -mt-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 dark:text-white">
                  Sign Up
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Create your account and download the app on your preferred
                  devices.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500 text-white text-2xl font-bold">
                    2
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 dark:text-white">
                  Set Up Your Workspace
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Customize your workspace with folders and tags to organize
                  your content.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500 text-white text-2xl font-bold">
                    3
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 dark:text-white">
                  Start Creating
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Begin taking notes, sketching ideas, and managing your tasks
                  all in one place.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white">
                Get Started Now
              </Button>
            </div>
          </div>
        </section>

        <section
          id="testimonials"
          className="py-16 bg-[#F5F5F5] dark:bg-[#1E1E1E]"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl dark:text-white">
                What Our Users Say
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Trusted by professionals across industries
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          JD
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        "NoteKaro has completely transformed how I organize my
                        work. The integration of notes and tasks is seamless."
                      </p>
                      <div>
                        <p className="font-semibold dark:text-white">
                          John Doe
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          Product Manager
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          AK
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        "The sketching feature is incredible. I can quickly
                        visualize concepts and share them with my team
                        instantly."
                      </p>
                      <div>
                        <p className="font-semibold dark:text-white">
                          Alice Kim
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          UX Designer
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/50">
                        <span className="text-purple-600 dark:text-purple-400 font-medium">
                          MR
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        "As a researcher, I need to keep track of many ideas.
                        NoteKaro helps me organize everything efficiently."
                      </p>
                      <div>
                        <p className="font-semibold dark:text-white">
                          Michael Rodriguez
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          Academic Researcher
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-[#F5F5F5] dark:bg-[#1E1E1E] text-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
              Ready to Transform Your Productivity?
            </h2>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto mb-8">
              Join thousands of professionals who have already made the switch
              to NoteKaro
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-blue-50 dark:hover:bg-white/90">
                Try Free For 14 Days
              </Button>
              <Button
                variant="outline"
                className="bg-white text-blue-600 hover:bg-blue-50 dark:hover:bg-white/90"
              >
                Schedule a Demo
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-[#F5F5F5] dark:bg-[#1E1E1E]">
        <div className="container mx-auto px-4 pt-12 pb-6 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  NoteKaro
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                One app for all your productivity needs. Combine note-taking,
                sketching, and task management.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5 7h-2v-3c0-.55-.45-1-1-1s-1 .45-1 1v3h-2v-6h2v1.1c.52-.62 1.45-1.1 2.5-1.1 1.38 0 2.5 1.12 2.5 2.5v3.5z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-4">
                Product
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#features"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-4">
                Resources
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-4">
                Company
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-500">
              &copy; {new Date().getFullYear()} NoteKaro. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Made with ❤️ by{" "}
                <span className="hover:underline text-gray-600 dark:text-gray-400">
                  <a href="https://github.com/akshatbajetha">Akshat Bajetha</a>
                </span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

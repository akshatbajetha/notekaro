"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import videoPoster from "@/public/benefits-light.png";

import {
  Pencil,
  CheckSquare,
  FileEdit,
  Clock,
  Zap,
  Bell,
  Play,
} from "lucide-react";
import { MobileNav } from "@/components/mobile-nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import GetStartedButton from "@/components/GetStartedButton";
import { useTheme } from "next-themes";
import { AppsCarousel } from "@/components/AppsCarousel";
import BenefitsImage from "@/components/BenefitsImage";
import { IconBrandGithub, IconBrandX } from "@tabler/icons-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5] dark:bg-[#1E1E1E] dark:text-gray-200  max-w-screen-lg mx-auto">
      <div className="container mx-auto flex h-24 items-center justify-between px-4 md:px-6 top-0 z-40 w-full bg-[#F5F5F5]/95 dark:bg-[#1E1E1E]/95">
        <MobileNav />
      </div>

      <main className="flex-1">
        <section className="container px-12 py-12 md:py-24 ">
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

        <section id="how-it-works" className="py-16 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Getting started with NoteKaro is simple. Our intuitive workflow
              helps you capture and organize your ideas effortlessly.
            </p>
          </div>

          <div className="relative rounded-lg overflow-hidden bg-gray-300 aspect-video max-w-4xl mx-auto shadow-lg">
            {/* Video placeholder - replace src with your actual video */}
            <video
              className="w-full h-full object-cover"
              poster={videoPoster.src}
              controls
              preload="none"
            >
              <source type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center group cursor-pointer">
              <div className="bg-blue-500 rounded-full p-4 flex items-center justify-center">
                <Play className="w-6 h-6 text-white" />
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
                <BenefitsImage />
              </div>
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
              <Card className="border-gray-200 dark:border-gray-800 dark:bg-[#1E1E1E] bg-[#F5F5F5]">
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
              <Card className="border-gray-200 dark:border-gray-800 dark:bg-[#1E1E1E] bg-[#F5F5F5]">
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
              <Card className="border-gray-200 dark:border-gray-800 dark:bg-[#1E1E1E] bg-[#F5F5F5]">
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

        <section className="py-16 bg-[#F5F5F5] dark:bg-[#1E1E1E] dark:text-white text-black ">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
              Ready to Transform Your Productivity?
            </h2>
            <p className="text-lg dark:text-blue-100 text-blue-500 max-w-3xl mx-auto mb-8">
              Join thousands of professionals who have already made the switch
              to NoteKaro
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GetStartedButton />
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-[#F5F5F5] dark:bg-[#1E1E1E]">
        <div className="container mx-auto px-4 pt-12 pb-6 md:px-6">
          <div className="flex space-x-4 flex-row justify-center items-center w-full">
            <a
              href="https://github.com/akshatbajetha/NoteKaro"
              target="_blank"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <IconBrandGithub className=" text-neutral-700 dark:text-neutral-300 hover:scale-110 transition-transform duration-150" />
            </a>
            <span>
              <Link
                href="#features"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Features
              </Link>
            </span>
            <span>
              <Link
                href="#how-it-works"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-nowrap"
              >
                How It Works
              </Link>
            </span>
            <span>
              <Link
                href="#benefits"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Benefits
              </Link>
            </span>
            <span>
              <Link
                href="#testimonials"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Testimonials
              </Link>
            </span>
          </div>

          <div className="flex flex-row gap-x-2"></div>

          <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-500">
              &copy; {new Date().getFullYear()} NoteKaro. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Made with ❤️ by{" "}
                <span className="hover:underline text-gray-600 dark:text-gray-400">
                  <a target="_blank" href="https://github.com/akshatbajetha">
                    Akshat Bajetha
                  </a>
                </span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

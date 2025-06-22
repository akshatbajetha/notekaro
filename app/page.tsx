"use client";

import Link from "next/link";
import videoPosterDark from "@/public/VideoPosterDark.png";
import videoPosterLight from "@/public/VideoPosterLight.png";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Pencil, CheckSquare, FileEdit, Clock, Zap, Bell } from "lucide-react";
import { MobileNav } from "@/components/mobile-nav";
import GetStartedButton from "@/components/GetStartedButton";
import { AppsCarousel } from "@/components/AppsCarousel";
import BenefitsImage from "@/components/BenefitsImage";
import { IconBrandGithub } from "@tabler/icons-react";
import { SignInModal } from "@/components/sign-in-modal";
import ScreenLoading from "@/components/sketch/ScreenLoading";
import HeroVideoDialog from "@/src/components/magicui/hero-video-dialog";

function HomeContent() {
  const searchParams = useSearchParams();
  const [showSignInModal, setShowSignInModal] = useState(false);

  useEffect(() => {
    const notloggedin = searchParams.get("notloggedin");
    if (notloggedin === "true") {
      setShowSignInModal(true);
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center flex-col bg-[#F5F5F5] dark:bg-[#1E1E1E] dark:text-gray-200 md:max-w-screen-xl mx-auto">
      <div className="container mx-auto flex h-24 items-center justify-between px-4 md:px-6 top-0 z-40 w-full">
        <MobileNav />
      </div>

      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
      />

      <main className="flex-1">
        <section className="container px-4 sm:px-6 md:px-12 lg:px-24 py-12">
          <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
            <div className="md:space-y-6 flex flex-col gap-y-6">
              <h1 className="text-4xl font-bold tracking-tighter md:text-6xl text-gray-900 dark:text-white">
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
              <div className="flex flex-col gap-2 md:min-[400px]:flex-row">
                <GetStartedButton />
              </div>
            </div>

            <AppsCarousel />
          </div>
        </section>

        <section
          id="how-it-works"
          className="container px-4 sm:px-6 md:px-12 lg:px-24 py-12 md:py-24"
        >
          <div className="relative">
            <HeroVideoDialog
              className="block dark:hidden"
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/4UJy0UwdoXs?si=_0r-NOionE8MCeOe"
              thumbnailSrc={videoPosterLight.src}
              thumbnailAlt="NoteKaro Demo Video"
            />
            <HeroVideoDialog
              className="hidden dark:block"
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/BwTYR-7RhFs?si=NGyuJ9nurBTFNjpE"
              thumbnailSrc={videoPosterDark.src}
              thumbnailAlt="NoteKaro Demo Video"
            />
          </div>
        </section>

        <section
          id="features"
          className="container px-4 sm:px-6 md:px-12 lg:px-24 py-12 md:py-24"
        >
          <div className="flex flex-col items-center justify-center gap-y-4 md:gap-y-8 p-4 md:mb-12 mb-8">
            <h1 className="md:text-4xl text-2xl font-bold text-foreground max-w-2xl mx-auto text-center">
              Tired of switching between different apps to manage your notes,
              sketches and tasks?
            </h1>
            <p className="md:text-3xl text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-center">
              <span className="text-blue-600 dark:text-blue-400">NoteKaro</span>{" "}
              is the solution for you.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border-2 border-gray-200 dark:border-gray-800 bg-[#F5F5F5] dark:bg-[#1E1E1E] p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <FileEdit className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="mb-2 text-xl font-bold dark:text-white">
                Rich Note Taking
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Create beautifully formatted notes with our powerful rich text
                editor.
              </p>
            </div>
            <div className="rounded-lg border-2 border-gray-200 dark:border-gray-800 bg-[#F5F5F5] dark:bg-[#1E1E1E] p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50">
                <Pencil className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="mb-2 text-xl font-bold dark:text-white">
                Sketching
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Express your ideas visually with our intuitive sketching tools.
              </p>
            </div>
            <div className="rounded-lg border-2 border-gray-200 dark:border-gray-800 bg-[#F5F5F5] dark:bg-[#1E1E1E] p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50">
                <CheckSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="mb-2 text-xl font-bold dark:text-white">
                Todo List
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Stay organized with tasks and receive timely email reminders.
              </p>
            </div>
          </div>
        </section>

        <section
          id="features-detail"
          className="container px-4 sm:px-6 md:px-12 lg:px-24 py-12 md:py-24"
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
                  Access your notes, sketches and tasks from any device with
                  instant synchronization.
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
                  Enjoy a smooth, responsive experience.
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

        <section
          id="benefits"
          className="container px-4 sm:px-6 md:px-12 lg:px-24 py-12 md:py-24"
        >
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

        <section className="container px-4 sm:px-6 md:px-12 lg:px-24 py-12 md:py-24 ">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
              Ready to Transform Your Productivity?
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GetStartedButton />
            </div>
          </div>
        </section>

        <footer className="py-8 border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-700 dark:text-gray-300">
              Have questions or feedback? We&apos;d love to hear from you! Reach
              out to us at{" "}
              <a
                href="mailto:feedback@notekaro.com"
                aria-label="Email us at feedback@notekaro.com"
                target="_blank"
                className="text-gray-700 dark:text-gray-300 hover:underline"
              >
                feedback@notekaro.com
              </a>
            </p>
          </div>
        </footer>
      </main>
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-[#F5F5F5] dark:bg-[#1E1E1E]">
        <div className="container mx-auto px-4 pt-12 pb-6 md:px-6">
          <div className="flex space-x-4 flex-row justify-center items-center w-full">
            <a
              href="https://github.com/akshatbajetha/NoteKaro"
              aria-label="Akshat Bajetha's GitHub Profile"
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
          </div>

          <div className="flex flex-row gap-x-2"></div>

          <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              &copy; {new Date().getFullYear()} NoteKaro. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Made with ❤️ by{" "}
                <span className="hover:underline text-gray-700 dark:text-gray-300">
                  <a
                    aria-label="Akshat Bajetha's GitHub Profile"
                    target="_blank"
                    href="https://github.com/akshatbajetha"
                  >
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

export default function Home() {
  return (
    <Suspense fallback={<ScreenLoading />}>
      <HomeContent />
    </Suspense>
  );
}

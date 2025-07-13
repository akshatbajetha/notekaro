"use client";

import { MobileNav } from "@/components/mobile-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageCircle } from "lucide-react";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import Link from "next/link";

export default function ContactPage() {
  const socialLinks = [
    {
      name: "Twitter",
      url: "https://x.com/AkshatBajetha",
      icon: <FaTwitter className="h-6 w-6" />,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/50",
      hoverColor: "hover:bg-blue-200 dark:hover:bg-blue-800/50",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/akshat-bajetha/",
      icon: <FaLinkedin className="h-6 w-6" />,
      color: "text-blue-700 dark:text-blue-300",
      bgColor: "bg-blue-100 dark:bg-blue-900/50",
      hoverColor: "hover:bg-blue-200 dark:hover:bg-blue-800/50",
    },
    {
      name: "GitHub",
      url: "https://github.com/akshatbajetha/",
      icon: <FaGithub className="h-6 w-6" />,
      color: "text-gray-900 dark:text-gray-100",
      bgColor: "bg-gray-200 dark:bg-gray-800",
      hoverColor: "hover:bg-gray-200 dark:hover:bg-gray-700",
    },
  ];

  return (
    <>
      <div className="container mx-auto flex h-24 items-center justify-between px-4 md:px-6 top-0 z-40 w-full">
        <MobileNav />
      </div>
      <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#1E1E1E] dark:text-gray-200">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-24 py-12 md:py-20">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tighter md:text-6xl text-gray-900 dark:text-white mb-6">
              Let&apos;s{" "}
              <span className="text-blue-600 dark:text-blue-400">Connect</span>
            </h1>
            <p className="text-gray-700 dark:text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-2xl mx-auto">
              I&apos;m always excited to connect with fellow developers,
              designers, and productivity enthusiasts. Feel free to reach out!
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-12 md:grid-cols-2 max-w-3xl mx-auto">
            {/* Social Links Card */}
            <Card className="border-2 border-gray-200 dark:border-gray-800 bg-[#F5F5F5] dark:bg-[#1E1E1E] hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-bold dark:text-white">
                  <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  Connect on Social
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Follow me on social media to stay updated with my latest
                  projects and thoughts on productivity and development.
                </p>
                <div className="flex flex-col gap-3">
                  {socialLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${link.bgColor} ${link.hoverColor} group`}
                    >
                      <div
                        className={`${link.color} group-hover:scale-110 transition-transform duration-200`}
                      >
                        {link.icon}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {link.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Email Card */}
            <Card className="border-2 border-gray-200 dark:border-gray-800 bg-[#F5F5F5] dark:bg-[#1E1E1E] hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-bold dark:text-white">
                  <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
                  Send an Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Have a question, feedback, or want to collaborate? I&apos;d
                  love to hear from you!
                </p>
                <Link
                  href="mailto:akshatbajetha@gmail.com"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800/50 transition-all duration-200 font-medium"
                >
                  <Mail className="h-4 w-4" />
                  akshatbajetha@gmail.com
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

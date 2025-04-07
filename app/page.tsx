"use client";

import { Button } from "@/components/ui/button";
import { Pen, StickyNote, CheckSquare, ArrowRight, Mail } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen dark:bg-[#191919] bg-[#F5F5F5]">
      {/* Hero Section */}
      <section className="py-20 h-screen flex justify-center items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 text-neutral-700 dark:text-neutral-300">
              NoteKaro
            </h1>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-700 dark:text-neutral-300">
              An Open Source Tool for Organizing Notes, Tasks, and Ideas.
            </h2>
            <div className="mt-8">
              <Button size="lg" className="h-14 w-40">
                Get Started <ArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* <Separator className="h-[2px] bg-foreground/30" /> */}
      {/* Features */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-6">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary mb-4">
                <StickyNote className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-neutral-700 dark:text-neutral-300">
                Clean Notes
              </h3>
              <p className="text-foreground/70">
                Create and organize rich, interactive notes effortlessly with
                our powerful editor, designed for a seamless writing experience.
                <br />
                <span className="text-muted-foreground">Powered by </span>
                <a href="https://www.blocknotejs.org/" target="_blank">
                  <span className="text-muted-foreground hover:underline">
                    BlockNoteJS
                  </span>
                </a>
                .
              </p>
            </div>
            <div className="text-center p-6">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary mb-4">
                <Pen className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-neutral-700 dark:text-neutral-300">
                Visual Canvas
              </h3>
              <p className="text-foreground/70">
                Transform your ideas into stunning visuals with our intuitive
                sketching tools—perfect for diagrams, mind maps, and
                illustrations.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-primary mb-4">
                <CheckSquare className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-neutral-700 dark:text-neutral-300">
                Task Management
              </h3>
              <p className="text-foreground/70">
                Stay organized and productive with smart task management and
                email reminders to keep you on track.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8 text-neutral-700 dark:text-neutral-300">
            Ready to boost your productivity?
          </h2>
          <div className="flex items-center justify-center space-x-4">
            <Button size="lg">
              Sign up now <Mail className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border py-6 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground">
            <p>© 2025 NoteKaro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

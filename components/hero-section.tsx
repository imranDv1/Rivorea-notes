'use client'
import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { HeroHeader } from "./header";
import type { Variants } from "framer-motion";

import { BorderBeam } from "./ui/border-beam";
import { authClient } from "@/lib/auth-client";


// Variants for AnimatedGroup items
const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
    filter: "blur(12px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const, // ✅ TS-safe
      bounce: 0.3,
      duration: 1.5,
    },
  },
};

// Variants for the container
const containerVariants: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.75,
    },
  },
};

export default function HeroSection() {
  const { data: sessiom } = authClient.useSession();
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block"
        >
          <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>
        <section>
          <div className="relative pt-24 md:pt-36">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
            />

            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.5,
                        },
                      },
                    },
                    item: {
                      hidden: {
                        opacity: 0,
                        y: 20,
                      },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          type: "spring" as const,
                          bounce: 0.3,
                          duration: 2,
                        },
                      },
                    },
                  }}
                >
                  <Link
                    href="/"
                    className="hover:bg-background dark:hover:border-t-border bg-background group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
                  >
                    <span className="text-foreground text-sm">
                      Introducing Support for AI Models
                    </span>
                    <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                    <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                      <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimatedGroup>

                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  as="h1"
                  className="mx-auto max-w-4xl  mt-6 text-5xl max-md:font-bold md:text-7xl lg:mt-4 xl:text-[5.25rem]"
                >
                  Organize Your Thoughts Effortlessly
                </TextEffect>
                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  delay={0.5}
                  as="p"
                  className="mx-auto mt-8 max-w-4xl text-muted-foreground text-balance text-lg"
                >
                  Rivorea Notes helps you capture ideas, manage tasks, and keep
                  everything in one place. Fast, simple, and accessible
                  anywhere.
                </TextEffect>

              </div>
            </div>

  {sessiom ? (
    <div className="flex items-center mt-4 justify-center gap-4">
      <Link href="/dashboard" className={buttonVariants({ variant: "default" })}> continue to Dashboard</Link>
      <Link href="https://x.com/imrandv1" target="_blank" className={buttonVariants({ variant: "secondary" })}>Follow me on X</Link>
    </div>
  ) : 
  null
  }

            <AnimatedGroup
              variants={{ container: containerVariants, item: itemVariants }}
            >
              <div className="mask-b-from-55% relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                  <Image
                    className="bg-background object-cover object-top aspect-15/8 relative hidden rounded-2xl dark:block"
                    src="/Images/Rivorea Post.jpg"
                    alt="app screen"
                    width="2700"
                    height="1440"
                  />
                  <Image
                    className="z-2 border-border/25 object-cover object-top aspect-15/8 relative rounded-2xl border dark:hidden"
                    src="/Images/Rivorea Pos tLight.jpg"
                    alt="app screen"
                    width="2700"
                    height="1440"
                  />
                    <BorderBeam size={330} colorFrom="#ff8540" colorTo="#ff6467" borderWidth={3} />
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>
      </main>
    </>
  );
}

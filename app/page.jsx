import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Stethoscope, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { creditBenefits, features, testimonials } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="bg-[#050A08] min-h-screen font-sans">

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-screen flex items-center">

        {/* Ambient background blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-[-10%] left-[-5%] w-[55vw] h-[55vw] rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="absolute bottom-[-5%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-teal-400/8 blur-[100px]" />
          {/* Fine grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="container mx-auto px-6 md:px-10 lg:px-16 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div className="space-y-8 max-w-xl">
              {/* Pill badge */}
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-emerald-400 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Healthcare Made Simple
              </span>

              <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight text-white">
                Connect with <br />
                <span className="bg-linear-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  doctors anytime,
                </span>
                <br />
                anywhere.
              </h1>

              <p className="text-gray-400 text-lg leading-relaxed">
                Book appointments, consult via video, and manage your entire healthcare
                journey on one secure platform — built around you.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-emerald-500 text-white hover:bg-emerald-400 font-semibold px-8 shadow-lg shadow-emerald-500/20 transition-all duration-200"
                >
                  <Link href="/onboarding">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 font-semibold px-8 backdrop-blur-sm"
                >
                  <Link href="/doctors">Find Doctors</Link>
                </Button>
              </div>

              {/* Trust strip */}
              <div className="flex items-center gap-5 pt-2">
                <div className="flex -space-x-2">
                  {["A", "B", "C", "D"].map((l) => (
                    <div
                      key={l}
                      className="h-8 w-8 rounded-full border-2 border-[#050A08] bg-emerald-900/60 flex items-center justify-center text-[10px] font-bold text-emerald-300"
                    >
                      {l}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-400">
                  <span className="text-white font-semibold">10,000+</span> patients trust us
                </p>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Image */}
            <div className="relative h-105 sm:h-130 lg:h-150">
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-3xl" />
              <div className="absolute -inset-2 rounded-3x" />
              <Image
                src="/banner.png"
                alt="Doctor consultation"
                fill
                priority
                className="object-cover rounded-3xl"
              />
              {/* Gradient fade at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-24 rounded-b-3xl bg-linear-to-t from-[#050A08]/70 to-transparent" />

              {/* Floating stat card */}
              <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/60 px-4 py-3 backdrop-blur-xl">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Stethoscope className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Active Doctors</p>
                  <p className="text-lg font-bold text-white">500+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 relative">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-transparent via-emerald-950/10 to-transparent" />

        <div className="container mx-auto px-6 md:px-10 lg:px-16">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-4">
              How It Works
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Healthcare in three steps
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Our platform makes quality care accessible with just a few clicks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 rounded-3xl overflow-hidden border border-white/5">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-[#050A08] p-8 md:p-10 hover:bg-emerald-950/20 transition-colors duration-300 relative"
              >
                {/* Step number */}
                <span className="absolute top-6 right-8 text-5xl font-bold text-white/5 group-hover:text-white/8 transition-colors select-none">
                  0{index + 1}
                </span>

                {/* Icon */}
                <div className="mb-6 h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{feature.description}</p>

                <div className="mt-6 h-0.5 w-8 bg-emerald-500/30 group-hover:w-16 transition-all duration-300 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Credit / Pricing ───────────────────────────────────────────── */}
      <section className="py-24 md:py-32 relative">
        <div className="container mx-auto px-6 md:px-10 lg:px-16">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left text */}
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-4">
                Affordable Healthcare
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
                Simple credits,<br />
                <span className="bg-linear-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  no surprises.
                </span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Choose the consultation package that fits your needs. Pay only for what you use.
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-full bg-emerald-500 text-white hover:bg-emerald-400 font-semibold px-8 shadow-lg shadow-emerald-500/20"
              >
                <Link href="/pricing">View All Plans <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>

            {/* Right card */}
            <div className="rounded-3xl border border-white/8 bg-white/3 backdrop-blur-xl overflow-hidden">
              {/* Card header */}
              <div className="flex items-center gap-3 border-b border-white/8 px-8 py-5">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                  <Stethoscope className="h-4 w-4 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-white">How Our Credit System Works</h3>
              </div>

              {/* Benefits list */}
              <ul className="divide-y divide-white/5">
                {creditBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-4 px-8 py-5 hover:bg-white/3 transition-colors">
                    <div className="mt-0.5 shrink-0 h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Check className="h-3 w-3 text-emerald-400" />
                    </div>
                    <p
                      className="text-gray-300 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: benefit }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-transparent via-emerald-950/10 to-transparent" />

        <div className="container mx-auto px-6 md:px-10 lg:px-16">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-4">
              Success Stories
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              What our users say
            </h2>
            <p className="text-gray-400 text-lg">
              Hear from patients and doctors who use our platform every day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-white/8 bg-white/3 p-6 hover:border-emerald-500/25 hover:bg-white/5 transition-all duration-300"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-300 text-sm leading-relaxed mb-5">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                  <div className="h-9 w-9 rounded-full bg-emerald-900/40 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 relative">
        <div className="container mx-auto px-6 md:px-10 lg:px-16">
          <div className="relative rounded-3xl overflow-hidden border border-white/8">
            {/* BG glow inside card */}
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[60%] rounded-full bg-emerald-500/10 blur-[80px]" />
            </div>
            <div className="bg-[#071210] px-8 py-16 md:px-16 md:py-20 lg:px-24 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
              <div className="max-w-lg">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
                  Ready to take control of your health?
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Join thousands of users who have simplified their healthcare journey.
                  Get started today and experience care the way it's meant to be.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                <Button
                  size="lg"
                  className="rounded-full bg-emerald-500 text-white hover:bg-emerald-400 font-semibold px-8 shadow-lg shadow-emerald-500/25 transition-all duration-200"
                  asChild
                >
                  <Link href="/sign-up">Sign Up Free</Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 font-semibold px-8 backdrop-blur-sm"
                  asChild
                >
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
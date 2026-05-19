import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SPECIALTIES } from "@/lib/specialities";

export default async function DoctorsPage() {
  return (
    <div>

      {/* Hero Header */}
      <div className="max-w-5xl mx-auto mb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-black text-black dark:text-white tracking-tight mb-3">
          Find Your{" "}
          <span className="text-emerald-600 dark:text-emerald-400">Doctor</span>
        </h1>
        <p className="text-base text-emerald-700 dark:text-emerald-400 max-w-md mx-auto">
          Browse by specialty or view all available healthcare providers
        </p>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="h-px w-16 bg-emerald-200 dark:bg-emerald-900" />
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <div className="h-px w-16 bg-emerald-200 dark:bg-emerald-900" />
        </div>
      </div>

      {/* Specialty Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {SPECIALTIES.map((specialty) => (
          <Link key={specialty.name} href={`/doctors/${specialty.name}`} className="group">
            <div className="relative h-full rounded-2xl border border-emerald-100 dark:border-emerald-900/50 bg-white dark:bg-black hover:border-emerald-500 dark:hover:border-emerald-600 hover:shadow-[0_0_0_1.5px_#10b981] transition-all duration-200 overflow-hidden cursor-pointer">

              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              <div className="p-9 flex flex-col items-center justify-center text-center gap-5">

                {/* Icon Container */}
                <div className="w-20 h-20 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/60 flex items-center justify-center group-hover:bg-emerald-600 group-hover:border-emerald-600 transition-all duration-200">
                  <span className="text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors duration-200 text-3xl">
                    {specialty.icon}
                  </span>
                </div>

                {/* Label */}
                <div>
                  <h3 className="font-bold text-base text-black dark:text-white leading-tight">
                    {specialty.name}
                  </h3>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-500 mt-0.5 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    View doctors →
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-emerald-600 dark:text-emerald-600 mt-10">
        {SPECIALTIES.length} specialties available
      </p>
    </div>
  );
}
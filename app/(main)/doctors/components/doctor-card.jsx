import { User, Star, Calendar, Clock } from "lucide-react";
import Link from "next/link";

export function DoctorCard({ doctor }) {
  return (
    <div className="group relative rounded-2xl border border-emerald-100 dark:border-emerald-900/50 bg-white dark:bg-black hover:border-emerald-500 dark:hover:border-emerald-600 hover:shadow-[0_0_0_1.5px_#10b981] transition-all duration-200 overflow-hidden">

      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <div className="p-5">

        {/* Header: Avatar + Name + Badge */}
        <div className="flex items-start gap-4 mb-4">

          {/* Avatar */}
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center shrink-0 overflow-hidden">
            {doctor.imageUrl ? (
              <img
                src={doctor.imageUrl}
                alt={doctor.name}
                className="w-14 h-14 object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            )}
          </div>

          {/* Name + Badge */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-black dark:text-white text-base leading-tight truncate">
                {doctor.name}
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0">
                <Star className="w-2.5 h-2.5 fill-emerald-500 text-emerald-500" />
                Verified
              </span>
            </div>

            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mt-1">
              {doctor.specialty}
              <span className="mx-1.5 text-emerald-300 dark:text-emerald-700">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {doctor.experience} yrs exp
              </span>
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-emerald-100 dark:bg-emerald-900/50 mb-4" />

        {/* Description */}
        <p className="text-sm text-black dark:text-white leading-relaxed line-clamp-2 mb-5">
          {doctor.description}
        </p>

        {/* CTA Button */}
        <Link
          href={`/doctors/${doctor.specialty}/${doctor.id}`}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 border border-emerald-700 transition-colors duration-200"
        >
          <Calendar className="w-4 h-4" />
          View Profile & Book
        </Link>
      </div>
    </div>
  );
}
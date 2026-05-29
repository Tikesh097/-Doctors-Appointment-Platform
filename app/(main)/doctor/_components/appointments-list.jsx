"use client";

import { useEffect } from "react";
import { getDoctorAppointments } from "@/actions/doctor";
import { AppointmentCard } from "@/components/appointment-card";
import { Calendar, Loader2 } from "lucide-react";
import useFetch from "@/hooks/use-fetch";

export default function DoctorAppointmentsList() {
  const {
    loading,
    data,
    fn: fetchAppointments,
  } = useFetch(getDoctorAppointments);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const appointments = data?.appointments || [];

  return (
    <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-black overflow-hidden">

      {/* Header */}
      <div className="px-6 py-5 border-b border-emerald-100 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-black dark:text-white">Upcoming Appointments</h2>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
              Your scheduled patient sessions
            </p>
          </div>
        </div>
        {!loading && appointments.length > 0 && (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">
            {appointments.length} scheduled
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-11 h-11 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mb-3">
              <Loader2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-spin" />
            </div>
            <p className="text-sm font-semibold text-black dark:text-white">Loading appointments</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">Please wait a moment…</p>
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                userRole="DOCTOR"
                refetchAppointments={fetchAppointments}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-base font-bold text-black dark:text-white mb-1">No upcoming appointments</p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 max-w-xs leading-relaxed">
              You don&apos;t have any scheduled appointments yet. Make sure
              you&apos;ve set your availability to allow patients to book.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
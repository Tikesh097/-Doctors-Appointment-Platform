import { getPatientAppointments } from "@/actions/patient";
import { AppointmentCard } from "@/components/appointment-card";
import PageHeader from "@/components/page-header";
import { Calendar, AlertCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/onboarding";

export default async function PatientAppointmentsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "PATIENT") {
    redirect("/onboarding");
  }

  const { appointments, error } = await getPatientAppointments();

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">

      <PageHeader
        icon={<Calendar />}
        title="My Appointments"
        backLink="/doctors"
        backLabel="Find Doctors"
      />

      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-black overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-emerald-100 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-black dark:text-white">
                Your Scheduled Appointments
              </h2>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                View and manage your consultations
              </p>
            </div>
          </div>
          {!error && appointments?.length > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">
              {appointments.length} scheduled
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          {error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mb-4">
                <AlertCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm font-bold text-black dark:text-white mb-1">Something went wrong</p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 max-w-xs">{error}</p>
            </div>
          ) : appointments?.length > 0 ? (
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  userRole="PATIENT"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-base font-bold text-black dark:text-white mb-1">
                No appointments scheduled
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 max-w-xs leading-relaxed">
                You don&apos;t have any appointments yet. Browse our doctors and
                book your first consultation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
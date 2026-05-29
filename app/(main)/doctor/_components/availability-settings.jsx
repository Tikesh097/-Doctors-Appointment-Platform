"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Clock, Plus, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { setAvailabilitySlots } from "@/actions/doctor";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 uppercase tracking-wide mb-2">
      {children}
    </p>
  );
}

export function AvailabilitySettings({ slots }) {
  const [showForm, setShowForm] = useState(false);

  const { loading, fn: submitSlots, data } = useFetch(setAvailabilitySlots);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { startTime: "", endTime: "" } });

  function createLocalDateFromTime(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
  }

  const onSubmit = async (formValues) => {
    if (loading) return;
    const startDate = createLocalDateFromTime(formValues.startTime);
    const endDate = createLocalDateFromTime(formValues.endTime);
    if (startDate >= endDate) { toast.error("End time must be after start time"); return; }
    const fd = new FormData();
    fd.append("startTime", startDate.toISOString());
    fd.append("endTime", endDate.toISOString());
    await submitSlots(fd);
  };

  useEffect(() => {
    if (data?.success) { setShowForm(false); toast.success("Availability updated successfully"); }
  }, [data]);

  const formatTimeString = (d) => { try { return format(new Date(d), "h:mm a"); } catch { return "Invalid time"; } };

  return (
    <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-black overflow-hidden">

      {/* Header */}
      <div className="px-6 py-5 border-b border-emerald-100 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
          <Clock className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-base font-bold text-black dark:text-white">Availability Settings</h2>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
            Set your daily availability for patient appointments
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">

        {/* Slot list / form toggle */}
        {!showForm ? (
          <div className="space-y-4">
            <SectionLabel>Current Availability</SectionLabel>

            {slots.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                <div className="w-11 h-11 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-sm font-semibold text-black dark:text-white">No slots set yet</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1 max-w-xs">
                  Add your availability to start accepting appointments from patients.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-black border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <p className="text-sm font-bold text-black dark:text-white">
                        {formatTimeString(slot.startTime)} – {formatTimeString(slot.endTime)}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        slot.appointment
                          ? "bg-black/5 dark:bg-white/10 text-black dark:text-white border-black/20 dark:border-white/20"
                          : "bg-emerald-600 text-white border-emerald-700"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${slot.appointment ? "bg-black dark:bg-white" : "bg-white animate-pulse"}`} />
                      {slot.appointment ? "Booked" : "Available"}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowForm(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 border border-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Set Availability Time
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-xl border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 p-5">
            <div>
              <SectionLabel>Set Daily Availability</SectionLabel>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 -mt-1">
                Choose your working hours for all days
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Time */}
              <div className="space-y-1.5">
                <label htmlFor="startTime" className="text-xs font-semibold text-black dark:text-white uppercase tracking-wide">
                  Start Time
                </label>
                <input
                  id="startTime"
                  type="time"
                  {...register("startTime", { required: "Start time is required" })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-black text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
                {errors.startTime && (
                  <p className="text-xs font-medium text-black dark:text-white flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-emerald-500" />
                    {errors.startTime.message}
                  </p>
                )}
              </div>

              {/* End Time */}
              <div className="space-y-1.5">
                <label htmlFor="endTime" className="text-xs font-semibold text-black dark:text-white uppercase tracking-wide">
                  End Time
                </label>
                <input
                  id="endTime"
                  type="time"
                  {...register("endTime", { required: "End time is required" })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-black text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
                {errors.endTime && (
                  <p className="text-xs font-medium text-black dark:text-white flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-emerald-500" />
                    {errors.endTime.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-black dark:text-white bg-white dark:bg-black border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black disabled:opacity-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 border border-emerald-700 disabled:opacity-50 transition-colors"
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
                  : <><CheckCircle2 className="w-4 h-4" />Save Availability</>}
              </button>
            </div>
          </form>
        )}

        {/* Info box */}
        <div className="flex gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-black dark:text-white mb-1">How Availability Works</p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
              Setting your daily availability allows patients to book appointments during those hours.
              The same availability applies to all days. You can update at any time — existing booked
              appointments will not be affected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
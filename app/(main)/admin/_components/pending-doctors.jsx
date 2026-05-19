"use client";

import { useState, useEffect } from "react";
import { Check, X, User, Medal, FileText, ExternalLink, Clock, ChevronRight, Shield } from "lucide-react";
import { format } from "date-fns";
import { updateDoctorStatus } from "@/actions/admin";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

function StatusBadge({ label }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      {label}
    </span>
  );
}

function DoctorCard({ doctor, onViewDetails }) {
  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-white dark:bg-black hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-[0_0_0_1px_#10b981] transition-all duration-200">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0">
          <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <p className="font-semibold text-black dark:text-white text-sm">{doctor.name}</p>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
            {doctor.specialty}
            <span className="mx-1.5 text-emerald-300 dark:text-emerald-700">·</span>
            {doctor.experience} yrs experience
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 self-end sm:self-auto">
        <StatusBadge label="Pending Review" />
        <button
          onClick={() => onViewDetails(doctor)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 border border-emerald-700 transition-colors"
        >
          Review
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-black dark:text-white">{value}</p>
    </div>
  );
}

function PendingDoctors({ doctors }) {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const {
    loading,
    data,
    fn: submitStatusUpdate,
  } = useFetch(updateDoctorStatus);

  const handleViewDetails = (doctor) => setSelectedDoctor(doctor);
  const handleCloseDialog = () => setSelectedDoctor(null);

  const handleUpdateStatus = async (doctorId, status) => {
    if (loading) return;
    const formData = new FormData();
    formData.append("doctorId", doctorId);
    formData.append("status", status);
    await submitStatusUpdate(formData);
  };

  useEffect(() => {
    if (data?.success) handleCloseDialog();
  }, [data]);

  return (
    <div className="space-y-4">

      {/* Main Card */}
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-black overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-emerald-100 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-base font-bold text-black dark:text-white">
                Doctor Verifications
              </h2>
            </div>
            <p className="text-sm text-emerald-700 dark:text-emerald-400 ml-10">
              Review and approve pending doctor applications
            </p>
          </div>
          {doctors.length > 0 && (
            <span className="mt-1 shrink-0 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">
              {doctors.length} pending
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          {doctors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mb-3">
                <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm font-semibold text-black dark:text-white">All caught up</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">No pending verification requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} onViewDetails={handleViewDetails} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Overlay */}
      {selectedDoctor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
          onClick={(e) => e.target === e.currentTarget && handleCloseDialog()}
        >
          <div className="w-full max-w-2xl rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-black shadow-2xl overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-emerald-600">
              <div>
                <h3 className="text-base font-bold text-white">
                  Verification Review
                </h3>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Carefully review all details before making a decision
                </p>
              </div>
              <button
                onClick={handleCloseDialog}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-white hover:bg-emerald-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto">

              {/* Identity */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-bold text-black dark:text-white">{selectedDoctor.name}</p>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">{selectedDoctor.email}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Clock className="w-3 h-3 text-emerald-500" />
                    <span className="text-xs text-emerald-600 dark:text-emerald-500">
                      Applied {format(new Date(selectedDoctor.createdAt), "PPP")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-emerald-100 dark:bg-emerald-900/50" />

              {/* Professional Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Medal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-black dark:text-white uppercase tracking-wide">
                    Professional Details
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
                  <InfoRow label="Specialty" value={selectedDoctor.specialty} />
                  <InfoRow label="Experience" value={`${selectedDoctor.experience} years`} />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 uppercase tracking-wide">Credentials</p>
                    <a
                      href={selectedDoctor.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-200 transition-colors"
                    >
                      View document
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="h-px bg-emerald-100 dark:bg-emerald-900/50" />

              {/* Description */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-black dark:text-white uppercase tracking-wide">
                    Service Description
                  </span>
                </div>
                <p className="text-sm text-black dark:text-white leading-relaxed whitespace-pre-line p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
                  {selectedDoctor.description}
                </p>
              </div>
            </div>

            {/* Loading bar */}
            {loading && (
              <div className="px-6">
                <BarLoader width="100%" color="#36d7b7" height={2} />
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-emerald-100 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20">
              <button
                onClick={() => handleUpdateStatus(selectedDoctor.id, "REJECTED")}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-700 border border-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <X className="w-4 h-4" />
                Reject Application
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedDoctor.id, "VERIFIED")}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-700 border border-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Check className="w-4 h-4" />
                Approve Doctor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PendingDoctors;
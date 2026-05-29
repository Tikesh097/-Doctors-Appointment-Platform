"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
    Calendar,
    Clock,
    User,
    Video,
    Stethoscope,
    X,
    Edit,
    Loader2,
    CheckCircle,
    FileText,
} from "lucide-react";
import {
    cancelAppointment,
    addAppointmentNotes,
    markAppointmentCompleted,
} from "@/actions/doctor";
import { generateVideoToken } from "@/actions/appointments";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function StatusBadge({ status }) {
    const styles =
        status === "COMPLETED"
            ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
            : status === "CANCELLED"
                ? "bg-black/5 dark:bg-white/10 text-black dark:text-white border-black/20 dark:border-white/20"
                : "bg-emerald-600 text-white border-emerald-700";

    const dot =
        status === "COMPLETED"
            ? "bg-emerald-500"
            : status === "CANCELLED"
                ? "bg-black dark:bg-white"
                : "bg-white animate-pulse";

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
            {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
    );
}

function SectionLabel({ children }) {
    return (
        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 uppercase tracking-wide mb-1.5">
            {children}
        </p>
    );
}

export function AppointmentCard({ appointment, userRole, refetchAppointments }) {
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState(null);
    const [notes, setNotes] = useState(appointment.notes || "");
    const router = useRouter();

    const { loading: cancelLoading, fn: submitCancel, data: cancelData } = useFetch(cancelAppointment);
    const { loading: notesLoading, fn: submitNotes, data: notesData } = useFetch(addAppointmentNotes);
    const { loading: tokenLoading, fn: submitTokenRequest, data: tokenData } = useFetch(generateVideoToken);
    const { loading: completeLoading, fn: submitMarkCompleted, data: completeData } = useFetch(markAppointmentCompleted);

    const formatDateTime = (d) => { try { return format(new Date(d), "MMMM d, yyyy 'at' h:mm a"); } catch { return "Invalid date"; } };
    const formatTime = (d) => { try { return format(new Date(d), "h:mm a"); } catch { return "Invalid time"; } };

    const canMarkCompleted = () => {
        if (userRole !== "DOCTOR" || appointment.status !== "SCHEDULED") return false;
        return new Date() >= new Date(appointment.endTime);
    };

    const isAppointmentActive = () => {
        const now = new Date();
        const start = new Date(appointment.startTime);
        const end = new Date(appointment.endTime);
        return (start.getTime() - now.getTime() <= 30 * 60 * 1000 && now < start) || (now >= start && now <= end);
    };

    const handleCancelAppointment = async () => {
        if (cancelLoading) return;
        if (window.confirm("Are you sure you want to cancel this appointment? This action cannot be undone.")) {
            const fd = new FormData();
            fd.append("appointmentId", appointment.id);
            await submitCancel(fd);
        }
    };

    const handleMarkCompleted = async () => {
        if (completeLoading) return;
        if (new Date() < new Date(appointment.endTime)) { alert("Cannot mark appointment as completed before the scheduled end time."); return; }
        if (window.confirm("Are you sure you want to mark this appointment as completed?")) {
            const fd = new FormData();
            fd.append("appointmentId", appointment.id);
            await submitMarkCompleted(fd);
        }
    };

    const handleSaveNotes = async () => {
        if (notesLoading || userRole !== "DOCTOR") return;
        const fd = new FormData();
        fd.append("appointmentId", appointment.id);
        fd.append("notes", notes);
        await submitNotes(fd);
    };

    const handleJoinVideoCall = async () => {
        if (tokenLoading) return;
        setAction("video");
        const fd = new FormData();
        fd.append("appointmentId", appointment.id);
        await submitTokenRequest(fd);
    };

    const refresh = () => refetchAppointments ? refetchAppointments() : router.refresh();

    useEffect(() => { if (cancelData?.success) { toast.success("Appointment cancelled"); setOpen(false); refresh(); } }, [cancelData]);
    useEffect(() => { if (completeData?.success) { toast.success("Marked as completed"); setOpen(false); refresh(); } }, [completeData]);
    useEffect(() => { if (notesData?.success) { toast.success("Notes saved"); setAction(null); refresh(); } }, [notesData]);
    useEffect(() => {
        if (tokenData?.success) router.push(`/video-call?sessionId=${tokenData.videoSessionId}&token=${tokenData.token}&appointmentId=${appointment.id}`);
        else if (tokenData?.error) setAction(null);
    }, [tokenData]);

    const otherParty = userRole === "DOCTOR" ? appointment.patient : appointment.doctor;
    const otherPartyLabel = userRole === "DOCTOR" ? "Patient" : "Doctor";
    const otherPartyIcon = userRole === "DOCTOR"
        ? <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        : <Stethoscope className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;

    return (
        <>
            {/* ── List Card ── */}
            <div className="group relative rounded-2xl border border-emerald-100 dark:border-emerald-900/50 bg-white dark:bg-black hover:border-emerald-500 dark:hover:border-emerald-600 hover:shadow-[0_0_0_1.5px_#10b981] transition-all duration-200 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                <div className="p-5 flex flex-col md:flex-row justify-between gap-4">
                    {/* Left: person info */}
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                            {otherPartyIcon}
                        </div>
                        <div>
                            <h3 className="font-bold text-black dark:text-white text-sm">
                                {userRole === "DOCTOR" ? otherParty.name : `Dr. ${otherParty.name}`}
                            </h3>
                            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                                {userRole === "DOCTOR" ? otherParty.email : otherParty.specialty}
                            </p>
                            <div className="flex items-center gap-1.5 mt-2 text-xs text-black dark:text-white">
                                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                                {formatDateTime(appointment.startTime)}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1 text-xs text-black dark:text-white">
                                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                                {formatTime(appointment.startTime)} – {formatTime(appointment.endTime)}
                            </div>
                        </div>
                    </div>

                    {/* Right: status + actions */}
                    <div className="flex flex-col items-end gap-3 self-end md:self-start shrink-0">
                        <StatusBadge status={appointment.status} />
                        <div className="flex gap-2 flex-wrap justify-end">
                            {canMarkCompleted() && (
                                <button
                                    onClick={handleMarkCompleted}
                                    disabled={completeLoading}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 border border-emerald-700 disabled:opacity-50 transition-colors"
                                >
                                    {completeLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><CheckCircle className="w-3.5 h-3.5" />Complete</>}
                                </button>
                            )}
                            <button
                                onClick={() => setOpen(true)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-black dark:text-white bg-white dark:bg-black border border-emerald-200 dark:border-emerald-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Modal ── */}
            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
                    onClick={(e) => e.target === e.currentTarget && setOpen(false)}
                >
                    <div className="w-full max-w-2xl rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-black shadow-2xl overflow-hidden">

                        {/* Modal header */}
                        <div className="flex items-center justify-between px-6 py-5 bg-emerald-600">
                            <div>
                                <h3 className="text-base font-bold text-white">Appointment Details</h3>
                                <p className="text-xs text-emerald-100 mt-0.5">
                                    {appointment.status === "SCHEDULED" ? "Manage your upcoming appointment" : "View appointment information"}
                                </p>
                            </div>
                            <button onClick={() => setOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-white hover:bg-emerald-700 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal body */}
                        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">

                            {/* Person info */}
                            <div>
                                <SectionLabel>{otherPartyLabel}</SectionLabel>
                                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-black border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0">
                                        {otherPartyIcon}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-black dark:text-white">
                                            {userRole === "DOCTOR" ? otherParty.name : `Dr. ${otherParty.name}`}
                                        </p>
                                        <p className="text-xs text-emerald-700 dark:text-emerald-400">
                                            {userRole === "DOCTOR" ? otherParty.email : otherParty.specialty}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-emerald-100 dark:bg-emerald-900/50" />

                            {/* Time */}
                            <div>
                                <SectionLabel>Scheduled Time</SectionLabel>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-black dark:text-white">
                                        <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
                                        {formatDateTime(appointment.startTime)}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-black dark:text-white">
                                        <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                                        {formatTime(appointment.startTime)} – {formatTime(appointment.endTime)}
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-emerald-100 dark:bg-emerald-900/50" />

                            {/* Status */}
                            <div>
                                <SectionLabel>Status</SectionLabel>
                                <StatusBadge status={appointment.status} />
                            </div>

                            {/* Patient description */}
                            {appointment.patientDescription && (
                                <>
                                    <div className="h-px bg-emerald-100 dark:bg-emerald-900/50" />
                                    <div>
                                        <SectionLabel>{userRole === "DOCTOR" ? "Patient Description" : "Your Description"}</SectionLabel>
                                        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-sm text-black dark:text-white whitespace-pre-line">
                                            {appointment.patientDescription}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Video call */}
                            {appointment.status === "SCHEDULED" && (
                                <>
                                    <div className="h-px bg-emerald-100 dark:bg-emerald-900/50" />
                                    <div>
                                        <SectionLabel>Video Consultation</SectionLabel>
                                        <button
                                            onClick={handleJoinVideoCall}
                                            disabled={!isAppointmentActive() || action === "video" || tokenLoading}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 border border-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {tokenLoading || action === "video"
                                                ? <><Loader2 className="w-4 h-4 animate-spin" />Preparing Video Call...</>
                                                : <><Video className="w-4 h-4" />{isAppointmentActive() ? "Join Video Call" : "Available 30 min before appointment"}</>}
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Doctor notes */}
                            <div className="h-px bg-emerald-100 dark:bg-emerald-900/50" />
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <SectionLabel>Doctor Notes</SectionLabel>
                                    {userRole === "DOCTOR" && action !== "notes" && appointment.status !== "CANCELLED" && (
                                        <button
                                            onClick={() => setAction("notes")}
                                            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 transition-colors"
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                            {appointment.notes ? "Edit" : "Add"}
                                        </button>
                                    )}
                                </div>

                                {userRole === "DOCTOR" && action === "notes" ? (
                                    <div className="space-y-3">
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Enter your clinical notes here..."
                                            className="w-full min-h-[100px] px-3.5 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-black text-sm text-black dark:text-white placeholder:text-emerald-300 dark:placeholder:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none transition"
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => { setAction(null); setNotes(appointment.notes || ""); }}
                                                disabled={notesLoading}
                                                className="px-4 py-2 rounded-xl text-xs font-semibold text-black dark:text-white border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black disabled:opacity-50 transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSaveNotes}
                                                disabled={notesLoading}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 border border-emerald-700 disabled:opacity-50 transition-colors"
                                            >
                                                {notesLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving...</> : <><FileText className="w-3.5 h-3.5" />Save Notes</>}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 min-h-[80px] text-sm">
                                        {appointment.notes
                                            ? <p className="text-black dark:text-white whitespace-pre-line">{appointment.notes}</p>
                                            : <p className="text-emerald-400 dark:text-emerald-600 italic">No notes added yet</p>}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal footer */}
                        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-emerald-100 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20">
                            <div className="flex gap-2">
                                {canMarkCompleted() && (
                                    <button
                                        onClick={handleMarkCompleted}
                                        disabled={completeLoading}
                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 border border-emerald-700 disabled:opacity-50 transition-colors"
                                    >
                                        {completeLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Completing...</> : <><CheckCircle className="w-4 h-4" />Mark Complete</>}
                                    </button>
                                )}
                                {appointment.status === "SCHEDULED" && (
                                    <button
                                        onClick={handleCancelAppointment}
                                        disabled={cancelLoading}
                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-black dark:text-white bg-white dark:bg-black border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-red-600 dark:hover:text-black disabled:opacity-50 transition-all"
                                    >
                                        {cancelLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Cancelling...</> : <><X className="w-4 h-4" />Cancel Appointment</>}
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 border border-emerald-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
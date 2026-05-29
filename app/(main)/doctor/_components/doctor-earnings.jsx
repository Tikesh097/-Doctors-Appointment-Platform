"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp, Calendar, BarChart3, CreditCard,
  Loader2, AlertCircle, Coins, X, CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { requestPayout } from "@/actions/payout";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 uppercase tracking-wide mb-2">
      {children}
    </p>
  );
}

function StatusPill({ status }) {
  const isProcessed = status === "PROCESSED";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
      isProcessed
        ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
        : "bg-emerald-600 text-white border-emerald-700"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isProcessed ? "bg-emerald-500" : "bg-white animate-pulse"}`} />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-2xl border border-emerald-100 dark:border-emerald-900/50 bg-white dark:bg-black p-5 flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-3xl font-black text-black dark:text-white leading-none">{value}</p>
        {sub && <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">{sub}</p>}
      </div>
      <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
  );
}

export function DoctorEarnings({ earnings, payouts = [] }) {
  const [showPayoutDialog, setShowPayoutDialog] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState("");

  const {
    thisMonthEarnings = 0,
    completedAppointments = 0,
    averageEarningsPerMonth = 0,
    availableCredits = 0,
    availablePayout = 0,
  } = earnings;

  const { loading, data, fn: submitPayoutRequest } = useFetch(requestPayout);

  const pendingPayout = payouts.find((p) => p.status === "PROCESSING");
  const platformFee = availableCredits * 2;

  const handlePayoutRequest = async (e) => {
    e.preventDefault();
    if (!paypalEmail) { toast.error("PayPal email is required"); return; }
    const fd = new FormData();
    fd.append("paypalEmail", paypalEmail);
    await submitPayoutRequest(fd);
  };

  useEffect(() => {
    if (data?.success) { setShowPayoutDialog(false); setPaypalEmail(""); toast.success("Payout request submitted!"); }
  }, [data]);

  return (
    <div className="space-y-6">

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard icon={Coins} label="Available Credits" value={availableCredits} sub={`$${availablePayout.toFixed(2)} available for payout`} />
        <StatCard icon={TrendingUp} label="This Month" value={`$${thisMonthEarnings.toFixed(2)}`} />
        <StatCard icon={Calendar} label="Total Appointments" value={completedAppointments} sub="completed" />
        <StatCard icon={BarChart3} label="Avg / Month" value={`$${averageEarningsPerMonth.toFixed(2)}`} />
      </div>

      {/* Payout Management */}
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-black overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-emerald-100 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-black dark:text-white">Payout Management</h2>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">Manage and request your earnings</p>
          </div>
        </div>

        <div className="p-6 space-y-6">

          {/* Payout Status Panel */}
          <div className="rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <SectionLabel>Available for Payout</SectionLabel>
              {pendingPayout
                ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white border border-emerald-700"><span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />Processing</span>
                : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Available</span>}
            </div>

            {pendingPayout ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Pending Credits", value: pendingPayout.credits },
                    { label: "Pending Amount", value: `$${pendingPayout.netAmount.toFixed(2)}` },
                    { label: "PayPal Email", value: pendingPayout.paypalEmail },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 rounded-xl bg-white dark:bg-black border border-emerald-100 dark:border-emerald-900/40">
                      <p className="text-xs text-emerald-600 dark:text-emerald-500 font-semibold uppercase tracking-wide">{label}</p>
                      <p className="text-sm font-bold text-black dark:text-white mt-0.5 truncate">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 p-3.5 rounded-xl bg-white dark:bg-black border border-emerald-100 dark:border-emerald-900/40">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                  <p className="text-xs text-black dark:text-white leading-relaxed">
                    Your payout request is being processed. You'll receive the payment once an admin approves it. Credits will be deducted after processing.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Available Credits", value: availableCredits },
                    { label: "Payout Amount", value: `$${availablePayout.toFixed(2)}` },
                    { label: "Platform Fee", value: `$${platformFee.toFixed(2)}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 rounded-xl bg-white dark:bg-black border border-emerald-100 dark:border-emerald-900/40">
                      <p className="text-xs text-emerald-600 dark:text-emerald-500 font-semibold uppercase tracking-wide">{label}</p>
                      <p className="text-sm font-bold text-black dark:text-white mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>

                {availableCredits > 0 ? (
                  <button
                    onClick={() => setShowPayoutDialog(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 border border-emerald-700 transition-colors"
                  >
                    <CreditCard className="w-4 h-4" />
                    Request Payout for All Credits
                  </button>
                ) : (
                  <div className="text-center py-3">
                    <p className="text-xs text-emerald-600 dark:text-emerald-500">No credits available. Complete more appointments to earn credits.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Info box */}
          <div className="flex gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-black dark:text-white mb-1">Payout Structure</p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
                You earn $8 per credit. Platform fee is $2 per credit (20%). Payouts include all your available credits and are processed via PayPal.
              </p>
            </div>
          </div>

          {/* Payout History */}
          {payouts.length > 0 && (
            <div>
              <SectionLabel>Payout History</SectionLabel>
              <div className="space-y-2">
                {payouts.slice(0, 5).map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                    <div>
                      <p className="text-sm font-bold text-black dark:text-white">
                        {format(new Date(payout.createdAt), "MMM d, yyyy")}
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                        {payout.credits} credits · ${payout.netAmount.toFixed(2)} · {payout.paypalEmail}
                      </p>
                    </div>
                    <StatusPill status={payout.status} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payout Modal */}
      {showPayoutDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
          onClick={(e) => e.target === e.currentTarget && setShowPayoutDialog(false)}
        >
          <div className="w-full max-w-md rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-black shadow-2xl overflow-hidden">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 bg-emerald-600">
              <div>
                <h3 className="text-base font-bold text-white">Request Payout</h3>
                <p className="text-xs text-emerald-100 mt-0.5">Request payout for all your available credits</p>
              </div>
              <button onClick={() => setShowPayoutDialog(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-white hover:bg-emerald-700 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePayoutRequest} className="px-6 py-5 space-y-5">

              {/* Breakdown */}
              <div className="rounded-xl border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 overflow-hidden">
                {[
                  { label: "Available credits", value: availableCredits },
                  { label: "Gross amount", value: `$${(availableCredits * 10).toFixed(2)}` },
                  { label: "Platform fee (20%)", value: `-$${platformFee.toFixed(2)}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between px-4 py-3 border-b border-emerald-100 dark:border-emerald-900/40 text-sm">
                    <span className="text-emerald-700 dark:text-emerald-400">{label}</span>
                    <span className="font-semibold text-black dark:text-white">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between px-4 py-3 text-sm">
                  <span className="font-bold text-black dark:text-white">Net payout</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">${availablePayout.toFixed(2)}</span>
                </div>
              </div>

              {/* Email input */}
              <div className="space-y-1.5">
                <label htmlFor="paypalEmail" className="text-xs font-semibold text-black dark:text-white uppercase tracking-wide">
                  PayPal Email
                </label>
                <input
                  id="paypalEmail"
                  type="email"
                  placeholder="your-email@paypal.com"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-black text-sm text-black dark:text-white placeholder:text-emerald-300 dark:placeholder:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
                <p className="text-xs text-emerald-600 dark:text-emerald-500">Enter the PayPal email where you want to receive the payout.</p>
              </div>

              {/* Info */}
              <div className="flex gap-3 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 text-white" />
                </div>
                <p className="text-xs text-black dark:text-white leading-relaxed">
                  Once processed, {availableCredits} credits will be deducted and ${availablePayout.toFixed(2)} will be sent to your PayPal.
                </p>
              </div>

              {/* Footer */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowPayoutDialog(false)}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-black dark:text-white bg-white dark:bg-black border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black disabled:opacity-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 border border-emerald-700 disabled:opacity-50 transition-colors"
                >
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" />Requesting...</>
                    : <><CheckCircle2 className="w-4 h-4" />Request Payout</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
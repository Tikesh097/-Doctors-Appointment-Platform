"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import {
  Loader2, Video, VideoOff, Mic, MicOff, PhoneOff, User,
} from "lucide-react";
import { toast } from "sonner";

export default function VideoCall({ sessionId, token }) {
  const [isLoading, setIsLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const sessionRef = useRef(null);
  const publisherRef = useRef(null);
  const router = useRouter();

  const appId = process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID;

  const handleScriptLoad = () => {
    setScriptLoaded(true);
    if (!window.OT) { toast.error("Failed to load Vonage Video API"); setIsLoading(false); return; }
    initializeSession();
  };

  const initializeSession = () => {
    if (!appId || !sessionId || !token) { toast.error("Missing required video call parameters"); router.push("/appointments"); return; }
    try {
      sessionRef.current = window.OT.initSession(appId, sessionId);

      sessionRef.current.on("streamCreated", (event) => {
        sessionRef.current.subscribe(event.stream, "subscriber", { insertMode: "append", width: "100%", height: "100%" }, (err) => {
          if (err) toast.error("Error connecting to other participant's stream");
        });
      });

      sessionRef.current.on("sessionConnected", () => {
        setIsConnected(true);
        setIsLoading(false);
        publisherRef.current = window.OT.initPublisher("publisher", {
          insertMode: "replace", width: "100%", height: "100%",
          publishAudio: isAudioEnabled, publishVideo: isVideoEnabled,
        }, (err) => { if (err) toast.error("Error initializing your camera and microphone"); });
      });

      sessionRef.current.on("sessionDisconnected", () => setIsConnected(false));

      sessionRef.current.connect(token, (err) => {
        if (err) toast.error("Error connecting to video session");
        else if (publisherRef.current) {
          sessionRef.current.publish(publisherRef.current, (e) => { if (e) toast.error("Error publishing your stream"); });
        }
      });
    } catch {
      toast.error("Failed to initialize video call");
      setIsLoading(false);
    }
  };

  const toggleVideo = () => { if (publisherRef.current) { publisherRef.current.publishVideo(!isVideoEnabled); setIsVideoEnabled((p) => !p); } };
  const toggleAudio = () => { if (publisherRef.current) { publisherRef.current.publishAudio(!isAudioEnabled); setIsAudioEnabled((p) => !p); } };

  const endCall = () => {
    if (publisherRef.current) { publisherRef.current.destroy(); publisherRef.current = null; }
    if (sessionRef.current) { sessionRef.current.disconnect(); sessionRef.current = null; }
    router.push("/appointments");
  };

  useEffect(() => {
    return () => {
      if (publisherRef.current) publisherRef.current.destroy();
      if (sessionRef.current) sessionRef.current.disconnect();
    };
  }, []);

  // Invalid params screen
  if (!sessionId || !token || !appId) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto mb-5">
            <Video className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-2xl font-black text-black dark:text-white mb-2">Invalid Video Call</h1>
          <p className="text-sm text-emerald-700 dark:text-emerald-400 mb-6">Missing required parameters for the video call.</p>
          <button
            onClick={() => router.push("/appointments")}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 border border-emerald-700 transition-colors"
          >
            Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://unpkg.com/@vonage/client-sdk-video@latest/dist/js/opentok.js"
        onLoad={handleScriptLoad}
        onError={() => { toast.error("Failed to load video call script"); setIsLoading(false); }}
      />

      <div className="min-h-screen bg-white dark:bg-black">
        <div className="container mx-auto px-4 py-8 space-y-6">

          {/* Page header */}
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-black text-black dark:text-white">Video Consultation</h1>
            <div className="inline-flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : isLoading ? "bg-emerald-400 animate-pulse" : "bg-black dark:bg-white"}`} />
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                {isConnected ? "Connected" : isLoading ? "Connecting…" : "Connection failed"}
              </p>
            </div>
          </div>

          {/* Loading state */}
          {isLoading && !scriptLoaded ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mb-4">
                <Loader2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400 animate-spin" />
              </div>
              <p className="text-base font-bold text-black dark:text-white">Loading video call</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">Setting up your session…</p>
            </div>
          ) : (
            <div className="space-y-5">

              {/* Video panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Publisher */}
                <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-black overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-emerald-100 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-black dark:text-white uppercase tracking-wide">You</span>
                  </div>
                  <div id="publisher" className="w-full h-[300px] md:h-[400px] bg-emerald-50 dark:bg-emerald-950/20">
                    {!scriptLoaded && (
                      <div className="flex items-center justify-center h-full">
                        <div className="w-20 h-20 rounded-2xl bg-white dark:bg-black border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
                          <User className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subscriber */}
                <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-black overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-emerald-100 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-black/30 dark:bg-white/30"}`} />
                    <span className="text-xs font-bold text-black dark:text-white uppercase tracking-wide">Other Participant</span>
                  </div>
                  <div id="subscriber" className="w-full h-[300px] md:h-[400px] bg-emerald-50 dark:bg-emerald-950/20">
                    {(!isConnected || !scriptLoaded) && (
                      <div className="flex items-center justify-center h-full">
                        <div className="w-20 h-20 rounded-2xl bg-white dark:bg-black border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
                          <User className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Controls bar */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">

                  {/* Toggle video */}
                  <button
                    onClick={toggleVideo}
                    disabled={!publisherRef.current}
                    title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
                    className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all disabled:opacity-40 ${
                      isVideoEnabled
                        ? "bg-white dark:bg-black border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:border-emerald-500"
                        : "bg-black dark:bg-white border-black dark:border-white text-white dark:text-black"
                    }`}
                  >
                    {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </button>

                  {/* End call */}
                  <button
                    onClick={endCall}
                    title="End call"
                    className="w-16 h-16 rounded-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 border border-emerald-700 text-white transition-colors shadow-lg"
                  >
                    <PhoneOff className="w-6 h-6" />
                  </button>

                  {/* Toggle audio */}
                  <button
                    onClick={toggleAudio}
                    disabled={!publisherRef.current}
                    title={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
                    className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all disabled:opacity-40 ${
                      isAudioEnabled
                        ? "bg-white dark:bg-black border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:border-emerald-500"
                        : "bg-black dark:bg-white border-black dark:border-white text-white dark:text-black"
                    }`}
                  >
                    {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>
                </div>

                {/* Status line */}
                <p className="text-xs text-emerald-600 dark:text-emerald-500 text-center">
                  {isVideoEnabled ? "Camera on" : "Camera off"}
                  <span className="mx-1.5 text-emerald-300 dark:text-emerald-700">·</span>
                  {isAudioEnabled ? "Microphone on" : "Microphone muted"}
                  <span className="mx-1.5 text-emerald-300 dark:text-emerald-700">·</span>
                  Click the green button to end the call
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
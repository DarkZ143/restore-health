/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Megaphone,
  Mail,
  Send,
  Users,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Check,
} from "lucide-react";

import { auth } from "@/lib/firebase";
import { getIdToken, onAuthStateChanged } from "firebase/auth";

type Agent = {
  id: string;
  fullName: string;
  email: string;
};

export default function BroadcastPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(true);

  // Form State
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sendToAll, setSendToAll] = useState(true);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // UI State
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "";
    msg: string;
  }>({ type: "", msg: "" });

  // ==========================================================
  // FETCH ALL AGENTS
  // ==========================================================
  const fetchAgents = useCallback(async () => {
    try {
      setLoadingAgents(true);
      let token = "";
      const currentUser = auth.currentUser;

      if (currentUser) token = await getIdToken(currentUser, true);
      else {
        await new Promise((resolve) => {
          const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) token = await getIdToken(user, true);
            unsubscribe();
            resolve(null);
          });
        });
      }

      if (!token) return;

      const response = await fetch("/api/admin/agents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.success) {
        setAgents(data.agents || []);
      }
    } catch (err) {
      console.error("Failed to load agents for broadcast", err);
    } finally {
      setLoadingAgents(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  // ==========================================================
  // FILTER AGENTS LIST
  // ==========================================================
  const filteredAgents = useMemo(() => {
    return agents.filter(
      (a) =>
        a.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.email?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [agents, searchQuery]);

  // ==========================================================
  // TOGGLE AGENT SELECTION
  // ==========================================================
  const toggleAgent = (email: string) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email],
    );
  };

  // ==========================================================
  // SEND BROADCAST
  // ==========================================================
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      setStatus({ type: "error", msg: "Subject and Message cannot be empty." });
      return;
    }

    if (!sendToAll && selectedEmails.length === 0) {
      setStatus({ type: "error", msg: "Please select at least one agent." });
      return;
    }

    try {
      setIsSending(true);
      setStatus({ type: "", msg: "" });

      const currentUser = auth.currentUser;
      const token = currentUser ? await getIdToken(currentUser, true) : "";

      if (!token) throw new Error("Authentication error. Please re-login.");

      const payload = {
        subject,
        message,
        sendToAll,
        selectedEmails: sendToAll ? [] : selectedEmails,
        adminEmail: currentUser?.email || "admin@restorehealth.com",
      };

      const response = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send broadcast.");
      }

      setStatus({
        type: "success",
        msg: "Broadcast sent successfully to the selected audience!",
      });
      setSubject("");
      setMessage("");
      setSelectedEmails([]);

      setTimeout(() => setStatus({ type: "", msg: "" }), 6000);
    } catch (err: any) {
      setStatus({ type: "error", msg: err.message || "Something went wrong." });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* ======================================================
          ✨ PREMIUM LOADING OVERLAY (UX UPGRADE) ✨
      ====================================================== */}
      {isSending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f2d24]/60 backdrop-blur-md transition-all duration-500">
          <div className="flex flex-col items-center justify-center rounded-[2.5rem] bg-white p-12 shadow-2xl scale-100 animate-in zoom-in-95 duration-300 max-w-md w-full mx-4 text-center border border-[#dfe7df]">
            {/* Pulsing Icon */}
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-[#eaf5ef] mb-6 shadow-inner border border-[#087443]/10">
              <div className="absolute h-full w-full animate-ping rounded-full bg-[#087443]/20 opacity-75"></div>
              <Send
                size={44}
                className="text-[#087443] animate-pulse relative z-10 translate-x-1"
              />
            </div>

            <h2 className="text-2xl font-black tracking-tight text-[#1f2d24] mb-2">
              Transmitting...
            </h2>
            <p className="text-sm font-semibold text-[#7c887f] leading-relaxed px-4">
              Securely delivering your official broadcast to{" "}
              {sendToAll ? (
                "all agents"
              ) : (
                <span className="text-[#087443]">
                  {selectedEmails.length} selected agents
                </span>
              )}
              .
            </p>

            <div className="mt-8 flex items-center gap-2 rounded-full bg-[#fbf9f2] px-4 py-2 border border-[#d9bd63]/30">
              <Loader2 size={14} className="animate-spin text-[#b8860b]" />
              <p className="text-xs font-bold text-[#b8860b] uppercase tracking-widest">
                Please don&apos;t close this window
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          MAIN PAGE CONTENT
      ====================================================== */}
      <div className="mx-auto max-w-6xl space-y-8 pb-12">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#1f2d24]">
            Broadcast System
          </h1>
          <p className="mt-1.5 text-sm font-medium text-[#7c887f]">
            Send official announcements, updates, or alerts to your agents
            securely.
          </p>
        </div>

        {status.msg && (
          <div
            className={`flex items-center gap-3 rounded-2xl border px-6 py-4 text-sm font-bold shadow-sm transition-all duration-500 animate-in fade-in slide-in-from-top-4 ${
              status.type === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-600"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 size={22} className="text-green-600" />
            ) : (
              <AlertCircle size={22} className="text-red-600" />
            )}
            <span>{status.msg}</span>
          </div>
        )}

        <form
          onSubmit={handleSendBroadcast}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* COMPOSER COLUMN */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
            <div className="rounded-[2rem] border border-[#e5ebe5] bg-white p-8 shadow-sm flex flex-col flex-1 h-full">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d9bd63] to-[#a47508] shadow-md shadow-[#b8860b]/20">
                  <Megaphone size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-extrabold text-[#1f2d24]">
                  Compose Message
                </h3>
              </div>

              <div className="space-y-6 flex-1 flex flex-col">
                <div>
                  <label className="mb-2 block text-xs font-extrabold uppercase tracking-widest text-[#7c887f]">
                    Email Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter broadcast subject..."
                    disabled={isSending}
                    className="w-full rounded-2xl border border-[#dfe7df] bg-[#fbfcfb] px-5 py-4 text-sm font-bold text-[#1f2d24] outline-none transition-all focus:border-[#d9bd63] focus:bg-white focus:ring-4 focus:ring-[#d9bd63]/10 disabled:opacity-60 placeholder:text-[#a0aaa1] placeholder:font-medium"
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <label className="mb-2 block text-xs font-extrabold uppercase tracking-widest text-[#7c887f]">
                    Message Body
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your official message here..."
                    disabled={isSending}
                    className="w-full flex-1 min-h-[280px] resize-none rounded-2xl border border-[#dfe7df] bg-[#fbfcfb] px-5 py-5 text-sm font-medium leading-relaxed text-[#26352c] outline-none transition-all focus:border-[#d9bd63] focus:bg-white focus:ring-4 focus:ring-[#d9bd63]/10 disabled:opacity-60 placeholder:text-[#a0aaa1]"
                  />
                </div>

                <div className="mt-4 flex items-start gap-3 rounded-2xl bg-[#eaf5ef] px-5 py-4 border border-[#087443]/15">
                  <Mail size={18} className="text-[#087443] shrink-0 mt-0.5" />
                  <p className="text-[13px] font-semibold text-[#087443] leading-relaxed">
                    Emails will be sent on behalf of your admin account. Any
                    replies from agents will be directed straight to your inbox.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* AUDIENCE COLUMN */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-full">
            <div className="rounded-[2rem] border border-[#e5ebe5] bg-white p-8 shadow-sm flex flex-col h-full">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf5ef] text-[#087443]">
                  <Users size={20} />
                </div>
                <h3 className="text-xl font-extrabold text-[#1f2d24]">
                  Select Audience
                </h3>
              </div>

              <div className="flex rounded-2xl bg-[#f6f8f4] p-1.5 border border-[#dfe7df] mb-6">
                <button
                  type="button"
                  onClick={() => setSendToAll(true)}
                  disabled={isSending}
                  className={`flex-1 rounded-xl py-2.5 text-xs font-extrabold transition-all duration-300 ${sendToAll ? "bg-white text-[#087443] shadow-sm" : "text-[#7c887f] hover:text-[#1f2d24]"} disabled:opacity-60`}
                >
                  All Agents
                </button>
                <button
                  type="button"
                  onClick={() => setSendToAll(false)}
                  disabled={isSending}
                  className={`flex-1 rounded-xl py-2.5 text-xs font-extrabold transition-all duration-300 ${!sendToAll ? "bg-white text-[#087443] shadow-sm" : "text-[#7c887f] hover:text-[#1f2d24]"} disabled:opacity-60`}
                >
                  Selected Agents
                </button>
              </div>

              {!sendToAll && (
                <div className="flex flex-col flex-1 min-h-[300px] mb-6">
                  <div className="relative mb-4">
                    <Search
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#929d95]"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search agents..."
                      disabled={isSending}
                      className="w-full rounded-xl border border-[#dfe7df] bg-[#fbfcfb] py-3 pl-11 pr-4 text-xs font-bold outline-none transition focus:border-[#d9bd63] disabled:opacity-60"
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto rounded-xl border border-[#dfe7df] bg-[#fbfcfb] p-2 max-h-[350px]">
                    {loadingAgents ? (
                      <div className="flex h-full items-center justify-center p-6">
                        <Loader2
                          size={24}
                          className="animate-spin text-[#d9bd63]"
                        />
                      </div>
                    ) : filteredAgents.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-6 text-center">
                        <Users size={28} className="text-[#c1cbc2] mb-2" />
                        <p className="text-xs font-bold text-[#7c887f]">
                          No agents found.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {filteredAgents.map((agent) => {
                          const isSelected = selectedEmails.includes(
                            agent.email,
                          );
                          return (
                            <div
                              key={agent.id}
                              onClick={() =>
                                !isSending && toggleAgent(agent.email)
                              }
                              className={`group flex items-center justify-between rounded-lg px-4 py-3 text-sm transition-all duration-200 ${isSending ? "cursor-not-allowed opacity-70" : "cursor-pointer"} ${isSelected ? "bg-[#eaf5ef] border border-[#087443]/20 shadow-sm" : "hover:bg-white border border-transparent"}`}
                            >
                              <div className="min-w-0 pr-3">
                                <p
                                  className={`truncate font-bold ${isSelected ? "text-[#087443]" : "text-[#29372f]"}`}
                                >
                                  {agent.fullName || "Unnamed"}
                                </p>
                                <p className="truncate text-[11px] font-medium text-[#8a958d] mt-0.5">
                                  {agent.email}
                                </p>
                              </div>
                              <div
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${isSelected ? "bg-[#087443] border-[#087443] text-white" : "border-[#c1cbc2] bg-white group-hover:border-[#b8860b]"}`}
                              >
                                {isSelected && (
                                  <Check size={14} strokeWidth={3} />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-end">
                    <span className="rounded-full bg-[#fbf9f2] px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#b8860b] border border-[#d9bd63]/30">
                      {selectedEmails.length} Selected
                    </span>
                  </div>
                </div>
              )}

              <div className={`${sendToAll ? "mt-auto pt-6" : "mt-0"}`}>
                <button
                  type="submit"
                  disabled={
                    isSending || (!sendToAll && selectedEmails.length === 0)
                  }
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#b8860b] via-[#c89416] to-[#a47508] px-5 py-4 text-sm font-extrabold text-white shadow-xl shadow-[#b8860b]/20 transition-all duration-300 hover:shadow-2xl hover:shadow-[#b8860b]/30 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed"
                >
                  <Send
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                  Broadcast Message
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

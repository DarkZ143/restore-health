/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search,
  MessageSquare,
  Package,
  User,
  Clock,
  CheckCircle2,
  Send,
  Loader2,
  AlertCircle
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { getIdToken, onAuthStateChanged } from "firebase/auth";

type Reply = {
  sender: "admin" | "user";
  message: string;
  createdAt: string;
};

type Ticket = {
  id: string;
  userName: string;
  userEmail: string;
  productName: string;
  subject: string;
  message: string;
  status: "open" | "answered" | "resolved";
  createdAt: string;
  replies?: Reply[];
};

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Reply State
  const [replyMessage, setReplyMessage] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  // ==========================================
  // FETCH ALL TICKETS (ADMIN VIEW)
  // ==========================================
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      let token = "";
      const currentUser = auth.currentUser;
      
      if (currentUser) {
        token = await getIdToken(currentUser, true);
      } else {
        await new Promise((resolve) => {
          const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) token = await getIdToken(user, true);
            unsubscribe();
            resolve(null);
          });
        });
      }

      if (!token) return;
      
      const response = await fetch("/api/admin/support", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      
      if (data.success) {
        setTickets(data.tickets || []);
      }
    } catch (error) {
      console.error("Error fetching tickets", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // ==========================================
  // SEND REPLY TO USER
  // ==========================================
  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    try {
      setIsReplying(true);
      const currentUser = auth.currentUser;
      const token = currentUser ? await getIdToken(currentUser, true) : "";

      const response = await fetch("/api/admin/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          message: replyMessage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state instantly for UI
        const updatedReplies = [...(selectedTicket.replies || []), data.reply];
        const updatedTicket = { ...selectedTicket, replies: updatedReplies, status: "answered" as const };
        
        setSelectedTicket(updatedTicket);
        setTickets(prev => prev.map(t => t.id === selectedTicket.id ? updatedTicket : t));
        setReplyMessage("");
      }
    } catch (error) {
      console.error("Failed to send reply", error);
    } finally {
      setIsReplying(false);
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.productName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl h-[85vh] flex flex-col space-y-4 pb-4">
      {/* ==========================================
          HEADER
      ========================================== */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-[#1f2d24]">Admin Support Desk</h1>
        <p className="mt-1 text-sm font-medium text-[#7c887f]">Manage agent reports, issues, and resolve tickets globally.</p>
      </div>

      {/* ==========================================
          SPLIT VIEW CONTAINER
      ========================================== */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* LEFT COLUMN: TICKET LIST */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col rounded-[2rem] border border-[#e5ebe5] bg-white overflow-hidden shadow-sm">
          <div className="p-5 border-b border-[#e5ebe5] bg-[#fafcfb]">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#929d95]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users or issues..."
                className="w-full rounded-xl border border-[#dfe7df] bg-white py-3 pl-11 pr-4 text-xs font-bold outline-none transition focus:border-[#d9bd63]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 size={24} className="animate-spin text-[#d9bd63]" />
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-[#a0aaa1]">
                <MessageSquare size={32} className="mb-2 opacity-50" />
                <p className="text-xs font-bold">No active tickets found</p>
              </div>
            ) : (
              filteredTickets.map(ticket => (
                <div 
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 border ${
                    selectedTicket?.id === ticket.id 
                      ? "bg-[#eaf5ef] border-[#087443]/30 shadow-sm" 
                      : "bg-white border-[#f0f5f0] hover:border-[#d9bd63]/50 hover:bg-[#fafcfb]"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className={`text-sm font-extrabold ${selectedTicket?.id === ticket.id ? "text-[#087443]" : "text-[#1f2d24]"}`}>
                      {ticket.userName || "Agent"}
                    </p>
                    <StatusBadge status={ticket.status} />
                  </div>
                  <p className="text-xs font-bold text-[#b8860b] mb-1 truncate">{ticket.productName}</p>
                  <p className="text-xs font-medium text-[#7c887f] line-clamp-2 leading-relaxed">
                    {ticket.subject}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: TICKET DETAILS & REPLY CHAT */}
        <div className="lg:col-span-8 xl:col-span-8 flex flex-col rounded-[2rem] border border-[#e5ebe5] bg-white shadow-sm overflow-hidden">
          {!selectedTicket ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#fbfcfb]">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#eaf5ef] mb-4">
                <MessageSquare size={32} className="text-[#087443]" />
              </div>
              <h3 className="text-xl font-extrabold text-[#1f2d24]">Select a Ticket</h3>
              <p className="text-sm font-medium text-[#7c887f] mt-2 max-w-xs">
                Choose a ticket from the left sidebar to view details and resolve the issue.
              </p>
            </div>
          ) : (
            <>
              {/* TICKET HEADER */}
              <div className="border-b border-[#e5ebe5] p-6 bg-[#fafcfb]">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-black text-[#1f2d24]">{selectedTicket.subject}</h2>
                  <StatusBadge status={selectedTicket.status} />
                </div>
                
                <div className="flex flex-wrap gap-4 text-xs font-bold text-[#536057]">
                  <div className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 border border-[#dfe7df]">
                    <User size={14} className="text-[#b8860b]" /> {selectedTicket.userName || "Agent"}
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 border border-[#dfe7df]">
                    <Package size={14} className="text-[#087443]" /> {selectedTicket.productName}
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 border border-[#dfe7df]">
                    <Clock size={14} className="text-[#929d95]" /> 
                    {new Date(selectedTicket.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>

              {/* CHAT / MESSAGE HISTORY */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fbfcfb]">
                {/* Original User Message */}
                <div className="flex flex-col items-start">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a0aaa1] mb-1.5 ml-2">Original Request ({selectedTicket.userName})</span>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-white p-4 text-sm font-medium leading-relaxed text-[#26352c] border border-[#e5ebe5] shadow-sm">
                    {selectedTicket.message}
                  </div>
                </div>

                {/* Replies Thread */}
                {selectedTicket.replies?.map((reply, idx) => (
                  <div key={idx} className={`flex flex-col ${reply.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a0aaa1] mb-1.5 mx-2">
                      {reply.sender === 'admin' ? 'You (Admin)' : `${selectedTicket.userName} Reply`}
                    </span>
                    <div className={`max-w-[85%] rounded-2xl p-4 text-sm font-medium leading-relaxed shadow-sm ${
                      reply.sender === 'admin' 
                        ? 'rounded-tr-none bg-[#087443] text-white' 
                        : 'rounded-tl-none bg-white text-[#26352c] border border-[#e5ebe5]'
                    }`}>
                      {reply.message}
                    </div>
                  </div>
                ))}
              </div>

              {/* REPLY INPUT AREA */}
              <div className="p-5 border-t border-[#e5ebe5] bg-white">
                <div className="flex gap-3">
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your official resolution or response here..."
                    disabled={isReplying || selectedTicket.status === "resolved"}
                    className="flex-1 resize-none rounded-xl border border-[#dfe7df] bg-[#fbfcfb] px-4 py-3 text-sm font-medium outline-none transition focus:border-[#d9bd63] focus:bg-white h-20 disabled:opacity-60"
                  />
                  <button
                    onClick={handleSendReply}
                    disabled={isReplying || !replyMessage.trim() || selectedTicket.status === "resolved"}
                    className="flex items-center justify-center h-20 w-20 rounded-xl bg-gradient-to-br from-[#b8860b] to-[#a47508] text-white shadow-lg shadow-[#b8860b]/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isReplying ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} className="-ml-1" />}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Utility Component for Status Badge
function StatusBadge({ status }: { status: string }) {
  if (status === "open") return <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-extrabold uppercase text-red-600 border border-red-200 flex items-center gap-1"><AlertCircle size={10}/> Open</span>;
  if (status === "answered") return <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-extrabold uppercase text-blue-600 border border-blue-200 flex items-center gap-1"><CheckCircle2 size={10}/> Answered</span>;
  return <span className="rounded-full bg-[#eaf5ef] px-2.5 py-1 text-[10px] font-extrabold uppercase text-[#087443] border border-[#087443]/20 flex items-center gap-1"><CheckCircle2 size={10}/> Resolved</span>;
}
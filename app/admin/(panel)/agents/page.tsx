/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  RefreshCw,
  ChevronRight,
  Mail,
  Phone,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { auth } from "@/lib/firebase";
import { getIdToken, onAuthStateChanged } from "firebase/auth";

type Agent = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: string;
  phoneVerified: boolean;
  createdAt: string | null;
};

export default function AdminAgentsPage() {
  const router = useRouter();

  const [agents, setAgents] = useState<Agent[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================================
  // FETCH AGENTS
  // ==========================================================
  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

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

      if (!token) throw new Error("Authentication token missing.");

      const response = await fetch("/api/admin/agents", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load agents.");
      }

      setAgents(data.agents || []);
    } catch (err: any) {
      console.error("❌ Admin Agents Error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  // ==========================================================
  // FILTER & SEARCH
  // ==========================================================
  const filteredAgents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return agents.filter((agent) => {
      const matchesSearch =
        !query ||
        agent.fullName.toLowerCase().includes(query) ||
        agent.email.toLowerCase().includes(query) ||
        agent.phoneNumber.includes(query) ||
        agent.id.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        agent.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [agents, search, statusFilter]);

  // ==========================================================
  // METRICS
  // ==========================================================
  const activeCount = agents.filter(
    (a) => a.status.toLowerCase() === "active",
  ).length;
  const inactiveCount = agents.filter(
    (a) => a.status.toLowerCase() !== "active",
  ).length;
  const verifiedCount = agents.filter((a) => a.phoneVerified).length;

  function formatDate(date: string | null) {
    if (!date) return "—";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "—";
    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-7">
      {/* ======================================================
          HEADER
      ====================================================== */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#1f2d24]">
            Agent Management
          </h1>
          <p className="mt-1 text-sm font-medium text-[#87928a]">
            View and manage all registered RestoreHealth agents.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAgents}
          disabled={loading}
          className="flex w-fit items-center gap-2 rounded-xl border border-[#d9bd63]/50 bg-white px-5 py-2.5 text-sm font-bold text-[#b8860b] shadow-sm transition hover:bg-[#faf9f2] disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={17} className="animate-spin" />
          ) : (
            <RefreshCw size={17} />
          )}
          Refresh Data
        </button>
      </div>

      {/* ======================================================
          SUMMARY CARDS
      ====================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} title="Total Agents" value={agents.length} />
        <StatCard
          icon={UserCheck}
          title="Active Agents"
          value={activeCount}
          color="green"
        />
        <StatCard
          icon={ShieldCheck}
          title="Verified Phone"
          value={verifiedCount}
          color="gold"
        />
        <StatCard
          icon={UserX}
          title="Inactive / Blocked"
          value={inactiveCount}
          color="red"
        />
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          <AlertCircle size={19} />
          <span>{error}</span>
        </div>
      )}

      {/* ======================================================
          SEARCH + FILTER
      ====================================================== */}
      <section className="rounded-2xl border border-[#dfe7df] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xl">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#929d95]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone or ID..."
              className="w-full rounded-xl border border-[#dfe6df] bg-[#fbfcfb] py-3 pl-11 pr-4 text-sm font-medium text-[#26352c] outline-none transition focus:border-[#d9bd63] focus:ring-4 focus:ring-[#d9bd63]/10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-[#dfe6df] bg-[#fbfcfb] px-4 py-3 text-sm font-bold text-[#536057] outline-none focus:border-[#d9bd63]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </section>

      {/* ======================================================
          AGENTS TABLE
      ====================================================== */}
      <section className="overflow-hidden rounded-2xl border border-[#dfe7df] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#e5ebe5] px-6 py-5 bg-[#fafcfb]">
          <div>
            <h2 className="text-lg font-extrabold text-[#1f2d24]">
              Agents List
            </h2>
            <p className="mt-1 text-xs font-medium text-[#8b968e]">
              Showing {filteredAgents.length} of {agents.length} agents
            </p>
          </div>
        </div>

        {loading && agents.length === 0 ? (
          <div className="flex min-h-[280px] items-center justify-center">
            <Loader2 size={30} className="animate-spin text-[#d9bd63]" />
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="flex min-h-[280px] items-center justify-center px-6 text-center">
            <div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f1f4f1] text-[#8d9890]">
                <Users size={24} />
              </div>
              <h3 className="mt-4 text-sm font-extrabold text-[#4d5951]">
                No agents found
              </h3>
              <p className="mt-1 text-xs font-medium text-[#939d96]">
                Try changing your search filters.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-[#e5ebe5] bg-[#f8faf8]">
                  <TableHead>Agent</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Agent ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead />
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map((agent) => (
                  <tr
                    key={agent.id}
                    onClick={() => router.push(`/admin/agents/${agent.id}`)}
                    className="group cursor-pointer border-b border-[#edf1ed] transition hover:bg-[#fbf9f2]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#087443] to-[#04331d] text-sm font-extrabold text-white shadow-sm">
                          {agent.fullName
                            ? agent.fullName.charAt(0).toUpperCase()
                            : "A"}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-extrabold text-[#29372f] group-hover:text-[#b8860b]">
                            {agent.fullName || "Unnamed Agent"}
                          </p>
                          <p className="truncate text-xs font-medium text-[#919b94]">
                            {agent.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#59645d]">
                          <Mail size={13} className="text-[#a47508]" />{" "}
                          {agent.email || "—"}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#59645d]">
                          <Phone size={13} className="text-[#087443]" />{" "}
                          {agent.phoneNumber || "—"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-[#f3f6f3] px-2.5 py-1.5 text-[10px] font-bold text-[#68736c] font-mono">
                        {agent.id.slice(0, 8)}...
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={agent.status} />
                        {agent.phoneVerified && (
                          <span className="flex items-center gap-1 rounded-full bg-[#fbf9f2] px-2.5 py-1 text-[9px] font-extrabold text-[#b8860b] border border-[#d9bd63]/30">
                            <ShieldCheck size={11} /> Verified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-[#68736c]">
                      {formatDate(agent.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-[#e5ebe5] text-[#68736c] transition group-hover:bg-[#d9bd63] group-hover:text-white group-hover:border-[#d9bd63] shadow-sm">
                        <ChevronRight size={17} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, color = "default" }: any) {
  const colorStyles: Record<string, string> = {
    default: "text-[#087443] bg-[#eaf5ef]",
    green: "text-[#087443] bg-green-100",
    gold: "text-[#b8860b] bg-[#fbf9f2]",
    red: "text-red-600 bg-red-50",
  };

  return (
    <div className="rounded-2xl border border-[#dfe7df] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-[#7f8a83] uppercase tracking-wider">
            {title}
          </p>
          <p className="mt-2 text-3xl font-black text-[#1f2d24]">{value}</p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorStyles[color]}`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function TableHead({ children }: { children?: React.ReactNode }) {
  return (
    <th className="px-6 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider text-[#87928a]">
      {children}
    </th>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  let className = "bg-gray-100 text-gray-600 border-gray-200";

  if (normalized === "active")
    className = "bg-[#eaf5ef] text-[#087443] border-[#087443]/20";
  if (normalized === "inactive")
    className = "bg-yellow-50 text-yellow-700 border-yellow-200";
  if (normalized === "blocked")
    className = "bg-red-50 text-red-700 border-red-200";

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide ${className}`}
    >
      {status || "unknown"}
    </span>
  );
}

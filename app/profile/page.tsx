/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  CalendarDays,
  BadgeCheck,
  RefreshCw,
  ArrowLeft,
  CircleUserRound,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  phoneVerified: boolean;
  role: string;
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
}

function formatDate(date: string | null) {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatRole(role: string) {
  if (!role) return "User";

  return role.charAt(0).toUpperCase() + role.slice(1);
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadProfile = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const storedUser =
        localStorage.getItem("restorehealth_user") || localStorage.getItem("user");

      if (!storedUser) {
        setError("Your session could not be found. Please login again.");
        return;
      }

      let parsedUser: Partial<UserProfile>;

      try {
        parsedUser = JSON.parse(storedUser);
      } catch {
        setError("Invalid login session. Please login again.");
        return;
      }

      const phoneNumber = String(
        parsedUser.phoneNumber ||
          localStorage.getItem("restorehealth_phone") ||
          localStorage.getItem("userPhone") ||
          "",
      ).trim();

      if (!phoneNumber) {
        setError("Phone number is missing from your login session.");
        return;
      }

      const response = await fetch(
        `/api/profile?phoneNumber=${encodeURIComponent(phoneNumber)}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Failed to load profile.");
      }

      setUser(data.user);
      // Keep latest user data locally.
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("restorehealth_user", JSON.stringify(data.user));
    } catch (err) {
      console.error("❌ Profile Error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading your profile.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setError("");

    if (!currentPassword) {
      toast.error("Enter your current password to change your password.");
      return;
    }
    if (newPassword && newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: user.phoneNumber,
          currentPassword,
          newPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Failed to update profile.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Profile updated successfully.");
    } catch (updateError) {
      toast.error(updateError instanceof Error ? updateError.message : "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 h-8 w-40 animate-pulse rounded-lg bg-slate-200" />

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="h-44 animate-pulse bg-slate-100" />

            <div className="space-y-5 p-6">
              <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
              <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/dashboard"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
              <User size={26} />
            </div>

            <h1 className="text-xl font-semibold text-slate-900">
              Unable to load profile
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {error || "User profile could not be found."}
            </p>

            <button
              onClick={() => loadProfile()}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <RefreshCw size={17} />
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  const initials =
    user.fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name[0]?.toUpperCase())
      .join("") || "U";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Top Bar */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link
              href="/dashboard"
              className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>

            <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>

            <p className="mt-1 text-sm text-slate-500">
              View your account and personal information.
            </p>
          </div>

          <button
            onClick={() => loadProfile(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Profile Header */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-36 bg-linear-to-r from-emerald-700 via-emerald-600 to-emerald-500" />

          <div className="relative px-5 pb-6 sm:px-8">
            {/* Avatar */}
            <div className="-mt-14 flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-emerald-100 text-3xl font-bold text-emerald-700 shadow-md">
              {initials}
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {user.fullName || "User"}
                  </h2>

                  {user.phoneVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <BadgeCheck size={14} />
                      Verified
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {formatRole(user.role)}
                </p>
              </div>

              <span
                className={`inline-flex w-fit items-center rounded-full px-3 py-1.5 text-xs font-semibold ${
                  user.status.toLowerCase() === "active"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {formatRole(user.status)}
              </span>
            </div>
          </div>
        </section>

        {/* Personal Information */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-8">
            <h3 className="text-lg font-bold text-slate-900">
              Personal Information
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your registered personal details.
            </p>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-8">
            {/* Full Name */}
            <ProfileItem
              icon={<User size={19} />}
              label="Full Name"
              value={user.fullName || "Not available"}
            />

            {/* Email */}
            <ProfileItem
              icon={<Mail size={19} />}
              label="Email Address"
              value={user.email || "Not available"}
            />

            {/* Phone */}
            <ProfileItem
              icon={<Phone size={19} />}
              label="Mobile Number"
              value={user.phoneNumber || "Not available"}
            />

            {/* Phone Verification */}
            <ProfileItem
              icon={<ShieldCheck size={19} />}
              label="Phone Verification"
              value={user.phoneVerified ? "Verified" : "Not Verified"}
              valueClassName={
                user.phoneVerified ? "text-emerald-600" : "text-amber-600"
              }
            />
          </div>
        </section>

        {/* Update Profile */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-8">
            <h3 className="text-lg font-bold text-slate-900">Change Password</h3>
            <p className="mt-1 text-sm text-slate-500">
              Your name and account details are managed by RestoreHealth.
            </p>
          </div>

          <form onSubmit={updateProfile} className="space-y-5 p-5 sm:p-8">
            <div>
              <p className="text-sm font-bold text-slate-800">Change password</p>
              <p className="mt-1 text-xs text-slate-500">
                Enter your current password to set a new one.
              </p>
            </div>

            <label className="block text-sm font-semibold text-slate-700">
              Current Password
              <div className="relative">
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button type="button" onClick={() => setShowCurrentPassword((value) => !value)} className="absolute right-3 top-1/2 text-slate-500" aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}>
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              New Password
              <div className="relative">
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                />
                <button type="button" onClick={() => setShowNewPassword((value) => !value)} className="absolute right-3 top-1/2 text-slate-500" aria-label={showNewPassword ? "Hide new password" : "Show new password"}>
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Confirm New Password
              <div className="relative">
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                />
                <button type="button" onClick={() => setShowConfirmPassword((value) => !value)} className="absolute right-3 top-1/2 text-slate-500" aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">
              <Save size={17} /> {saving ? "Saving..." : "Save changes"}
            </button>
          </form>
        </section>

        {/* Account Information */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-8">
            <h3 className="text-lg font-bold text-slate-900">
              Account Information
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Details related to your RestoreHealth account.
            </p>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-8">
            <ProfileItem
              icon={<CircleUserRound size={19} />}
              label="Account ID"
              value={user.id}
              smallValue
            />

            <ProfileItem
              icon={<ShieldCheck size={19} />}
              label="Account Role"
              value={formatRole(user.role)}
            />

            <ProfileItem
              icon={<BadgeCheck size={19} />}
              label="Account Status"
              value={formatRole(user.status)}
              valueClassName={
                user.status.toLowerCase() === "active"
                  ? "text-emerald-600"
                  : "text-slate-700"
              }
            />

            <ProfileItem
              icon={<CalendarDays size={19} />}
              label="Member Since"
              value={formatDate(user.createdAt)}
            />
          </div>
        </section>

        {/* Bottom Note */}
        <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <div className="flex gap-3">
            <ShieldCheck
              className="mt-0.5 shrink-0 text-emerald-600"
              size={21}
            />

            <div>
              <h4 className="text-sm font-bold text-emerald-900">
                Your account is secure
              </h4>

              <p className="mt-1 text-sm leading-6 text-emerald-800">
                Your mobile number is verified through OTP. Keep your account
                information secure and do not share OTPs with anyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ProfileItem({
  icon,
  label,
  value,
  valueClassName = "text-slate-900",
  smallValue = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
  smallValue?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p
          className={`mt-1 wrap-break-word font-semibold ${valueClassName} ${
            smallValue ? "text-xs sm:text-sm" : "text-sm"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

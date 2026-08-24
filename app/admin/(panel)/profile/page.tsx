"use client";

import { FormEvent, useState } from "react";
import {
  EmailAuthProvider,
  getIdToken,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { CheckCircle2, Eye, EyeOff, KeyRound, Save, UserRound } from "lucide-react";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";

type AdminData = {
  email?: string;
  name?: string;
  role?: string;
};

function getStoredAdmin(): AdminData {
  if (typeof window === "undefined") return {};

  const storedAdmin = localStorage.getItem("restorehealth_admin");
  if (!storedAdmin) return {};

  try {
    return JSON.parse(storedAdmin) as AdminData;
  } catch {
    return {};
  }
}

export default function AdminProfilePage() {
  const [admin, setAdmin] = useState<AdminData>(getStoredAdmin);
  const [name, setName] = useState(() => getStoredAdmin().name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleNameSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    const cleanName = name.trim();
    if (cleanName.length < 2 || cleanName.length > 80) {
      setError("Name must be between 2 and 80 characters.");
      return;
    }

    try {
      setSavingName(true);
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Your session has expired. Please log in again.");

      const token = await getIdToken(currentUser, true);
      const response = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName }),
      });
      const data = (await response.json()) as { success?: boolean; message?: string; name?: string };

      if (!response.ok || !data.success) throw new Error(data.message || "Unable to update your name.");

      const updatedAdmin = { ...admin, name: data.name || cleanName };
      localStorage.setItem("restorehealth_admin", JSON.stringify(updatedAdmin));
      setAdmin(updatedAdmin);
      setName(updatedAdmin.name || "");
      setMessage("Your name has been updated.");
      toast.success("Your name has been updated.");
    } catch (updateError) {
      const errorMessage = updateError instanceof Error ? updateError.message : "Unable to update your name.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSavingName(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSavingPassword(true);
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        throw new Error("Your session has expired. Please log in again.");
      }

      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword,
      );
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Your password has been updated.");
      toast.success("Your password has been updated.");
    } catch (updateError) {
      const code = (updateError as { code?: string }).code;
      setError(
        code === "auth/invalid-credential" || code === "auth/wrong-password"
          ? "The current password is incorrect."
          : code === "auth/requires-recent-login"
            ? "For security, please log out and log in again before changing your password."
            : "Unable to update your password. Please try again.",
      );
          toast.error("Unable to update your password.");
    } finally {
      setSavingPassword(false);
    }
  }

  const inputClass = "mt-2 w-full rounded-xl border border-[#dfe7df] bg-white px-4 py-3 text-sm text-[#1f2d24] outline-none transition focus:border-[#087443] focus:ring-2 focus:ring-[#087443]/10";

  return (
    <div className="max-w-4xl space-y-7">
      <div>
        <p className="text-xs font-semibold text-[#8a958d]">Account settings</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#1f2d24]">My Profile</h1>
        <p className="mt-2 text-sm text-[#68756d]">Manage your admin details and account password.</p>
      </div>

      {(message || error) && (
        <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
          {error ? <KeyRound size={17} /> : <CheckCircle2 size={17} />}
          {error || message}
        </div>
      )}

      <section className="rounded-2xl border border-[#dfe7df] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3 border-b border-[#edf1ed] pb-5">
          <UserRound className="text-[#087443]" size={22} />
          <div><h2 className="font-extrabold text-[#1f2d24]">Personal information</h2><p className="text-xs text-[#8a958d]">Your name shown across the admin panel.</p></div>
        </div>
        <form onSubmit={handleNameSubmit} className="mt-6 space-y-5">
          <label className="block text-sm font-bold text-[#536057]">Full name<input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} required maxLength={80} /></label>
          <label className="block text-sm font-bold text-[#536057]">Email address<input className={`${inputClass} bg-[#f7faf7] text-[#8a958d]`} value={admin.email || ""} readOnly /></label>
          <button type="submit" disabled={savingName} className="inline-flex items-center gap-2 rounded-xl bg-[#087443] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#065d35] disabled:cursor-not-allowed disabled:opacity-60"><Save size={17} />{savingName ? "Saving..." : "Save name"}</button>
        </form>
      </section>

      <section className="rounded-2xl border border-[#dfe7df] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3 border-b border-[#edf1ed] pb-5">
          <KeyRound className="text-[#b8860b]" size={22} />
          <div><h2 className="font-extrabold text-[#1f2d24]">Change password</h2><p className="text-xs text-[#8a958d]">Use at least 6 characters for your new password.</p></div>
        </div>
        <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-5">
          <label className="block text-sm font-bold text-[#536057]">Current password<div className="relative"><input className={`${inputClass} pr-12`} type={showCurrentPassword ? "text" : "password"} value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" required /><button type="button" onClick={() => setShowCurrentPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#68756d]" aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}>{showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
          <label className="block text-sm font-bold text-[#536057]">New password<div className="relative"><input className={`${inputClass} pr-12`} type={showPassword ? "text" : "password"} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" required minLength={6} /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#68756d]" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
          <label className="block text-sm font-bold text-[#536057]">Confirm new password<div className="relative"><input className={`${inputClass} pr-12`} type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" required minLength={6} /><button type="button" onClick={() => setShowConfirmPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#68756d]" aria-label={showConfirmPassword ? "Hide password" : "Show password"}>{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
          <button type="submit" disabled={savingPassword} className="inline-flex items-center gap-2 rounded-xl bg-[#b8860b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#966f08] disabled:cursor-not-allowed disabled:opacity-60"><KeyRound size={17} />{savingPassword ? "Updating..." : "Update password"}</button>
        </form>
      </section>
    </div>
  );
}
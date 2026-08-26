/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import {
  X,
  MessageCircle,
  Send,
  Loader2,
  LockKeyhole,
  ArrowRight,
} from "lucide-react";

const WHATSAPP_NUMBER = "919205456671";

export default function FloatingWhatsAppButton() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loginRequired, setLoginRequired] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================================
  // CHECK CLIENT LOGIN
  // ==========================================================

  function getClientUser() {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      // Primary client session
      const clientData = localStorage.getItem("restorehealth_client");

      if (clientData) {
        const parsed = JSON.parse(clientData);

        if (parsed) {
          return parsed;
        }
      }

      // Alternative session keys
      const userData = localStorage.getItem("restorehealth_user");

      if (userData) {
        const parsed = JSON.parse(userData);

        if (parsed) {
          return parsed;
        }
      }

      const loggedIn = localStorage.getItem("restorehealth_client_logged_in");

      if (loggedIn === "true") {
        return {
          name: "Client",
        };
      }

      return null;
    } catch (error) {
      console.error("Failed to read client session:", error);
      return null;
    }
  }

  // ==========================================================
  // GET USER NAME
  // ==========================================================

  function getUserName(user: any) {
    return (
      user?.name ||
      user?.fullName ||
      user?.displayName ||
      user?.firstName ||
      user?.email ||
      "Client"
    );
  }

  // ==========================================================
  // RAISE COMPLAINT
  // ==========================================================

  function handleRaiseComplaint() {
    const user = getClientUser();

    // --------------------------------------------------------
    // USER NOT LOGGED IN
    // --------------------------------------------------------

    if (!user) {
      setLoginRequired(true);
      return;
    }

    // --------------------------------------------------------
    // USER LOGGED IN
    // --------------------------------------------------------

    setOpen(true);
  }

  // ==========================================================
  // GO TO CLIENT LOGIN
  // ==========================================================

  function handleGoToLogin() {
    setLoginRequired(false);
    router.push("/auth/login");
  }

  // ==========================================================
  // OPEN WHATSAPP
  // ==========================================================

  function openWhatsApp(user: any) {
    const cleanMessage = message.trim();

    if (!cleanMessage) {
      return;
    }

    setLoading(true);

    const userName = getUserName(user);

    const whatsappMessage = `Hello I'm ${userName}, I have something issue: ${cleanMessage}`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      whatsappMessage,
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setLoading(false);
    setOpen(false);
    setMessage("");
  }

  // ==========================================================
  // SUBMIT COMPLAINT
  // ==========================================================

  function handleSubmitComplaint() {
    const user = getClientUser();

    // --------------------------------------------------------
    // SAFETY CHECK
    // --------------------------------------------------------

    if (!user) {
      setOpen(false);
      setLoginRequired(true);
      return;
    }

    // --------------------------------------------------------
    // OPEN WHATSAPP
    // --------------------------------------------------------

    openWhatsApp(user);
  }

  // ==========================================================
  // AFTER CLIENT LOGIN
  // ==========================================================

  useEffect(() => {
    // No automatic WhatsApp opening after login.
    // User must manually click Raise a Complaint again.

    const pendingComplaint = sessionStorage.getItem(
      "restorehealth_pending_complaint",
    );

    if (pendingComplaint) {
      sessionStorage.removeItem("restorehealth_pending_complaint");
    }
  }, []);

  return (
    <>
      {/* =====================================================
          FLOATING BUTTON
      ====================================================== */}

      <div className="fixed bottom-6 right-6 z-50 lg:bottom-10 lg:right-10">
        <button
          type="button"
          onClick={handleRaiseComplaint}
          className="
            flex
            items-center
            justify-center
            rounded-full
            bg-[#25D366]
            text-white
            shadow-xl
            shadow-[#25D366]/30
            transition-all
            duration-300
            hover:scale-105
            hover:bg-[#20bd5a]

            h-14
            w-14
            gap-0
            p-0

            lg:h-auto
            lg:w-auto
            lg:gap-2.5
            lg:px-6
            lg:py-3
          "
          aria-label="Raise a Complaint"
        >
          <FaWhatsapp size={28} className="shrink-0" />

          <span className="hidden whitespace-nowrap text-[15px] font-extrabold lg:block cursor-pointer">
            Raise a Complaint
          </span>
        </button>
      </div>

      {/* =====================================================
          LOGIN REQUIRED MODAL
      ====================================================== */}

      {loginRequired && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div
            className="
              relative
              w-full
              max-w-sm
              rounded-3xl
              border
              border-[#d9eadc]
              bg-white
              p-6
              shadow-2xl
              dark:border-white/10
              dark:bg-[#151711]
              sm:p-7
            "
          >
            {/* CLOSE */}

            <button
              type="button"
              onClick={() => setLoginRequired(false)}
              className="
                absolute
                right-4
                top-4
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                text-gray-500
                transition
                hover:bg-gray-100
                hover:text-gray-800
                dark:text-white/50
                dark:hover:bg-white/10
                dark:hover:text-white
              "
              aria-label="Close"
            >
              <X size={19} />
            </button>

            {/* ICON */}

            <div className="flex flex-col items-center text-center">
              <div
                className="
                  mb-5
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#e8f5ea]
                  text-[#2f6b3a]
                  dark:bg-[#1b2d1f]
                  dark:text-[#9ed5a7]
                "
              >
                <LockKeyhole size={26} />
              </div>

              {/* TITLE */}

              <h2 className="text-xl font-extrabold text-[#263326] dark:text-white">
                Login Required
              </h2>

              {/* DESCRIPTION */}

              <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#718071] dark:text-white/50">
                Please login first to raise a complaint. Your account is
                required so we can identify you and assist you properly.
              </p>
            </div>

            {/* INFO */}

            <div
              className="
                mt-5
                rounded-2xl
                border
                border-[#d9eadc]
                bg-[#f1f8f2]
                px-4
                py-3
                dark:border-[#4d8056]/30
                dark:bg-[#1b2d1f]/50
              "
            >
              <p className="text-center text-xs font-semibold leading-relaxed text-[#3e6845] dark:text-[#a8d5ae]">
                Login to your Client account to continue with your complaint.
              </p>
            </div>

            {/* BUTTONS */}

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setLoginRequired(false)}
                className="
                  flex-1
                  rounded-2xl
                  border
                  border-[#d9e4da]
                  bg-white
                  px-4
                  py-3.5
                  text-sm
                  font-bold
                  text-[#526052]
                  transition
                  hover:bg-[#f5faf6]
                  dark:border-white/10
                  dark:bg-white/5
                  dark:text-white/70
                  dark:hover:bg-white/10
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleGoToLogin}
                className="
                  flex-1
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-[#0d9f72]
                  px-4
                  py-3.5
                  text-sm
                  font-extrabold
                  text-white
                  shadow-lg
                  shadow-[#0d9f72]/20
                  transition-all
                  duration-300
                  hover:scale-[1.01]
                  hover:bg-[#0b8c65]
                "
              >
                Client Login
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          COMPLAINT MODAL
      ====================================================== */}

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div
            className="
              relative
              w-full
              max-w-md
              rounded-3xl
              border
              border-[#d9eadc]
              bg-white
              p-6
              shadow-2xl
              dark:border-white/10
              dark:bg-[#151711]
              sm:p-7
            "
          >
            {/* CLOSE BUTTON */}

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setMessage("");
              }}
              className="
                absolute
                right-4
                top-4
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                text-gray-500
                transition
                hover:bg-gray-100
                hover:text-gray-800
                dark:text-white/50
                dark:hover:bg-white/10
                dark:hover:text-white
              "
              aria-label="Close"
            >
              <X size={19} />
            </button>

            {/* HEADER */}

            <div className="mb-6 pr-8">
              <div
                className="
                  mb-4
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#e8f5ea]
                  text-[#2f6b3a]
                  dark:bg-[#1b2d1f]
                  dark:text-[#9ed5a7]
                "
              >
                <MessageCircle size={24} />
              </div>

              <h2 className="text-xl font-extrabold text-[#263326] dark:text-white">
                Raise a Complaint
              </h2>

              <p className="mt-1.5 text-sm leading-relaxed text-[#718071] dark:text-white/50">
                Tell us about your issue. We will connect you with our support
                team through WhatsApp.
              </p>
            </div>

            {/* MESSAGE INPUT */}

            <label
              htmlFor="complaint-message"
              className="mb-2 block text-sm font-bold text-[#354335] dark:text-white/80"
            >
              Describe your issue
            </label>

            <textarea
              id="complaint-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Please type only your problem with Transaction ID"
              rows={5}
              maxLength={1000}
              className="
                w-full
                resize-none
                rounded-2xl
                border
                border-[#d9e4da]
                bg-[#f9fcf9]
                px-4
                py-3.5
                text-sm
                font-medium
                text-[#263326]
                outline-none
                transition
                placeholder:text-[#9aaa9a]
                focus:border-[#75b87f]
                focus:ring-4
                focus:ring-[#75b87f]/10
                dark:border-white/10
                dark:bg-white/5
                dark:text-white
                dark:placeholder:text-white/30
              "
            />

            <div className="mt-1.5 flex justify-end">
              <span className="text-[11px] font-medium text-[#8a998b]">
                {message.length}/1000
              </span>
            </div>

            {/* LOGIN INFORMATION */}

            <div
              className="
                mt-4
                rounded-2xl
                border
                border-[#d9eadc]
                bg-[#f1f8f2]
                px-4
                py-3
                dark:border-[#4d8056]/30
                dark:bg-[#1b2d1f]/50
              "
            >
              <p className="text-xs font-semibold leading-relaxed text-[#3e6845] dark:text-[#a8d5ae]">
                Your complaint will be sent directly to our support team through
                WhatsApp.
              </p>
            </div>

            {/* SUBMIT BUTTON */}

            <button
              type="button"
              onClick={handleSubmitComplaint}
              disabled={!message.trim() || loading}
              className="
                mt-5
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-[#25D366]
                px-5
                py-3.5
                text-sm
                font-extrabold
                text-white
                shadow-lg
                shadow-[#25D366]/20
                transition-all
                duration-300
                hover:scale-[1.01]
                hover:bg-[#20bd5a]
                disabled:cursor-not-allowed
                disabled:opacity-50
                disabled:hover:scale-100
              "
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Opening WhatsApp...
                </>
              ) : (
                <>
                  <FaWhatsapp size={19} />
                  Continue to WhatsApp
                  <Send size={17} />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
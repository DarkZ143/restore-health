/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileCheck2,
  Info,
  LockKeyhole,
  LogIn,
  Mic,
  MicOff,
  Phone,
  PhoneCall,
  Play,
  ShieldCheck,
  Square,
  UserPlus,
  Users,
  Video,
  Volume2,
  X,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Save,
} from "lucide-react";
import { auth } from "@/lib/firebase";

/* =========================================================
   TYPES
========================================================= */

type PlanData = {
  planId: string;
  planName: string;
  price: string;
  family: string;
};

type VerificationMethod = "video" | "call" | null;

type VerificationStatus =
  | "idle"
  | "checking"
  | "ready"
  | "recording"
  | "processing"
  | "success"
  | "saving"
  | "saved"
  | "pending"
  | "failed";

type DeviceStatus = {
  cameraAvailable: boolean;
  microphoneAvailable: boolean;
  cameraPermission: boolean;
  microphonePermission: boolean;
};

/* =========================================================
   TERMS
========================================================= */

const VERIFICATION_TERMS = [
  "I confirm that I have understood the selected membership plan and its benefits.",
  "I understand that once the membership plan is issued, it cannot be cancelled or refunded.",
  "I confirm that the information provided by me is correct and I am voluntarily proceeding with this membership.",
  "I understand that the applicable membership amount and GST will be payable after successful verification.",
];

/* =========================================================
   COMPONENT
========================================================= */

export default function PaymentDeclarationPage() {
  const router = useRouter();

  /* =======================================================
     PLAN DATA
  ======================================================= */

  const [plan, setPlan] = useState<PlanData>({
    planId: "",
    planName: "",
    price: "",
    family: "",
  });

  /* =======================================================
     DECLARATIONS
  ======================================================= */

  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  const [checkbox3, setCheckbox3] = useState(false);

  /* =======================================================
     LOGIN
  ======================================================= */

  const [showLoginPopup, setShowLoginPopup] = useState(false);

  /* =======================================================
     VERIFICATION
  ======================================================= */

  const [showVerification, setShowVerification] = useState(false);

  const [verificationMethod, setVerificationMethod] =
    useState<VerificationMethod>(null);

  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("idle");

  /* =======================================================
     VIDEO
  ======================================================= */

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const mediaStreamRef = useRef<MediaStream | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const recordedChunksRef = useRef<Blob[]>([]);

  const [recordingTime, setRecordingTime] = useState(0);

  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);

  const recordedVideoBlobRef = useRef<Blob | null>(null);

  const [isSavingVideo, setIsSavingVideo] = useState(false);

  const [savedVideoUrl, setSavedVideoUrl] = useState<string | null>(null);

  const [isRecording, setIsRecording] = useState(false);

  const [videoError, setVideoError] = useState("");

  /* =======================================================
     DEVICE STATUS
  ======================================================= */

  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>({
    cameraAvailable: false,
    microphoneAvailable: false,
    cameraPermission: false,
    microphonePermission: false,
  });

  /* =======================================================
     AUDIO / SPEECH
  ======================================================= */

  const speechRecognitionRef = useRef<any>(null);

  const [speechSupported, setSpeechSupported] = useState(false);

  const [spokenText, setSpokenText] = useState("");

  const [speechError, setSpeechError] = useState("");

  const [termsReadCorrectly, setTermsReadCorrectly] = useState(false);

  /* =======================================================
     CALL
  ======================================================= */

  // FIXED: Added Support Name state for the missing name issue
  const [supportName, setSupportName] = useState("");
  const [supportPhone, setSupportPhone] = useState("");

  const [callStatus, setCallStatus] = useState<
    "idle" | "requesting" | "pending" | "approved" | "rejected"
  >("idle");

  const [callMessage, setCallMessage] = useState("");

  // Pre-fill Name & Phone if available in LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser =
        localStorage.getItem("user") ||
        sessionStorage.getItem("user") ||
        localStorage.getItem("restorehealth_user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          const name =
            parsed?.displayName ||
            parsed?.name ||
            parsed?.fullName ||
            parsed?.customerName ||
            "";
          const phone =
            parsed?.phoneNumber || parsed?.phone || parsed?.mobile || "";

          if (name) setSupportName(name);
          if (phone) setSupportPhone(phone.replace(/\D/g, ""));
        } catch (e) {
          console.error("Error parsing user data");
        }
      }
    }
  }, []);

  /* =======================================================
     PAYMENT ACCESS
  ======================================================= */

  const [paymentEnabled, setPaymentEnabled] = useState(false);

  /* =======================================================
     PLAN FROM URL
  ======================================================= */

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    setPlan({
      planId: params.get("planId") || "",
      planName: params.get("plan") || "",
      price: params.get("price") || "",
      family: params.get("family") || "",
    });
  }, []);

  /* =======================================================
     PRICE
  ======================================================= */

  const numericPrice = Number(plan.price.replace(/[^\d]/g, ""));

  const membershipPrice = Number.isNaN(numericPrice) ? 0 : numericPrice;

  const gstAmount = Math.round(membershipPrice * 0.18);

  const totalAmount = membershipPrice + gstAmount;

  /* =======================================================
     DECLARATIONS
  ======================================================= */

  const allChecked = checkbox1 && checkbox2 && checkbox3;

  const acceptedCount = [checkbox1, checkbox2, checkbox3].filter(
    Boolean,
  ).length;

  /* =======================================================
     FORMAT PRICE
  ======================================================= */

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  /* =======================================================
     LOGIN CHECK
  ======================================================= */

  const isUserLoggedIn = () => {
    if (typeof window === "undefined") {
      return false;
    }

    const localKeys = ["authToken", "accessToken", "token", "user"];

    const sessionKeys = ["authToken", "user"];

    const localLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    const sessionLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

    const hasLocalAuth = localKeys.some((key) => !!localStorage.getItem(key));

    const hasSessionAuth = sessionKeys.some(
      (key) => !!sessionStorage.getItem(key),
    );

    return localLoggedIn || sessionLoggedIn || hasLocalAuth || hasSessionAuth;
  };

  /* =======================================================
     PROCEED TO PAYMENT
  ======================================================= */

  const proceedToPayment = () => {
    if (!paymentEnabled) {
      return;
    }

    const params = new URLSearchParams({
      planId: plan.planId,
      plan: plan.planName,
      family: plan.family,
      price: String(membershipPrice),
      gst: String(gstAmount),
      total: String(totalAmount),
      verificationMethod: verificationMethod || "",
    });

    router.push(`/payment?${params.toString()}`);
  };

  /* =======================================================
     START VERIFICATION
  ======================================================= */

  const handlePayment = () => {
    if (!allChecked) {
      return;
    }

    if (!plan.planId || membershipPrice <= 0) {
      alert("Plan information is missing. Please select the plan again.");

      return;
    }

    if (!isUserLoggedIn()) {
      setShowLoginPopup(true);
      return;
    }

    setShowVerification(true);
    setVerificationMethod(null);
    setPaymentEnabled(false);
    setVerificationStatus("idle");
  };

  /* =======================================================
     CAMERA + MICROPHONE CHECK
  ======================================================= */

  const checkDevices = async () => {
    setVerificationStatus("checking");
    setVideoError("");

    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setVideoError(
        "Camera and microphone access is not supported by this browser.",
      );

      setVerificationStatus("failed");
      return false;
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      const cameraAvailable = devices.some(
        (device) => device.kind === "videoinput",
      );

      const microphoneAvailable = devices.some(
        (device) => device.kind === "audioinput",
      );

      if (!cameraAvailable) {
        setDeviceStatus({
          cameraAvailable: false,
          microphoneAvailable,
          cameraPermission: false,
          microphonePermission: false,
        });

        setVideoError("No camera found. Please connect or enable a camera.");

        setVerificationStatus("failed");
        return false;
      }

      if (!microphoneAvailable) {
        setDeviceStatus({
          cameraAvailable: true,
          microphoneAvailable: false,
          cameraPermission: false,
          microphonePermission: false,
        });

        setVideoError(
          "No microphone found. Please connect or enable a microphone.",
        );

        setVerificationStatus("failed");
        return false;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const videoTracks = stream.getVideoTracks();

      const audioTracks = stream.getAudioTracks();

      if (!videoTracks.length) {
        stream.getTracks().forEach((track) => track.stop());

        setVideoError("No camera found. Please enable your camera.");

        setVerificationStatus("failed");
        return false;
      }

      if (!audioTracks.length) {
        stream.getTracks().forEach((track) => track.stop());

        setVideoError("No microphone found. Please enable your microphone.");

        setVerificationStatus("failed");
        return false;
      }

      const cameraTrack = videoTracks[0];

      const microphoneTrack = audioTracks[0];

      if (!cameraTrack.enabled) {
        stream.getTracks().forEach((track) => track.stop());

        setVideoError("Please enable the camera.");

        setVerificationStatus("failed");
        return false;
      }

      if (!microphoneTrack.enabled) {
        stream.getTracks().forEach((track) => track.stop());

        setVideoError("Please unmute the microphone.");

        setVerificationStatus("failed");
        return false;
      }

      mediaStreamRef.current = stream;

      setDeviceStatus({
        cameraAvailable: true,
        microphoneAvailable: true,
        cameraPermission: true,
        microphonePermission: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setVerificationStatus("ready");

      return true;
    } catch (error: any) {
      console.error("Camera/Microphone error:", error);

      if (error?.name === "NotAllowedError") {
        setVideoError(
          "Please enable the camera and microphone permissions in your browser.",
        );
      } else if (error?.name === "NotFoundError") {
        setVideoError("No camera or microphone found.");
      } else if (error?.name === "NotReadableError") {
        setVideoError(
          "Camera or microphone is already being used by another application.",
        );
      } else {
        setVideoError(
          "Unable to access camera or microphone. Please check your device settings.",
        );
      }

      setVerificationStatus("failed");

      return false;
    }
  };

  /* =======================================================
     SPEECH RECOGNITION
  ======================================================= */

  const initializeSpeechRecognition = () => {
    if (typeof window === "undefined") {
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    setSpeechSupported(true);

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event: any) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }

      setSpokenText((previous) => `${previous} ${transcript}`.trim());
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event);

      setSpeechError(
        "Unable to recognize speech clearly. Please speak slowly and clearly.",
      );
    };

    speechRecognitionRef.current = recognition;
  };

  /* =======================================================
     NORMALIZE SPEECH
  ======================================================= */

  const normalizeSpeech = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9₹\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  /* =======================================================
     CHECK TERMS
  ======================================================= */

  const checkTermsRead = () => {
    const transcript = normalizeSpeech(spokenText);

    if (!transcript) {
      return false;
    }

    const requiredPhrases = [
      ["understood", "membership", "plan"],
      ["cannot be", "cancelled", "refunded"],
      ["information", "provided", "correct"],
      ["amount", "gst", "payable"],
    ];

    const matched = requiredPhrases.filter((group) =>
      group.some((word) => transcript.includes(word)),
    ).length;

    return matched >= 3;
  };

  /* =======================================================
     START RECORDING
  ======================================================= */

  const startRecording = async () => {
    const ready = await checkDevices();

    if (!ready) {
      return;
    }

    setSpokenText("");
    setSpeechError("");
    setTermsReadCorrectly(false);
    setVideoError("");
    setRecordingTime(0);

    recordedChunksRef.current = [];

    const stream = mediaStreamRef.current;

    if (!stream) {
      setVideoError("Camera and microphone are not ready.");
      return;
    }

    const audioTracks = stream.getAudioTracks();

    const videoTracks = stream.getVideoTracks();

    if (!audioTracks.length) {
      setVideoError("No microphone found. Please enable the microphone.");
      return;
    }

    if (!audioTracks[0].enabled) {
      setVideoError("Please unmute the microphone.");
      return;
    }

    if (!videoTracks.length) {
      setVideoError("No camera found. Please enable the camera.");
      return;
    }

    if (!videoTracks[0].enabled) {
      setVideoError("Please enable the camera.");
      return;
    }

    let mimeType = "";

    if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")) {
      mimeType = "video/webm;codecs=vp9,opus";
    } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")) {
      mimeType = "video/webm;codecs=vp8,opus";
    } else if (MediaRecorder.isTypeSupported("video/webm")) {
      mimeType = "video/webm";
    }

    const recorder = new MediaRecorder(
      stream,
      mimeType ? { mimeType } : undefined,
    );

    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    recorder.onstop = async () => {
      const blob = new Blob(recordedChunksRef.current, {
        type: mimeType || "video/webm",
      });

      const url = URL.createObjectURL(blob);

      recordedVideoBlobRef.current = blob;
      setRecordedVideoUrl(url);

      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch {}
      }

      setVerificationStatus("processing");

      /*
       * FRONTEND DEMO CHECK
       *
       * Final production verification
       * should happen on:
       *
       * /api/verification/video
       *
       * where the recording should be
       * uploaded and processed.
       */

      const termsPassed = checkTermsRead();

      if (speechSupported && !termsPassed) {
        setTermsReadCorrectly(false);

        setVideoError(
          "The required terms were not clearly detected. Please record again and read all terms clearly.",
        );

        setVerificationStatus("failed");

        return;
      }

      /*
       * For browsers without SpeechRecognition,
       * recording itself is available.
       *
       * Backend must perform final verification.
       */

      setTermsReadCorrectly(true);

      setVerificationStatus("success");
    };

    recorder.start(1000);

    setIsRecording(true);
    setVerificationStatus("recording");

    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.start();
      } catch {}
    }

    recordingTimerRef.current = setInterval(() => {
      setRecordingTime((previous) => previous + 1);
    }, 1000);
  };

  /* =======================================================
     STOP RECORDING
  ======================================================= */

  const stopRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);

      recordingTimerRef.current = null;
    }

    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {}
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);
  };

  /* =======================================================
     SAVE VIDEO TO CLOUDINARY
  ======================================================= */

  const saveVideoVerification = async () => {
    const blob = recordedVideoBlobRef.current;
    const currentUser = auth.currentUser;

    if (!blob || !currentUser || !termsReadCorrectly || isSavingVideo) {
      return;
    }

    setIsSavingVideo(true);
    setVerificationStatus("saving");
    setVideoError("");

    try {
      const idToken = await currentUser.getIdToken(true);
      const formData = new FormData();
      formData.append("video", blob, `verification-${Date.now()}.webm`);
      formData.append("planId", plan.planId);
      formData.append("transcript", spokenText);

      const response = await fetch("/api/verification/video", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save video verification.");
      }

      setSavedVideoUrl(data.videoUrl || null);
      setVerificationStatus("saved");
      setPaymentEnabled(true);
    } catch (error: any) {
      console.error("Video verification upload error:", error);
      setVideoError(error?.message || "Unable to save video verification.");
      setVerificationStatus("success");
    } finally {
      setIsSavingVideo(false);
    }
  };

  /* =======================================================
     ENABLE PAYMENT AFTER VIDEO
  ======================================================= */

  const handleVideoSuccess = () => {
    if (!termsReadCorrectly) {
      return;
    }

    setPaymentEnabled(true);
  };

  /* =======================================================
     CALL SUPPORT (FIXED)
  ======================================================= */

  /* =======================================================
     CALL SUPPORT (FIXED WITH USER ID)
  ======================================================= */

  const requestSupportCall = async () => {
    // Check missing name gracefully
    if (!supportName.trim()) {
      setCallStatus("idle");
      setCallMessage("Please enter your customer name to proceed.");
      return;
    }

    if (!supportPhone.trim()) {
      setCallStatus("idle");
      setCallMessage("Please enter your phone number.");
      return;
    }

    if (!/^\+?[0-9]{10,15}$/.test(supportPhone.trim())) {
      setCallStatus("idle");
      setCallMessage("Please enter a valid phone number.");
      return;
    }

    try {
      setCallStatus("requesting");
      setCallMessage("");

      const numericAmount = totalAmount;

      if (!plan.planId || !plan.planName) {
        setCallStatus("idle");
        setCallMessage(
          "Plan information is missing. Please select the plan again.",
        );
        return;
      }

      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        setCallStatus("idle");
        setCallMessage(
          "Payment amount is invalid. Please select the plan again.",
        );
        return;
      }

      // ==========================================
      // FIX: EXTRACT USER ID FROM AUTH OR STORAGE
      // ==========================================
      let userId = auth.currentUser?.uid;

      if (!userId) {
        const storedUser =
          localStorage.getItem("user") ||
          sessionStorage.getItem("user") ||
          localStorage.getItem("restorehealth_user");
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            userId = parsed.uid || parsed.id || parsed.userId;
          } catch (e) {
            console.error("Failed to parse user for ID");
          }
        }
      }

      // Agar userId fir bhi na mile toh request fail na ho isliye ek fallback de do (ya error show karo)
      if (!userId) {
        setCallStatus("idle");
        setCallMessage("User session missing. Please log in again.");
        return;
      }

      // API Call
      const response = await fetch("/api/verification/support-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId, // 🚀 YAHAN BHEJA HAI USER ID
          customerName: supportName.trim(),
          phoneNumber: supportPhone.trim(),
          planId: plan.planId,
          planName: plan.planName,
          family: plan.family,
          amount: numericAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Unable to request support call.");
      }

      setCallStatus("pending");

      setCallMessage(
        data?.alreadyRequested
          ? "Your support call request is already pending. Our team will contact you shortly."
          : "Your support call request has been submitted. Our team will contact you and verify the declaration.",
      );

      console.log("✅ Support call request:", data.requestId);
    } catch (error: unknown) {
      console.error("❌ Support call error:", error);

      setCallStatus("idle");

      setCallMessage(
        error instanceof Error
          ? error.message
          : "Unable to request support call.",
      );
    }
  };

  /* =======================================================
     POLL CALL VERIFICATION STATUS (FIXED)
  ======================================================= */

  useEffect(() => {
    if (callStatus !== "pending") {
      return;
    }

    const interval = setInterval(async () => {
      try {
        // Fetch User ID
        let currentUserId = auth.currentUser?.uid;
        if (!currentUserId) {
          const storedUser =
            localStorage.getItem("user") ||
            sessionStorage.getItem("user") ||
            localStorage.getItem("restorehealth_user");
          if (storedUser) {
            currentUserId =
              JSON.parse(storedUser).uid ||
              JSON.parse(storedUser).userId ||
              JSON.parse(storedUser).id;
          }
        }

        if (!currentUserId) return; // Agar ID nahi hai toh skip karo

        // Call the new API Route with both planId and userId
        const response = await fetch(
          `/api/verification/support-call/status?planId=${encodeURIComponent(
            plan.planId,
          )}&userId=${encodeURIComponent(currentUserId)}`,
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (data?.status === "approved") {
          setCallStatus("approved");
          setPaymentEnabled(true);
          setCallMessage(
            "Your verification has been approved. You can now proceed to payment.",
          );
        }

        if (data?.status === "rejected") {
          setCallStatus("rejected");
          setPaymentEnabled(false);
          setCallMessage(
            data?.message || "Your verification was not approved.",
          );
        }
      } catch (error) {
        console.error("Verification status error:", error);
      }
    }, 5000); // Har 5 second mein check karega

    return () => clearInterval(interval);
  }, [callStatus, plan.planId]);

  /* =======================================================
     CLEANUP
  ======================================================= */

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (recordedVideoUrl) {
        URL.revokeObjectURL(recordedVideoUrl);
      }
    };
  }, [recordedVideoUrl]);

  /* =======================================================
     INIT SPEECH
  ======================================================= */

  useEffect(() => {
    initializeSpeechRecognition();
  }, []);

  useEffect(() => {
    if (!showVerification) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [showVerification]);

  /* =======================================================
     LOGIN
  ======================================================= */

  const handleLogin = () => {
    if (typeof window === "undefined") {
      return;
    }

    const returnUrl = window.location.pathname + window.location.search;

    sessionStorage.setItem("paymentReturnUrl", returnUrl);

    router.push(`/services/login?redirect=${encodeURIComponent(returnUrl)}`);
  };

  /* =======================================================
     SIGNUP
  ======================================================= */

  const handleSignup = () => {
    if (typeof window === "undefined") {
      return;
    }

    const returnUrl = window.location.pathname + window.location.search;

    sessionStorage.setItem("paymentReturnUrl", returnUrl);

    router.push(`/services/signup?redirect=${encodeURIComponent(returnUrl)}`);
  };

  /* =======================================================
     RESET VIDEO
  ======================================================= */

  const resetVideoVerification = () => {
    stopRecording();

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());

      mediaStreamRef.current = null;
    }

    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
    }

    setRecordedVideoUrl(null);
    recordedVideoBlobRef.current = null;
    setSavedVideoUrl(null);
    setIsSavingVideo(false);
    setSpokenText("");
    setTermsReadCorrectly(false);
    setPaymentEnabled(false);
    setVideoError("");
    setSpeechError("");
    setRecordingTime(0);
    setVerificationStatus("idle");
  };

  /* =======================================================
     RECORDING TIME
  ======================================================= */

  const formatRecordingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <>
      <main className="min-h-screen bg-[#f7faf7] px-4 py-6 dark:bg-[#07140e] sm:px-6 sm:py-10">
        <div className="mx-auto max-w-5xl">
          {/* BACK */}

          <button
            type="button"
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-bold text-[#064627] shadow-sm transition hover:bg-emerald-50 dark:border-emerald-900 dark:bg-[#0d1d14] dark:text-emerald-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Plans
          </button>

          {/* HEADER */}

          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#c89416]/30 bg-[#fff9e9] px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#9a6d00] dark:border-[#c89416]/40 dark:bg-[#c89416]/10 dark:text-[#e6bd50]">
              <FileCheck2 className="h-4 w-4" />
              Payment Declaration
            </div>

            <h1 className="text-3xl font-black text-[#064627] dark:text-emerald-300 sm:text-4xl">
              Review & Confirm Your Plan
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-300">
              Please review your selected plan and accept all three declarations
              before continuing.
            </p>
          </div>

          {/* CONTENT */}

          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            {/* LEFT */}

            <div className="space-y-5">
              {/* PLAN DETAILS */}

              <div className="overflow-hidden rounded-3xl border border-[#dce9cf] bg-white shadow-sm dark:border-emerald-900 dark:bg-[#0d1d14]">
                <div className="bg-[#064627] px-5 py-4 text-white">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5" />

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-200">
                        Selected Membership
                      </p>

                      <h2 className="font-black">Plan Details</h2>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 p-5 sm:grid-cols-3">
                  <div className="rounded-2xl border border-emerald-100 bg-[#f4faf1] p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
                    <ShieldCheck className="mb-2 h-5 w-5 text-[#17643d]" />

                    <p className="text-[9px] font-black uppercase text-slate-400">
                      Plan
                    </p>

                    <p className="mt-1 font-black text-slate-900 dark:text-white">
                      {plan.planName || "Not Selected"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-emerald-100 bg-[#f4faf1] p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
                    <Users className="mb-2 h-5 w-5 text-[#17643d]" />

                    <p className="text-[9px] font-black uppercase text-slate-400">
                      Family
                    </p>

                    <p className="mt-1 font-black text-slate-900 dark:text-white">
                      {plan.family || "—"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#c89416]/30 bg-[#fff9e9] p-4 dark:border-[#c89416]/30 dark:bg-[#c89416]/10">
                    <CreditCard className="mb-2 h-5 w-5 text-[#c89416]" />

                    <p className="text-[9px] font-black uppercase text-slate-400">
                      Price
                    </p>

                    <p className="mt-1 font-black text-[#9a6d00] dark:text-[#e6bd50]">
                      {plan.price || "₹0"}
                    </p>
                  </div>
                </div>
              </div>

              {/* DECLARATIONS */}

              <div className="rounded-3xl border border-[#dce9cf] bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-[#0d1d14] sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#c89416]">
                      Required
                    </p>

                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      Accept All Declarations
                    </h2>
                  </div>

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-black ${
                      allChecked
                        ? "bg-[#064627] text-white"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                    }`}
                  >
                    {acceptedCount}/3
                  </div>
                </div>

                <div className="space-y-4">
                  {/* DECLARATION 1 */}

                  <Declaration
                    checked={checkbox1}
                    setChecked={setCheckbox1}
                    title="Plan Details Confirmation"
                    description="I have reviewed and understood the selected membership plan, family coverage, benefits, validity and applicable charges."
                  />

                  {/* DECLARATION 2 */}

                  <label
                    className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${
                      checkbox2
                        ? "border-emerald-500 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/20"
                        : "border-slate-200 hover:border-emerald-300 dark:border-slate-800"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checkbox2}
                      onChange={(e) => setCheckbox2(e.target.checked)}
                      className="sr-only"
                    />

                    <div
                      className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${
                        checkbox2
                          ? "border-[#064627] bg-[#064627] text-white"
                          : "border-slate-300 dark:border-slate-600"
                      }`}
                    >
                      {checkbox2 && <Check className="h-4 w-4 stroke-3" />}
                    </div>

                    <div>
                      <h3 className="font-black text-slate-900 dark:text-white">
                        Cancellation & Refund Policy
                      </h3>

                      <p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-300 sm:text-sm">
                        I understand and agree that once the membership plan is
                        issued, it cannot be cancelled or refunded.
                      </p>

                      <Link
                        href="/cancellation-and-refund-policy"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-2 inline-block text-xs font-black text-[#9a6d00] underline underline-offset-4 dark:text-[#e6bd50]"
                      >
                        Read Cancellation & Refund Policy
                      </Link>
                    </div>
                  </label>

                  {/* DECLARATION 3 */}

                  <Declaration
                    checked={checkbox3}
                    setChecked={setCheckbox3}
                    title="Payment Authorization"
                    description="I confirm that the information provided is correct and I authorize payment for this membership plan."
                  />
                </div>

                {/* STATUS */}

                <div
                  className={`mt-5 flex items-start gap-3 rounded-xl border p-4 ${
                    allChecked
                      ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/20"
                      : "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20"
                  }`}
                >
                  {allChecked ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                  ) : (
                    <Info className="h-5 w-5 shrink-0 text-amber-600" />
                  )}

                  <p
                    className={`text-xs font-bold leading-5 ${
                      allChecked
                        ? "text-emerald-700 dark:text-emerald-300"
                        : "text-amber-700 dark:text-amber-300"
                    }`}
                  >
                    {allChecked
                      ? "All declarations accepted. Click Next to complete verification."
                      : `Please accept all declarations. ${acceptedCount} of 3 completed.`}
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT */}

            <div>
              <div className="sticky top-5 overflow-hidden rounded-3xl border border-[#dce9cf] bg-white shadow-lg dark:border-emerald-900 dark:bg-[#0d1d14]">
                <div className="bg-[#064627] p-5 text-white">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6" />

                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-emerald-200">
                        Secure Checkout
                      </p>

                      <h2 className="font-black">Payment Summary</h2>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="mb-5 rounded-2xl bg-[#f4faf1] p-4 dark:bg-emerald-950/20">
                    <p className="text-[9px] font-black uppercase text-slate-400">
                      Selected Plan
                    </p>

                    <p className="mt-1 text-lg font-black text-[#064627] dark:text-emerald-300">
                      {plan.planName || "No plan selected"}
                    </p>

                    {plan.family && (
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                        Family Coverage: {plan.family}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between gap-4 text-sm">
                      <span className="font-semibold text-slate-500 dark:text-slate-300">
                        Membership Fee
                      </span>

                      <span className="font-black text-slate-900 dark:text-white">
                        {formatPrice(membershipPrice)}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4 text-sm">
                      <span className="font-semibold text-slate-500 dark:text-slate-300">
                        GST (18%)
                      </span>

                      <span className="font-black text-slate-900 dark:text-white">
                        {formatPrice(gstAmount)}
                      </span>
                    </div>

                    <div className="border-t border-dashed border-slate-200 pt-4 dark:border-slate-700">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <p className="text-[9px] font-black uppercase text-slate-400">
                            Total Payable
                          </p>

                          <p className="text-[10px] text-slate-400">
                            Including GST
                          </p>
                        </div>

                        <p className="text-2xl font-black text-[#064627] dark:text-emerald-300">
                          {formatPrice(totalAmount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* NEXT / PAYMENT */}

                  {!paymentEnabled ? (
                    <button
                      type="button"
                      disabled={
                        !allChecked || !plan.planId || membershipPrice <= 0
                      }
                      onClick={handlePayment}
                      className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 text-sm font-black transition-all ${
                        allChecked && plan.planId && membershipPrice > 0
                          ? "bg-[#064627] text-white shadow-lg hover:-translate-y-0.5 hover:bg-[#095936]"
                          : "cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                      }`}
                    >
                      <ChevronRight className="h-5 w-5" />

                      {allChecked ? "Next" : `Accept ${3 - acceptedCount} More`}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={proceedToPayment}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#064627] px-5 py-4 text-sm font-black text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#095936]"
                    >
                      <CreditCard className="h-5 w-5" />
                      Proceed to Payment
                    </button>
                  )}

                  <p className="mt-3 text-center text-[10px] font-semibold leading-5 text-slate-400">
                    {paymentEnabled
                      ? "Verification completed successfully."
                      : "Verification is required before payment."}
                  </p>

                  <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#f4faf1] px-3 py-3 dark:bg-emerald-950/20">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-[#17643d] dark:text-emerald-400" />

                    <p className="text-center text-[10px] font-bold text-slate-500 dark:text-slate-300">
                      Secure verification before payment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* =====================================================
          LOGIN POPUP
      ===================================================== */}

      {showLoginPopup && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={() => setShowLoginPopup(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-[#dce9cf] bg-white shadow-2xl dark:border-emerald-900 dark:bg-[#0d1d14]"
          >
            <button
              type="button"
              onClick={() => setShowLoginPopup(false)}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="bg-[#064627] px-6 pb-8 pt-7 text-center text-white">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                <LockKeyhole className="h-8 w-8" />
              </div>

              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-200">
                Account Required
              </p>

              <h2 className="mt-2 text-2xl font-black">Login Required</h2>

              <p className="mx-auto mt-2 max-w-xs text-xs font-medium leading-5 text-emerald-100 sm:text-sm">
                Please login or create your account before continuing.
              </p>
            </div>

            <div className="p-6">
              <div className="mb-5 rounded-2xl border border-emerald-100 bg-[#f4faf1] p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Selected Plan
                </p>

                <div className="mt-2 flex items-end justify-between gap-3">
                  <div>
                    <p className="font-black text-[#064627] dark:text-emerald-300">
                      {plan.planName}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-300">
                      Family: {plan.family}
                    </p>
                  </div>

                  <p className="shrink-0 text-lg font-black text-[#9a6d00] dark:text-[#e6bd50]">
                    {formatPrice(totalAmount)}
                  </p>
                </div>
              </div>

              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />

                <p className="text-xs font-semibold leading-5 text-amber-800 dark:text-amber-300">
                  Login is required before verification and payment.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogin}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#064627] px-5 py-3.5 text-sm font-black text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#095936]"
              >
                <LogIn className="h-5 w-5" />
                Login to Continue
              </button>

              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />

                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Or
                </span>

                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
              </div>

              <button
                type="button"
                onClick={handleSignup}
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#064627] bg-white px-5 py-3.5 text-sm font-black text-[#064627] transition hover:bg-[#f0f8ea] dark:bg-[#0d1d14] dark:text-emerald-300"
              >
                <UserPlus className="h-5 w-5" />
                Create New Account
              </button>

              <button
                type="button"
                onClick={() => setShowLoginPopup(false)}
                className="mt-3 w-full rounded-full px-5 py-3 text-xs font-bold text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          VERIFICATION MODAL
      ===================================================== */}

      {showVerification && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center overflow-hidden bg-black/70 px-4 py-8 backdrop-blur-md">
          <div className="relative flex max-h-[calc(100vh-4rem)] w-full max-w-4xl flex-col overflow-hidden rounded-[30px] border border-[#dce9cf] bg-white shadow-2xl dark:border-emerald-900 dark:bg-[#0d1d14]">
            {/* HEADER */}

            <div className="flex items-center justify-between gap-4 bg-[#064627] px-5 py-5 text-white sm:px-7">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-200">
                  Verification Required
                </p>

                <h2 className="mt-1 text-xl font-black sm:text-2xl">
                  Complete Your Verification
                </h2>

                <p className="mt-1 text-xs text-emerald-100">
                  Choose any one verification method.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  resetVideoVerification();
                  setShowVerification(false);
                }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 overflow-y-auto p-5 overscroll-contain sm:p-7">
              {/* METHOD SELECTION */}

              {!verificationMethod && (
                <>
                  <div className="grid gap-5 md:grid-cols-2">
                    {/* VIDEO */}

                    <button
                      type="button"
                      onClick={() => setVerificationMethod("video")}
                      className="group rounded-3xl border-2 border-emerald-100 bg-[#f7fbf5] p-6 text-left transition hover:-translate-y-1 hover:border-[#064627] hover:shadow-xl dark:border-emerald-900 dark:bg-[#102218]"
                    >
                      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#064627] text-white">
                        <Video className="h-7 w-7" />
                      </div>

                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        Capture Yourself
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300">
                        Record a short video while reading the required terms
                        clearly.
                      </p>

                      <div className="mt-5 flex items-center gap-2 text-xs font-black text-[#064627] dark:text-emerald-300">
                        Start Video Verification
                        <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </div>
                    </button>

                    {/* CALL */}

                    <button
                      type="button"
                      onClick={() => setVerificationMethod("call")}
                      className="group rounded-3xl border-2 border-[#c89416]/20 bg-[#fffaf0] p-6 text-left transition hover:-translate-y-1 hover:border-[#c89416] hover:shadow-xl dark:border-[#c89416]/30 dark:bg-[#241d0d]"
                    >
                      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c89416] text-white">
                        <PhoneCall className="h-7 w-7" />
                      </div>

                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        Call Support
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300">
                        Our support team will call you and verbally confirm the
                        required terms.
                      </p>

                      <div className="mt-5 flex items-center gap-2 text-xs font-black text-[#9a6d00] dark:text-[#e6bd50]">
                        Verify by Support Call
                        <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </div>
                    </button>
                  </div>

                  <div className="mt-5 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                    <p className="text-xs font-semibold leading-5 text-blue-800 dark:text-blue-300">
                      Only one verification method is required. Payment will
                      become available after successful verification.
                    </p>
                  </div>
                </>
              )}

              {/* VIDEO VERIFICATION */}

              {verificationMethod === "video" && (
                <div>
                  {/* TOP */}

                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        Capture Yourself
                      </h3>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                        Your voice and video will be recorded together.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={resetVideoVerification}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-black text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Reset
                    </button>
                  </div>

                  {/* CAMERA */}

                  <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
                    <div className="overflow-hidden rounded-3xl bg-black">
                      <div className="relative aspect-video">
                        <video
                          ref={videoRef}
                          autoPlay
                          muted
                          playsInline
                          className="h-full w-full object-cover"
                        />

                        {!deviceStatus.cameraPermission && (
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 p-6 text-center">
                            <div>
                              <Camera className="mx-auto mb-3 h-10 w-10 text-white" />

                              <p className="text-sm font-black text-white">
                                Camera Preview
                              </p>

                              <p className="mt-1 text-xs text-slate-300">
                                Click Start Recording to enable camera and
                                microphone.
                              </p>
                            </div>
                          </div>
                        )}

                        {isRecording && (
                          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-red-600 px-3 py-2 text-xs font-black text-white shadow-lg">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                            REC {formatRecordingTime(recordingTime)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* TERMS */}

                    <div className="rounded-3xl border border-emerald-100 bg-[#f7fbf5] p-5 dark:border-emerald-900 dark:bg-[#102218]">
                      <div className="mb-4 flex items-center gap-2">
                        <FileCheck2 className="h-5 w-5 text-[#17643d]" />

                        <h4 className="font-black text-slate-900 dark:text-white">
                          Please read clearly
                        </h4>
                      </div>

                      <div className="space-y-3">
                        {VERIFICATION_TERMS.map((term, index) => (
                          <div
                            key={term}
                            className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-[#0d1d14]"
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#064627] text-[10px] font-black text-white">
                              {index + 1}
                            </span>

                            <p className="text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300">
                              {term}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* DEVICE STATUS */}

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <DeviceCard
                      icon={Camera}
                      title="Camera"
                      available={deviceStatus.cameraAvailable}
                      permission={deviceStatus.cameraPermission}
                    />

                    <DeviceCard
                      icon={Mic}
                      title="Microphone"
                      available={deviceStatus.microphoneAvailable}
                      permission={deviceStatus.microphonePermission}
                    />
                  </div>

                  {/* ERRORS */}

                  {(videoError || speechError) && (
                    <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20">
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                      <div>
                        <p className="text-sm font-black text-red-800 dark:text-red-300">
                          Verification issue
                        </p>

                        <p className="mt-1 text-xs font-semibold leading-5 text-red-700 dark:text-red-400">
                          {videoError || speechError}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* SPEECH */}

                  {isRecording && (
                    <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
                      <div className="flex items-center gap-3">
                        <Volume2 className="h-5 w-5 text-blue-600" />

                        <div>
                          <p className="text-xs font-black text-blue-900 dark:text-blue-300">
                            Voice capture active
                          </p>

                          <p className="text-[11px] font-semibold text-blue-700 dark:text-blue-400">
                            Please read all terms slowly and clearly.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TRANSCRIPT */}

                  {spokenText && (
                    <div className="mt-5 max-h-40 overflow-y-auto overscroll-contain rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                        Voice Transcript
                      </p>

                      <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                        {spokenText}
                      </p>
                    </div>
                  )}

                  {/* SUCCESS */}

                  {(verificationStatus === "success" ||
                    verificationStatus === "saved" ||
                    verificationStatus === "saving") && (
                    <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
                      <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" />

                      <div>
                        <p className="font-black text-emerald-800 dark:text-emerald-300">
                          {verificationStatus === "saved"
                            ? "Video verification saved"
                            : verificationStatus === "saving"
                              ? "Saving video verification"
                              : "Video verification completed"}
                        </p>

                        <p className="mt-1 text-xs font-semibold leading-5 text-emerald-700 dark:text-emerald-400">
                          {verificationStatus === "saved"
                            ? `Your verification is securely stored${savedVideoUrl ? " in Cloudinary" : ""}. You can now proceed to payment.`
                            : verificationStatus === "saving"
                              ? "Please wait while your video and audio are securely stored."
                              : "Your video and audio verification has been completed. Save it to continue."}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* CONTROLS */}

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    {!isRecording && verificationStatus !== "success" && (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#064627] px-5 py-4 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#095936]"
                      >
                        <Video className="h-5 w-5" />
                        Start Recording
                      </button>
                    )}

                    {isRecording && (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-4 text-sm font-black text-white shadow-lg transition hover:bg-red-700"
                      >
                        <Square className="h-4 w-4 fill-current" />
                        Stop Recording
                      </button>
                    )}

                    {verificationStatus === "success" && (
                      <>
                        <button
                          type="button"
                          onClick={saveVideoVerification}
                          disabled={isSavingVideo}
                          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#064627] px-5 py-4 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#095936] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isSavingVideo ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Save className="h-5 w-5" />
                          )}
                          {isSavingVideo ? "Saving..." : "Save"}
                        </button>

                        <button
                          type="button"
                          onClick={resetVideoVerification}
                          disabled={isSavingVideo}
                          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-4 text-sm font-black text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <X className="h-5 w-5" />
                          Cancel
                        </button>
                      </>
                    )}

                    {verificationStatus === "saved" && (
                      <button
                        type="button"
                        onClick={() => {
                          handleVideoSuccess();
                        }}
                        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#064627] px-5 py-4 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#095936]"
                      >
                        <CreditCard className="h-5 w-5" />
                        Proceed to Payment
                      </button>
                    )}
                  </div>

                  {/* BACK METHOD */}

                  <button
                    type="button"
                    onClick={() => {
                      resetVideoVerification();
                      setVerificationMethod(null);
                    }}
                    className="mx-auto mt-4 flex items-center gap-2 text-xs font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Choose another verification method
                  </button>
                </div>
              )}

              {/* CALL VERIFICATION */}

              {verificationMethod === "call" && (
                <div>
                  <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#c89416] text-white">
                      <PhoneCall className="h-8 w-8" />
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                      Verify by Support Call
                    </h3>

                    <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-300">
                      Enter your details. Our support team will call you and
                      read the required terms. You must confirm by saying
                      <strong> YES </strong>
                      if you agree.
                    </p>
                  </div>

                  {/* CALL PROCESS */}

                  <div className="grid gap-4 md:grid-cols-3">
                    <CallStep
                      number="1"
                      icon={Phone}
                      title="Enter Details"
                      text="Provide the name and number on which our support team should call."
                    />

                    <CallStep
                      number="2"
                      icon={PhoneCall}
                      title="Confirm Terms"
                      text="Our team will explain the required terms and ask for YES or NO."
                    />

                    <CallStep
                      number="3"
                      icon={CheckCircle2}
                      title="Team Approval"
                      text="The recording will be reviewed before payment access is enabled."
                    />
                  </div>

                  {/* CUSTOMER NAME AND PHONE INPUT FORM */}

                  <div className="mx-auto mt-6 max-w-xl rounded-3xl border border-[#c89416]/30 bg-[#fffaf0] p-5 dark:bg-[#241d0d]">
                    {/* CUSTOMER NAME FIX */}
                    <div className="mb-4">
                      <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                        Customer Name
                      </label>
                      <div className="mt-2 flex overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#0d1d14]">
                        <input
                          type="text"
                          value={supportName}
                          onChange={(e) => setSupportName(e.target.value)}
                          placeholder="Enter your full name"
                          disabled={callStatus === "pending"}
                          className="w-full bg-transparent px-4 py-4 text-sm font-bold text-slate-900 outline-none dark:text-white"
                        />
                      </div>
                    </div>

                    {/* PHONE NUMBER FIX */}
                    <div>
                      <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                        Phone Number
                      </label>
                      <div className="mt-2 flex overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#0d1d14]">
                        <div className="flex items-center border-r border-slate-200 px-4 text-sm font-black text-slate-500 dark:border-slate-700">
                          +91
                        </div>
                        <input
                          type="tel"
                          value={supportPhone}
                          onChange={(e) =>
                            setSupportPhone(e.target.value.replace(/\D/g, ""))
                          }
                          maxLength={10}
                          placeholder="9876543210"
                          disabled={callStatus === "pending"}
                          className="w-full bg-transparent px-4 py-4 text-sm font-bold text-slate-900 outline-none dark:text-white"
                        />
                      </div>
                    </div>

                    {callMessage && (
                      <div
                        className={`mt-4 rounded-xl p-3 text-xs font-bold ${
                          callStatus === "approved"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300"
                            : callStatus === "rejected"
                              ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-300"
                              : "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-300"
                        }`}
                      >
                        {callMessage}
                      </div>
                    )}

                    {callStatus !== "approved" && (
                      <button
                        type="button"
                        disabled={callStatus === "requesting"}
                        onClick={requestSupportCall}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#c89416] px-5 py-4 text-sm font-black text-white shadow-lg transition hover:bg-[#ad7e0e] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {callStatus === "requesting" ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Requesting Call...
                          </>
                        ) : callStatus === "pending" ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Waiting for Verification
                          </>
                        ) : (
                          <>
                            <PhoneCall className="h-5 w-5" />
                            Request Support Call
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* APPROVED */}

                  {callStatus === "approved" && (
                    <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/20">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-7 w-7 text-emerald-600" />

                        <div>
                          <h4 className="font-black text-emerald-800 dark:text-emerald-300">
                            Verification Approved
                          </h4>

                          <p className="mt-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                            Your support-call verification has been approved.
                            Payment is now available.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={proceedToPayment}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#064627] px-5 py-4 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#095936]"
                      >
                        <CreditCard className="h-5 w-5" />
                        Proceed to Payment
                      </button>
                    </div>
                  )}

                  {/* BACK */}

                  <button
                    type="button"
                    onClick={() => setVerificationMethod(null)}
                    disabled={callStatus === "pending"}
                    className="mx-auto mt-5 flex items-center gap-2 text-xs font-black text-slate-400 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-slate-200"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Choose another verification method
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* =========================================================
   DECLARATION COMPONENT
========================================================= */

function Declaration({
  checked,
  setChecked,
  title,
  description,
}: {
  checked: boolean;
  setChecked: (value: boolean) => void;
  title: string;
  description: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${
        checked
          ? "border-emerald-500 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/20"
          : "border-slate-200 hover:border-emerald-300 dark:border-slate-800"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="sr-only"
      />

      <div
        className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${
          checked
            ? "border-[#064627] bg-[#064627] text-white"
            : "border-slate-300 dark:border-slate-600"
        }`}
      >
        {checked && <Check className="h-4 w-4 stroke-3" />}
      </div>

      <div>
        <h3 className="font-black text-slate-900 dark:text-white">{title}</h3>

        <p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-300 sm:text-sm">
          {description}
        </p>
      </div>
    </label>
  );
}

/* =========================================================
   DEVICE CARD
========================================================= */

function DeviceCard({
  icon: Icon,
  title,
  available,
  permission,
}: {
  icon: any;
  title: string;
  available: boolean;
  permission: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0d1d14]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf5e5] text-[#17643d] dark:bg-emerald-950 dark:text-emerald-300">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm font-black text-slate-900 dark:text-white">
            {title}
          </p>

          <p className="text-[10px] font-semibold text-slate-400">
            {available
              ? permission
                ? "Ready"
                : "Permission required"
              : "Not available"}
          </p>
        </div>
      </div>

      {available && permission ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
      ) : (
        <AlertTriangle className="h-5 w-5 text-amber-500" />
      )}
    </div>
  );
}

/* =========================================================
   CALL STEP
========================================================= */

function CallStep({
  number,
  icon: Icon,
  title,
  text,
}: {
  number: string;
  icon: any;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0d1d14]">
      <div className="flex items-center gap-3">
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#064627] text-white">
          <Icon className="h-5 w-5" />

          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#c89416] text-[9px] font-black text-white">
            {number}
          </span>
        </div>

        <h4 className="font-black text-slate-900 dark:text-white">{title}</h4>
      </div>

      <p className="mt-3 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-300">
        {text}
      </p>
    </div>
  );
}
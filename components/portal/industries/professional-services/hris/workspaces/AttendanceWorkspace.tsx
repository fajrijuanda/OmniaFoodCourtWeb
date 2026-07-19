"use client";
import { useState, useEffect, useMemo } from "react";
import { CheckCircle2, Camera, MapPin, XCircle, ShieldCheck, UserRound, ClipboardCheck, LogIn, LogOut, Loader2 } from "lucide-react";
import { PortalDataTable } from "@/components/portal/ui";
import { apiFetch, OfflineQueuedError } from "@/lib/api";
import { AnimatePresence, motion } from "framer-motion";
import { takeSelfiePhoto, getCurrentPosition } from "@/lib/mobile/nativeHardware";

type AttendanceAction = "clock-in" | "clock-out";

export function AttendanceWorkspace({ syncStatus, onSync }: { syncStatus: string; onSync: () => void }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [attendanceAction, setAttendanceAction] = useState<AttendanceAction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCapturingLocation, setIsCapturingLocation] = useState(false);

  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locError, setLocError] = useState("");
  const [apiError, setApiError] = useState("");
  const [faceProfile, setFaceProfile] = useState<any>(null);
  const [challenge, setChallenge] = useState<{ employeeId: string; challenge: string; expiresAt: string } | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const fetchLogs = () => {
    setLoading(true);
    return apiFetch("/api/tenant/hris/attendance")
      .then((data) => setLogs(data as any[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const fetchFaceProfile = () => {
    return apiFetch("/api/tenant/hris/attendance/face-profile")
      .then((data) => setFaceProfile(data))
      .catch((error) => setApiError(error.message));
  };

  useEffect(() => {
    fetchLogs();
    fetchFaceProfile();
  }, []);

  const employeeLogs = useMemo(() => {
    const employeeId = faceProfile?.employee?.id;
    return employeeId ? logs.filter((log) => log.employee?.id === employeeId || log.employeeId === employeeId) : logs;
  }, [faceProfile?.employee?.id, logs]);

  const todayLog = employeeLogs.find((log) => Boolean(log.clockInAt));
  const openLog = employeeLogs.find((log) => Boolean(log.clockInAt) && !log.clockOutAt);
  const canClockIn = !todayLog;
  const canClockOut = Boolean(openLog);
  const actionLabel = attendanceAction === "clock-out" ? "Clock Out" : "Clock In";

  const openAttendanceCamera = async (action: AttendanceAction) => {
    if (action === "clock-in" && !canClockIn) return;
    if (action === "clock-out" && !canClockOut) return;

    setIsActionSheetOpen(false);
    setAttendanceAction(action);
    setIsSubmitting(false);
    setApiError("");
    setChallenge(null);
    setLocation(null);
    setLocError("");
    setCapturedPhoto(null);
    setIsCapturingLocation(true);

    // Fetch liveness challenge
    try {
      const liveChallenge = await apiFetch<{ employeeId: string; challenge: string; expiresAt: string }>("/api/tenant/hris/attendance/liveness-challenge", {
        method: "POST",
        body: JSON.stringify({ employeeId: faceProfile?.employee?.id })
      });
      setChallenge(liveChallenge);
    } catch (error: any) {
      setApiError(error.message || "Failed to create liveness challenge.");
    }

    // Dapatkan lokasi GPS via native Capacitor / browser fallback
    try {
      const pos = await getCurrentPosition();
      setLocation(pos);
    } catch (error: any) {
      setLocError(error.message || "Gagal mendapatkan lokasi.");
    } finally {
      setIsCapturingLocation(false);
    }
  };

  const closeAttendanceCamera = () => {
    setAttendanceAction(null);
    setIsSubmitting(false);
    setCapturedPhoto(null);
  };

  const captureAndSubmitAttendance = async () => {
    if (!challenge || !attendanceAction) return;
    setIsSubmitting(true);
    setApiError("");
    try {
      // Ambil foto selfie via native Camera plugin atau browser fallback
      const { dataUrl: photoUrl } = await takeSelfiePhoto();
      setCapturedPhoto(photoUrl);

      // Ambil foto kedua dan ketiga untuk liveness check
      const { dataUrl: frame2 } = await takeSelfiePhoto();
      const { dataUrl: frame3 } = await takeSelfiePhoto();

      await apiFetch(`/api/tenant/hris/attendance/${attendanceAction}-selfie`, {
        method: "POST",
        allowOfflineQueue: true,
        headers: {
          "Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify({
          employeeId: challenge.employeeId,
          latitude: location?.lat,
          longitude: location?.lng,
          photoUrl,
          livenessChallenge: challenge.challenge,
          livenessFrames: [frame2, frame3],
          deviceInfo: navigator.userAgent
        })
      });
      closeAttendanceCamera();
      await Promise.all([fetchLogs(), fetchFaceProfile()]);
      onSync();
    } catch (error: any) {
      if (error instanceof OfflineQueuedError || error.name === "OfflineQueuedError") {
        alert("Koneksi terputus. Absensi disimpan secara offline dan akan dikirim saat online.");
        closeAttendanceCamera();
      } else {
        setApiError(error.message || `Failed to ${actionLabel.toLowerCase()}.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const enrollFace = async () => {
    setIsSubmitting(true);
    setApiError("");
    try {
      const { dataUrl: photoUrl } = await takeSelfiePhoto();
      setCapturedPhoto(photoUrl);

      const enrolled = await apiFetch("/api/tenant/hris/attendance/face-profile/enroll", {
        method: "POST",
        body: JSON.stringify({
          employeeId: faceProfile?.employee?.id,
          photoUrl
        })
      });
      setFaceProfile(enrolled);
    } catch (error: any) {
      setApiError(error.message || "Failed to enroll face profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-black text-[#172033] sm:text-2xl">Attendance</h2>
          <p className="mt-1 text-xs font-bold text-slate-500 sm:text-sm">{syncStatus}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        {loading ? <div className="p-4 text-center">Loading...</div> : (
          <PortalDataTable
            headerAction={
              <button onClick={() => setIsActionSheetOpen(true)} className="inline-flex shrink-0 w-fit items-center gap-1.5 lg:gap-2 rounded-full bg-[var(--portal-primary)] px-3 py-2 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 text-[11px] lg:text-sm font-black text-[var(--portal-on-primary)]" type="button">
                <ClipboardCheck className="h-4 w-4 lg:h-5 lg:w-5" />
                <span className="hidden sm:inline">Attendance Action</span>
              </button>
            }
            rows={logs}
            rowKey={(row) => row.id}
            searchPlaceholder="Cari attendance..."
            getSearchText={(row) => `${row.employee?.fullName}`}
            gridTemplateColumns="1fr 0.9fr 0.6fr 0.7fr 0.6fr"
            columns={[
              { label: "Employee", render: (row) => <p className="text-sm font-black text-[#172033] sm:text-base">{row.employee?.fullName}</p> },
              { label: "In", render: (row) => <p className="text-xs font-black text-[#172033] sm:text-sm">{new Date(row.clockInAt).toLocaleTimeString()}</p> },
              { label: "Out", render: (row) => <p className="text-xs font-bold text-slate-500 sm:text-sm">{row.clockOutAt ? new Date(row.clockOutAt).toLocaleTimeString() : "-"}</p> },
              { label: "Status", render: (row) => <span className="w-fit rounded-full bg-slate-50 px-3 py-1 text-xs font-black text-slate-600">{row.status}</span> },
              { label: "AI Valid", render: (row) => (row.isFaceMatched && row.isLivenessVerified ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <span className="text-xs text-slate-400">N/A</span>) }
            ]}
          />
        )}
        <div className="rounded-[22px] bg-slate-50 p-4 sm:p-5">
          <p className="text-sm font-black text-[#172033] sm:text-base">Today summary</p>
          <div className="mt-4 grid gap-2">
            {[`${logs.length} present`, `${logs.filter((log) => log.isFaceMatched && log.isLivenessVerified).length} AI verified`].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-[14px] bg-white px-3 py-2.5 text-xs font-black sm:rounded-[16px] sm:px-4 sm:py-3 sm:text-sm">
                {item}<CheckCircle2 className="h-4 w-4 text-[var(--portal-primary)]" />
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-[16px] bg-white p-3">
            <div className="flex items-center gap-2 text-xs font-black text-[#172033]">
              <UserRound className="h-4 w-4 text-[var(--portal-primary)]" />
              {faceProfile?.employee?.fullName ?? "Employee profile"}
            </div>
            <p className={`mt-2 text-xs font-bold ${faceProfile?.enrolled ? "text-emerald-600" : "text-amber-600"}`}>
              {faceProfile?.enrolled ? "Face baseline enrolled" : "Face baseline belum dibuat"}
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isActionSheetOpen ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/45 p-3 backdrop-blur-sm sm:items-center">
            <button className="absolute inset-0" type="button" aria-label="Tutup pilihan attendance" onClick={() => setIsActionSheetOpen(false)} />
            <motion.div initial={{ y: 24, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 24, opacity: 0, scale: 0.98 }} className="relative w-full max-w-md rounded-[24px] bg-white p-4 shadow-2xl sm:p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--portal-primary)]">Attendance</p>
                  <h3 className="mt-1 text-xl font-black text-[#172033]">Pilih Aksi</h3>
                </div>
                <button onClick={() => setIsActionSheetOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500" type="button">
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              <div className="grid gap-2">
                <button onClick={() => openAttendanceCamera("clock-in")} disabled={!canClockIn} className="flex items-center gap-3 rounded-[18px] border border-slate-100 bg-slate-50 p-4 text-left transition enabled:hover:border-orange-200 enabled:hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-55" type="button">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-[var(--portal-primary)] text-white"><LogIn className="h-5 w-5" /></span>
                  <span>
                    <span className="block text-sm font-black text-[#172033]">Clock In</span>
                    <span className="mt-0.5 block text-xs font-bold text-slate-500">{canClockIn ? "Mulai jam kerja hari ini." : "Sudah clock in, lakukan clock out."}</span>
                  </span>
                </button>
                <button onClick={() => openAttendanceCamera("clock-out")} disabled={!canClockOut} className="flex items-center gap-3 rounded-[18px] border border-slate-100 bg-slate-50 p-4 text-left transition enabled:hover:border-orange-200 enabled:hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-55" type="button">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-[#172033] text-white"><LogOut className="h-5 w-5" /></span>
                  <span>
                    <span className="block text-sm font-black text-[#172033]">Clock Out</span>
                    <span className="mt-0.5 block text-xs font-bold text-slate-500">{canClockOut ? "Akhiri jam kerja hari ini." : "Clock in dulu sebelum clock out."}</span>
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {attendanceAction ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} className="w-full rounded-t-[28px] bg-white p-5 shadow-2xl sm:max-w-md sm:rounded-[28px] sm:p-6">
              {/* Header */}
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--portal-primary)]">Live Attendance</p>
                  <h3 className="mt-0.5 text-xl font-black text-slate-900">{actionLabel}</h3>
                </div>
                <button onClick={closeAttendanceCamera} className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500" type="button"><XCircle className="h-5 w-5" /></button>
              </div>

              {/* Preview foto jika sudah diambil */}
              {capturedPhoto ? (
                <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-900">
                  <img src={capturedPhoto} alt="Selfie preview" className="h-full w-full object-cover" />
                  <div className="absolute bottom-3 left-3 right-3 rounded-[14px] bg-white/90 p-2 text-center text-xs font-black text-slate-800">
                    ✅ Foto berhasil diambil
                  </div>
                </div>
              ) : (
                <div className="mb-4 flex aspect-[4/3] items-center justify-center rounded-2xl bg-slate-100">
                  <div className="text-center">
                    <Camera className="mx-auto h-10 w-10 text-slate-400" />
                    <p className="mt-2 text-sm font-bold text-slate-500">Ketuk tombol untuk mengambil selfie</p>
                  </div>
                </div>
              )}

              {/* Status Liveness Challenge */}
              {challenge && (
                <div className="mb-3 rounded-[14px] border border-orange-100 bg-orange-50 px-4 py-2.5 text-center text-xs font-black text-orange-700">
                  🎯 Challenge: {challenge.challenge}
                </div>
              )}

              {/* Status wajah */}
              <div className="mb-3 flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-bold text-slate-600">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>{faceProfile?.enrolled ? `Baseline selfie tersimpan. Siap ${actionLabel}.` : `Belum ada enrollment selfie — gunakan tombol Enroll.`}</span>
              </div>

              {/* Status GPS */}
              <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-bold">
                {isCapturingLocation ? (
                  <><Loader2 className="h-4 w-4 animate-spin text-slate-400" /><span className="text-slate-500">Mendapatkan lokasi...</span></>
                ) : locError ? (
                  <><MapPin className="h-4 w-4 text-red-500" /><span className="text-red-500">{locError}</span></>
                ) : location ? (
                  <><MapPin className="h-4 w-4 text-emerald-500" /><span className="text-emerald-700">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span></>
                ) : (
                  <><MapPin className="h-4 w-4 text-slate-400" /><span className="text-slate-400">Lokasi belum didapatkan</span></>
                )}
              </div>

              {apiError ? (
                <div className="mb-3 rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-bold text-red-600">{apiError}</div>
              ) : null}

              <div className="grid gap-2 sm:grid-cols-2">
                <button onClick={enrollFace} disabled={isSubmitting} className="flex items-center justify-center gap-2 rounded-full border border-slate-200 py-3 text-sm font-black text-slate-700 disabled:cursor-not-allowed disabled:opacity-50" type="button">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserRound className="h-4 w-4" />}
                  Enroll Wajah
                </button>
                <button onClick={captureAndSubmitAttendance} disabled={!location || !!locError || !challenge || !faceProfile?.enrolled || isSubmitting} className="flex items-center justify-center gap-2 rounded-full bg-[var(--portal-primary)] py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-50" type="button">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                  {isSubmitting ? "Memproses..." : actionLabel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

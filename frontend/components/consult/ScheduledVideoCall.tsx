"use client";

import { useEffect, useRef, useState } from "react";

type RoomInfo = {
  phase: "early" | "live" | "ended" | "closed";
  role: "guest" | "host";
  title?: string;
  bookedLabel: string;
  startsAt: string;
  endsAt: string;
  opensAt: string;
  videoReady: boolean;
  appId?: number;
  token?: string;
  roomId?: string;
  userId?: string;
  userName?: string;
};

function deviceLabel(startsAt: string, endsAt: string) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "";
  const date = start.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const hm = (value: Date) => value.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${date}, ${hm(start)}–${hm(end)}`;
}

export function ScheduledVideoCall({
  bookingId,
  roomKey,
}: {
  bookingId: string;
  roomKey: string;
}) {
  const [info, setInfo] = useState<RoomInfo | null>(null);
  const [error, setError] = useState("");
  const [callError, setCallError] = useState("");
  const container = useRef<HTMLDivElement>(null);
  const infoRef = useRef<RoomInfo | null>(null);
  infoRef.current = info;

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ id: bookingId });
    if (roomKey) params.set("k", roomKey);

    async function load() {
      try {
        const response = await fetch(`/api/consultation/room?${params}`, { credentials: "include", cache: "no-store" });
        const data = (await response.json()) as RoomInfo & { message?: string };
        if (cancelled) return;
        if (!response.ok) {
          setInfo(null);
          setError(data.message || "This video room could not be opened.");
          return;
        }
        setError("");
        setInfo(data);
      } catch {
        if (!cancelled) setError("This video room could not be opened.");
      }
    }

    void load();
    const timer = window.setInterval(() => {
      const phase = infoRef.current?.phase;
      if (cancelled || (phase && phase !== "early")) return;
      void load();
    }, 15000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [bookingId, roomKey]);

  const token = info?.phase === "live" && info.videoReady ? info.token || "" : "";

  useEffect(() => {
    const current = infoRef.current;
    if (!token || !current?.appId || !current.roomId || !current.userId) return;
    const session = {
      appId: current.appId,
      token,
      roomId: current.roomId,
      userId: current.userId,
      userName: current.userName,
    };
    let cancelled = false;
    let room: import("@zegocloud/zego-uikit-prebuilt").ZegoUIKitPrebuilt | null = null;
    document.body.dataset.juCall = "1";

    (async () => {
      try {
        const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");
        if (cancelled || !container.current) return;
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
          session.appId,
          session.token,
          session.roomId,
          session.userId,
          session.userName,
        );
        room = ZegoUIKitPrebuilt.create(kitToken);
        room.joinRoom({
          container: container.current,
          maxUsers: 2,
          sharedLinks: [],
          showPreJoinView: true,
          showRoomDetailsButton: false,
          showLeavingView: true,
          turnOnCameraWhenJoining: true,
          turnOnMicrophoneWhenJoining: true,
          preJoinViewConfig: { title: "Join your consultation" },
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
            config: { role: ZegoUIKitPrebuilt.Host },
          },
        });
      } catch {
        if (!cancelled) setCallError("The video caller could not start in this browser.");
      }
    })();

    return () => {
      cancelled = true;
      delete document.body.dataset.juCall;
      try {
        room?.destroy();
      } catch {
        /* The kit may already have left the room. */
      }
    };
  }, [token]);

  if (error) {
    return (
      <section className="mx-auto max-w-xl px-5 py-16">
        <div className="glass-card rounded-3xl p-6">
          <h1 className="font-serif text-[40px] font-medium leading-[0.95] tracking-[-0.03em] text-on-surface sm:text-[52px]">Video consultation</h1>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-on-surface md:text-base">{error}</p>
        </div>
      </section>
    );
  }

  if (!info) {
    return (
      <section className="mx-auto max-w-xl px-5 py-16">
        <p className="text-sm text-on-surface-variant">Opening the consultation room…</p>
      </section>
    );
  }

  const onDevice = deviceLabel(info.startsAt, info.endsAt);
  const showDevice = onDevice && onDevice !== info.bookedLabel;
  const live = Boolean(token);

  if (live) {
    return (
      <section className="mx-auto w-full max-w-[1400px] px-4 pb-8">
        <p className="mb-3 text-sm text-on-surface-variant">
          {info.role === "host" ? "You are joining as the astrologer." : "You are joining your booked consultation."}{" "}
          {info.bookedLabel}
        </p>
        {callError ? <p className="mb-3 text-sm text-lotus">{callError}</p> : null}
        <div
          className="overflow-hidden rounded-3xl border border-[#EAD9B0] bg-[#1A1106]"
          style={{ height: "min(820px, calc(100dvh - 7rem))" }}
        >
          <div ref={container} className="h-full w-full" />
        </div>
      </section>
    );
  }

  const note =
    info.phase === "early"
      ? "The video room opens 10 minutes before this time. This page will open the camera when the room is ready."
      : info.phase === "ended"
        ? "This booked time has passed. The video room stays open only until 10 minutes after the slot."
        : info.phase === "closed"
          ? "This consultation is finished or cancelled, so the video room is closed."
          : "This time is open for the video call. The camera will start once video calling is connected on the server.";

  return (
    <section className="mx-auto max-w-xl px-5 py-16">
      <div className="glass-card rounded-3xl p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">Video consultation</p>
        <h1 className="mt-3 font-serif text-[40px] font-medium leading-[0.95] tracking-[-0.03em] text-on-surface sm:text-[52px]">{info.title || "Consultation"}</h1>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-on-surface md:text-base">{info.bookedLabel}</p>
        {showDevice ? (
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">On this device: {onDevice}</p>
        ) : null}
        <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">{note}</p>
        {info.role === "host" ? (
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">This link is for the astrologer.</p>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
            The astrologer joins from a separate link sent with the booking.
          </p>
        )}
      </div>
    </section>
  );
}

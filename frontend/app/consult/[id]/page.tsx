import type { Metadata } from "next";
import { ScheduledVideoCall } from "@/components/consult/ScheduledVideoCall";

export const metadata: Metadata = {
  title: "Video consultation",
  description: "Join a MaharshiOm consultation at the booked time.",
};

export default async function ConsultRoomPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ k?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const roomKey = /^[a-fA-F0-9]{32}$/.test(query.k || "") ? (query.k || "").toLowerCase() : "";
  return <ScheduledVideoCall bookingId={/^\d+$/.test(id) ? id : "0"} roomKey={roomKey} />;
}

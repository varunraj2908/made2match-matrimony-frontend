"use client";

import { useParams } from "next/navigation";
import Chat from "@/components/sections/Chat";

export default function ChatThreadPage() {
  const params = useParams<{ id: string }>();
  const idNum = Number(params?.id);
  return <Chat initialUserId={Number.isFinite(idNum) ? idNum : undefined} />;
}

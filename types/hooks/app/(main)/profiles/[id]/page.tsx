"use client";

import ProfileDetail from "@/components/sections/ProfileDetail";
import { useParams } from "next/navigation";

export default function ProfileDetailPage() {
  const params = useParams();
  const raw = params?.id;
  const id = Array.isArray(raw) ? raw[0] : raw;
  return <ProfileDetail id={id ?? ""} />;
}

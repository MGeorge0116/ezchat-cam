import * as React from "react";
import RoomShell from "@/app/room/RoomShell";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function RoomPage({ params }: PageProps) {
  const { username } = await params;
  return <RoomShell username={username} />;
}

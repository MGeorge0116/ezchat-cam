// app/my/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import MyRoomRedirectClient from "@/components/MyRoomRedirectClient";

export default function MyPage() {
  return <MyRoomRedirectClient />;
}

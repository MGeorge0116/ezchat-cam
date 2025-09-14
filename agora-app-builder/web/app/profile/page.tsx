// app/profile/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Server Component: keep this DOM-free so SSG is skipped.
import ProfileClient from "@/components/ProfileClient";

export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">My Profile</h1>
      <ProfileClient />
    </div>
  );
}

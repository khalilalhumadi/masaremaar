import { redirect } from "next/navigation";

// /admin → /admin/dashboard (middleware already handles unauthenticated redirect)
export default function AdminIndex() {
  redirect("/admin/dashboard");
}

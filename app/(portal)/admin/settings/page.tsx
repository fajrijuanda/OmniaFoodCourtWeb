import { redirect } from "next/navigation";

export default function AdminSettingsPage() {
  redirect("/portal/settings?role=developer");
}

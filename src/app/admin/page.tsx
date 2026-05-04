import { redirect } from "next/navigation";

/** 避免访问 /admin 出现 404，统一进入登录页 */
export default function AdminIndexPage() {
  redirect("/admin/login");
}

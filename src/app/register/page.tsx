import type { Metadata } from "next";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = {
  title: "注册",
  description: "创建 LT Magazine 账户，填写手机号、邮箱、年龄、性别、地区与职业。",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-12 md:px-6">
      <h1 className="font-display text-3xl font-bold">注册</h1>
      <p className="mt-2 text-sm text-muted">
        注册后需开通订阅即可阅读全文并生成「今日看版」。站点域名：ltmagazine.cn
      </p>
      <RegisterForm />
    </div>
  );
}

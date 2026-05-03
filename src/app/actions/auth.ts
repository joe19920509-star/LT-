"use server";

import bcrypt from "bcryptjs";
import { Gender } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const registerSchema = z.object({
  email: z.string().email("请输入有效邮箱"),
  password: z.string().min(8, "密码至少 8 位"),
  phone: z
    .string()
    .min(11, "请输入有效手机号")
    .regex(/^1[3-9]\d{9}$/, "请输入中国大陆手机号"),
  age: z.coerce.number().int().min(16).max(120),
  gender: z.enum(["male", "female", "other", "prefer_not"]),
  region: z.string().min(1, "请选择地区"),
  occupation: z.string().min(1, "请填写职业"),
});

export type RegisterState = { error?: string; ok?: boolean };

export async function registerAction(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone"),
    age: formData.get("age"),
    gender: formData.get("gender"),
    region: formData.get("region"),
    occupation: formData.get("occupation"),
  });
  if (!parsed.success) {
    const fe = parsed.error.flatten().fieldErrors;
    const first =
      fe.email?.[0] ??
      fe.phone?.[0] ??
      fe.password?.[0] ??
      fe.age?.[0] ??
      fe.gender?.[0] ??
      fe.region?.[0] ??
      fe.occupation?.[0] ??
      parsed.error.errors[0]?.message;
    return { error: first ?? "表单有误" };
  }
  const data = parsed.data;
  const exists = await prisma.user.findUnique({ where: { email: data.email } });
  if (exists) return { error: "该邮箱已注册" };

  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      phone: data.phone,
      age: data.age,
      gender: data.gender as Gender,
      region: data.region,
      occupation: data.occupation,
    },
  });

  const session = await getSession();
  session.userId = user.id;
  await session.save();
  return { ok: true };
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function loginAction(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "邮箱或密码错误" };
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) return { error: "邮箱或密码错误" };
  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!ok) return { error: "邮箱或密码错误" };
  const session = await getSession();
  session.userId = user.id;
  await session.save();
  return { ok: true };
}

export async function logoutAction() {
  const session = await getSession();
  session.destroy();
}

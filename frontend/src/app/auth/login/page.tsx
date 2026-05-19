import { LoginClient } from "@/features/auth/login-client";

export default async function LoginPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[]>> }) {
  const sp = (await searchParams) ?? {};
  const next = typeof sp.next === "string" ? sp.next : undefined;
  return <LoginClient nextUrl={next} />;
}

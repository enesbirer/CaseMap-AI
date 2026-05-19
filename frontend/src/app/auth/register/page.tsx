"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { me, register } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";

const schema = z.object({
  email: z.string().email("Geçerli bir e-posta girin"),
  password: z.string().min(8, "En az 8 karakter"),
});
type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const t = await register(values.email, values.password);
      setToken(t.access_token);
      const user = await me();
      setUser(user);
      return t;
    },
    onSuccess: () => {
      toast.success("Hesap oluşturuldu");
      router.replace("/app/dashboard");
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Kayıt Ol</CardTitle>
        <CardDescription>CaseMap AI hesabınızı oluşturun.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit((v) => mutation.mutate(v))} noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input id="email" type="email" placeholder="ornek@mail.com" {...form.register("email")} />
            {form.formState.errors.email?.message ? (
              <div className="text-xs text-danger">{form.formState.errors.email.message}</div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label>
            <div className="relative">
              <Input id="password" type={show ? "text" : "password"} {...form.register("password")} />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:bg-white/5 hover:text-foreground"
                aria-label={show ? "Şifreyi gizle" : "Şifreyi göster"}
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {form.formState.errors.password?.message ? (
              <div className="text-xs text-danger">{form.formState.errors.password.message}</div>
            ) : null}
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={mutation.isPending}>
            {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Kayıt Ol
          </Button>

          <div className="text-center text-xs text-muted-foreground">
            Zaten hesabın var mı?{" "}
            <Link href="/auth/login" className="text-foreground hover:underline">
              Giriş yap
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


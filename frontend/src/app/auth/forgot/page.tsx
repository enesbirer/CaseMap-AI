"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("Geçerli bir e-posta girin"),
});
type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Şifre Sıfırlama</CardTitle>
        <CardDescription>Bu sürümde şifre sıfırlama endpoint’i backend’de yok.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(() => toast.message("Şu an desteklenmiyor. Lütfen giriş sayfasına dönün."))}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input id="email" type="email" placeholder="ornek@mail.com" {...form.register("email")} />
            {form.formState.errors.email?.message ? (
              <div className="text-xs text-danger">{form.formState.errors.email.message}</div>
            ) : null}
          </div>
          <Button type="submit" className="w-full" variant="secondary" size="lg">
            Link Gönder
          </Button>
          <div className="text-center text-xs text-muted-foreground">
            <Link href="/auth/login" className="text-foreground hover:underline">
              Giriş sayfasına dön
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


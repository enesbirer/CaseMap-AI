import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-dvh max-w-2xl place-items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sayfa bulunamadı</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Aradığın sayfa mevcut değil veya taşınmış olabilir.
          </div>
          <div className="mt-4 flex gap-2">
            <Button asChild>
              <Link href="/">Landing</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/app/dashboard">Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


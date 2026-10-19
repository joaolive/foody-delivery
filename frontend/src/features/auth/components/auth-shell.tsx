import type { ReactNode } from "react";

import { BrandMark } from "@/components/common/brand-mark";
import { ThemeToggle } from "@/components/common/theme-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-svh bg-background lg:grid lg:grid-cols-2">
      <aside className="relative hidden min-h-svh overflow-hidden bg-primary px-10 py-9 text-primary-foreground lg:flex lg:flex-col xl:px-16 xl:py-12">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-36 -right-36 size-96 rounded-full border-[5rem] border-primary-foreground/10"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-52 -left-48 size-[34rem] rounded-full border-[6rem] border-primary-foreground/10"
        />
        <BrandMark inverse className="relative z-10" />
        <div className="relative z-10 mt-auto max-w-xl pb-8">
          <p className="mb-5 text-xs font-bold tracking-[0.18em] uppercase opacity-80">
            Seu delivery, passo a passo
          </p>
          <p className="text-4xl font-bold tracking-tight xl:text-5xl">
            Do pedido à entrega, acompanhe tudo por aqui.
          </p>
          <p className="mt-5 max-w-md text-base leading-7 opacity-85">
            Escolha seus produtos, faça seu pedido e acompanhe cada etapa da
            entrega em um só lugar.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-primary-foreground/25 pt-6 text-xs font-semibold">
            <span>01 · Escolha</span>
            <span>02 · Acompanhe</span>
            <span>03 · Receba</span>
          </div>
        </div>
      </aside>

      <section className="flex min-h-svh flex-col px-4 py-5 sm:px-8 sm:py-8 lg:px-12 xl:px-20">
        <div className="flex items-center justify-between gap-4 lg:justify-end">
          <BrandMark className="lg:hidden" />
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <Card className="w-full max-w-md rounded-2xl shadow-xl shadow-primary/5 ring-border/80">
            <CardHeader className="gap-2 px-6 pt-6 sm:px-8 sm:pt-8">
              <p className="text-xs font-bold tracking-[0.16em] text-primary uppercase">
                Sua área Foody
              </p>
              <CardTitle>
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              </CardTitle>
              <CardDescription className="leading-6">
                {description}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
              {children}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

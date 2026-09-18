import type { Metadata } from "next";
import Link from "next/link";
import { UserSwitcher } from "@/components/UserSwitcher";
import { currentUser } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "Keystone — internal tools",
  description: "Config-driven internal tools runtime",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await currentUser();

  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <header className="bg-neutral-900 text-white">
          <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">
            <Link href="/" className="text-sm font-bold tracking-wide">
              KEYSTONE
            </Link>
            <nav className="flex gap-4 text-sm text-neutral-300">
              <Link href="/" className="hover:text-white">
                Tools
              </Link>
              <Link href="/audit" className="hover:text-white">
                Audit log
              </Link>
            </nav>
            <div className="ml-auto flex items-center gap-3">
              <span className="text-xs text-neutral-400">{user.name}</span>
              <UserSwitcher current={user} />
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
      </body>
    </html>
  );
}

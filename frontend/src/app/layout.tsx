import type { Metadata } from "next";
import "@/styles/globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WalletProviders } from "@/components/WalletProviders";
import { FirebaseAuthProvider } from "@/components/FirebaseAuthProvider";
import { ToastProvider } from "@/lib/toast-context";
import { ToastContainer } from "@/components/ToastContainer";

export const metadata: Metadata = {
  title: "NecroBridge – Resurrect Dead Protocols on Solana",
  description:
    "Community-driven migration layer for dead crypto assets. Nominate, vote, and bridge defunct protocol tokens to Solana using Wormhole NTT and trustless Merkle proofs.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>💀</text></svg>",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="bg-surface text-text-primary antialiased min-h-screen flex flex-col relative overflow-x-hidden">
        <div className="fixed inset-0 -z-20 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        <ToastProvider>
          <FirebaseAuthProvider>
            <WalletProviders>
              <Header />
              <main className="flex-1 relative z-10">{children}</main>
              <Footer />
            </WalletProviders>
          </FirebaseAuthProvider>
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}

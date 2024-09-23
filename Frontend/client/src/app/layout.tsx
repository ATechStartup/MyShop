import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/nav/(page)/Navbar";
import Footer from "./components/footer/Footer";
import { Toaster } from "react-hot-toast";
import ClientProviders from "@/providers/ClientProviders";


export const metadata: Metadata = {
  title: "دیجی شاپ",
  description: "Generated by create next app",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="fa" dir="rtl">
      <body className="text-slate-700">

        <Toaster toastOptions={{
          style: {
            background: 'rgb(51 65 85)',
            color: '#fff',
          },
        }} />
        <ClientProviders>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow mt-[4.5rem]">{children}</main>
            <Footer />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}

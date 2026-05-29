import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { dark } from "@clerk/themes";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Medicare - Doctors Appointment App",
  description: "Connect with doctors anytime, anywhere",
};

export default function RootLayout({ children }) {
  return (
     <ClerkProvider
     appearance={{
      baseTheme:dark,
     }}
     >
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* header */}
          <Header/>

          <main className="min-h-screen">{children}</main>

          {/* footer */}

          <footer className="bg-muted/50 py-12">
            <div className="container mx-auto px-4 text-center">
    <p className="text-sm text-muted-foreground">
      © {new Date().getFullYear()} All rights reserved. Developed by{" "}
      <span className="font-semibold text-amber-600">
        Tikesh Aswale
      </span>
    </p>
  </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}

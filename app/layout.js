import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Medicare - Doctors Appointment App",
  description: "Connect with doctors anytime, anywhere",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>

        {/* header */}

        <main className="min-h-screen">{children}</main>

        {/* footer */}

        <footer className="bg-muted/50 py-12">
          <div className="container mx-auto px-4 text-center text-gray-400 ">
          <p>Made by tikesh</p>
          </div>
        </footer>



      </body>
    </html>
  );
}

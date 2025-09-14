import { JetBrains_Mono } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";
import ClientLayout from '@/components/ClientLayout';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';


const jetbrainsMono = JetBrains_Mono({
  subsets: ["cyrillic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-jetbrainsMono",
});

const myFont = localFont({
  src: '../public/assets/Fonts/FORTE.ttf',
});


export const metadata = {
  title: 'Aakash Sharma Portfolio',
  description: 'Welcome to Aakash Sharma\'s Portfolio - a showcase of my skills, projects, and professional achievements. Built with Next.js, my portfolio highlights my expertise in web development, including JavaScript, React, and modern frontend technologies.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={jetbrainsMono.variable}>
        <ClientLayout myFont={myFont}>
          {children}
        </ClientLayout>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}



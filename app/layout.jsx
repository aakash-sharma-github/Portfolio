"use client";
import { useEffect } from 'react'
import { JetBrains_Mono } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";
import StairTransation from "@/components/StairTransation";
import { useContextApi } from '../context/contextApi';
import { SpeedInsights } from '@vercel/speed-insights/next';


const jetbrainsMono = JetBrains_Mono({
  subsets: ["cyrillic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-jetbrainsMono",
});

const myFont = localFont({
  src: '../public/assets/Fonts/FORTE.ttf',
});


export default function RootLayout({ children }) {
  const setFont = useContextApi((state) => state.setFont);

  useEffect(() => {
    setFont(myFont.className);
  }, [setFont]);

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Welcome to Aakash Sharma's Portfolio - a showcase of my skills, projects, and professional achievements. Built with Next.js, my portfolio highlights my expertise in web development, including JavaScript, React, and modern frontend technologies. Explore my latest projects, read about my experience, and get in touch for collaboration opportunities. Discover how I can bring value to your team or project with innovative solutions and cutting-edge web applications." />
        <title>Aakash Sharma Portfolio</title>
      </head>
      <body className={jetbrainsMono.variable}>
        <Header myFont={myFont} />
        <StairTransation />
        <PageTransition>
          {children}
        </PageTransition>
        <SpeedInsights />
      </body>
    </html>
  );
}



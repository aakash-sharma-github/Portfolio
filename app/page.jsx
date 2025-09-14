"use client";
import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Photo from "@/components/Photo";
import Socials from "@/components/Socials";
import Stats from "@/components/Stats";
import { Button } from "@/components/ui/button";
import { FiDownload } from "react-icons/fi";
import { useContextApi } from '../context/contextApi';
import { TypeAnimation } from 'react-type-animation';
import Link from "next/link";

// Lazy load heavy components
const ParticlesContainer = dynamic(() => import("@/components/ParticleContainer"), {
    ssr: false,
    loading: () => null,
});

const Home = () => {
  const font = useContextApi((state) => state.font);
  const [shouldLoadParticles, setShouldLoadParticles] = useState(false);
  const [isHighPerformanceDevice, setIsHighPerformanceDevice] = useState(false);

  useEffect(() => {
    // Check device capabilities and user preferences
    const checkDeviceCapabilities = () => {
      const isHighEnd = window.navigator.hardwareConcurrency > 4 && 
                       window.innerWidth > 1024 &&
                       !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setIsHighPerformanceDevice(isHighEnd);
      
      // Delay particles loading to improve initial load time
      const timer = setTimeout(() => {
        setShouldLoadParticles(isHighEnd);
      }, 1000);
      
      return () => clearTimeout(timer);
    };

    if (typeof window !== 'undefined') {
      checkDeviceCapabilities();
    }
  }, []);

  return (
    <>
      {/* particles - only load on high-performance devices */}
      {shouldLoadParticles && (
        <div className="w-[1300px] h-full absolute right-0 bottom-0 pointer-events-none particle-container">
          <Suspense fallback={null}>
            <ParticlesContainer />
          </Suspense>
        </div>
      )}
      <section className="h-full">
        <div className=" container mx-auto h-full">
          <div className="flex flex-col xl:flex-row items-center justify-between xl:pt-8 xl:pb-24">
            {/* text */}
            <div className="text-center xl:text-left order-2 xl:order-none">
              <div className={`${font}`}>
                <h1 className="h1 mb-6">Hello I'm <br />
                  <TypeAnimation
                    sequence={[
                      "Aakash Sharma.",
                      1000,
                      'Frontend Developer.',
                      1000,
                      'Backend Developer.',
                      1000,
                      "Python Developer.",
                      1000,
                      'App Developer.',
                      1000,
                    ]}
                    wrapper="span"
                    speed={50}
                    className="text-accent"
                    repeat={Infinity}
                  />
                </h1>
              </div>
              <p className="max-w-[500px] mb-9 text-white/80">
                I'm a skilled software developer focused on creating robust, user-friendly applications. I specialize in full-stack development, mobile apps, and custom software solutions. Let's bring your ideas to life with precision and efficiency.
              </p>
              {/* button and socials */}
              <div className="flex flex-col xl:flex-row items-center gap-8">
                <Link
                  href="/assets/Aakash_Sharma_CV.pdf"
                  target="_blank"
                  download={true}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="uppercase flex items-center gap-2"
                  >
                    <span>Download CV</span>
                    <FiDownload className="text-xl" />
                  </Button>
                </Link>
                <div className="mb-8 xl:mb-0">
                  <Socials
                    containerStyles="flex gap-6"
                    iconStyles="w-9 h-9 border border-accent rounded-full flex items-center justify-center text-accent text-base hover:bg-accent hover:text-primary hover:transition-all duration-500"
                  />
                </div>
              </div>
            </div>
            {/* photo */}
            <div className="order-1 xl:order-none mb-4 xl:mb-0">
              <Photo />
            </div>
          </div>
        </div>
        <Stats />
      </section >
    </>
  )
}

export default Home


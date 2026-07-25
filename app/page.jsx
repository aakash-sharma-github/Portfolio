"use client";
import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { FiDownload, FiArrowRight } from "react-icons/fi";
import CountUp from "react-countup";
import { useContextApi } from "../context/contextApi";
import { useGitHub } from "../context/githubContext";
import { Socials } from "@/components/Socials";

const ParticlesContainer = dynamic(() => import("@/components/ParticleContainer"), {
  ssr: false,
  loading: () => null,
});

// ─── AvatarWithTap ────────────────────────────────────────────────────────────
// Mobile secret: tap the avatar 7 times within 4 seconds → navigate to admin.
// No visual feedback. No button. Completely invisible to visitors.
// Desktop users use the keystroke sequence in ClientLayout instead.
const SECRET_ROUTE = '/x7k2-management-9qp';
const REQUIRED_TAPS = 7;
const TAP_WINDOW_MS = 4000;

const AvatarWithTap = ({ children }) => {
  const router = useRouter();
  const tapCount = useRef(0);
  const tapTimer = useRef(null);

  const handleTap = useCallback(() => {
    tapCount.current += 1;

    // Reset the window timer on every tap
    clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, TAP_WINDOW_MS);

    // 7th tap — navigate silently
    if (tapCount.current >= REQUIRED_TAPS) {
      tapCount.current = 0;
      clearTimeout(tapTimer.current);
      router.push(SECRET_ROUTE);
    }
  }, [router]);

  return (
    <div
      className="absolute inset-3 rounded-full overflow-hidden mix-blend-lighten"
      // onTouchStart fires on mobile taps without any 300ms delay
      // onClick fires on desktop clicks (but desktop uses keystroke instead)
      onTouchStart={handleTap}
      onClick={handleTap}
      // No cursor change, no visual hint — completely invisible
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {children}
    </div>
  );
};

// ─── Floating tech badge ──────────────────────────────────────────────────────
const TechBadge = ({ label, delay = 0 }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.3 }}
    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold
                   bg-accent/10 border border-accent/25 text-accent/90"
  >
    {label}
  </motion.span>
);

// ─── Stat item ────────────────────────────────────────────────────────────────
// key={num} on CountUp makes it re-animate when the real GitHub number arrives,
// smoothly counting up from the fallback value to the live value.
const StatItem = ({ num, label, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 + index * 0.08, duration: 0.35 }}
    className="flex flex-col items-center xl:items-start"
  >
    <div className="flex items-end gap-0.5">
      <CountUp
        key={num}
        end={num}
        duration={2.5}
        delay={0.6}
        className="text-xl sm:text-2xl xl:text-4xl font-extrabold text-white tabular-nums"
      />
      <span className="text-accent text-lg sm:text-xl xl:text-3xl font-extrabold mb-0.5">+</span>
    </div>
    <p className="text-white/50 text-[10px] sm:text-xs leading-snug text-center xl:text-left mt-0.5">
      {label}
    </p>
  </motion.div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const Home = () => {
  const font = useContextApi((state) => state.font);

  // isLoading tells us whether GitHub data is still being fetched.
  // data always has safe default values (repoCount: 35, totalCommits: 350)
  // so the page never breaks even if the API call fails.
  const { data: githubData } = useGitHub();

  const [loadParticles, setLoadParticles] = useState(false);

  useEffect(() => {
    const isHighEnd =
      typeof window !== "undefined" &&
      window.navigator.hardwareConcurrency > 4 &&
      window.innerWidth > 1024 &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isHighEnd) {
      const t = setTimeout(() => setLoadParticles(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  // GitHub stats start at fallback values immediately; CountUp re-animates
  // automatically (via key={num}) when the real numbers arrive from the API.
  const stats = [
    { num: new Date().getFullYear() - 2021, label: "Years of\nexperience" },
    { num: 8, label: "Projects\ncompleted" },
    { num: 12, label: "Technologies\nlearned" },
    { num: githubData.repoCount, label: "GitHub\nrepos" },
    { num: githubData.totalCommits, label: "GitHub\ncommits" },
  ];

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col">
      {/* Particles — desktop only */}
      {loadParticles && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Suspense fallback={null}>
            <ParticlesContainer />
          </Suspense>
        </div>
      )}

      {/* Radial glow behind photo — desktop */}
      <div className="hidden xl:block absolute right-[10%] top-1/2 -translate-y-1/2
                            w-[500px] h-[500px] rounded-full
                            bg-accent/8 blur-[100px] pointer-events-none" />

      {/* ── Main hero ── */}
      <section className="flex-1 container mx-auto px-4 py-10 xl:py-0
                                flex items-center">
        <div className="w-full flex flex-col xl:flex-row items-center
                                justify-between gap-12 xl:gap-0">

          {/* ── Left: text content ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 text-center xl:text-left order-2 xl:order-1 max-w-3xl"
          >
            {/* Available badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-green-500/10 border
                                       border-green-500/25 text-green-400 text-xs font-semibold
                                       px-3 py-1.5 rounded-full mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Available for hire
            </motion.div>

            {/* Headline */}
            <div className={font}>
              <h1 className="text-[2rem] sm:text-5xl xl:text-[4.5rem] font-bold
                                           leading-[1.1] tracking-tight mb-4">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="block text-white/70 text-2xl sm:text-3xl xl:text-4xl
                                               font-normal mb-2"
                >
                  Hello, I&apos;m
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="block text-accent"
                >
                  <TypeAnimation
                    sequence={[
                      "Aakash Sharma", 2000,
                      "Full-Stack Developer.", 2000,
                      "Frontend Developer.", 1500,
                      "Backend Developer.", 1500,
                      "App Developer.", 1500,
                      "Python Developer.", 1500,
                    ]}
                    wrapper="span"
                    speed={55}
                    repeat={Infinity}
                  />
                </motion.span>
              </h1>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-white/55 text-base xl:text-lg leading-relaxed
                                       mb-8 max-w-[480px] mx-auto xl:mx-0"
            >
              Skilled software developer focused on creating robust, user-friendly
              applications. I specialise in full-stack development, mobile apps, and
              custom software solutions.
            </motion.p>

            {/* Tech stack badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-2 justify-center xl:justify-start mb-8"
            >
              {["React", "Next.js", "Node.js", "MongoDB", "React Native", "Python"].map((t, i) => (
                <TechBadge key={t} label={t} delay={0.4 + i * 0.05} />
              ))}
            </motion.div>

            {/* CTA + socials */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center gap-4
                                       justify-center xl:justify-start"
            >
              {/* Download CV */}
              <Link
                href="/assets/Aakash_Sharma_CV.pdf"
                target="_blank"
                download
                className="group flex items-center gap-2.5 bg-accent hover:bg-accent-hover
                                           text-white font-semibold px-6 py-3 rounded-xl text-sm
                                           transition-all duration-200 w-full sm:w-auto justify-center"
              >
                <FiDownload className="group-hover:animate-bounce" />
                Download CV
              </Link>

              {/* View work */}
              <Link
                href="/work"
                className="group flex items-center gap-2.5 border border-white/20
                                           hover:border-accent/50 text-white/70 hover:text-accent
                                           font-semibold px-6 py-3 rounded-xl text-sm
                                           transition-all duration-200 w-full sm:w-auto justify-center"
              >
                View My Work
                <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </motion.div>

            {/* Social icons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-3 mt-6 justify-center xl:justify-start"
            >
              <Socials />
            </motion.div>
          </motion.div>

          {/* ── Right: photo ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 xl:order-2 flex-shrink-0"
          >
            {/* Animated ring + avatar */}
            <div className="relative w-[260px] h-[260px] sm:w-[320px] sm:h-[320px]
                                        xl:w-[460px] xl:h-[460px]">
              {/* Spinning dashed ring */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 506 506"
                fill="transparent"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.circle
                  cx="253" cy="253" r="248"
                  stroke="#3F88C5"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "24 10 0 0" }}
                  animate={{
                    strokeDasharray: ["15 120 25 25", "16 25 92 72", "4 250 22 22"],
                    rotate: [120, 360],
                  }}
                  transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                />
              </svg>

              {/* Avatar image — 7 taps on mobile navigates to secret admin route */}
              <AvatarWithTap>
                <Image
                  src="/assets/avatar.png"
                  alt="Aakash Sharma"
                  fill
                  priority
                  quality={95}
                  className="object-cover"
                  sizes="(max-width: 640px) 260px, (max-width: 1024px) 320px, 460px"
                />
              </AvatarWithTap>

              {/* Floating badge — years of exp */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="absolute -right-4 top-8 bg-[#1e1e28] border border-white/10
                                           rounded-2xl px-4 py-3 shadow-xl backdrop-blur-sm
                                           hidden sm:block"
              >
                <div className="text-2xl font-extrabold text-accent">
                  {new Date().getFullYear() - 2021}+
                </div>
                <div className="text-white/50 text-[10px] uppercase tracking-widest">
                  Years exp.
                </div>
              </motion.div>

              {/* Floating badge — stack */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -left-4 bottom-12 bg-[#1e1e28] border border-white/10
                                           rounded-2xl px-4 py-3 shadow-xl backdrop-blur-sm
                                           hidden sm:block"
              >
                <div className="text-xs font-bold text-white mb-0.5">Full-Stack</div>
                <div className="text-white/45 text-[10px]">Web + Mobile</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="container mx-auto px-4 py-10 xl:py-12
                                border-t border-white/6 mt-4">
        <div className="grid grid-cols-5 gap-2 sm:gap-4 xl:gap-0
                                xl:divide-x xl:divide-white/8">
          {stats.map((stat, i) => (
            <div key={i} className="xl:px-8 first:xl:pl-0 last:xl:pr-0">
              <StatItem num={stat.num} label={stat.label} index={i} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
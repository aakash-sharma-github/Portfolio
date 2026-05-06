"use client";

// ─── Icons ────────────────────────────────────────────────────────────────────
// IMPORTANT: store component references (not <JSX /> elements) in data arrays.
// Rendering JSX inside static data objects causes "Element type is invalid"
// whenever an import resolves to undefined (e.g. renamed icons in v5).
import {
  FaHtml5,
  FaCss3,
  FaJs,
  FaPython,
  FaJava,
  FaReact,
  FaNodeJs,
  FaGithub,
  FaGit,
} from "react-icons/fa6";
import { TbBrandReactNative } from "react-icons/tb";
import { PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import {
  SiNextdotjs,
  SiTailwindcss,
  SiMongodb,
  SiMysql,
  SiVscode,
  SiIntellijidea,
  SiExpress,
  SiDjango,
  SiPostman,
  SiDocker,
  SiTypescript,
  SiN8N,
  SiClaude,
  SiSupabase,
  SiLinux,
  SiVercel,
  SiShadcnui,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { FiBriefcase, FiBook, FiUser, FiAward, FiCode } from "react-icons/fi";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PageHeader from "@/components/PageHeader";

// ─── Data ─────────────────────────────────────────────────────────────────────

const TABS = [
  { id: "experience", label: "Experience", Icon: FiBriefcase },
  { id: "skills", label: "Skills", Icon: FiCode },
  { id: "education", label: "Education", Icon: FiBook },
  { id: "about", label: "About Me", Icon: FiUser },
  { id: "certifications", label: "Certifications", Icon: FiAward },
];

const experienceData = {
  description:
    "I'm a software developer with experience in telecommunication and IoT systems. At Telcovate I work on automation and network projects; my time at BlueEra Softech and CodeClause helped me grow building real-world projects with React, Node.js, and great teams.",
  items: [
    {
      company: "Telcovate Communication Network Solutions",
      position: "Telecommunication Engineer",
      duration: "Nov 2024 – Present",
      type: "Full-time",
    },
    {
      company: "BlueEra Softech Pvt. Ltd.",
      position: "Software Engineer Intern",
      duration: "Jan 2024 – Apr 2024",
      type: "Internship",
    },
    {
      company: "CodeClause",
      position: "Web Developer Intern",
      duration: "Jul 2023 – Aug 2023",
      type: "Internship",
    },
  ],
};

const skillsData = {
  description:
    "Spanning web, mobile, and systems — from interactive UIs with React and Next.js to backend APIs with Node.js and Express, plus databases and DevOps tooling.",
  categories: [
    {
      name: "Languages",
      items: [
        { Icon: FaHtml5, name: "HTML5" },
        { Icon: FaCss3, name: "CSS3" },
        { Icon: FaJs, name: "JavaScript" },
        { Icon: SiTypescript, name: "TypeScript" },
        { Icon: FaPython, name: "Python" },
        { Icon: FaJava, name: "Java" },
      ],
    },
    {
      name: "Frameworks",
      items: [
        { Icon: FaReact, name: "React.js" },
        { Icon: SiNextdotjs, name: "Next.js" },
        { Icon: FaNodeJs, name: "Node.js" },
        { Icon: SiExpress, name: "Express" },
        { Icon: SiTailwindcss, name: "Tailwind CSS" },
        { Icon: SiDjango, name: "Django" },
        { Icon: TbBrandReactNative, name: "React Native" },
        { Icon: SiShadcnui, name: "Shadcn UI" },
      ],
    },
    {
      name: "Tools",
      items: [
        { Icon: FaGithub, name: "GitHub" },
        { Icon: FaGit, name: "Git" },
        { Icon: VscVscode, name: "VS Code" },
        { Icon: SiIntellijidea, name: "IntelliJ IDEA" },
        { Icon: SiPostman, name: "Postman" },
        { Icon: PiMicrosoftExcelLogoDuotone, name: "Excel" },
        { Icon: SiDocker, name: "Docker" },
        { Icon: SiN8N, name: "N8N" },
        { Icon: SiClaude, name: "Claude" },
        { Icon: SiLinux, name: "Linux" },
        { Icon: SiVercel, name: "Vercel" },
      ],
    },
    {
      name: "Databases",
      items: [
        { Icon: SiMysql, name: "MySQL" },
        { Icon: SiMongodb, name: "MongoDB" },
        { Icon: SiSupabase, name: "Supabase" },
      ],
    },
  ],
};

const educationData = {
  description:
    "Formally trained in Computer Science and Engineering across institutions in Nepal and India, combining academic rigour with a multicultural perspective.",
  items: [
    {
      institution: "Parul University Gujarat, India",
      degree: "B.Tech — Computer Science & Engineering",
      duration: "2020 – 2024",
      grade: "First Class",
    },
    {
      institution: "Model Multiple College Janakpur, Nepal",
      degree: "12th — National Examination Board (NEB)",
      duration: "2018 – 2019",
      grade: "",
    },
    {
      institution: "Saraswati English Boarding School, Nepal",
      degree: "10th — Secondary Education Exam (SEE)",
      duration: "2017",
      grade: "",
    },
  ],
};

const aboutData = {
  description:
    "I'm a tech enthusiast with a strong background in software development and web technologies. I love tackling complex challenges and am always eager to learn and grow.",
  fields: [
    { label: "Name", value: "Aakash Sharma" },
    { label: "Email", value: "aakashsharma9855@gmail.com" },
    { label: "Nationality", value: "Nepali" },
    { label: "Languages", value: "English, Hindi, Nepali" },
    { label: "Freelance", value: "Available" },
    { label: "Location", value: "Dubai, UAE" },
  ],
};

const certData = {
  description:
    "Certifications spanning front-end, back-end, data tools, and professional internship recognition.",
  items: [
    {
      course: "Front End Web Development using Angular",
      issuer: "Parul University",
      mode: "Offline",
    },
    {
      course: "Zero To Prototype With Node.js",
      issuer: "Parul University",
      mode: "Offline",
    },
    {
      course: "Zero To Hero in Microsoft Excel",
      issuer: "Udemy",
      mode: "Online",
    },
    {
      course: "Web Development Internship",
      issuer: "CodeClause",
      mode: "Online",
    },
    {
      course: "Meta Front-End Developer Professional Certificate",
      issuer: "Coursera",
      mode: "Online",
    },
    {
      course: "Software Engineering Internship",
      issuer: "BlueEra Softech Pvt. Ltd.",
      mode: "Offline",
    },
  ],
};

// ─── Animation helpers ────────────────────────────────────────────────────────
const panelVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.14 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, delay: i * 0.055, ease: "easeOut" },
  }),
};

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ title, description }) {
  return (
    <div className="mb-8">
      <h2 className="text-3xl xl:text-4xl font-bold text-white mb-3">
        {title}
      </h2>
      <p className="text-white/50 text-sm leading-relaxed max-w-2xl">
        {description}
      </p>
    </div>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────────
function ExperiencePanel() {
  return (
    <div>
      <SectionHeader
        title="My Experience"
        description={experienceData.description}
      />
      <div className="relative">
        <div className="absolute left-5 top-2 bottom-2 w-px bg-accent/20 hidden sm:block" />
        <div className="space-y-4">
          {experienceData.items.map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={staggerItem}
              initial="hidden"
              animate="visible"
              className="relative sm:pl-14"
            >
              <div
                className="hidden sm:flex absolute left-[14px] top-6 w-3 h-3 rounded-full
                              bg-accent ring-4 ring-accent/15 ring-offset-0"
              />
              <div
                className="bg-[#232329] border border-white/6 hover:border-accent/30
                              rounded-2xl p-5 sm:p-6 transition-all duration-200 group"
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-accent text-xs font-semibold uppercase tracking-widest">
                    {item.duration}
                  </span>
                  <span
                    className="text-[10px] bg-accent/10 text-accent border border-accent/20
                                   px-2 py-0.5 rounded-full uppercase tracking-wider"
                  >
                    {item.type}
                  </span>
                </div>
                <h3
                  className="text-lg font-bold text-white group-hover:text-accent/90
                               transition-colors duration-150 mb-1"
                >
                  {item.position}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  <p className="text-white/50 text-sm">{item.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────
function SkillsPanel() {
  return (
    <div>
      <SectionHeader title="My Skills" description={skillsData.description} />
      <div className="space-y-8">
        {skillsData.categories.map((cat) => (
          <div key={cat.name}>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex-1 h-px bg-white/8" />
              <h3 className="text-xs font-semibold text-white/35 uppercase tracking-widest">
                {cat.name}
              </h3>
              <span className="flex-1 h-px bg-white/8" />
            </div>
            <div className="flex flex-wrap gap-3">
              {cat.items.map((skill, si) => {
                // Destructure Icon component reference — render it safely below
                const { Icon: SkillIcon, name, color } = skill;
                return (
                  <motion.div
                    key={name}
                    custom={si}
                    variants={staggerItem}
                    initial="hidden"
                    animate="visible"
                  >
                    <TooltipProvider delayDuration={80}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="w-14 h-14 bg-[#232329] border border-white/6
                                          hover:border-accent/40 rounded-2xl flex items-center
                                          justify-center cursor-default transition-all duration-200
                                          hover:-translate-y-1 hover:bg-[#2a2a35]"
                          >
                            {/* SkillIcon is a component reference, never JSX — safe to render */}
                            {SkillIcon && (
                              <SkillIcon
                                className="text-2xl"
                                style={{ color }}
                              />
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="bg-[#232329] border-accent/30 text-white text-xs px-2 py-1"
                        >
                          {name}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Education ────────────────────────────────────────────────────────────────
function EducationPanel() {
  return (
    <div>
      <SectionHeader
        title="My Education"
        description={educationData.description}
      />
      <div className="space-y-4">
        {educationData.items.map((item, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={staggerItem}
            initial="hidden"
            animate="visible"
            className="bg-[#232329] border border-white/6 hover:border-accent/30
                       rounded-2xl p-5 sm:p-6 transition-all duration-200 group"
          >
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-accent text-xs font-semibold uppercase tracking-widest">
                {item.duration}
              </span>
              {item.grade && (
                <span
                  className="text-[10px] bg-green-500/10 text-green-400 border
                                 border-green-500/20 px-2 py-0.5 rounded-full"
                >
                  {item.grade}
                </span>
              )}
            </div>
            <h3
              className="text-base font-bold text-white group-hover:text-accent/90
                           transition-colors duration-150 mb-1.5"
            >
              {item.degree}
            </h3>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
              <p className="text-white/50 text-sm">{item.institution}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function AboutPanel() {
  return (
    <div>
      <SectionHeader title="About Me" description={aboutData.description} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {aboutData.fields.map((field, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={staggerItem}
            initial="hidden"
            animate="visible"
            className="bg-[#232329] border border-white/6 hover:border-accent/30
                       rounded-xl p-4 transition-all duration-200"
          >
            <span className="text-[10px] text-white/35 uppercase tracking-widest font-semibold block mb-1">
              {field.label}
            </span>
            <span className="text-white font-semibold text-sm">
              {field.value}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Certifications ───────────────────────────────────────────────────────────
function CertificationsPanel() {
  return (
    <div>
      <SectionHeader
        title="Certifications"
        description={certData.description}
      />
      <ScrollArea className="h-[420px] pr-1">
        <div className="space-y-3">
          {certData.items.map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={staggerItem}
              initial="hidden"
              animate="visible"
              className="bg-[#232329] border border-white/6 hover:border-accent/30
                         rounded-2xl p-4 sm:p-5 flex items-start gap-4 transition-all duration-200 group"
            >
              <div
                className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20
                              flex items-center justify-center flex-shrink-0 mt-0.5"
              >
                <FiAward className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="text-sm font-bold text-white group-hover:text-accent/90
                               transition-colors duration-150 mb-1 leading-snug"
                >
                  {item.course}
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-white/45 text-xs">{item.issuer}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border
                    ${item.mode === "Online"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        : "bg-accent/10 text-accent border-accent/20"
                      }`}
                  >
                    {item.mode}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

// ─── Panel map ────────────────────────────────────────────────────────────────
const PANELS = {
  experience: ExperiencePanel,
  skills: SkillsPanel,
  education: EducationPanel,
  about: AboutPanel,
  certifications: CertificationsPanel,
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ResumePage() {
  const [activeTab, setActiveTab] = useState("experience");
  const ActivePanel = PANELS[activeTab];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-primary py-4 xl:py-4"
    >
      <div className="container mx-auto px-4">
        {/* HEADER */}
        <PageHeader
          badge="My Background"
          header="Why Hire"
          subheader="Me?"
          desc="A full-stack developer with proven delivery experience across web, mobile, and systems."
        />

        <div className="flex flex-col xl:flex-row gap-8 xl:gap-12">
          {/* Sidebar */}
          <aside className="w-full xl:w-[240px] flex-shrink-0">
            {/*
              Mobile: horizontally scrollable pill strip with fade-out edges
              so the user can see more tabs are off-screen.
              Desktop (xl): vertical stacked list.
            */}
            <div className="relative xl:hidden">
              {/* Left fade hint */}
              <div
                className="pointer-events-none absolute left-0 top-0 bottom-0 w-6
                              bg-gradient-to-r from-primary to-transparent z-10"
              />
              {/* Right fade hint */}
              <div
                className="pointer-events-none absolute right-0 top-0 bottom-0 w-6
                              bg-gradient-to-l from-primary to-transparent z-10"
              />

              {/* Scrollable row */}
              <div
                className="flex gap-2 overflow-x-auto scroll-smooth px-1 pb-2
                           [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]
                           [scrollbar-width:none] snap-x snap-mandatory"
              >
                {TABS.map(({ id, label, Icon: TabIcon }) => {
                  const isActive = activeTab === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`
                        flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                        whitespace-nowrap flex-shrink-0 snap-start
                        transition-all duration-200
                        ${isActive
                          ? "bg-accent text-white shadow-lg shadow-accent/20"
                          : "bg-[#232329] text-white/50 border border-white/6"
                        }
                      `}
                    >
                      <TabIcon
                        className={`text-sm flex-shrink-0 ${isActive ? "text-white" : "text-accent"}`}
                      />
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Scroll dot indicators */}
              <div className="flex justify-center gap-1.5 mt-2">
                {TABS.map(({ id }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`transition-all duration-200 rounded-full
                      ${activeTab === id
                        ? "w-4 h-1.5 bg-accent"
                        : "w-1.5 h-1.5 bg-white/20"
                      }`}
                    aria-label={`Go to ${id} tab`}
                  />
                ))}
              </div>
            </div>

            {/* Desktop vertical list */}
            <div className="hidden xl:flex flex-col gap-2">
              {TABS.map(({ id, label, Icon: TabIcon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
                      w-full transition-all duration-200 text-left
                      ${isActive
                        ? "bg-accent text-white shadow-lg shadow-accent/20"
                        : "bg-[#232329] text-white/50 hover:text-white hover:bg-[#2a2a35] border border-white/6"
                      }
                    `}
                  >
                    <TabIcon
                      className={`text-base flex-shrink-0 ${isActive ? "text-white" : "text-accent"}`}
                    />
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Identity card — desktop only */}
            <div
              className="hidden xl:block mt-6 bg-[#232329] border border-white/6
                            rounded-2xl p-5 text-center"
            >
              <div
                className="w-12 h-12 rounded-full bg-accent/10 border-2 border-accent/30
                              flex items-center justify-center mx-auto mb-3"
              >
                <span className="text-accent font-bold">AS</span>
              </div>
              <p className="text-white font-bold text-sm">Aakash Sharma</p>
              <p className="text-white/40 text-xs mt-0.5">
                Full-Stack Developer
              </p>
              <div className="mt-3 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-medium">
                  Available for hire
                </span>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <ActivePanel />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

"use client";
import {
  FaHtml5, FaCss3, FaJs, FaPython, FaJava,
  FaReact, FaNodeJs, FaGithub, FaGit,
} from "react-icons/fa6";
import { TbBrandReactNative } from "react-icons/tb";
import { PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import {
  SiTypescript, SiNextdotjs, SiTailwindcss, SiMongodb,
  SiMysql, SiIntellijidea, SiExpress,
  SiDjango, SiPostman, SiDocker, SiSupabase, SiN8N,
  SiClaude,
  SiShadcnui
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  FiBriefcase, FiBook, FiAward, FiUser, FiCpu, FiDownload,
} from "react-icons/fi";
import { Sintony } from "next/font/google";

/* ── DATA ───────────────────────────────────────────── */
const experience = {
  icon: <FiBriefcase />,
  title: "Experience",
  description: "I'm a software developer with experience in telecommunication and IoT systems. At Telcovate, I work on automation and network projects. My time at BlueEra Softech and CodeClause helped me grow as a developer.",
  items: [
    { duration: "Sept 2024 – Present", title: "Telecommunication Assistant", subtitle: "Telcovate Communication Network Solutions" },
    { duration: "Jan 2024 – May 2024", title: "Software Engineer Intern", subtitle: "BlueEra Softech Pvt. Ltd." },
    { duration: "Jul 2023 – Aug 2023", title: "Web Developer Intern", subtitle: "CodeClause" },
  ],
};

const education = {
  icon: <FiBook />,
  title: "Education",
  description: "My schooling has been from Nepal, and thereafter from India in Computer Science and Engineering, combining multiple experiences with novelty.",
  items: [
    { duration: "2020 – 2024", title: "B.Tech, Computer Science and Engineering", subtitle: "Parul University Gujarat, India" },
    { duration: "2018 – 2019", title: "12th — National Examination Board (NEB)", subtitle: "Model Multiple College Janakpur, Nepal" },
    { duration: "2017", title: "10th — Secondary Education Examination (SEE)", subtitle: "Saraswati English Boarding School, Nepal" },
  ],
};

const certifications = {
  icon: <FiAward />,
  title: "Certifications",
  description: "Certifications that enhance my skills across web development, cloud tooling, and productivity software.",
  items: [
    { duration: "Online", title: "Meta Front-End Developer Professional Certificate", subtitle: "Coursera" },
    { duration: "Offline", title: "Front End Web Development using Angular", subtitle: "Parul University" },
    { duration: "Offline", title: "Zero To Prototype With NODE.JS", subtitle: "Parul University" },
    { duration: "Online", title: "Zero To Hero in Microsoft Excel", subtitle: "Udemy" },
    { duration: "Online", title: "Web Development Intern", subtitle: "CodeClause" },
    { duration: "Offline", title: "Software Engineering Internship", subtitle: "BlueEra Softech Pvt. Ltd." },
  ],
};

const about = {
  icon: <FiUser />,
  fields: [
    { label: "Name", value: "Aakash Sharma" },
    { label: "Email", value: "aakashsharma9855@gmail.com" },
    { label: "Nationality", value: "Nepali" },
    { label: "Languages", value: "English, Hindi, Nepali" },
    { label: "Freelance", value: "Available" },
    { label: "Availability", value: "Dubai, UAE | Full-time" },
  ],
  bio: "I'm a tech enthusiast with a strong background in software development and web technologies. I love tackling challenges and am always eager to learn and grow in the tech field.",
};

const skills = {
  icon: <FiCpu />,
  categories: [
    {
      name: "Languages",
      items: [
        { icon: <FaHtml5 />, name: "HTML5" },
        { icon: <FaCss3 />, name: "CSS3" },
        { icon: <FaJs />, name: "JavaScript" },
        { icon: <SiTypescript />, name: "TypeScript" },
        { icon: <FaPython />, name: "Python" },
        { icon: <FaJava />, name: "Java" },
      ],
    },
    {
      name: "Frameworks",
      items: [
        { icon: <FaReact />, name: "React.js" },
        { icon: <SiNextdotjs />, name: "Next.js" },
        { icon: <FaNodeJs />, name: "Node.js" },
        { icon: <SiExpress />, name: "Express" },
        { icon: <SiTailwindcss />, name: "Tailwind CSS" },
        { icon: <SiShadcnui />, name: "Shadcn UI" },
        { icon: <SiDjango />, name: "Django" },
        { icon: <TbBrandReactNative />, name: "React Native" },
      ],
    },
    {
      name: "Tools",
      items: [
        { icon: <FaGithub />, name: "GitHub" },
        { icon: <FaGit />, name: "Git" },
        { icon: <VscVscode />, name: "VS Code" },
        { icon: <SiIntellijidea />, name: "IntelliJ IDEA" },
        { icon: <SiPostman />, name: "Postman" },
        { icon: <PiMicrosoftExcelLogoDuotone />, name: "Excel" },
        { icon: <SiDocker />, name: "Docker" },
        { icon: <SiN8N />, name: "N8N" },
        { icon: <SiClaude />, name: "Claude" },
      ],
    },
    {
      name: "Databases",
      items: [
        { icon: <SiMysql />, name: "MySQL" },
        { icon: <SiMongodb />, name: "MongoDB" },
        { icon: <SiSupabase />, name: "Supabase" },
      ],
    },
  ],
};

const TABS = [
  { key: "experience", label: "Experience", icon: <FiBriefcase size={15} /> },
  { key: "skills", label: "Skills", icon: <FiCpu size={15} /> },
  { key: "education", label: "Education", icon: <FiBook size={15} /> },
  { key: "about", label: "About", icon: <FiUser size={15} /> },
  { key: "certifications", label: "Certifications", icon: <FiAward size={15} /> },
];

/* ── Timeline Item ──────────────────────────────────── */
const TimelineItem = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.07, duration: 0.38 }}
    className="relative pl-8 group"
  >
    {/* connector */}
    <span className="absolute left-0 top-2 w-3 h-3 rounded-full border-2 border-accent bg-primary z-10 transition-colors group-hover:bg-accent" />
    {index !== -1 && (
      <span className="absolute left-[5px] top-5 w-px h-full bg-white/8 group-last:hidden" />
    )}
    <div className="bg-[#1a1a21] border border-white/5 rounded-xl p-5 hover:border-accent/25 transition-all duration-300">
      <span className="text-accent text-xs font-semibold uppercase tracking-widest">{item.duration}</span>
      <h4 className="text-white font-semibold text-base mt-1 leading-snug">{item.title}</h4>
      <p className="text-white/50 text-sm mt-1">{item.subtitle}</p>
    </div>
  </motion.div>
);

/* ── Skill Icon ─────────────────────────────────────── */
const SkillIcon = ({ skill }) => (
  <TooltipProvider delayDuration={80}>
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          whileHover={{ y: -4, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="relative w-14 h-14 flex items-center justify-center rounded-xl bg-[#1a1a21] border border-white/5 hover:border-accent/30 cursor-pointer transition-colors duration-200"
        >
          <span className="text-2xl" style={{ color: skill.color }}>{skill.icon}</span>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs font-medium">{skill.name}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

/* ── Panel content per tab ──────────────────────────── */
const panelVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const Panel = ({ active }) => {
  if (active === "experience")
    return (
      <motion.div key="experience" variants={panelVariants} initial="hidden" animate="show" exit="exit">
        <SectionHeader data={experience} />
        <div className="flex flex-col gap-4 mt-6">
          {experience.items.map((item, i) => <TimelineItem key={i} item={item} index={i} />)}
        </div>
      </motion.div>
    );

  if (active === "education")
    return (
      <motion.div key="education" variants={panelVariants} initial="hidden" animate="show" exit="exit">
        <SectionHeader data={education} />
        <div className="flex flex-col gap-4 mt-6">
          {education.items.map((item, i) => <TimelineItem key={i} item={item} index={i} />)}
        </div>
      </motion.div>
    );

  if (active === "certifications")
    return (
      <motion.div key="certifications" variants={panelVariants} initial="hidden" animate="show" exit="exit">
        <SectionHeader data={certifications} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {certifications.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
              className="bg-[#1a1a21] border border-white/5 rounded-xl p-5 hover:border-accent/25 transition-all duration-300"
            >
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest mb-2 ${item.duration === "Online" ? "bg-accent/15 text-accent" : "bg-white/8 text-white/60"}`}>
                {item.duration}
              </span>
              <h4 className="text-white text-sm font-semibold leading-snug">{item.title}</h4>
              <p className="text-white/45 text-xs mt-1">{item.subtitle}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );

  if (active === "skills")
    return (
      <motion.div key="skills" variants={panelVariants} initial="hidden" animate="show" exit="exit">
        <div className="space-y-8">
          {skills.categories.map((cat, ci) => (
            <motion.div key={cat.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.08, duration: 0.35 }}>
              <h4 className="text-white/40 text-xs font-semibold uppercase tracking-[0.18em] mb-4 gap-3">
                <span className="h-px flex-1 bg-white/8" />
                {cat.name}
                <span className="h-px flex-1 bg-white/8" />
              </h4>
              <div className="flex flex-wrap gap-3 justify-start">
                {cat.items.map((skill, si) => (
                  <SkillIcon key={si} skill={skill} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );

  if (active === "about")
    return (
      <motion.div key="about" variants={panelVariants} initial="hidden" animate="show" exit="exit">
        <p className="text-white/55 text-sm leading-relaxed mb-8 max-w-2xl">{about.bio}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {about.fields.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.3 }}
              className="flex items-center gap-4 p-4 bg-[#1a1a21] border border-white/5 rounded-xl"
            >
              <span className="text-white/35 text-xs uppercase tracking-widest min-w-[80px]">{f.label}</span>
              <span className="text-white text-sm font-medium">{f.value}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );

  return null;
};

const SectionHeader = ({ data }) => (
  <div className="mb-2">
    <p className="text-white/50 text-sm leading-relaxed max-w-2xl">{data.description}</p>
  </div>
);

/* ── Main component ─────────────────────────────────── */
const Resume = () => {
  const [active, setActive] = useState("experience");
  const activeTab = TABS.find((t) => t.key === active);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.3, duration: 0.5 } }}
      className="min-h-screen py-4 md:py-4"
    >
      <div className="container mx-auto px-4">
        {/* Page title */}
        <div className="mb-4 text-center">
          <span className="inline-block px-4 py-1 rounded-full border border-accent/30 text-accent text-xs uppercase tracking-[0.2em] mb-4">
            Career &amp; Skills
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">My Resume</h1>
          <p className="text-white/40 text-base max-w-md mx-auto">
            A snapshot of my professional journey, education and technical toolkit.
          </p>
          {/* <a
            href="/assets/Aakash_Sharma_CV.pdf"
            download
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-accent/10 border border-accent/30 text-accent text-sm font-medium hover:bg-accent hover:text-white transition-all duration-250"
          >
            <FiDownload size={14} /> Download CV
          </a> */}
        </div>

        <div className="flex flex-col xl:flex-row gap-8 xl:gap-12">
          {/* ── SIDEBAR TABS ── */}
          <div className="xl:w-56 flex-shrink-0">
            <nav className="flex xl:flex-col gap-2 flex-wrap xl:flex-nowrap sticky xl:top-8">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActive(tab.key)}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left ${active === tab.key
                    ? "bg-accent/15 text-accent border border-accent/30"
                    : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                >
                  <span className="shrink-0">{tab.icon}</span>
                  <span>{tab.label}</span>
                  {active === tab.key && (
                    <motion.span
                      layoutId="tab-indicator"
                      className="absolute inset-0 rounded-xl border border-accent/30"
                    />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* ── CONTENT PANEL ── */}
          <div className="flex-1 min-w-0">
            {/* Section heading */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-accent text-lg">{activeTab?.icon}</span>
              <h2 className="text-2xl font-bold text-white">{activeTab?.label}</h2>
              <span className="flex-1 h-px bg-gradient-to-r from-accent/20 to-transparent" />
            </div>

            <AnimatePresence mode="wait">
              <Panel active={active} />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Resume;
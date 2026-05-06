"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  FaCode, FaServer, FaMobile, FaPython,
  FaDocker, FaDatabase, FaShieldAlt, FaRocket,
} from "react-icons/fa";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import PageHeader from "@/components/PageHeader";

const servicesList = [
  {
    num: "01",
    icon: FaCode,
    title: "Frontend Development",
    description:
      "Creating stunning, interactive user interfaces with React, Next.js, and modern CSS frameworks. Responsive, accessible, and performant across all devices.",
    features: ["React & Next.js", "Tailwind CSS", "TypeScript", "Framer Motion"],
    accent: "#3F88C5",
  },
  {
    num: "02",
    icon: FaServer,
    title: "Backend Development",
    description:
      "Building robust, scalable backend systems using Node.js, Express.js, and MongoDB. Secure APIs, authentication, and efficient database architectures.",
    features: ["Node.js & Express", "RESTful APIs", "GraphQL", "Microservices"],
    accent: "#3F88C5",
  },
  {
    num: "03",
    icon: FaMobile,
    title: "Mobile App Development",
    description:
      "Feature-rich mobile applications using React Native. Cross-platform solutions with native performance across iOS and Android.",
    features: ["React Native", "TypeScript", "iOS & Android", "App Store Deployment", "Play Store Deployment"],
    accent: "#3F88C5",
  },
  {
    num: "04",
    icon: FaPython,
    title: "Python Development",
    description:
      "Efficient Python applications with Django and Flask. Data analysis, automation scripts, and machine learning for complex business problems.",
    features: ["Django & Flask", "Data Analysis", "Machine Learning", "Automation"],
    accent: "#3F88C5",
  },
  {
    num: "05",
    icon: FaDocker,
    title: "DevOps & Cloud",
    description:
      "Implementing DevOps with Docker, Kubernetes, and cloud platforms. Automated pipelines, monitoring, and high-availability production environments.",
    features: ["Docker & Kubernetes", "AWS & Azure", "CI/CD Pipelines", "Monitoring"],
    accent: "#3F88C5",
  },
  {
    num: "06",
    icon: FaDatabase,
    title: "Database Solutions",
    description:
      "Designing and optimizing SQL and NoSQL architectures. Data integrity, query performance, and scalable data management strategies.",
    features: ["MongoDB & PostgreSQL", "Database Design", "Query Optimization", "Data Migration"],
    accent: "#3F88C5",
  },
  {
    num: "07",
    icon: FaShieldAlt,
    title: "Security & Compliance",
    description:
      "Comprehensive security measures to protect applications and data. Audits, authentication systems, and regulatory compliance.",
    features: ["Security Audits", "Data Protection", "GDPR Compliance", "Penetration Testing"],
    accent: "#3F88C5",
  },
  {
    num: "08",
    icon: FaRocket,
    title: "Performance Optimization",
    description:
      "Tuning applications through code optimization, caching, and infrastructure improvements for fast load times and high-traffic resilience.",
    features: ["Speed Optimization", "Caching Strategies", "CDN Implementation", "Load Testing"],
    accent: "#3F88C5",
  },
];

/* ── Service card ───────────────────────────────────── */
const ServiceCard = ({ service, index }) => {
  const [hovered, setHovered] = useState(false);
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative bg-[#181820] border border-white/6 rounded-2xl p-6 flex flex-col gap-5 hover:border-accent/30 transition-all duration-350 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5 cursor-default"
    >
      {/* number + icon row */}
      <div className="flex items-start justify-between">
        <span className="text-white/10 text-4xl font-bold leading-none select-none group-hover:text-accent/15 transition-colors duration-300">
          {service.num}
        </span>
        <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/15 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
          <Icon className="text-accent text-lg" />
        </div>
      </div>

      {/* title */}
      <h3 className="text-white text-lg font-bold leading-snug group-hover:text-accent transition-colors duration-250">
        {service.title}
      </h3>

      {/* description */}
      <p className="text-white/45 text-sm leading-relaxed flex-1">{service.description}</p>

      {/* feature pills */}
      <div className="flex flex-wrap gap-2 pt-1 border-t border-white/5">
        {service.features.map((f) => (
          <span key={f} className="px-2.5 py-1 rounded-lg bg-white/4 text-white/50 text-[10px] font-medium border border-white/5 group-hover:border-accent/15 group-hover:text-white/65 transition-all duration-250">
            {f}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

/* ── Page ───────────────────────────────────────────── */
const Services = () => {
  return (
    <section className="min-h-screen bg-primary pb-20">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <PageHeader
          badge="What I Offer"
          header="My"
          subheader="Services"
          desc="Comprehensive technology solutions tailored to your needs — from concept to production."
        />

        {/* SERVICES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {servicesList.map((service, i) => (
            <ServiceCard key={service.num} service={service} index={i} />
          ))}
        </div>

        {/* CTA BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-16 relative overflow-hidden rounded-2xl border border-accent/20 bg-[#181820] p-8 md:p-12"
        >
          {/* subtle background glow */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-accent text-[10px] uppercase tracking-[0.22em] font-semibold mb-2">Let's collaborate</p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Ready to start your project?</h3>
              <p className="text-white/45 text-sm max-w-md">
                Let's discuss how I can help bring your ideas to life with modern technology.
              </p>
            </div>
            <Link
              href="/contact"
              className="flex-shrink-0 flex items-center gap-2.5 px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/85 transition-colors duration-250 group"
            >
              Get in touch
              <FiArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Services;
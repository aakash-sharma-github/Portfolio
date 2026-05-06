"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { contactApi } from "@/lib/api";
import { Toaster, toast } from "sonner";
import {
  FiMail, FiMapPin, FiGithub, FiLinkedin,
  FiArrowUpRight, FiCheckCircle,
} from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import { SocialsContact } from "@/components/Socials";
import PageHeader from "@/components/PageHeader";

/* ── schema ─────────────────────────────────────────── */
const formSchema = z.object({
  fullname: z.string().min(2, "Please enter your full name."),
  email: z.string().min(1, "Please enter your email.").email("Enter a valid email."),
  subject: z.string().min(1, "Please enter a subject."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

/* ── info items ─────────────────────────────────────── */
const contactInfo = [
  {
    icon: FiMail,
    label: "Email",
    value: "aakashsharma9855@gmail.com",
    href: "mailto:aakashsharma9855@gmail.com",
  },
  {
    icon: FiMapPin,
    label: "Location",
    value: "Dubai, UAE",
    href: null,
  },
];

/* ── availability dots ─────────────────────────────── */
const availability = [
  { label: "Freelance projects", available: true },
  { label: "Full-time roles", available: true },
  { label: "Open source", available: true },
  { label: "Consulting", available: true },
];

/* ── stagger ────────────────────────────────────────── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38 } },
};

/* ── Contact Page ───────────────────────────────────── */
const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { fullname: "", email: "", subject: "", message: "" },
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      await contactApi.submitContact({
        fullname: values.fullname.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
      });
      setSent(true);
      form.reset();
      toast.success("Message sent! I'll get back to you soon.");
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to send message.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      className="min-h-screen bg-primary"
    >
      <div className="container mx-auto px-4 pb-4">
        {/* HEADER */}
        <PageHeader
          badge="Let's connect"
          header="Get In"
          subheader="Touch"
          desc="Have a project in mind or want to say hello? I'd love to hear from you."
        />

        {/* TWO COLUMN */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 xl:gap-12 max-w-6xl mx-auto">

          {/* ═══ LEFT: Info panel ═══ */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {/* contact info cards */}
            <motion.div variants={fadeUp} className="bg-[#181820] border border-white/6 rounded-2xl p-6 space-y-4">
              <p className="text-white/30 text-[9px] uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                <span className="h-px flex-1 bg-white/8" />Contact Info<span className="h-px flex-1 bg-white/8" />
              </p>
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/15 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                    <Icon className="text-accent" size={15} />
                  </div>
                  <div>
                    <p className="text-white/35 text-[10px] uppercase tracking-widest">{label}</p>
                    {href ? (
                      <a href={href} className="text-white text-sm font-medium hover:text-accent transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="text-white text-sm font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* availability */}
            <motion.div variants={fadeUp} className="bg-[#181820] border border-white/6 rounded-2xl p-6 hidden sm:block">
              <p className="text-white/30 text-[9px] uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                <span className="h-px flex-1 bg-white/8" />Availability<span className="h-px flex-1 bg-white/8" />
              </p>
              <div className="space-y-3">
                {availability.map(({ label, available }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-white/55 text-sm">{label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${available ? "bg-green-400 animate-pulse" : "bg-white/20"}`} />
                      <span className={`text-[10px] font-semibold ${available ? "text-green-400" : "text-white/30"}`}>
                        {available ? "Open" : "Closed"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* socials */}
            <motion.div variants={fadeUp} className="bg-[#181820] border border-white/6 rounded-2xl p-6">
              <p className="text-white/30 text-[9px] uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                <span className="h-px flex-1 bg-white/8" />Socials<span className="h-px flex-1 bg-white/8" />
              </p>
              {/* <div className="flex gap-3">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex flex-col items-center gap-2 py-3 rounded-xl bg-white/4 border border-white/6 hover:border-accent/30 hover:bg-accent/8 transition-all duration-250 group"
                  >
                    <Icon className="text-white/45 group-hover:text-accent transition-colors" size={18} />
                    <span className="text-white/30 text-[9px] uppercase tracking-widest group-hover:text-accent/70 transition-colors">{label}</span>
                  </a>
                ))}
              </div> */}
              <SocialsContact />
            </motion.div>
          </motion.div>

          {/* ═══ RIGHT: Form ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.45 }}
            className="lg:col-span-3"
          >
            <div className="bg-[#181820] border border-white/6 rounded-2xl p-7 md:p-9 h-full">

              {/* success state */}
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full py-16 text-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-green-400/10 border border-green-400/20 flex items-center justify-center">
                    <FiCheckCircle className="text-green-400" size={28} />
                  </div>
                  <h3 className="text-white text-xl font-bold">Message sent!</h3>
                  <p className="text-white/45 text-sm max-w-xs">
                    Thanks for reaching out. I'll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-2 px-5 py-2 rounded-xl border border-accent/30 text-accent text-sm hover:bg-accent/10 transition-colors"
                  >
                    Send another
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="mb-7">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      Let's <span className="text-accent">work together</span>
                    </h2>
                    <p className="text-white/40 text-sm">
                      Fill out the form and I'll reply within 24 hours.
                    </p>
                  </div>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit, () => toast.error("Please fix the errors above."))}
                      className="space-y-5"
                    >
                      {/* name + email */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField
                          control={form.control}
                          name="fullname"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white/55 text-xs uppercase tracking-widest">Full Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="bg-[#13131a] border-white/8 text-white placeholder:text-white/20 focus:border-accent/50 h-11 rounded-xl"
                                  placeholder="Your name"
                                />
                              </FormControl>
                              <FormMessage className="text-red-400/80 text-xs" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white/55 text-xs uppercase tracking-widest">Email</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  className="bg-[#13131a] border-white/8 text-white placeholder:text-white/20 focus:border-accent/50 h-11 rounded-xl"
                                  placeholder="your@email.com"
                                />
                              </FormControl>
                              <FormMessage className="text-red-400/80 text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* subject */}
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/55 text-xs uppercase tracking-widest">Subject</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-[#13131a] border-white/8 text-white placeholder:text-white/20 focus:border-accent/50 h-11 rounded-xl"
                                placeholder="What's this about?"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400/80 text-xs" />
                          </FormItem>
                        )}
                      />

                      {/* message */}
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/55 text-xs uppercase tracking-widest">Message</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                className="bg-[#13131a] border-white/8 text-white placeholder:text-white/20 focus:border-accent/50 min-h-[140px] resize-none rounded-xl"
                                placeholder="Tell me about your project…"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400/80 text-xs" />
                          </FormItem>
                        )}
                      />

                      {/* submit */}
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-accent hover:bg-accent/85 text-white font-semibold py-5 rounded-xl transition-all duration-250 disabled:opacity-50 flex items-center justify-center gap-2 group"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="animate-spin" size={16} />
                            <span>Sending…</span>
                          </>
                        ) : (
                          <>
                            <Send size={15} />
                            <span>Send Message</span>
                            <FiArrowUpRight size={15} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </>
              )}
            </div>
          </motion.div>

        </div>
      </div>
      <Toaster richColors />
    </motion.section>
  );
};

export default Contact;
"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import FadeIn from "@/components/FadeIn";

const experience = [
  {
    role: "IT Developer — Data Engineering & Analytics",
    company: "Evergreen Engineering Inc.",
    location: "Eugene, OR",
    period: "Jun 2025 – May 2026",
    bullets: [
      "Sole IT developer — owned design, development, and maintenance of a production intranet and analytics platform.",
      "Built a Drive Search system indexing ~7 million files / 16 TB into a SQL-backed searchable database with metadata, keyword, and AI-powered semantic similarity search — cutting document search time by ~80%.",
      "Developed ETL-style backend workflows to extract, organize, and refresh file metadata and content from structured and unstructured sources.",
      "Integrated Ajera data into Metabase leadership dashboards for financial, labor, and output reporting.",
      "Built Linux cron jobs and automation scripts to keep indexes and data workflows updated on schedule.",
    ],
    tags: ["Python", "SQL", "ETL", "Linux", "Metabase", "Semantic Search", "WordPress"],
  },
  {
    role: "Artificial Life Challenge — CS Capstone",
    company: "Oregon State University",
    location: "Corvallis, OR",
    period: "Sep 2025 – Jun 2026",
    bullets: [
      "Served as Scrum Leader, Product Owner, and developer — organized sprint workflow and defined project priorities.",
      "Designed and implemented the database structure, save-state functionality, and state manipulation for simulation data.",
      "Built resource-generation logic, UI components, and real-time data displays for the interactive application.",
    ],
    tags: ["Scrum", "Database Design", "UI", "Simulation"],
  },
];

const projects = [
  {
    name: "Drive Search System",
    description:
      "Indexed ~7M files / 16 TB of company documents into a SQL-backed search engine with metadata, keyword, and AI semantic similarity search. Reduced employee document search time by ~80%.",
    tags: ["Python", "SQL", "Semantic Search", "ETL"],
    href: "#",
  },
  {
    name: "Analytics Intranet",
    description:
      "Designed and built a full production intranet with access-controlled analytics dashboards, Metabase integrations, and internal reporting tools for company leadership.",
    tags: ["WordPress", "PHP", "SQL", "Metabase"],
    href: "#",
  },
  {
    name: "Artificial Life Simulator",
    description:
      "CS capstone — simulation app with persistent state, resource-generation logic, and real-time UI. Served as Scrum Leader and Product Owner.",
    tags: ["Scrum", "Database Design", "UI"],
    href: "#",
  },
  {
    name: "kaisplace.com",
    description: "This portfolio site — built with Next.js, Tailwind CSS, and Framer Motion.",
    tags: ["Next.js", "Tailwind", "Framer Motion"],
    href: "#",
  },
];

const skills = [
  "Python", "SQL", "C / C++", "Java", "PHP", "Bash", "PowerShell",
  "HTML / CSS / JS", "Data Engineering", "ETL Pipelines", "Semantic Search",
  "Linux", "Metabase", "Gephi", "Data Visualization", "Samba",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-x-hidden">

      {/* Ambient gradient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-violet-200/30 dark:bg-violet-900/20 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full bg-sky-200/30 dark:bg-sky-900/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] rounded-full bg-rose-200/20 dark:bg-rose-900/10 blur-3xl" />
      </div>

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-100 dark:border-zinc-800/60"
      >
        <div className="flex items-center justify-between px-8 py-4 max-w-4xl mx-auto">
          <span className="font-bold tracking-tight text-lg bg-gradient-to-r from-violet-600 to-sky-500 bg-clip-text text-transparent">
            kai.
          </span>
          <div className="flex gap-6 text-sm text-zinc-500 dark:text-zinc-400">
            {["about", "experience", "projects", "contact"].map((s) => (
              <a
                key={s}
                href={`#${s}`}
                className="capitalize hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-8 pt-28 pb-24">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-sm text-violet-500 dark:text-violet-400 mb-4 tracking-widest uppercase font-medium"
        >
          CS Graduate · IT Developer · Data Engineer
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-6xl font-bold tracking-tight mb-6 leading-tight"
        >
          Hi, I&apos;m{" "}
          <span className="bg-gradient-to-r from-violet-600 via-sky-500 to-cyan-400 bg-clip-text text-transparent">
            Kai Lindskog.
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-xl text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed mb-10"
        >
          B.S. Computer Science, Oregon State University. I build data systems,
          internal tools, and web applications. Welcome to my place on the internet.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex gap-4"
        >
          <a
            href="#experience"
            className="rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 text-sm font-medium hover:opacity-80 transition-opacity"
          >
            View my work
          </a>
          <a
            href="#contact"
            className="rounded-full border border-zinc-300 dark:border-zinc-700 px-6 py-3 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            Get in touch
          </a>
        </motion.div>
      </section>

      {/* About */}
      <section id="about" className="max-w-4xl mx-auto px-8 py-20">
        <FadeIn>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-violet-500 dark:text-violet-400 mb-3">
            About
          </h2>
          <p className="text-3xl font-semibold tracking-tight mb-8 max-w-2xl leading-snug">
            Data engineer, developer, and problem solver.
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl text-lg mb-6">
            I&apos;m a Computer Science graduate from Oregon State University with a focus on Applied Data Science.
            I&apos;ve worked as the sole IT developer at an engineering firm, building production search systems,
            ETL pipelines, analytics dashboards, and internal tools from the ground up.
          </p>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl text-lg mb-10">
            I care about the full stack — from well-structured databases and backend workflows
            to clean, functional interfaces that make data accessible to the people who need it.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-3">Skills &amp; Technologies</p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-full text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Experience */}
      <section id="experience" className="max-w-4xl mx-auto px-8 py-20 border-t border-zinc-100 dark:border-zinc-800">
        <FadeIn>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-violet-500 dark:text-violet-400 mb-3">
            Experience
          </h2>
          <p className="text-3xl font-semibold tracking-tight mb-10">Where I&apos;ve worked</p>
        </FadeIn>
        <div className="flex flex-col gap-10">
          {experience.map((job, i) => (
            <FadeIn key={job.role} delay={i * 0.1}>
              <div className="grid sm:grid-cols-[1fr_auto] gap-1 mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{job.role}</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm">{job.company} &mdash; {job.location}</p>
                </div>
                <span className="text-sm text-zinc-400 sm:text-right whitespace-nowrap">{job.period}</span>
              </div>
              <ul className="space-y-2 mb-4">
                {job.bullets.map((b, j) => (
                  <li key={j} className="flex gap-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-full bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-900">
                    {tag}
                  </span>
                ))}
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Education */}
        <FadeIn delay={0.2}>
          <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-4">Education</p>
            <div className="flex items-center justify-between gap-6">
              <div>
                <h3 className="font-semibold">B.S. Computer Science — Applied Data Science</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Oregon State University · Corvallis, OR</p>
              </div>
              <Image
                src="/osu-primarylogo.jpg"
                alt="Oregon State University Logo"
                width={800}
                height={240}
                className="h-28 w-auto object-contain shrink-0"
              />
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Projects */}
      <section id="projects" className="max-w-4xl mx-auto px-8 py-20 border-t border-zinc-100 dark:border-zinc-800">
        <FadeIn>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-violet-500 dark:text-violet-400 mb-3">
            Projects
          </h2>
          <p className="text-3xl font-semibold tracking-tight mb-10">Things I&apos;ve built</p>
        </FadeIn>
        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((project, i) => (
            <FadeIn key={project.name} delay={i * 0.1}>
              <motion.a
                href={project.href}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group block rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-lg hover:shadow-violet-100 dark:hover:shadow-violet-950 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {project.name}
                  </h3>
                  <span className="text-zinc-400 group-hover:text-violet-500 transition-colors text-lg">↗</span>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                  {project.description}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-full bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-900">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.a>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-4xl mx-auto px-8 py-20 border-t border-zinc-100 dark:border-zinc-800">
        <FadeIn>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-violet-500 dark:text-violet-400 mb-3">
            Contact
          </h2>
          <p className="text-3xl font-semibold tracking-tight mb-4">Let&apos;s work together.</p>
          <p className="text-zinc-600 dark:text-zinc-400 mb-10 max-w-md">
            Whether you have a project in mind or just want to say hi — my inbox is always open.
          </p>
        </FadeIn>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Email */}
          <FadeIn delay={0.1} className="flex-1">
            <motion.a
              href="mailto:kaiblindskog@gmail.com"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm px-6 py-5 hover:border-violet-400 dark:hover:border-violet-500 transition-colors group h-full"
            >
              <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-zinc-500 dark:text-zinc-400 group-hover:text-violet-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0-9.75 6.75L2.25 6.75" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-sm mb-0.5">Email</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-violet-500 transition-colors">
                  kaiblindskog@gmail.com
                </p>
              </div>
            </motion.a>
          </FadeIn>

          {/* LinkedIn */}
          <FadeIn delay={0.2} className="flex-1">
            <motion.a
              href="https://www.linkedin.com/in/kai-lindskog-b798a5254/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm px-6 py-5 hover:border-sky-400 dark:hover:border-sky-500 transition-colors group h-full"
            >
              <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800">
                <Image
                  src="/linkedin-logo.webp"
                  alt="LinkedIn"
                  width={44}
                  height={44}
                  className="w-11 h-11 object-contain rounded-lg"
                />
              </div>
              <div>
                <p className="font-semibold text-sm mb-0.5">LinkedIn</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-sky-500 transition-colors">
                  kai-lindskog
                </p>
              </div>
            </motion.a>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-8 py-8 border-t border-zinc-100 dark:border-zinc-800 text-sm text-zinc-400 flex justify-between items-center">
        <span>© {new Date().getFullYear()} Kai Lindskog</span>
        <span className="bg-gradient-to-r from-violet-600 to-sky-500 bg-clip-text text-transparent font-semibold">
          kai.
        </span>
      </footer>

    </div>
  );
}

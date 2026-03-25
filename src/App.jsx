import { useState, useEffect, useRef } from "react";

// ─── SUPABASE CONFIG ───
const SUPABASE_URL = "https://nrftvkralygjtlgaxkua.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yZnR2a3JhbHlnanRsZ2F4a3VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NTg5MjksImV4cCI6MjA5MDAzNDkyOX0.bkcLRxiprpZTaWGoM_J9BVRLfeWBUR_RqOmYS8Am-6Y";

async function saveContact(data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/contacts`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to save");
  return res.json();
}

// ─── DATA ───
const PROJECTS = [
  {
    id: "captains-log",
    name: "Captain's Log Tracker",
    tag: "Full-Stack App",
    summary: "Content distribution management across 30+ platforms",
    description:
      "Full-stack React + Supabase application for tracking content publishing workflows. Features per-log checklists across 30+ channels, credential vault, analytics dashboard with phase-level progress rings, and 10-gate editorial approval workflow. Database redesigned from flat JSON blobs into 4 normalized PostgreSQL tables.",
    tech: ["React", "Supabase", "PostgreSQL", "REST API"],
    metrics: ["30+ channels", "10 review gates", "4 normalized tables"],
    github: "https://github.com/elly-rezende/captains-log-tracker",
  },
  {
    id: "linkedin-engine",
    name: "LinkedIn Content Engine",
    tag: "AI-Powered Tool",
    summary: "AI-generated LinkedIn posts from real-time tech news",
    description:
      "Built with Claude API integration. Fetches real-time tech news from 12+ sources (TechCrunch, The Verge, Anthropic, OpenAI, GitHub), then generates LinkedIn posts matching a professional voice. Features topic filtering, 5 post styles, and one-click copy.",
    tech: ["React", "Claude API", "REST APIs", "Vite"],
    metrics: ["12+ sources", "5 post styles", "Real-time fetch"],
    github: "https://github.com/elly-rezende/linkedin-content-engine",
  },
  {
    id: "design-system",
    name: "COE Design System",
    tag: "Design Tokens",
    summary: "Token-based design system with programmatic palette generation",
    description:
      "Complete design token architecture with CSS variables, JavaScript constants, and JSON definitions. Features dark theme as primary context, rgba transparency patterns for layering, semantic stage colors, and a Python script that generates visual PDF palette references.",
    tech: ["CSS Variables", "JavaScript", "Python", "JSON"],
    metrics: ["3 output formats", "Dark-first", "PDF generation"],
    github: "https://github.com/elly-rezende/design-system-tokens",
  },
  {
    id: "content-engine",
    name: "Content Distribution Engine",
    tag: "Pipeline System",
    summary: "Multi-platform publishing pipeline with 26 channel adapters",
    description:
      "Comprehensive content distribution system that transforms one founder recording into 30+ platform-specific outputs. Includes a 26-skill reusable prompt library, dual-voice editorial strategy (personal vs. institutional), and a documented Customer User Journey mapping every step from raw text to live channels.",
    tech: ["Prompt Engineering", "Markdown", "Multi-platform", "CUJ"],
    metrics: ["26 skill library", "30+ platforms", "Dual-voice"],
    github: "https://github.com/elly-rezende/content-distribution-engine",
  },
];

const SKILLS = [
  { name: "React", level: 85, category: "frontend" },
  { name: "JavaScript", level: 90, category: "frontend" },
  { name: "HTML/CSS", level: 90, category: "frontend" },
  { name: "Tailwind CSS", level: 80, category: "frontend" },
  { name: "Supabase", level: 85, category: "backend" },
  { name: "PostgreSQL", level: 70, category: "backend" },
  { name: "REST APIs", level: 80, category: "backend" },
  { name: "Node.js", level: 65, category: "backend" },
  { name: "Claude / ChatGPT", level: 90, category: "ai" },
  { name: "Prompt Engineering", level: 95, category: "ai" },
  { name: "Anthropic API", level: 85, category: "ai" },
  { name: "GitHub Copilot", level: 80, category: "ai" },
  { name: "Git / GitHub", level: 85, category: "tools" },
  { name: "Canva / Figma", level: 80, category: "tools" },
  { name: "DaVinci Resolve", level: 70, category: "tools" },
  { name: "Descript", level: 80, category: "tools" },
  { name: "Articulate Rise", level: 85, category: "tools" },
  { name: "TalentLMS", level: 80, category: "tools" },
];

const SKILL_CATEGORIES = {
  all: { label: "All Skills", color: "#D4A853" },
  frontend: { label: "Frontend", color: "#7DD3A8" },
  backend: { label: "Backend", color: "#7DADE3" },
  ai: { label: "AI & LLM", color: "#C47AF4" },
  tools: { label: "Tools", color: "#F4A97A" },
};

const EXPERIENCE = [
  {
    role: "Content Operations & Distribution Manager",
    company: "Covenant of Education (COE)",
    period: "2025 – Present",
    location: "Remote",
    highlights: [
      "Designed and operate full content distribution pipeline: 1 input → 30+ platform outputs",
      "Built 26-skill reusable prompt library covering every distribution channel",
      "Developed Captain's Log Tracker (React + Supabase) as operational command center",
      "Manage dual-voice content strategy across personal and institutional channels",
      "Operate video pipeline: iPhone → AirDrop → Descript → YouTube with SEO optimization",
    ],
  },
  {
    role: "E-Learning Content & LMS Administrator",
    company: "vVardis",
    period: "2024 – 2025",
    location: "Remote",
    highlights: [
      "Administered TalentLMS for Swiss dental innovation company",
      "Coordinated multilingual content across English, German, French, and Italian",
      "Managed voiceover integration, assessment creation, and QA across 4 languages",
      "Handled Netlify deployments and content migration for web-based modules",
    ],
  },
];

// ─── TYPEWRITER COMPONENT ───
function TypeWriter({ texts, speed = 40, pause = 1500 }) {
  const [charIdx, setCharIdx] = useState(0);
  const [textIdx, setTextIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIdx];
    if (!deleting && charIdx === current.length) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (deleting && charIdx === 0) {
      setDeleting(false);
      setTextIdx((prev) => (prev + 1) % texts.length);
      return;
    }
    const t = setTimeout(
      () => setCharIdx((prev) => prev + (deleting ? -1 : 1)),
      deleting ? speed / 2 : speed
    );
    return () => clearTimeout(t);
  }, [charIdx, deleting, textIdx, texts, speed, pause]);

  const display = texts[textIdx].substring(0, charIdx);
  return (
    <>
      {display}
      <span style={{ animation: "blink 1s step-end infinite", color: "#D4A853" }}>█</span>
    </>
  );
}

// ─── TERMINAL BOOT ───
function TerminalBoot({ onComplete }) {
  const [lines, setLines] = useState([]);
  const ref = useRef(null);

  const bootSequence = [
    { text: "$ ssh elly@portfolio.dev", delay: 0, color: "#D4A853" },
    { text: "Connected to elly.dev — Florianópolis, BR", delay: 600, color: "#555" },
    { text: "", delay: 1200 },
    { text: "  ╔═══════════════════════════════════════════╗", delay: 1500, color: "#D4A853" },
    { text: "  ║  ELLY — Full-Stack Developer              ║", delay: 1600, color: "#D4A853" },
    { text: "  ║  React · Supabase · AI · 5 Languages      ║", delay: 1700, color: "#D4A853" },
    { text: "  ║  Remote (Global) · Building things that    ║", delay: 1800, color: "#D4A853" },
    { text: "  ║  work since day one.                       ║", delay: 1900, color: "#D4A853" },
    { text: "  ╚═══════════════════════════════════════════╝", delay: 2000, color: "#D4A853" },
    { text: "", delay: 2300 },
    { text: "$ cat /etc/motd", delay: 2500, color: "#7DD3A8" },
    { text: "Welcome. I'm Elly Rezende — I build content systems, full-stack apps, and AI-powered tools.", delay: 2800, color: "#ccc" },
    { text: "I build content distribution systems, full-stack apps, and AI-powered tools.", delay: 3200, color: "#ccc" },
    { text: "", delay: 3600 },
    { text: "$ ls ~/projects", delay: 3800, color: "#7DD3A8" },
    { text: "captains-log-tracker/  linkedin-engine/  design-system/  content-engine/", delay: 4100, color: "#7DADE3" },
    { text: "", delay: 4400 },
    { text: "→ Scroll down to explore ↓", delay: 4800, color: "#D4A853" },
  ];

  useEffect(() => {
    bootSequence.forEach(({ text, delay, color }) => {
      setTimeout(() => {
        setLines((prev) => [...prev, { text, color }]);
      }, delay);
    });
    setTimeout(() => onComplete?.(), 5500);
  }, []);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [lines]);

  return (
    <div
      ref={ref}
      style={{
        background: "#0a0b10",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "40px 20px",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        fontSize: "14px",
        maxWidth: 720,
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            color: line.color || "#888",
            lineHeight: 1.7,
            whiteSpace: "pre",
            animation: "fadeIn 0.3s ease",
            minHeight: line.text === "" ? "1em" : "auto",
          }}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
}

// ─── SKILL BAR ───
function SkillBar({ name, level, color }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setWidth(level); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [level]);

  return (
    <div ref={ref} style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: "#ccc", fontFamily: "'JetBrains Mono', monospace" }}>{name}</span>
        <span style={{ fontSize: 12, color: "#666" }}>{level}%</span>
      </div>
      <div style={{ background: "#1a1b23", borderRadius: 4, height: 6, overflow: "hidden" }}>
        <div
          style={{
            width: `${width}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
            borderRadius: 4,
            transition: "width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        />
      </div>
    </div>
  );
}

// ─── PROJECT CARD ───
function ProjectCard({ project, isHovered, onHover }) {
  return (
    <div
      onMouseEnter={() => onHover(project.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        background: isHovered ? "#13141c" : "#0e0f15",
        border: `1px solid ${isHovered ? "#D4A853" : "#1a1b23"}`,
        borderRadius: 12,
        padding: 28,
        transition: "all 0.3s ease",
        transform: isHovered ? "translateY(-4px)" : "none",
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 18, color: "#f0e8df", fontWeight: 600 }}>{project.name}</h3>
        <span
          style={{
            fontSize: 10,
            padding: "3px 10px",
            borderRadius: 20,
            background: "#D4A85322",
            color: "#D4A853",
            fontWeight: 600,
            letterSpacing: "0.05em",
            whiteSpace: "nowrap",
          }}
        >
          {project.tag}
        </span>
      </div>
      <p style={{ color: "#888", fontSize: 14, lineHeight: 1.6, margin: "0 0 16px" }}>{project.summary}</p>
      <div
        style={{
          maxHeight: isHovered ? 300 : 0,
          overflow: "hidden",
          transition: "max-height 0.5s ease, opacity 0.3s ease",
          opacity: isHovered ? 1 : 0,
        }}
      >
        <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.7, margin: "0 0 16px" }}>{project.description}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {project.metrics.map((m, i) => (
            <span key={i} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "#7DD3A822", color: "#7DD3A8" }}>
              {m}
            </span>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {project.tech.map((t, i) => (
            <span key={i} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "#1a1b23", color: "#888" }}>
              {t}
            </span>
          ))}
        </div>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 12, color: "#D4A853", textDecoration: "none" }}
          onClick={(e) => e.stopPropagation()}
        >
          GitHub →
        </a>
      </div>
    </div>
  );
}

// ─── MAIN APP ───
export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredProject, setHoveredProject] = useState(null);
  const [skillFilter, setSkillFilter] = useState("all");
  const [bootDone, setBootDone] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [formSent, setFormSent] = useState(false);
  const [formError, setFormError] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    setFormError(false);
    try {
      await saveContact({
        name: form.name,
        email: form.email,
        message: form.message,
        created_at: new Date().toISOString(),
      });
      setFormSent(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setFormSent(false), 4000);
    } catch {
      setFormError(true);
    } finally {
      setSending(false);
    }
  };

  const filteredSkills = skillFilter === "all" ? SKILLS : SKILLS.filter((s) => s.category === skillFilter);

  const navItems = [
    ["home", "Home"],
    ["projects", "Projects"],
    ["skills", "Skills"],
    ["experience", "Experience"],
    ["contact", "Contact"],
  ];

  const sectionStyle = {
    maxWidth: 900,
    margin: "0 auto",
    padding: "80px 24px",
  };

  const sectionTitle = (text, sub) => (
    <div style={{ marginBottom: 48 }}>
      <h2 style={{ fontSize: 28, color: "#f0e8df", margin: 0, fontWeight: 600 }}>
        <span style={{ color: "#D4A853", marginRight: 8 }}>$</span>
        {text}
      </h2>
      {sub && <p style={{ color: "#555", fontSize: 14, marginTop: 8 }}>{sub}</p>}
    </div>
  );

  const inputStyle = {
    width: "100%",
    background: "#111218",
    border: "1px solid #262730",
    borderRadius: 8,
    padding: "12px 16px",
    color: "#ccc",
    fontSize: 14,
    fontFamily: "'JetBrains Mono', monospace",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s",
  };

  if (!bootDone) {
    return <TerminalBoot onComplete={() => setBootDone(true)} />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0b10",
        fontFamily: "'Sora', 'Inter', system-ui, sans-serif",
        color: "#e0d8cf",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Sora:wght@300;400;500;600;700&display=swap');
        @keyframes blink { 50% { opacity: 0; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        * { scrollbar-width: thin; scrollbar-color: #333 #0a0b10; }
        html { scroll-behavior: smooth; }
        a:hover { opacity: 0.85; }
        ::selection { background: #D4A85344; color: #f0e8df; }
      `}</style>

      {/* NAV */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "12px 24px",
          background: "#0a0b10ee",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #1a1b23",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: "#D4A853", fontWeight: 600 }}>
          elly.dev
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          {navItems.map(([key, label]) => (
            <a
              key={key}
              href={`#${key}`}
              onClick={() => setActiveSection(key)}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                fontSize: 13,
                color: activeSection === key ? "#D4A853" : "#666",
                background: activeSection === key ? "#D4A85311" : "transparent",
                textDecoration: "none",
                transition: "all 0.2s",
                fontWeight: activeSection === key ? 500 : 400,
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section id="home" style={{ ...sectionStyle, paddingTop: 160, paddingBottom: 100 }}>
        <div style={{ marginBottom: 16 }}>
          <span
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              color: "#555",
              textTransform: "uppercase",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Content Operations · Full-Stack Development · AI Integration
          </span>
        </div>
        <h1 style={{ fontSize: 48, fontWeight: 700, color: "#f0e8df", margin: "0 0 16px", lineHeight: 1.15 }}>
          Elly
          <br />
          <span style={{ color: "#D4A853" }}>Rezende</span>
        </h1>
        <p style={{ fontSize: 20, color: "#888", maxWidth: 600, lineHeight: 1.6, margin: "0 0 32px" }}>
          I'm{" "}
          <TypeWriter
            texts={[
              "building full-stack apps with React + Supabase",
              "designing content systems for 30+ platforms",
              "integrating AI into real workflows",
              "turning ideas into deployed products",
            ]}
            speed={45}
            pause={2000}
          />
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a
            href="#projects"
            style={{
              padding: "12px 28px",
              background: "#D4A853",
              color: "#0a0b10",
              borderRadius: 8,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            View Projects
          </a>
          <a
            href="#contact"
            style={{
              padding: "12px 28px",
              border: "1px solid #333",
              color: "#ccc",
              borderRadius: 8,
              textDecoration: "none",
              fontSize: 14,
            }}
          >
            Get in Touch
          </a>
          <a
            href="https://github.com/elly-rezende"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "12px 28px",
              border: "1px solid #333",
              color: "#ccc",
              borderRadius: 8,
              textDecoration: "none",
              fontSize: 14,
            }}
          >
            GitHub ↗
          </a>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" style={{ ...sectionStyle, background: "#0c0d13", borderRadius: 0 }}>
        {sectionTitle("ls ~/projects", "Things I've built — real systems in production")}
        <div style={{ display: "grid", gap: 20 }}>
          {PROJECTS.map((p) => (
            <ProjectCard key={p.id} project={p} isHovered={hoveredProject === p.id} onHover={setHoveredProject} />
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" style={sectionStyle}>
        {sectionTitle("cat ~/.skills", "What I work with")}
        <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
          {Object.entries(SKILL_CATEGORIES).map(([key, { label, color }]) => (
            <button
              key={key}
              onClick={() => setSkillFilter(key)}
              style={{
                padding: "6px 16px",
                borderRadius: 20,
                border: `1px solid ${skillFilter === key ? color : "#262730"}`,
                background: skillFilter === key ? `${color}18` : "transparent",
                color: skillFilter === key ? color : "#666",
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 32px" }}>
          {filteredSkills.map((skill) => (
            <SkillBar
              key={skill.name}
              name={skill.name}
              level={skill.level}
              color={SKILL_CATEGORIES[skill.category]?.color || "#D4A853"}
            />
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" style={{ ...sectionStyle, background: "#0c0d13" }}>
        {sectionTitle("cat ~/experience.log", "Where I've worked")}
        <div style={{ display: "grid", gap: 32 }}>
          {EXPERIENCE.map((exp, i) => (
            <div
              key={i}
              style={{
                borderLeft: "2px solid #D4A853",
                paddingLeft: 24,
                animation: "slideUp 0.6s ease",
              }}
            >
              <h3 style={{ margin: "0 0 4px", fontSize: 18, color: "#f0e8df" }}>{exp.role}</h3>
              <div style={{ fontSize: 14, color: "#D4A853", marginBottom: 4 }}>{exp.company}</div>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 16 }}>
                {exp.period} · {exp.location}
              </div>
              {exp.highlights.map((h, j) => (
                <div key={j} style={{ fontSize: 14, color: "#999", lineHeight: 1.7, marginBottom: 6, paddingLeft: 16, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, color: "#D4A853" }}>▸</span>
                  {h}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={sectionStyle}>
        {sectionTitle("mail elly@portfolio.dev", "Let's work together")}
        <div style={{ maxWidth: 520 }}>
          <p style={{ color: "#888", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
            Open to Content Operations, Digital Distribution, Social Media Operations, and Technical Content Management roles — remote or hybrid. Based in Florianópolis, Brazil.
          </p>
          <div style={{ display: "grid", gap: 16 }}>
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#D4A853")}
              onBlur={(e) => (e.target.style.borderColor = "#262730")}
            />
            <input
              type="email"
              placeholder="Your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#D4A853")}
              onBlur={(e) => (e.target.style.borderColor = "#262730")}
            />
            <textarea
              placeholder="Your message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              style={{ ...inputStyle, resize: "vertical" }}
              onFocus={(e) => (e.target.style.borderColor = "#D4A853")}
              onBlur={(e) => (e.target.style.borderColor = "#262730")}
            />
            <button
              onClick={handleSubmit}
              disabled={sending || !form.name || !form.email || !form.message}
              style={{
                padding: "14px 32px",
                background: sending ? "#333" : "#D4A853",
                color: "#0a0b10",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: sending ? "wait" : "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
                opacity: !form.name || !form.email || !form.message ? 0.5 : 1,
              }}
            >
              {sending ? "Sending..." : formSent ? "✓ Message Sent!" : "Send Message"}
            </button>
            {formSent && (
              <p style={{ color: "#7DD3A8", fontSize: 13 }}>Thanks! I'll get back to you soon.</p>
            )}
            {formError && (
              <p style={{ color: "#F4A97A", fontSize: 13 }}>Something went wrong. Try again or email me directly.</p>
            )}
          </div>
          <div style={{ marginTop: 40, display: "flex", gap: 24 }}>
            <a
              href="https://linkedin.com/in/adrielly-rezende"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#888", fontSize: 14, textDecoration: "none" }}
            >
              LinkedIn ↗
            </a>
            <a
              href="https://github.com/elly-rezende"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#888", fontSize: 14, textDecoration: "none" }}
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          textAlign: "center",
          padding: "40px 24px",
          borderTop: "1px solid #1a1b23",
          color: "#444",
          fontSize: 13,
        }}
      >
        <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          © {new Date().getFullYear()} Elly Rezende · Built with React
        </span>
      </footer>
    </div>
  );
}

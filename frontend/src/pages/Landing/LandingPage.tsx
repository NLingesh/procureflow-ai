import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Boxes, ArrowRight, Brain, Users, ShoppingCart, BarChart3,
  Shield, Sparkles, Upload, ScanSearch, CheckCircle2, CreditCard,
  Star, ChevronDown, ChevronUp, Menu, X, Zap, Globe, Clock,
} from "lucide-react";

/* ─── Navbar ─── */
const LandingNavbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 z-50 w-full glass-strong border-b border-white/20">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Boxes size={18} />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">ProcureFlow</span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {["Features","How It Works","Pricing","FAQ"].map(l=>(
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g,"-")}`} className="text-sm font-medium text-slate-600 transition hover:text-indigo-600">{l}</a>
          ))}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">Sign In</Link>
          <Link to="/dashboard" className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-700 hover:shadow-indigo-500/40">Get Started</Link>
        </div>
        <button onClick={()=>setOpen(!open)} className="md:hidden rounded-lg p-2 hover:bg-slate-100">
          {open ? <X size={20}/> : <Menu size={20}/>}
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
          {["Features","How It Works","FAQ"].map(l=>(
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g,"-")}`} onClick={()=>setOpen(false)} className="block py-2 text-sm text-slate-600">{l}</a>
          ))}
          <Link to="/login" className="mt-2 block rounded-xl bg-indigo-600 py-2.5 text-center text-sm font-semibold text-white">Get Started</Link>
        </div>
      )}
    </nav>
  );
};

/* ─── Hero ─── */
const Hero = () => (
  <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
    {/* Gradient blobs */}
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -top-24 -left-24 h-[500px] w-[500px] rounded-full bg-indigo-400/20 blur-3xl animate-blob" />
      <div className="absolute top-40 right-0 h-[400px] w-[400px] rounded-full bg-emerald-400/15 blur-3xl animate-blob animation-delay-400" />
      <div className="absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-violet-400/15 blur-3xl animate-blob animation-delay-800" />
    </div>
    <div className="mx-auto max-w-7xl px-6 text-center">
      <div className="animate-fade-in">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700">
          <Sparkles size={14} /> Powered by Advanced AI
        </div>
        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
          AI Procurement{" "}
          <span className="text-gradient-hero">Automation</span>{" "}
          for Modern Businesses
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
          Streamline purchasing, automate invoice processing, and gain intelligent insights — all from one unified platform built for speed and scale.
        </p>
      </div>
      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in animation-delay-200">
        <Link to="/dashboard" className="group inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/40 hover:gap-3">
          Get Started Free <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
        <a href="#how-it-works" className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-8 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50">
          View Demo
        </a>
      </div>
      {/* Dashboard preview */}
      <div className="relative mx-auto mt-16 max-w-5xl animate-fade-in animation-delay-400">
        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 opacity-20 blur-2xl" />
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-2xl">
          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-amber-400" />
            <div className="h-3 w-3 rounded-full bg-emerald-400" />
            <span className="ml-3 text-xs text-slate-400">app.procureflow.ai/dashboard</span>
          </div>
          <div className="gradient-mesh p-8 sm:p-12">
            <div className="grid gap-4 sm:grid-cols-4">
              {[
                { label: "Revenue", val: "$48,250", color: "from-indigo-500 to-indigo-600" },
                { label: "Vendors", val: "128", color: "from-emerald-500 to-emerald-600" },
                { label: "Orders", val: "542", color: "from-violet-500 to-violet-600" },
                { label: "Invoices", val: "389", color: "from-amber-500 to-amber-600" },
              ].map((c) => (
                <div key={c.label} className="rounded-xl bg-white/70 p-4 backdrop-blur-sm border border-white/40 shadow-sm">
                  <p className="text-xs font-medium text-slate-500">{c.label}</p>
                  <p className={`mt-1 text-2xl font-bold bg-gradient-to-r ${c.color} bg-clip-text text-transparent`}>{c.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Features ─── */
const features = [
  { icon: Brain, title: "AI Invoice Processing", desc: "Automatically extract, validate, and process invoices with 99.5% accuracy using machine learning.", color: "text-indigo-600 bg-indigo-100" },
  { icon: Users, title: "Smart Vendor Management", desc: "Track vendor performance, compliance, and relationships with intelligent scoring and alerts.", color: "text-emerald-600 bg-emerald-100" },
  { icon: ShoppingCart, title: "Purchase Order Automation", desc: "Create, approve, and track purchase orders with configurable workflows and auto-matching.", color: "text-violet-600 bg-violet-100" },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Real-time spending analytics, trend detection, and predictive insights at your fingertips.", color: "text-amber-600 bg-amber-100" },
  { icon: Shield, title: "Secure Payments", desc: "PCI-compliant payment processing with multi-level approvals and complete audit trails.", color: "text-rose-600 bg-rose-100" },
  { icon: Sparkles, title: "AI Insights", desc: "Get actionable recommendations for cost savings, risk mitigation, and process optimization.", color: "text-cyan-600 bg-cyan-100" },
];

const Features = () => (
  <section id="features" className="py-24 bg-white">
    <div className="mx-auto max-w-7xl px-6">
      <div className="text-center animate-fade-in">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">Features</p>
        <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Everything you need to procure smarter</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">From invoice capture to payment — automate every step of your procurement pipeline.</p>
      </div>
      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <div key={f.title} className="group rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 hover-lift animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
            <div className={`inline-flex rounded-2xl p-3 ${f.color}`}>
              <f.icon size={24} />
            </div>
            <h3 className="mt-5 text-xl font-bold text-slate-900">{f.title}</h3>
            <p className="mt-3 leading-relaxed text-slate-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Stats ─── */
const stats = [
  { value: "500+", label: "Companies", icon: Globe },
  { value: "98%", label: "Automation Rate", icon: Zap },
  { value: "40%", label: "Cost Reduction", icon: BarChart3 },
  { value: "24/7", label: "AI Assistant", icon: Clock },
];

const Stats = () => (
  <section className="relative py-20 overflow-hidden">
    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700" />
    <div className="absolute inset-0 -z-10 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
    <div className="mx-auto max-w-7xl px-6">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className="text-center animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
            <div className="mx-auto mb-4 inline-flex rounded-2xl bg-white/10 p-3 text-white backdrop-blur-sm">
              <s.icon size={24} />
            </div>
            <p className="text-4xl font-extrabold text-white sm:text-5xl">{s.value}</p>
            <p className="mt-2 text-sm font-medium text-indigo-200">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── How It Works ─── */
const steps = [
  { icon: Upload, title: "Upload Invoice", desc: "Drag and drop invoices in any format — PDF, image, or email." },
  { icon: ScanSearch, title: "AI Extracts Data", desc: "Our AI reads, validates, and structures all invoice data instantly." },
  { icon: CheckCircle2, title: "Approve Purchase", desc: "Review matched POs, approve with one click or auto-approve rules." },
  { icon: CreditCard, title: "Track Payments", desc: "Monitor payment status, schedules, and cash flow in real-time." },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 gradient-mesh">
    <div className="mx-auto max-w-7xl px-6">
      <div className="text-center animate-fade-in">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">How It Works</p>
        <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Four steps to procurement bliss</h2>
      </div>
      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <div key={s.title} className="relative text-center animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
            {i < steps.length - 1 && (
              <div className="absolute top-10 left-[calc(50%+40px)] hidden h-0.5 w-[calc(100%-80px)] bg-gradient-to-r from-indigo-300 to-indigo-100 lg:block" />
            )}
            <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
              <s.icon size={28} />
              <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-indigo-600 shadow ring-2 ring-indigo-100">{i + 1}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Testimonials ─── */
const testimonials = [
  { name: "Sarah Chen", role: "CFO at TechVentures", text: "ProcureFlow cut our invoice processing time by 80%. The AI accuracy is remarkable — it catches discrepancies we used to miss.", rating: 5 },
  { name: "Marcus Rodriguez", role: "Procurement Director, Axiom Corp", text: "Finally, a procurement tool that actually understands our workflows. The automation saves our team 20+ hours every week.", rating: 5 },
  { name: "Emily Watson", role: "VP Operations, ScaleUp Inc", text: "The analytics alone justified the investment. We identified $2M in savings within the first quarter of using ProcureFlow.", rating: 5 },
];

const Testimonials = () => (
  <section className="py-24 bg-white">
    <div className="mx-auto max-w-7xl px-6">
      <div className="text-center animate-fade-in">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">Testimonials</p>
        <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Loved by procurement teams</h2>
      </div>
      <div className="mt-16 grid gap-8 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <div key={t.name} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-lg hover-lift animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
            <div className="flex gap-1 text-amber-400">
              {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
            </div>
            <p className="mt-4 leading-relaxed text-slate-600">"{t.text}"</p>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white">
                {t.name.split(" ").map(n=>n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── FAQ ─── */
const faqs = [
  { q: "How does the AI invoice processing work?", a: "Our AI uses OCR and NLP to extract data from invoices in any format. It validates against your purchase orders and vendor records, flags discrepancies, and routes for approval — all automatically." },
  { q: "Is ProcureFlow secure?", a: "Absolutely. We use AES-256 encryption, SOC 2 Type II compliance, and role-based access controls. All payment processing is PCI-DSS Level 1 certified." },
  { q: "Can I integrate with my existing ERP?", a: "Yes. ProcureFlow integrates with SAP, Oracle, NetSuite, QuickBooks, and 50+ other platforms via native connectors and REST APIs." },
  { q: "What's the implementation timeline?", a: "Most teams are up and running within 2 weeks. Our onboarding specialists handle data migration, configuration, and training at no extra cost." },
  { q: "Do you offer a free trial?", a: "Yes! Start with a 14-day free trial with full access to all features. No credit card required." },
];

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <section id="faq" className="py-24 gradient-mesh">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center animate-fade-in">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">FAQ</p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">Got questions?</h2>
        </div>
        <div className="mt-12 space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-shadow hover:shadow-md animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="flex w-full items-center justify-between px-6 py-5 text-left">
                <span className="text-sm font-semibold text-slate-900">{f.q}</span>
                {openIdx === i ? <ChevronUp size={18} className="text-indigo-600 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
              </button>
              {openIdx === i && (
                <div className="border-t border-slate-100 px-6 py-4">
                  <p className="text-sm leading-relaxed text-slate-600">{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── Footer ─── */
const Footer = () => (
  <footer className="border-t border-slate-200 bg-slate-900 pt-16 pb-8 text-slate-400">
    <div className="mx-auto max-w-7xl px-6">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white"><Boxes size={18} /></div>
            <span className="text-lg font-bold text-white">ProcureFlow</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">AI-powered procurement automation for modern businesses. Streamline, automate, and save.</p>
        </div>
        {[
          { title: "Product", links: ["Features","Pricing","Integrations","Changelog"] },
          { title: "Company", links: ["About","Blog","Careers","Contact"] },
          { title: "Legal", links: ["Privacy","Terms","Security","GDPR"] },
        ].map(col => (
          <div key={col.title}>
            <p className="text-sm font-semibold text-white">{col.title}</p>
            <ul className="mt-4 space-y-2.5">{col.links.map(l=>(
              <li key={l}><a href="#" className="text-sm transition hover:text-white">{l}</a></li>
            ))}</ul>
          </div>
        ))}
      </div>
      <div className="mt-12 border-t border-slate-800 pt-8 text-center text-xs">
        &copy; {new Date().getFullYear()} ProcureFlow AI. All rights reserved.
      </div>
    </div>
  </footer>
);

/* ─── Page ─── */
const LandingPage = () => (
  <div className="min-h-screen bg-surface-50">
    <LandingNavbar />
    <Hero />
    <Features />
    <Stats />
    <HowItWorks />
    <Testimonials />
    <FAQ />
    <Footer />
  </div>
);

export default LandingPage;
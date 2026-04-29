import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, 
  Database, 
  Cpu, 
  Workflow, 
  ShieldCheck, 
  Globe, 
  Users, 
  TrendingUp,
  ChevronRight,
  Menu,
  X,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Target,
  Search,
  Microscope,
  Stethoscope,
  ClipboardList,
  MessageSquare,
  Send
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

// --- Components ---

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: string, parts: {text: string}[]}[]>([
    { role: "model", parts: [{ text: "Hello! I'm the KAIROMICS AI Assistant. How can I help you today?" }] }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", parts: [{ text: input }] };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      });
      
      const data = await response.json();
      
      if (response.ok && data.reply) {
        setMessages(prev => [...prev, { role: "model", parts: [{ text: data.reply }] }]);
      } else {
        setMessages(prev => [...prev, { role: "model", parts: [{ text: `Error: ${data.error || "Failed to get response"}` }] }]);
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: "model", parts: [{ text: `Sorry, I encountered an error: ${error.message}` }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-linear-to-r from-brand-blue to-brand-purple rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare className="text-white w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-dark-card border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-linear-to-br from-brand-blue to-brand-purple rounded-lg flex items-center justify-center">
                  <Activity className="text-white w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">KAIROMICS Assistant</h3>
                  <p className="text-brand-blue text-xs">Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-brand-blue text-dark-bg rounded-tr-sm' : 'bg-white/10 text-slate-200 rounded-tl-sm'}`}>
                    <div className="markdown-body prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 text-slate-200 p-3 rounded-2xl rounded-tl-sm text-sm flex gap-1">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-slate-400 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-slate-400 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-slate-400 rounded-full" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/10 bg-white/5">
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about KAIROMICS..."
                  className="w-full bg-dark-bg border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-blue transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center text-dark-bg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-cyan transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Problem", href: "#problem" },
    { name: "Solution", href: "#solution" },
    { name: "Technology", href: "#technology" },
    { name: "Impact", href: "#impact" },
    { name: "Team", href: "#team" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-dark-bg/80 backdrop-blur-md border-b border-white/10 py-4" : "bg-transparent py-6"}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="/logo.png" 
            alt="KAIROMICS" 
            className="w-[300px] h-[60px] object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-medium text-slate-400 hover:text-brand-blue transition-colors">
              {link.name}
            </a>
          ))}
          <button className="px-5 py-2 rounded-full bg-white text-dark-bg text-sm font-semibold hover:bg-brand-blue hover:text-white transition-all">
            Get Started
          </button>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 right-0 bg-dark-bg border-b border-white/10 p-6 flex flex-col gap-4"
        >
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-lg font-medium text-slate-400"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <button className="w-full px-5 py-3 rounded-xl bg-linear-to-r from-brand-blue to-brand-purple text-white font-semibold">
            Get Started
          </button>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-blue/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-brand-purple/20 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-brand-blue text-xs font-bold tracking-widest uppercase mb-6">
            The Future of Cancer Intelligence
          </span>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-white mb-8 leading-[1.1]">
            Unifying the <span className="gradient-text">Cancer Care</span> <br /> Continuum
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-12 leading-relaxed">
            The world's first end-to-end AI platform that synthesizes every disparate data point into precise, actionable intelligence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-linear-to-r from-brand-blue to-brand-purple text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(0,210,255,0.4)] transition-all flex items-center justify-center gap-2 group">
              Explore the Platform <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all">
              Watch Demo
            </button>
          </div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-20 relative"
        >
          <div className="relative mx-auto max-w-5xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-dark-card/50 backdrop-blur-sm p-2">
            <img 
              src="/regenerated_image_1777502077226.png" 
              alt="KAIROMICS Dashboard" 
              className="w-full h-auto rounded-xl opacity-80"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-linear-to-t from-dark-bg via-transparent to-transparent" />
            
            {/* Floating Stats */}
            <div className="absolute top-1/4 -left-10 hidden lg:block">
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="glass p-4 rounded-2xl border-brand-blue/30 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-blue/20 flex items-center justify-center">
                    <TrendingUp className="text-brand-blue w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Accuracy</p>
                    <p className="text-xl font-bold text-white">98.2%</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="absolute bottom-1/4 -right-10 hidden lg:block">
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="glass p-4 rounded-2xl border-brand-purple/30 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-purple/20 flex items-center justify-center">
                    <Clock className="text-brand-purple w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Analysis Time</p>
                    <p className="text-xl font-bold text-white">&lt; 2 min</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Problem = () => {
  const stats = [
    { label: "New Global Cases", value: "19.9M", icon: Users, sub: "Diagnosed in 2022 alone" },
    { label: "Late-Stage Diagnosis", value: "≈46%", icon: AlertCircle, sub: "Drastically reducing survival" },
    { label: "Disconnected Systems", value: "6+", icon: Workflow, sub: "Managing a single patient" },
    { label: "Decisions w/o Full Data", value: "30%", icon: ClipboardList, sub: "Clinical data overload" },
  ];

  return (
    <section id="problem" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-brand-blue text-sm font-bold tracking-widest uppercase mb-4">The Challenge</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
              Cancer Care is <span className="text-red-500">Broken</span>, Delayed, and Data-Poor
            </h3>
            <div className="space-y-6">
              {[
                "Fragmented data silos across imaging, path, and labs",
                "Disconnected patient care pathways delaying critical care",
                "Clinical data overload causing diagnostic bottlenecks",
                "Reactive interventions instead of predictive precision"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="mt-1 w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                    <X className="text-red-500 w-3 h-3" />
                  </div>
                  <p className="text-slate-400 text-lg">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="glass p-8 rounded-3xl text-center"
              >
                <stat.icon className="w-8 h-8 text-brand-blue mx-auto mb-4 opacity-50" />
                <h4 className="text-3xl font-bold text-white mb-1">{stat.value}</h4>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-tighter mb-2">{stat.label}</p>
                <p className="text-xs text-slate-500">{stat.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Vision = () => {
  return (
    <section id="solution" className="py-24 bg-dark-card/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-brand-blue text-sm font-bold tracking-widest uppercase mb-4">The Vision</h2>
          <h3 className="text-4xl md:text-6xl font-bold text-white mb-8">One Platform to Unite Cancer Care</h3>
          <p className="max-w-3xl mx-auto text-xl text-slate-400 italic">
            "To synthesize every disparate data point into precise, actionable intelligence—creating a unified pathway that empowers clinicians and transforms cancer survival."
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Unified Data Layer",
              desc: "MRI, CT, PET, blood tests, and EMR records ingested and harmonized instantly.",
              icon: Database,
              color: "from-blue-500 to-cyan-400"
            },
            {
              title: "KAIROMICS AI Engine",
              desc: "Advanced radiomics and deep learning for precise predictive pattern recognition.",
              icon: Cpu,
              color: "from-purple-500 to-pink-400"
            },
            {
              title: "Clinical Workflow",
              desc: "Screening, diagnosis, treatment, and follow-up delivered in one seamless interface.",
              icon: Stethoscope,
              color: "from-emerald-500 to-teal-400"
            }
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="glass p-8 rounded-3xl relative overflow-hidden group"
            >
              <div className={`absolute top-0 left-0 w-1 h-full bg-linear-to-b ${card.color}`} />
              <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${card.color} flex items-center justify-center mb-6 shadow-lg`}>
                <card.icon className="text-white w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">{card.title}</h4>
              <p className="text-slate-400 leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pathway = () => {
  const steps = [
    { title: "Screening", items: ["Risk profiling", "Multi-modal fusion"], icon: Search },
    { title: "Diagnosis", items: ["Precision staging", "Radiomic analysis"], icon: Microscope },
    { title: "Treatment", items: ["Target therapy", "Efficacy tracking"], icon: Target },
    { title: "Follow-Up", items: ["Prognosis models", "Early recurrence"], icon: Activity },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-brand-blue text-sm font-bold tracking-widest uppercase mb-4">End-to-End</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">The KAIROMICS Cancer Care Pathway</h3>
          <p className="text-slate-400 max-w-2xl mx-auto">Eliminating data silos to deliver one continuous patient journey across all modalities.</p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-linear-to-r from-brand-blue/0 via-brand-blue/20 to-brand-purple/0 -translate-y-1/2 hidden lg:block" />
          
          <div className="grid lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative z-10"
              >
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-dark-card border-4 border-brand-blue/30 flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(0,210,255,0.2)]">
                    <step.icon className="text-brand-blue w-10 h-10" />
                  </div>
                  <div className="glass p-6 rounded-2xl w-full text-center">
                    <h4 className="text-xl font-bold text-white mb-4">{step.title}</h4>
                    <ul className="space-y-2">
                      {step.items.map((item, j) => (
                        <li key={j} className="text-sm text-slate-500 flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-brand-blue" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Technology = () => {
  return (
    <section id="technology" className="py-24 bg-dark-card/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            {/* Central Engine Visual */}
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-brand-blue/20 rounded-full" 
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-10 border-2 border-dashed border-brand-purple/20 rounded-full" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-linear-to-br from-brand-blue to-brand-purple p-1 shadow-[0_0_50px_rgba(0,210,255,0.3)]">
                  <div className="w-full h-full rounded-full bg-dark-bg flex flex-col items-center justify-center text-center p-4">
                    <Cpu className="text-brand-blue w-10 h-10 mb-2" />
                    <span className="text-white font-bold tracking-tighter">KAIROMICS ENGINE</span>
                  </div>
                </div>
              </div>

              {/* Orbiting Nodes */}
              {[
                { icon: Database, label: "Multi-Modal", pos: "top-0 left-1/2 -translate-x-1/2" },
                { icon: Activity, label: "Radiomics", pos: "bottom-0 left-1/2 -translate-x-1/2" },
                { icon: ShieldCheck, label: "Federated", pos: "left-0 top-1/2 -translate-y-1/2" },
                { icon: Globe, label: "Cloud Agnostic", pos: "right-0 top-1/2 -translate-y-1/2" },
              ].map((node, i) => (
                <motion.div
                  key={i}
                  className={`absolute ${node.pos} glass p-3 rounded-xl flex flex-col items-center gap-1`}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
                >
                  <node.icon className="w-5 h-5 text-brand-blue" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{node.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-brand-blue text-sm font-bold tracking-widest uppercase mb-4">Technology</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-8">Built for Clinical-Grade Oncology</h3>
            <div className="space-y-8">
              {[
                { title: "Data Ingestion Layer", desc: "DICOM, HL7 FHIR, EHR APIs, lab systems, and pathology ingested automatically.", icon: Database },
                { title: "AI Segmentation Engine", desc: "Deep learning auto-segmentation of tumours across CT, MRI, PET-CT and ultrasound.", icon: Cpu },
                { title: "Multi-modal Fusion Model", desc: "Integrates imaging features with blood biomarkers, genomics, and clinical data.", icon: Workflow },
                { title: "Explainable AI (XAI)", desc: "Every prediction comes with clinical interpretation, not just a score.", icon: ShieldCheck }
              ].map((tech, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <tech.icon className="text-brand-blue w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">{tech.title}</h4>
                    <p className="text-slate-400">{tech.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Impact = () => {
  const metrics = [
    { value: "35%", label: "Reduction in time to diagnosis", icon: Clock },
    { value: "28%", label: "Improvement in treatment response", icon: TrendingUp },
    { value: "40%", label: "Reduction in unnecessary biopsies", icon: Microscope },
    { value: "52%", label: "Earlier recurrence detection", icon: Search },
  ];

  return (
    <section id="impact" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-brand-blue text-sm font-bold tracking-widest uppercase mb-4">Clinical Impact</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">Measurable Outcomes Across the Pathway</h3>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {metrics.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-3xl text-center border-b-4 border-brand-blue"
            >
              <metric.icon className="w-10 h-10 text-brand-blue mx-auto mb-6 opacity-50" />
              <h4 className="text-5xl font-bold text-white mb-2">{metric.value}</h4>
              <p className="text-slate-400 font-medium">{metric.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="glass p-10 rounded-3xl">
          <h4 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <CheckCircle2 className="text-brand-blue" /> Clinical Validation Highlights
          </h4>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: "Lung Cancer", text: "Reduced diagnostic time by 38% and improved staging accuracy vs standard CT reporting." },
              { title: "Breast Cancer", text: "Virtual biopsy radiomics reduced unnecessary invasive procedures by 41% in a prospective pilot." },
              { title: "Prostate", text: "mpMRI radiomics predicted biochemical recurrence 18 months ahead with 87% AUC." }
            ].map((item, i) => (
              <div key={i}>
                <h5 className="text-brand-blue font-bold mb-3">{item.title}</h5>
                <p className="text-slate-400 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Market = () => {
  return (
    <section className="py-24 bg-dark-card/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-brand-blue text-sm font-bold tracking-widest uppercase mb-4">Market Opportunity</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-8">A Massive, Underserved Global Market</h3>
            <div className="space-y-6">
              {[
                "Global cancer incidence rising 1.5% annually",
                "NHS, EU & US prioritising AI diagnostics",
                "Radiomics AI market growing at 36.4% CAGR",
                "Regulatory frameworks providing clear pathways"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <CheckCircle2 className="text-brand-blue w-5 h-5 shrink-0" />
                  <p className="text-slate-400 text-lg">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            {/* Concentric Circles Visualization */}
            <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="absolute w-full h-full rounded-full border border-brand-blue/20 flex items-center justify-center"
              >
                <div className="absolute top-4 text-brand-blue text-xs font-bold uppercase tracking-widest">TAM: $45.6B</div>
              </motion.div>
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="absolute w-[70%] h-[70%] rounded-full border border-brand-blue/40 bg-brand-blue/5 flex items-center justify-center"
              >
                <div className="absolute top-4 text-brand-blue text-xs font-bold uppercase tracking-widest">SAM: $12.1B</div>
              </motion.div>
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="absolute w-[40%] h-[40%] rounded-full bg-linear-to-br from-brand-blue to-brand-purple flex flex-col items-center justify-center text-center p-4 shadow-2xl"
              >
                <span className="text-white text-xs font-bold uppercase tracking-widest mb-1">SOM</span>
                <span className="text-white text-2xl font-bold">$890M</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Team = () => {
  const team = [
    { name: "Mehdi Saberi", role: "Chief Executive Officer", bio: "20+ yrs oncology. Previous NHS Cancer Directorate Lead.", icon: Users },
    { name: "Shayan Shahzadi", role: "Chief AI Officer", bio: "Deep learning, NLP, radiomics. Ex-DeepMind Health research.", icon: Cpu },
    { name: "John Makuta", role: "Chief Technology Officer", bio: "ICT Data Analytics, AI integration implementation expert.", icon: Database },
    { name: "Dr. Sarah Chen", role: "Medical Lead", bio: "15+ years clinical strategy. Ex-Director of Oncology AI.", icon: Stethoscope },
  ];

  return (
    <section id="team" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-brand-blue text-sm font-bold tracking-widest uppercase mb-4">The Team</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">World-Class Expertise</h3>
          <p className="text-slate-400 max-w-2xl mx-auto">Combining clinical excellence, AI innovation, and commercial scale.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="glass p-8 rounded-3xl group"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-brand-blue/20 transition-colors">
                <member.icon className="text-brand-blue w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white mb-1">{member.name}</h4>
              <p className="text-brand-blue text-sm font-bold mb-4 uppercase tracking-wider">{member.role}</p>
              <p className="text-slate-500 text-sm leading-relaxed">{member.bio}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 glass p-10 rounded-3xl flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
          <div className="flex items-center gap-2 text-white font-bold"><ShieldCheck className="w-6 h-6" /> ISO 13485</div>
          <div className="flex items-center gap-2 text-white font-bold"><CheckCircle2 className="w-6 h-6" /> GDPR Compliant</div>
          <div className="flex items-center gap-2 text-white font-bold"><Activity className="w-6 h-6" /> HIPAA Ready</div>
          <div className="flex items-center gap-2 text-white font-bold"><Globe className="w-6 h-6" /> FDA 510(k)</div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-20 border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 mb-20">
          <div>
            <div className="flex items-center mb-8">
              <img 
                src="/logo.png" 
                alt="KAIROMICS" 
                className="w-[300px] h-[60px] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-slate-400 text-lg max-w-md mb-8">
              The future of cancer care is unified, intelligent, and actionable. Join us in pioneering the next era of AI-driven oncology.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-blue/20 transition-colors">
                <Globe className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-blue/20 transition-colors">
                <Users className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          <div className="glass p-10 rounded-3xl">
            <h4 className="text-2xl font-bold text-white mb-6">Get In Touch</h4>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 text-slate-400">
                <ChevronRight className="text-brand-blue w-5 h-5" />
                <span>Email: kairomics@icri.org</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <ChevronRight className="text-brand-blue w-5 h-5" />
                <span>Web: www.icri.org/kairomics</span>
              </div>
            </div>
            <button className="w-full py-4 rounded-xl bg-white text-dark-bg font-bold hover:bg-brand-blue hover:text-white transition-all">
              Schedule a Demo
            </button>
          </div>
        </div>

        <div className="flex flex-col md:row items-center justify-between gap-6 pt-10 border-t border-white/5 text-slate-500 text-sm">
          <p>© 2025 ICRI — Integrated Cancer Research Institute. Confidential.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Vision />
        <Pathway />
        <Technology />
        <Impact />
        <Market />
        <Team />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

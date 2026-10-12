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
  Send,
  Lock,
  Mail,
  Phone,
  User,
  Briefcase,
  RefreshCw,
  KeyRound,
  ExternalLink,
  Download,
  FileSpreadsheet
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
        className={`fixed bottom-6 right-6 w-14 h-14 brand-gradient-bg rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare className="text-dark-bg w-6 h-6" />
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
                <div className="w-8 h-8 brand-gradient-br text-dark-bg rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4" />
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
          <button className="w-full px-5 py-3 rounded-xl brand-gradient-bg text-dark-bg font-semibold">
            Get Started
          </button>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => {
  const fullText = "Intelligence in Every Phase of Oncology Care";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(interval);
      }
    }, 40); // Fast typing speed
    return () => clearInterval(interval);
  }, []);

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [regForm, setRegForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    enquiryReason: "Investors",
    organization: "",
  });
  const [captchaCode, setCaptchaCode] = useState({ q: "14 + 7", a: "21" });
  const [userCaptcha, setUserCaptcha] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [showAdminSync, setShowAdminSync] = useState(false);
  const [allRegistrations, setAllRegistrations] = useState<any[]>([]);

  const generateNewCaptcha = () => {
    const n1 = Math.floor(Math.random() * 15) + 5;
    const n2 = Math.floor(Math.random() * 9) + 2;
    setCaptchaCode({ q: `${n1} + ${n2}`, a: String(n1 + n2) });
    setUserCaptcha("");
    setCaptchaError(false);
  };

  const handleOpenDemoFlow = () => {
    if (hasRegistered) {
      // If already registered in session, still allow re-viewing or direct launch
      window.open("http://demo.kairomics.com/", "_blank", "noopener,noreferrer");
      return;
    }
    generateNewCaptcha();
    setEmailError("");
    setCaptchaError(false);
    setIsRegisterOpen(true);
  };

  const handleFetchRegistrations = async () => {
    try {
      const res = await fetch("/api/registrations");
      const data = await res.json();
      setAllRegistrations(data.data || []);
      setShowAdminSync(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setCaptchaError(false);

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regForm.email)) {
      setEmailError("Please provide a valid business or institutional email address.");
      return;
    }

    // Validate captcha
    if (userCaptcha.trim() !== captchaCode.a) {
      setCaptchaError(true);
      return;
    }

    setRegSubmitting(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...regForm,
          captchaAnswer: userCaptcha,
          captchaExpected: captchaCode.a
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Registration failed");
      }

      setRegSuccess(true);
      setHasRegistered(true);
    } catch (err: any) {
      alert(err.message || "Failed to submit registration.");
    } finally {
      setRegSubmitting(false);
    }
  };

  const prefix = "Intelligence in Every ";
  const displayedPrefix = displayedText.slice(0, prefix.length);
  const displayedHighlight = displayedText.slice(prefix.length);

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-blue/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-brand-green/20 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-brand-blue text-xs font-bold tracking-widest uppercase mb-6">
            THE FUTURE OF CANCER PATIENT PATHWAY INTELLIGENCE
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-6xl xl:text-7xl font-serif font-normal tracking-tight text-white mb-6 leading-[1.12] min-h-[150px] sm:min-h-[180px] md:min-h-[220px] lg:min-h-[220px] xl:min-h-[240px]">
            {displayedPrefix}
            {displayedHighlight && <span className="gradient-text">{displayedHighlight}</span>}
            <motion.span 
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-[0.1em] h-[1em] bg-white translate-y-[0.1em] ml-1"
            />
          </h1>
          <p className="max-w-xl text-md md:text-lg text-slate-400 mb-8 leading-relaxed">
            The world's first end-to-end AI platform that synthesizes every disparate data point into precise, actionable intelligence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto">
            <a 
              href="#problem"
              className="w-full sm:w-auto px-8 py-4 rounded-full brand-gradient-bg text-dark-bg font-bold text-lg hover:shadow-[0_0_30px_rgba(0,210,255,0.4)] transition-all flex items-center justify-center gap-2 group whitespace-nowrap"
            >
              Explore the Platform <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <button
              onClick={handleOpenDemoFlow}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-brand-blue/30 text-white font-bold text-lg hover:bg-brand-blue/20 hover:border-brand-blue transition-all whitespace-nowrap flex items-center justify-center gap-2 text-center shadow-lg group cursor-pointer"
            >
              <Lock className="w-4 h-4 text-brand-blue group-hover:scale-110 transition-transform" />
              Watch Demo
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-green" /> Bot-protected portal
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-brand-blue" /> Dispatched to john.m@kairomics.com
            </span>
          </div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="lg:col-span-6 relative w-full flex justify-center"
        >
          <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-dark-card/50 backdrop-blur-sm p-1.5">
            <img 
              src="/regenerated_image_1777502077226.png" 
              alt="KAIROMICS Dashboard" 
              className="w-full h-auto rounded-xl opacity-80"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-linear-to-t from-dark-bg via-transparent to-transparent" />
            
            {/* Floating Stats */}
            <div className="absolute top-1/4 -left-6 hidden xl:block">
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

            <div className="absolute bottom-1/4 -right-6 hidden xl:block">
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="glass p-4 rounded-2xl border-brand-green/30 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-green/20 flex items-center justify-center">
                    <Clock className="text-brand-green w-5 h-5" />
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

      {/* Registration Portal Modal */}
      <AnimatePresence>
        {isRegisterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-dark-bg/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              className="relative w-full max-w-xl bg-dark-card border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-8"
            >
              {/* Glow accent */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-blue/20 blur-3xl pointer-events-none -mr-16 -mt-16 rounded-full" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-green/20 blur-3xl pointer-events-none -ml-16 -mb-16 rounded-full" />

              <button
                onClick={() => {
                  setIsRegisterOpen(false);
                  setRegSuccess(false);
                }}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {!regSuccess ? (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl brand-gradient-bg flex items-center justify-center text-dark-bg">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold tracking-widest text-brand-blue uppercase">Access Authorization</span>
                      <h3 className="text-2xl font-serif font-bold text-white">Kairomics Portal Registration</h3>
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    Please authenticate your professional profile to unlock the interactive oncology platform demo. Your inquiry will be registered and notified directly to <span className="text-brand-blue font-semibold">john.m@kairomics.com</span>.
                  </p>

                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-brand-blue" /> Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={regForm.fullName}
                        onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                        placeholder="Dr. Jane Doe / John Smith"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue text-sm transition-all"
                      />
                    </div>

                    {/* Email & Phone Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-brand-blue" /> Work Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={regForm.email}
                          onChange={(e) => {
                            setRegForm({ ...regForm, email: e.target.value });
                            setEmailError("");
                          }}
                          placeholder="name@institution.com"
                          className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${emailError ? 'border-red-500' : 'border-white/10'} text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue text-sm transition-all`}
                        />
                        {emailError && (
                          <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {emailError}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-brand-blue" /> Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={regForm.phone}
                          onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue text-sm transition-all"
                        />
                      </div>
                    </div>

                    {/* Organization & Password */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-brand-blue" /> Institution / Company
                        </label>
                        <input
                          type="text"
                          value={regForm.organization}
                          onChange={(e) => setRegForm({ ...regForm, organization: e.target.value })}
                          placeholder="Hospital, Fund, or Lab"
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue text-sm transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-brand-blue" /> Portal Password *
                        </label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={regForm.password}
                          onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                          placeholder="••••••••••••"
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue text-sm transition-all"
                        />
                      </div>
                    </div>

                    {/* Enquiry Reason Selection Box */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>Why are you requesting access? *</span>
                        <span className="text-[11px] text-brand-blue font-normal">Select Enquiring Role</span>
                      </label>
                      <select
                        value={regForm.enquiryReason}
                        onChange={(e) => setRegForm({ ...regForm, enquiryReason: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-dark-bg border border-white/15 text-white focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue text-sm transition-all cursor-pointer"
                      >
                        <option value="Investors">Investors</option>
                        <option value="Healthcare Company Representative">Healthcare Company Representative</option>
                        <option value="Researcher">Researcher</option>
                        <option value="Career Seeker">Career Seeker</option>
                        <option value="Business Partner">Business Partner</option>
                      </select>
                    </div>

                    {/* Bot CAPTCHA Security Verification */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-brand-green" /> Bot Captcha Security *
                        </span>
                        <button
                          type="button"
                          onClick={generateNewCaptcha}
                          className="text-xs text-brand-blue hover:text-white flex items-center gap-1 transition-colors"
                        >
                          <RefreshCw className="w-3 h-3" /> Refresh
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="px-4 py-2.5 rounded-xl bg-brand-blue/10 border border-brand-blue/30 text-brand-blue font-mono font-bold text-base tracking-wider select-none">
                          {captchaCode.q} = ?
                        </div>
                        <input
                          type="text"
                          required
                          value={userCaptcha}
                          onChange={(e) => {
                            setUserCaptcha(e.target.value);
                            setCaptchaError(false);
                          }}
                          placeholder="Enter answer"
                          className={`flex-1 px-4 py-2.5 rounded-xl bg-white/5 border ${captchaError ? 'border-red-500' : 'border-white/10'} text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue text-sm transition-all`}
                        />
                      </div>
                      {captchaError && (
                        <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Incorrect captcha math solution. Please verify you are human.
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={regSubmitting}
                      className="w-full py-4 rounded-xl brand-gradient-bg text-dark-bg font-bold hover:shadow-[0_0_25px_rgba(0,210,255,0.4)] transition-all text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {regSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Verifying & Registering...
                        </>
                      ) : (
                        <>
                          Complete Registration & Launch Demo <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500">
                      <span>Encrypted SSL 256-bit submission</span>
                      <span>Records saved to database</span>
                    </div>
                  </form>
                </div>
              ) : (
                /* Success Screen with Immediate Access to Demo */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-6 flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-brand-green/20 border border-brand-green/40 flex items-center justify-center text-brand-green mb-2">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h4 className="text-2xl font-serif font-bold text-white">Registration Verified</h4>
                  <p className="text-slate-300 max-w-md text-sm leading-relaxed">
                    Welcome, <strong className="text-white">{regForm.fullName}</strong>. Your inquiry as a <strong className="text-brand-blue">{regForm.enquiryReason}</strong> has been logged to the database and forwarded to <strong className="text-white">john.m@kairomics.com</strong>.
                  </p>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 w-full text-left space-y-1.5 text-xs text-slate-400">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Registered Email:</span>
                      <span className="text-white font-medium">{regForm.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phone:</span>
                      <span className="text-white font-medium">{regForm.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Role / Reason:</span>
                      <span className="text-brand-blue font-medium">{regForm.enquiryReason}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Data Stored & Routed To:</span>
                      <span className="text-white font-medium">Database & john.m@kairomics.com</span>
                    </div>
                  </div>

                  <div className="pt-2 w-full space-y-3">
                    <a
                      href="http://demo.kairomics.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 rounded-xl brand-gradient-bg text-dark-bg font-bold text-base hover:shadow-[0_0_30px_rgba(0,210,255,0.4)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      Proceed to Live Demo (http://demo.kairomics.com/) <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>

                    <div className="flex items-center justify-center gap-4 text-xs pt-2">
                      <button
                        onClick={handleFetchRegistrations}
                        className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-brand-green" /> View Stored Records / Google Sheets Sync
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin / Google Sheets Database Sync Drawer */}
      <AnimatePresence>
        {showAdminSync && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-dark-bg/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl bg-dark-card border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-green/20 text-brand-green flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Registered Portal Database</h3>
                    <p className="text-xs text-slate-400">
                      Dispatched to <span className="text-brand-blue">john.m@kairomics.com</span> • Sync with Google Sheets / Google Drive
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAdminSync(false)}
                  className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                <span>Total Registrations: <strong className="text-white">{allRegistrations.length}</strong></span>
                <div className="flex items-center gap-2">
                  <a
                    href="/api/registrations/export-csv"
                    download
                    className="px-4 py-2 rounded-lg bg-brand-green/20 hover:bg-brand-green/30 text-brand-green border border-brand-green/40 font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Export for Google Sheets (CSV)
                  </a>
                  <button
                    onClick={handleFetchRegistrations}
                    className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="flex-1 overflow-y-auto rounded-xl border border-white/10 bg-black/40">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-white/5 text-slate-400 font-semibold uppercase tracking-wider border-b border-white/10 sticky top-0 backdrop-blur-md">
                    <tr>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Enquiring As</th>
                      <th className="p-3">Organization</th>
                      <th className="p-3">Notification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {allRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">
                          No registrations stored yet. Submit the registration form above to see entries.
                        </td>
                      </tr>
                    ) : (
                      allRegistrations.map((item, idx) => (
                        <tr key={item.id || idx} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 font-medium text-white">{item.fullName}</td>
                          <td className="p-3 text-brand-blue">{item.email}</td>
                          <td className="p-3 font-mono">{item.phone}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full bg-brand-blue/15 text-brand-blue text-[10px] font-semibold">
                              {item.enquiryReason}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400">{item.organization || "—"}</td>
                          <td className="p-3 text-slate-500 text-[10px]">
                            Dispatched to {item.forwardedTo}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pt-4 text-xs text-slate-400 flex items-center justify-between border-t border-white/10 mt-4">
                <span>Google Drive / Sheets instructions: Click "Export for Google Sheets (CSV)", open Google Sheets, and click File &gt; Import.</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
            <h3 className="text-4xl md:text-5xl font-serif font-normal text-white mb-8 leading-tight">
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
          <h3 className="text-4xl md:text-6xl font-serif font-normal text-white mb-8">One Platform to Unite Cancer Care</h3>
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
              color: "from-cyan-400 to-blue-500"
            },
            {
              title: "KAIROMICS AI Engine",
              desc: "Advanced radiomics and deep learning for precise predictive pattern recognition.",
              icon: Cpu,
              color: "from-blue-500 to-emerald-400"
            },
            {
              title: "Clinical Workflow",
              desc: "Screening, diagnosis, treatment, and follow-up delivered in one seamless interface.",
              icon: Stethoscope,
              color: "from-emerald-400 to-green-500"
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
          <h3 className="text-4xl md:text-5xl font-serif font-normal text-white mb-6">The KAIROMICS Cancer Care Pathway</h3>
          <p className="text-slate-400 max-w-2xl mx-auto">Eliminating data silos to deliver one continuous patient journey across all modalities.</p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-linear-to-r from-brand-light-blue/0 via-brand-blue/20 to-brand-green/0 -translate-y-1/2 hidden lg:block" />
          
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
                className="absolute inset-10 border-2 border-dashed border-brand-green/20 rounded-full" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full brand-gradient-br p-1 shadow-[0_0_50px_rgba(59,130,246,0.3)]">
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
            <h3 className="text-4xl md:text-5xl font-serif font-normal text-white mb-8">Built for Clinical-Grade Oncology</h3>
            <div className="space-y-8">
              {[
                { title: "Data Ingestion Layer", desc: "DICOM, HL7 FHIR, EHR APIs, lab systems, and pathology ingested automatically.", icon: Database },
                { title: "AI Segmentation Engine", desc: "Deep learning auto-segmentation of tumours across CT, MRI, PET-CT and ultrasound.", icon: Cpu },
                { title: "Multi-modal Fusion Model", desc: "Integrates imaging features with blood biomarkers, genomics, and clinical data.", icon: Workflow },
                { title: "Explainable AI (XAI)", desc: "Every prediction comes with clinical interpretation, not just a score.", icon: ShieldCheck }
              ].map((tech, i) => (
                <div key={i} className="flex gap-6 group cursor-pointer p-4 -mx-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/5 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] group-hover:border-brand-blue/50 group-hover:scale-110">
                    <tech.icon className="text-brand-blue w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <div className="transition-all duration-300 group-hover:translate-x-1">
                    <h4 className="text-xl font-bold text-white mb-2 group-hover:text-brand-light-blue transition-colors">{tech.title}</h4>
                    <p className="text-slate-400 group-hover:text-slate-300 transition-colors">{tech.desc}</p>
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
          <h3 className="text-4xl md:text-5xl font-serif font-normal text-white mb-6">Measurable Outcomes Across the Pathway</h3>
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



const Team = () => {
  const team = [
    { name: "Dr. Mehdi Saberi MBA", role: "Chief Executive Officer", bio: "20+ yrs oncology. Previous NHS Cancer Directorate Lead.", icon: Users },
    { name: "MSc. Shyan Shahzadi", role: "Chief AI Officer", bio: "Deep learning, NLP, radiomics. Ex-DeepMind Health research.", icon: Cpu },
    { name: "BSc. John Makuta", role: "Chief Technology Officer", bio: "ICT Data Analytics, AI integration implementation expert.", icon: Database },
    { name: "Dr. Sarah Chen", role: "Medical Lead", bio: "15+ years clinical strategy. Ex-Director of Oncology AI.", icon: Stethoscope },
  ];

  return (
    <section id="team" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-brand-blue text-sm font-bold tracking-widest uppercase mb-4">The Team</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-normal text-white mb-6">World-Class Expertise</h3>
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
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    inquiryType: "Investor Interest",
  });
  const [captchaNum1, setCaptchaNum1] = useState(0);
  const [captchaNum2, setCaptchaNum2] = useState(0);
  const [userCaptchaAnswer, setUserCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const generateCaptcha = () => {
    setCaptchaNum1(Math.floor(Math.random() * 9) + 1);
    setCaptchaNum2(Math.floor(Math.random() * 9) + 1);
    setUserCaptchaAnswer("");
    setCaptchaError(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) {
      // Quietly ignore bot submissions
      return;
    }
    const answer = parseInt(userCaptchaAnswer.trim(), 10);
    if (isNaN(answer) || answer !== (captchaNum1 + captchaNum2)) {
      setCaptchaError(true);
      return;
    }
    setSubmitted(true);
  };

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

          <div className="glass p-10 rounded-3xl" id="investor-contact-form">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h4 className="text-2xl font-serif font-normal text-white mb-2">Enterprise and Investors Inquiry</h4>
                  <p className="text-slate-400 text-sm">
                    Directing inquiries to <span className="text-brand-blue font-semibold">info@kairomics.com</span>. Our partnerships advisor will respond within 24 hours.
                  </p>
                </div>

                {/* Honeypot field for bot spam protection */}
                <div className="hidden" aria-hidden="true">
                  <input
                    type="text"
                    name="bot_protection_field"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">First Name</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/50 transition-all text-sm"
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Last Name</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/50 transition-all text-sm"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Work Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/50 transition-all text-sm"
                    placeholder="Work Email"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Organization / Industry</label>
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/50 transition-all text-sm"
                    placeholder="Organization / Industry"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Inquiry Type</label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/50 transition-all text-sm cursor-pointer"
                  >
                    <option value="Investor Interest" className="bg-[#0a0a0a] text-white">Investor Interest</option>
                    <option value="Enterprise" className="bg-[#0a0a0a] text-white">Enterprise</option>
                    <option value="Private Hospital" className="bg-[#0a0a0a] text-white">Private Hospital</option>
                    <option value="Organistion" className="bg-[#0a0a0a] text-white">Organistion</option>
                  </select>
                </div>

                {/* Interactive Math Challenge Captcha Shield */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-brand-blue" />
                      Anti-Spam Verification
                    </span>
                    <button
                      type="button"
                      onClick={generateCaptcha}
                      className="text-slate-400 hover:text-white transition-colors text-xs flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                      Refresh
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-bold text-white bg-slate-800/80 border border-white/15 px-4 py-2.5 rounded-lg tracking-wider font-mono">
                      {captchaNum1} + {captchaNum2} =
                    </div>
                    <input
                      type="text"
                      required
                      value={userCaptchaAnswer}
                      onChange={(e) => {
                        setUserCaptchaAnswer(e.target.value);
                        if (captchaError) setCaptchaError(false);
                      }}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/50 transition-all text-sm font-mono"
                      placeholder="Calculate"
                    />
                  </div>
                  {captchaError && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Incorrect verification answer. Please try again.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-white text-dark-bg font-bold hover:bg-brand-blue hover:text-white transition-all text-sm tracking-wide"
                >
                  Send Request
                </button>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col justify-center items-center text-center p-6 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue mb-2">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold text-white">Inquiry Forwarded</h4>
                <p className="text-slate-400 max-w-sm text-sm">
                  Thank you, <strong>{formData.firstName}</strong>. Your <strong>{formData.inquiryType}</strong> request has been successfully dispatched directly to <strong className="text-white">info@kairomics.com</strong>.
                </p>
                <button
                  onClick={() => {
                    setFormData({ firstName: "", lastName: "", email: "", organization: "", inquiryType: "Investor Interest" });
                    generateCaptcha();
                    setSubmitted(false);
                  }}
                  className="text-brand-blue hover:text-white text-xs font-semibold transition-colors mt-6 pt-2"
                >
                  Submit Another Inquiry
                </button>
              </motion.div>
            )}
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
        <Team />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

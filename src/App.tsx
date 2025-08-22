import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Menu, X, Sun, Moon, Phone, Mail, MapPin, Truck, Globe } from "lucide-react";
import { JSX } from "react";

// -------------------------------
// Ultra Nowoczesny layout 2025 z i18n (PL/EN)
// - Animowany gradient tła
// - Glassmorphism
// - Framer Motion transitions
// - Dark/Light toggle
// - Responsywne menu (hamburger)
// - Animowany wskaźnik aktywnej zakładki
// - i18n: przełącznik PL/EN + localStorage
// - Brak React Routera — zakładki sterowane lokalnym stanem
// -------------------------------

// ===== i18n =====
type Lang = "pl" | "en";

const BASE_TABS = ["Home", "O Firmie", "Tabor", "Kierunki", "Kontakt"] as const;
type Tab = typeof BASE_TABS[number];

const TAB_LABELS: Record<Lang, Record<Tab, string>> = {
  pl: {
    Home: "Home",
    "O Firmie": "O Firmie",
    Tabor: "Tabor",
    Kierunki: "Kierunki",
    Kontakt: "Kontakt",
  },
  en: {
    Home: "Home",
    "O Firmie": "About Us",
    Tabor: "Fleet",
    Kierunki: "Routes",
    Kontakt: "Contact",
  },
};

const COPY: Record<
  Lang,
  {
    topTagline: string;
    menu: string;
    heroTitle_pre: string;
    heroTitle_highlight: string;
    heroDesc: string;
    ctaAsk: string;
    ctaFleet: string;

    home_welcome_title: string;
    home_welcome_para: string;
    home_tags: string[];
    home_overlay_text: string;
    home_banner_title: string;
    home_banner_desc: string;

    about_title: string;
    about_desc: string;
    about_bullets: string[];
    office_title: string;

    fleet_title: string;
    fleet_desc: string;
    stat_sets: string;
    stat_avail: string;
    stat_scope: string;
    stat_ontime: string;

    routes_title: string;
    routes_desc: string;
    routes_list: string[];

    contact_title: string;
    contact_desc: string;
    form_name: string;
    form_email: string;
    form_phone: string;
    form_company: string;
    form_message: string;
    form_name_ph: string;
    form_email_ph: string;
    form_phone_ph: string;
    form_company_ph: string;
    form_message_ph: string;
    form_privacy: string;
    form_send: string;
    contact_details_title: string;
    office_heading: string;

    footer_contact: string;
    footer_office: string;
    footer_rights: string;

    theme_light: string;
    theme_dark: string;
    theme_sr: string;
    lang_sr: string;
  }
> = {
  pl: {
    topTagline: "Międzynarodowy i Krajowy",
    menu: "Menu",
    heroTitle_pre: "Solidny Partner",
    heroTitle_highlight: "w transporcie",
    heroDesc:
      "Międzynarodowy i krajowy transport drogowy. Bezpieczeństwo, terminowość i pełna przejrzystość 24/7.",
    ctaAsk: "Zapytaj o wycenę",
    ctaFleet: "Zobacz tabor",

    home_welcome_title: "Witaj w HAY-TRUCK",
    home_welcome_para:
      "Świadczymy usługi transportu drogowego w Polsce i całej Europie. Stawiamy na solidność, terminowość oraz bezpieczeństwo Twojego ładunku.",
    home_tags: ["Transport krajowy", "Międzynarodowy", "Spedycja", "EURO 6"],
    home_overlay_text: "Flota gotowa do drogi 24/7",
    home_banner_title: "Solidny Partner w Transporcie",
    home_banner_desc:
      "Realizujemy przewozy w całej Europie — bezpiecznie, terminowo, nowocześnie.",

    about_title: "Od 1990 roku na drogach Europy",
    about_desc:
      "Zaczynaliśmy od transportu krajowego, dziś obsługujemy klientów w całej Europie. Zapewniamy pełną obsługę logistyczną i spedycyjną — z naciskiem na bezpieczeństwo i SLA.",
    about_bullets: [
      "Doświadczony zespół kierowców",
      "Stały monitoring ładunku",
      "Ubezpieczenie OCP",
      "Ekologiczny tabor EURO 6",
    ],
    office_title: "Siedziba",

    fleet_title: "Nowoczesny tabor — EURO 6",
    fleet_desc:
      "Regularnie serwisowane zestawy, monitoring GPS, niska emisja, zgodność z normami EURO 6.",
    stat_sets: "Zestawów",
    stat_avail: "Dostępność",
    stat_scope: "Zasięg",
    stat_ontime: "On-time",

    routes_title: "Obsługiwane kierunki",
    routes_desc:
      "Polska i cała Europa: Niemcy, Francja, Włochy, Hiszpania, Czechy oraz inne kraje UE.",
    routes_list: [
      "Niemcy",
      "Francja",
      "Włochy",
      "Hiszpania",
      "Czechy",
      "Austria",
      "Holandia",
      "Belgia",
    ],

    contact_title: "Skontaktuj się z nami",
    contact_desc:
      "Odpowiemy szybko i konkretnie — zapytaj o wycenę lub dostępność.",
    form_name: "Imię i nazwisko",
    form_email: "E-mail",
    form_phone: "Telefon",
    form_company: "Firma",
    form_message: "Wiadomość",
    form_name_ph: "Jan Kowalski",
    form_email_ph: "jan@firma.pl",
    form_phone_ph: "+48 ...",
    form_company_ph: "Twoja Firma",
    form_message_ph: "Opisz swój ładunek / trasę",
    form_privacy: "Wysyłając formularz akceptujesz politykę prywatności.",
    form_send: "Wyślij zapytanie",
    contact_details_title: "Dane kontaktowe",
    office_heading: "Siedziba",

    footer_contact: "Kontakt",
    footer_office: "Siedziba",
    footer_rights: "Wszystkie prawa zastrzeżone",

    theme_light: "Jasny motyw",
    theme_dark: "Ciemny motyw",
    theme_sr: "Przełącz motyw",
    lang_sr: "Zmień język",
  },
  en: {
    topTagline: "International & Domestic",
    menu: "Menu",
    heroTitle_pre: "Reliable Partner",
    heroTitle_highlight: "in transportation",
    heroDesc:
      "International and domestic road transport. Safety, punctuality, and full transparency 24/7.",
    ctaAsk: "Request a Quote",
    ctaFleet: "View Fleet",

    home_welcome_title: "Welcome to HAY-TRUCK",
    home_welcome_para:
      "We provide road transport services across Poland and all of Europe. We focus on reliability, punctuality, and the safety of your cargo.",
    home_tags: ["Domestic transport", "International", "Forwarding", "EURO 6"],
    home_overlay_text: "Fleet ready 24/7",
    home_banner_title: "A Reliable Transport Partner",
    home_banner_desc:
      "We operate across Europe — safely, on time, and with modern standards.",

    about_title: "On European roads since 1990",
    about_desc:
      "We started with domestic transport and now serve customers all over Europe. We provide end-to-end logistics and forwarding — with emphasis on safety and SLAs.",
    about_bullets: [
      "Experienced driver team",
      "Continuous cargo monitoring",
      "Carrier liability insurance",
      "EURO 6 eco fleet",
    ],
    office_title: "Head Office",

    fleet_title: "Modern fleet — EURO 6",
    fleet_desc:
      "Regularly serviced sets, GPS monitoring, low emissions, EURO 6 compliance.",
    stat_sets: "Tractor-trailers",
    stat_avail: "Availability",
    stat_scope: "Coverage",
    stat_ontime: "On-time",

    routes_title: "Served routes",
    routes_desc:
      "Poland and all of Europe: Germany, France, Italy, Spain, Czechia and other EU countries.",
    routes_list: [
      "Germany",
      "France",
      "Italy",
      "Spain",
      "Czechia",
      "Austria",
      "Netherlands",
      "Belgium",
    ],

    contact_title: "Contact us",
    contact_desc:
      "We respond quickly and clearly — ask for a quote or availability.",
    form_name: "Full name",
    form_email: "E-mail",
    form_phone: "Phone",
    form_company: "Company",
    form_message: "Message",
    form_name_ph: "John Smith",
    form_email_ph: "john@company.com",
    form_phone_ph: "+48 ...",
    form_company_ph: "Your Company",
    form_message_ph: "Describe your cargo / route",
    form_privacy: "By sending the form you accept the privacy policy.",
    form_send: "Send inquiry",
    contact_details_title: "Contact details",
    office_heading: "Office",

    footer_contact: "Contact",
    footer_office: "Office",
    footer_rights: "All rights reserved",

    theme_light: "Light theme",
    theme_dark: "Dark theme",
    theme_sr: "Toggle theme",
    lang_sr: "Change language",
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("Home");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Motyw (light/dark)
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  );

  // Język — domyślnie PL, ale jeśli w localStorage "en" to EN
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem("haytruck-lang") : null;
      return saved === "en" || saved === "pl" ? (saved as Lang) : "pl";
    } catch {
      return "pl";
    }
  });

  const tr = COPY[lang];

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    try {
      localStorage.setItem("haytruck-theme", theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("haytruck-theme");
      if (saved === "dark" || saved === "light") setTheme(saved);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("haytruck-lang", lang);
    } catch {}
  }, [lang]);

  // Parallax mouse tilt for hero image
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const onMouseMove = (e: React.MouseEvent) => {
    const { innerWidth: w, innerHeight: h } = window;
    const x = ((e.clientX - w / 2) / w) * 8; // -4..4 deg
    const y = ((e.clientY - h / 2) / h) * -8; // -4..4 deg
    setTilt({ x, y });
  };

  const TabContent = useMemo(
    () =>
      ({
        Home: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold tracking-tight">{tr.home_welcome_title}</h3>
              <p className="mt-3 text-sm md:text-base text-muted-foreground">{tr.home_welcome_para}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {tr.home_tags.map((t) => (
                  <Pill key={t}>{t}</Pill>
                ))}
              </div>
            </GlassCard>
            <GlassCard className="overflow-hidden p-0">
              <motion.div className="relative h-64 md:h-80" style={{ perspective: 1000 }}>
                <motion.img
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop"
                  alt="Truck"
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ scale: 1.05, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  style={{ transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)` }}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-black/30" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-4 text-white shadow-2xl">
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      <p className="text-sm">{tr.home_overlay_text}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </GlassCard>
            <GlassCard className="col-span-1 md:col-span-2 p-0 overflow-hidden">
              <div className="relative h-56 md:h-64">
                <img
                  src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1800&auto=format&fit=crop"
                  alt="Road"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-primary/20 mix-blend-multiply" />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center text-white px-6">
                    <h4 className="text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow">{tr.home_banner_title}</h4>
                    <p className="mt-2 max-w-2xl mx-auto text-sm md:text-base opacity-90">{tr.home_banner_desc}</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        ),
        "O Firmie": (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <GlassCard className="lg:col-span-2 p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold">{tr.about_title}</h3>
              <p className="mt-3 text-sm md:text-base text-muted-foreground">{tr.about_desc}</p>
              <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {tr.about_bullets.map((b) => (
                  <li className="flex items-center gap-3" key={b}>
                    <Bullet />
                    {b}
                  </li>
                ))}
              </ul>
            </GlassCard>
            <GlassCard className="p-6">
              <h4 className="font-semibold">{tr.office_title}</h4>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> ul. Transportowców 7, 39-200 Dębica</div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> +48 14 6812 674</div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> +48 602 601 571</div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> +48 608 803 931</div>
                <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> biuro@hay-truck.pl</div>
              </div>
            </GlassCard>
          </div>
        ),
        Tabor: (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <GlassCard className="p-6 md:p-8 lg:col-span-2">
              <h3 className="text-xl md:text-2xl font-bold">{tr.fleet_title}</h3>
              <p className="mt-3 text-sm md:text-base text-muted-foreground">{tr.fleet_desc}</p>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <Stat k="120+" v={tr.stat_sets} />
                <Stat k="24/7" v={tr.stat_avail} />
                <Stat k="EU" v={tr.stat_scope} />
                <Stat k="99%" v={tr.stat_ontime} />
              </div>
            </GlassCard>
            <GlassCard className="overflow-hidden p-0">
              <img
                src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1600&auto=format&fit=crop"
                alt="Fleet"
                className="h-64 w-full object-cover"
              />
            </GlassCard>
          </div>
        ),
        Kierunki: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold">{tr.routes_title}</h3>
              <p className="mt-3 text-sm md:text-base text-muted-foreground">{tr.routes_desc}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {tr.routes_list.map((c) => (
                  <Pill key={c}>{c}</Pill>
                ))}
              </div>
            </GlassCard>
            <GlassCard className="p-0 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1529078155058-5d716f45d604?q=80&w=1600&auto=format&fit=crop"
                alt="Europe map"
                className="h-64 md:h-full w-full object-cover"
              />
            </GlassCard>
          </div>
        ),
        Kontakt: (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <GlassCard className="lg:col-span-2 p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold">{tr.contact_title}</h3>
              <p className="mt-3 text-sm md:text-base text-muted-foreground">{tr.contact_desc}</p>
              <form className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label={tr.form_name} placeholder={tr.form_name_ph} />
                <Input label={tr.form_email} type="email" placeholder={tr.form_email_ph} />
                <Input label={tr.form_phone} placeholder={tr.form_phone_ph} />
                <Input label={tr.form_company} placeholder={tr.form_company_ph} />
                <div className="md:col-span-2">
                  <Input label={tr.form_message} placeholder={tr.form_message_ph} textarea />
                </div>
                <div className="md:col-span-2 flex items-center justify-between gap-4">
                  <div className="text-xs text-muted-foreground">{tr.form_privacy}</div>
                  <button type="button" className="btn-primary">{tr.form_send}</button>
                </div>
              </form>
            </GlassCard>
            <GlassCard className="p-6">
              <h4 className="font-semibold">{tr.contact_details_title}</h4>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> ul. Transportowców 7, 39-200 Dębica</div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> +48 600 123 456</div>
                <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> biuro@hay-truck.pl</div>
              </div>
            </GlassCard>
          </div>
        ),
      } as Record<Tab, JSX.Element>),
    [tilt, lang]
  );

  return (
    <div className="min-h-svh w-full overflow-clip bg-background text-foreground" onMouseMove={onMouseMove}>
      {/* Animowany gradient w tle */}
      <AnimatedBackground />

      {/* Top bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/40 border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 grid place-items-center text-white shadow-lg shadow-red-500/30">
              <Truck className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="text-sm tracking-widest font-semibold text-primary uppercase">{tr.topTagline}</div>
              <div className="text-xl font-extrabold">HAY-TRUCK</div>
            </div>
          </div>

          {/* Desktop nav */}
          <LayoutGroup>
            <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
              {BASE_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="relative px-3 py-2 rounded-xl hover:bg-foreground/5 transition"
                >
                  <span className={`${activeTab === tab ? "text-primary" : "opacity-80"}`}>
                    {TAB_LABELS[lang][tab]}
                  </span>
                  {activeTab === tab && (
                    <motion.span
                      layoutId="active-underline"
                      className="absolute left-2 right-2 -bottom-0.5 h-0.5 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </nav>
          </LayoutGroup>

          <div className="flex items-center gap-2">
            <LangToggle lang={lang} setLang={setLang} sr={tr.lang_sr} />
            <ThemeToggle theme={theme} setTheme={setTheme} labelLight={tr.theme_light} labelDark={tr.theme_dark} sr={tr.theme_sr} />
            <button className="md:hidden p-2 rounded-xl hover:bg-foreground/10" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile sheet */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              className="md:hidden border-t border-border bg-background/95 backdrop-blur-lg"
            >
              <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
                <div className="font-bold">{tr.menu}</div>
                <button className="p-2 rounded-xl hover:bg-foreground/10" onClick={() => setMobileOpen(false)} aria-label="Close navigation">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mx-auto max-w-6xl px-2 pb-4 grid gap-1">
                {BASE_TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setMobileOpen(false);
                    }}
                    className={`text-left px-4 py-3 rounded-xl hover:bg-foreground/5 ${activeTab === tab ? "bg-foreground/5 text-primary" : ""}`}
                  >
                    {TAB_LABELS[lang][tab]}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-5xl font-extrabold tracking-tight"
            >
              {tr.heroTitle_pre} <span className="text-primary">{tr.heroTitle_highlight}</span>
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 text-base md:text-lg text-muted-foreground max-w-xl"
            >
              {tr.heroDesc}
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-6 flex flex-wrap gap-3"
            >
              <button onClick={() => setActiveTab("Kontakt")} className="btn-primary">{tr.ctaAsk}</button>
              <button onClick={() => setActiveTab("Tabor")} className="btn-ghost">{tr.ctaFleet}</button>
            </motion.div>
          </div>

          <GlassCard className="p-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative h-64 md:h-96"
              style={{ perspective: 1000 }}
            >
              <img
                src="https://images.unsplash.com/photo-1465447142348-e9952c393450?q=80&w=1600&auto=format&fit=crop"
                alt="Modern truck"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)` }}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-transparent to-primary/20" />
            </motion.div>
          </GlassCard>
        </div>
      </section>

      {/* CONTENT TABS */}
      <main className="relative z-10">
        <div className="mx-auto max-w-6xl px-4 pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {TabContent[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="text-xl font-extrabold">HAY-TRUCK</div>
            <p className="mt-2 text-muted-foreground">© {new Date().getFullYear()} — {tr.footer_rights}</p>
          </div>
          <div className="space-y-2">
            <div className="font-semibold">{tr.footer_contact}</div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> +48 600 123 456</div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> biuro@hay-truck.pl</div>
          </div>
          <div className="space-y-2">
            <div className="font-semibold">{tr.footer_office}</div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> ul. Transportowców 7, 39-200 Dębica, Poland</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// -------------------------------
// UI Primitives
// -------------------------------

function ThemeToggle({
  theme,
  setTheme,
  labelLight,
  labelDark,
  sr,
}: {
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
  labelLight: string;
  labelDark: string;
  sr: string;
}) {
  const isDark = theme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm hover:bg-foreground/5 transition"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="hidden sm:inline">{isDark ? labelLight : labelDark}</span>
      <span className="sr-only">{sr}</span>
    </button>
  );
}

function LangToggle({
  lang,
  setLang,
  sr,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  sr: string;
}) {
  const next = lang === "pl" ? "en" : "pl";
  return (
    <button
      onClick={() => setLang(next)}
      className="relative inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm hover:bg-foreground/5 transition"
      aria-label="Toggle language"
    >
      <Globe className="h-4 w-4" />
      <span className="font-semibold">{next.toUpperCase()}</span>
      <span className="sr-only">{sr}</span>
    </button>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="px-3 py-1 rounded-full bg-foreground/5 border border-border text-xs">{children}</span>;
}

function Bullet() {
  return <span className="h-2 w-2 rounded-full bg-primary inline-block" />;
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl border border-border p-4 text-center bg-background/60 backdrop-blur">
      <div className="text-2xl font-extrabold tracking-tight">{k}</div>
      <div className="text-xs text-muted-foreground mt-1">{v}</div>
    </div>
  );
}

function Input({ label, textarea = false, ...props }: any) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-foreground/80">{label}</span>
      {textarea ? (
        <textarea
          className="mt-2 w-full rounded-xl border border-border bg-background/60 backdrop-blur p-3 outline-none focus:ring-2 focus:ring-primary/40"
          rows={4}
          {...props}
        />
      ) : (
        <input
          className="mt-2 w-full rounded-xl border border-border bg-background/60 backdrop-blur p-3 outline-none focus:ring-2 focus:ring-primary/40"
          {...props}
        />
      )}
    </label>
  );
}

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-white/20 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl shadow-xl ${className}`}>
      {children}
    </div>
  );
}

function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      {/* Warstwa 1: animowany gradient (conic) */}
      <div className="absolute inset-0 bg-[conic-gradient(at_10%_10%,theme(colors.red.400),theme(colors.rose.500),theme(colors.red.700),theme(colors.rose.600),theme(colors.red.400))] opacity-30 dark:opacity-20 animate-spin-slow" />
      {/* Warstwa 2: rozmyte blobsy */}
      <div className="absolute -top-20 -left-20 h-[40vmax] w-[40vmax] bg-red-500/30 blur-3xl rounded-full mix-blend-multiply animate-float-slow" />
      <div className="absolute -bottom-24 -right-24 h-[40vmax] w-[40vmax] bg-rose-500/30 blur-3xl rounded-full mix-blend-multiply animate-float-slower" />
      {/* Warstwa 3: subtelna siateczka */}
      <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "24px 24px" }} />
    </div>
  );
}

// -------------------------------
// Tailwind utility classes (via @layer) — wklej do globals.css jeśli chcesz
// Tutaj zostawiamy inline (per-file) dla wygody podglądu.
// -------------------------------

const styleSheet = `
:root{color-scheme:light dark}
html{scroll-behavior:smooth}
/* Kolory tematu (możesz zmapować do Tailwind Theme Extend) */
:root{
  --background: 255 255 255;
  --foreground: 15 23 42;
  --muted: 100 116 139;
  --border: 226 232 240;
  --primary: 220 38 38;
}
.dark{
  --background: 3 6 23;
  --foreground: 226 232 240;
  --muted: 148 163 184;
  --border: 30 41 59;
  --primary: 248 113 113;
}

/***** Semantic tokens *****/
.bg-background{background-color: rgb(var(--background)/1)}
.text-foreground{color: rgb(var(--foreground)/1)}
.text-muted-foreground{color: rgb(var(--muted)/0.9)}
.border-border{border-color: rgb(var(--border)/1)}
.text-primary{color: rgb(var(--primary)/1)}
.bg-primary{background-color: rgb(var(--primary)/1)}

/***** Animacje *****/
@keyframes spin-slow{from{transform:rotate(0)}to{transform:rotate(360deg)}}
.animate-spin-slow{animation:spin-slow 40s linear infinite}
@keyframes float-slow{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}}
.animate-float-slow{animation:float-slow 16s ease-in-out infinite}
.animate-float-slower{animation:float-slow 22s ease-in-out infinite}

/***** Przyciski *****/
.btn-primary{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;padding:.75rem 1rem;border-radius:1rem;font-weight:700;border:1px solid rgb(var(--primary)/.2);background:linear-gradient(180deg, rgb(var(--primary)/1), rgb(var(--primary)/.9));color:white;box-shadow:0 10px 20px -10px rgb(var(--primary)/.6);transition:transform .15s ease,filter .2s ease,box-shadow .2s ease}
.btn-primary:hover{filter:saturate(1.1);box-shadow:0 16px 30px -12px rgb(var(--primary)/.7)}
.btn-primary:active{transform:translateY(1px)}
.btn-ghost{display:inline-flex;align-items:center;justify-content:center;padding:.75rem 1rem;border-radius:1rem;font-weight:700;border:1px solid rgb(var(--border)/1);background:transparent}
.btn-ghost:hover{background:rgb(var(--foreground)/.05)}
`;

// Wstrzyknięcie CSS (działa w środowiskach preview)
if (typeof document !== "undefined" && !document.getElementById("haytruck-inline-style")) {
  const tag = document.createElement("style");
  tag.id = "haytruck-inline-style";
  tag.innerHTML = styleSheet;
  document.head.appendChild(tag);
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft,
  ExternalLink,
  Code2,
  Layers,
  Sparkles,
  Briefcase,
  CheckCircle2,
  Calendar,
  MapPin,
  ArrowUpRight,
  X,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Zap,
  Terminal,
  GraduationCap,
  Download,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Tv,
  Eye,
  EyeOff,
  Bookmark,
  Lock,
  Monitor,
  Globe,
  Video,
  Share2
} from "lucide-react";
import { useSound } from "@/components/SoundController";
import { Navigation } from "@/components/Navigation";
import { SectionHeader } from "@/components/SectionHeader";
import { CategorySelector3D } from "@/components/CategorySelector3D";
import { TiltCard } from "@/components/TiltCard";
import { PersonalProjectsRolodex } from "@/components/PersonalProjectsRolodex";

interface ProjectCaseStudy {
  id: string;
  tag: string;
  category: string;
  isThesisCapstone?: boolean;
  title: string;
  tagline: string;
  client: string;
  role: string;
  shortDesc: string;
  fullDesc: string;
  imageSrc: string;
  videoUrl?: string;
  videoDriveUrl?: string;
  driveId?: string;
  tech: string[];
  architecture: {
    backend: string;
    coreEngine: string;
    safetyLayer: string;
    frontend: string;
    futureReadiness: string;
  };
  stackText: string;
  mediaText: string;
  outcomeText: string;
  liveUrl?: string;
  githubUrl?: string;
  statusText: string;
}

const PERSONAL_PROJECTS: ProjectCaseStudy[] = [
  {
    id: "affilio-commerce",
    tag: "SYS-01",
    category: "FULL STACK SAAS",
    title: "Affilio Commerce — High-Converting Affiliate & E-Commerce Platform",
    tagline: "MULTI-TIER AFFILIATE ATTRIBUTION & REAL-TIME CHECKOUT ECOSYSTEM",
    client: "AFFILIO COMMERCE",
    role: "Lead Full-Stack Architect & Growth Engineer. Engineered the high-converting product storefront, automated checkout funnels, multi-tier affiliate referral ledger, and Stripe payout pipelines.",
    shortDesc: "Comprehensive e-commerce and affiliate growth platform featuring multi-tier commission attribution, high-converting product showcases, checkout funnels, and creator commission dashboards.",
    fullDesc: "Comprehensive e-commerce and affiliate growth platform featuring multi-tier commission attribution, high-converting product showcases, checkout funnels, and creator commission dashboards. Includes live recorded walkthroughs of the end-to-end checkout and attribution flows.",
    imageSrc: "/affilio-commerce.png",
    driveId: "1ckz4spH9c48x8Lv_0wHXEbaUwLPIY3Gp",
    videoDriveUrl: "https://drive.google.com/file/d/1ckz4spH9c48x8Lv_0wHXEbaUwLPIY3Gp/view?usp=sharing",
    tech: ["React", "Next.js", "Tailwind CSS", "Stripe API", "Node.js", "PostgreSQL"],
    architecture: {
      backend: "Node.js and Next.js Server Actions with PostgreSQL managing product inventories, commission splits, and webhook verification.",
      coreEngine: "High-speed affiliate attribution engine tracking click identifiers, conversion cookie attribution, and automated tier multipliers.",
      safetyLayer: "Stripe webhook cryptographic verification, fraud protection for affiliate referral loops, and encrypted payout data.",
      frontend: "Next.js and Tailwind CSS responsive storefront with real-time shopping cart state, currency localization, and affiliate dashboard.",
      futureReadiness: "Prepared for automated crypto payout bridges and multi-channel TikTok Shop & Instagram Shop API synchronization.",
    },
    stackText: "React, Next.js, Tailwind CSS, Stripe API, Node.js, PostgreSQL.",
    mediaText: "Direct embedded high-definition screen record walkthrough demonstrating customer checkout and real-time affiliate ledger attribution without leaving the application.",
    outcomeText: "Streamlined end-to-end purchasing workflows, established automated commission calculation for creators, and provided merchants with unified conversion analytics.",
    githubUrl: "https://github.com/jayloludovice",
    statusText: "SCREEN RECORD DEMO",
  },
  {
    id: "jlr-consultancy",
    tag: "SYS-02",
    category: "COMPANY WEBSITE",
    title: "JLR Consultancy Corporate Portal",
    tagline: "FULL MULTI-PAGE COMPANY WEBSITE FOR AN OFFSHORE CONSULTING FIRM",
    client: "JLR CONSULTANCY",
    role: "Frontend UI/UX Developer & Web Designer. Developed the complete multi-page architecture, animated loader, responsive navigation, service modals, and careers inquiry pipeline.",
    shortDesc: "A full multi-page company website for an offshore consulting firm featuring animated loader, responsive navigation, services showcase, team profiles with modal popups, careers page, and contact form.",
    fullDesc: "A full multi-page company website for an offshore consulting firm featuring animated loader, responsive navigation, services showcase, team profiles with modal popups, careers page, and contact form.",
    imageSrc: "/jlrlanding.png",
    tech: ["Next.js", "Tailwind CSS", "Figma", "WordPress", "JavaScript"],
    architecture: {
      backend: "Static high-speed delivery pipeline with Netlify Edge routing, automated form handling, and spam protection.",
      coreEngine: "Client-side interactive modal dialogue engine showcasing detailed consultant bios, service breakdowns, and dynamic inquiry forms.",
      safetyLayer: "Sanitized client input fields, reCAPTCHA integration, and optimized HTTPS asset delivery.",
      frontend: "Custom responsive multi-page layout built with semantic HTML5, CSS3 transitions, Font Awesome iconography, and curated Google Fonts typography.",
      futureReadiness: "Pre-structured for multi-language localization and automated applicant tracking system (ATS) webhooks.",
    },
    stackText: "Next.js, Tailwind CSS, Figma, WordPress, JavaScript, Netlify.",
    mediaText: "Production corporate website deployed live at https://jlrconsultancy.netlify.app/.",
    outcomeText: "Established an authoritative digital corporate presence for the consulting firm, boosting overseas client inquiries and presenting services and team credentials through a professional, responsive user experience.",
    liveUrl: "https://jlrconsultancy.netlify.app/",
    githubUrl: "https://github.com/jayloludovice",
    statusText: "LIVE CORPORATE WEBSITE",
  },
  {
    id: "leadflow",
    tag: "SYS-03",
    category: "FULL STACK SAAS",
    title: "LeadFlow AI CRM & SaaS Platform",
    tagline: "PRODUCTION-READY AI-POWERED CRM FOR SALES TEAMS WITH AUTOMATED OUTREACH",
    client: "LEADFLOW AI PLATFORM",
    role: "Full-Stack AI Developer & Systems Architect. Built the neural outreach engine, predictive lead scoring pipeline, sales kanban, and Stripe billing subscriptions.",
    shortDesc: "A production-ready AI-powered CRM for sales teams — manage leads, close deals, and automate outreach. Features AI email writer, lead scoring, sales pipeline, and team collaboration in one platform.",
    fullDesc: "A production-ready AI-powered CRM for sales teams — manage leads, close deals, and automate outreach. Features AI email writer, lead scoring, sales pipeline, and team collaboration in one platform.",
    imageSrc: "/Screenshot 2026-07-19 025423.png",
    tech: ["Next.js 15", "TypeScript", "Supabase", "Prisma", "OpenAI", "Stripe", "Tailwind CSS"],
    architecture: {
      backend: "Next.js Server Actions and Prisma ORM connected to PostgreSQL, managing deal pipelines, activity feeds, and user permissions.",
      coreEngine: "OpenAI GPT-4o mini neural engine with prompt templates generating personalized outreach emails tailored to prospect company and industry data.",
      safetyLayer: "Stripe subscription gating, API rate limiting, encrypted credential persistence, and isolated multi-tenant workspaces.",
      frontend: "Fluid drag-and-drop sales pipeline kanban, real-time stage transitions, and reactive probability gauge components.",
      futureReadiness: "Engineered for bi-directional contact syncing with Google Workspace, Microsoft Outlook, and Zapier webhooks.",
    },
    stackText: "Next.js 15, TypeScript, Supabase, Prisma ORM, OpenAI API, Stripe, Tailwind CSS, Vercel.",
    mediaText: "Live SaaS deployment accessible at https://leadflow-crm-sand.vercel.app/.",
    outcomeText: "Reduced manual email drafting time for sales teams by over 70%, improved lead prioritization with AI conversion scoring, and accelerated deal closing velocity.",
    liveUrl: "https://leadflow-crm-sand.vercel.app/",
    githubUrl: "https://github.com/jayloludovice",
    statusText: "LIVE SAAS PLATFORM",
  },
  {
    id: "hagdanan",
    tag: "SYS-04",
    category: "COMMUNITY PLATFORM",
    title: "Hagdanan Steps of Service — Official Civic & Advocacy Portal",
    tagline: "MULTI-PAGE CIVIC ENGAGEMENT PLATFORM FOR 500+ YOUTH & 8 ADVOCACY PILLARS",
    client: "HAGDANAN STEPS OF SERVICE (#AkoAyIsangHakbang)",
    role: "Lead Frontend Developer & UI/UX Architect. Spearheaded the complete digital presence—designing and building a responsive multi-page web platform (Home, About Us, Advocacy Gallery, Interactive Contact/Volunteer Portal) featuring dynamic KPI milestone counters, categorized photo gallery with lightbox, multi-purpose inquiry dispatch forms, and an accessible civic design system.",
    shortDesc: "Official digital portal for Hagdanan Steps of Service (#AkoAyIsangHakbang), a youth-led civic movement in Mabitac, Laguna. Unifies 8 advocacy pillars (Education, Health, Environment, Culture & Sports) across 12+ launched community programs and 500+ youth reached. Features an interactive categorized event gallery with lightbox modal, volunteer/partnership triage intake, FAQ accordions, and integrated partner showcases.",
    fullDesc: "Official digital portal for Hagdanan Steps of Service (#AkoAyIsangHakbang), a youth-led civic movement in Mabitac, Laguna. Unifies 8 advocacy pillars (Education, Health, Environment, Culture & Sports) across 12+ launched community programs and 500+ youth reached. Features an interactive categorized event gallery with lightbox modal, volunteer/partnership triage intake, FAQ accordions, and integrated partner showcases (JLR Consultancy, Rotaract, LGU).",
    imageSrc: "/hsos.png",
    tech: ["HTML", "CSS", "JavaScript", "Netlify Forms", "Google Maps API", "Font Awesome", "Responsive Design"],
    architecture: {
      backend: "Serverless Netlify Forms integration with automated categorization for volunteer onboarding, corporate partnerships, and donation inquiries, paired with async notification routing and Google Maps embed services.",
      coreEngine: "Modular vanilla JavaScript engine driving real-time metric counter animations (500+ youth, 12+ programs), dynamic multi-category gallery filtering (Education, Community, Sports, Recognition, Culture), and responsive lightbox dialogues.",
      safetyLayer: "Strict client-side form validation, automated honeypot spam protection, CSRF token mitigation via Netlify edge headers, and WCAG-compliant high-contrast readability.",
      frontend: "Multi-page semantic HTML5 structure with modern CSS3 layout grids, custom dark/gold civic design system, micro-interactions, and 100% mobile-first responsiveness across all screen sizes.",
      futureReadiness: "Architected for seamless headless CMS integration (Strapi/Sanity) to empower non-technical youth coordinators to publish press releases, event signups, and local digital donation gateways (GCash/PayMaya).",
    },
    stackText: "HTML, CSS, JavaScript, Netlify Forms, Google Maps API, Font Awesome, Netlify CDN.",
    mediaText: "Live multi-page production portal active at https://hagdananstepsofservice.netlify.app/.",
    outcomeText: "Transformed grassroots youth initiatives into an established digital institution—reaching 500+ Mabitaqueño youth, centralizing volunteer recruitment across 8 advocacy pillars, and establishing credibility for partnerships with LGU Mabitac, Rotaract Sierra Lakes, and Ballout Sports for major initiatives like the 126-Step Tunnel of Lights and ARAL Education Program.",
    liveUrl: "https://hagdananstepsofservice.netlify.app/",
    githubUrl: "https://github.com/jayloludovice",
    statusText: "LIVE CIVIC PLATFORM",
  },
  {
    id: "mabitac",
    tag: "SYS-05",
    category: "E-GOVERNANCE",
    title: "Municipal E-Governance Portal — Mabitac, Laguna",
    tagline: "OFFICIAL LOCAL GOVERNMENT WEBSITE WITH LLAMA 3.3 70B AI CHATBOT",
    client: "MUNICIPALITY OF MABITAC, LAGUNA",
    role: "Lead Systems Developer & AI Integration Architect. Designed the public citizen portal, secure municipal admin dashboard, and Groq LLaMA 3.3 70B bilingual conversational assistant.",
    shortDesc: "Official local government website for the Municipality of Mabitac, Laguna. Features a public portal for residents with announcements, events, downloadable forms, and emergency hotlines — plus a secure admin dashboard and an AI chatbot (LLaMA 3.3 70B via Groq) that answers queries in Filipino and English.",
    fullDesc: "Official local government website for the Municipality of Mabitac, Laguna. Features a public portal for residents with announcements, events, downloadable forms, and emergency hotlines — plus a secure admin dashboard and an AI chatbot (LLaMA 3.3 70B via Groq) that answers queries in Filipino and English.",
    imageSrc: "/mbtccc.png",
    tech: ["HTML", "CSS", "JavaScript", "Supabase", "PostgreSQL", "Groq AI", "REST API"],
    architecture: {
      backend: "Supabase edge infrastructure and PostgreSQL database managing announcements, event calendars, emergency directories, and citizen service requests.",
      coreEngine: "High-speed Groq AI inference engine running LLaMA 3.3 70B with municipal context prompt engineering to answer citizen inquiries in both Filipino and English.",
      safetyLayer: "Role-based administrative authentication, secure file upload buckets for official municipal forms, and prompt injection defense.",
      frontend: "Accessible responsive citizen interface designed for high-contrast mobile readability across all network conditions.",
      futureReadiness: "Pre-configured for integration with PhilSys national digital IDs and local municipal tax assessment portals.",
    },
    stackText: "HTML, CSS, JavaScript, Supabase, PostgreSQL, Groq AI (LLaMA), REST API, Netlify.",
    mediaText: "Official municipal production portal deployed live at https://municipalityofmabitac.netlify.app/.",
    outcomeText: "Modernized citizen service access for the town of Mabitac, delivering 24/7 instant AI query resolution in Tagalog and English while reducing in-person municipal inquiry queues by over 60%.",
    liveUrl: "https://municipalityofmabitac.netlify.app/",
    githubUrl: "https://github.com/jayloludovice",
    statusText: "OFFICIAL LGU PORTAL",
  },
  {
    id: "ecom-admin",
    tag: "SYS-06",
    category: "FULL STACK",
    title: "eCommerce Admin Operations Dashboard",
    tagline: "INTERNAL OPERATIONS DASHBOARD FOR MANAGING AN ONLINE STORE",
    client: "ENTERPRISE INTERNAL OPS",
    role: "Full-Stack Developer & Dashboard Architect. Engineered the backend authentication, RESTful API resources, inventory lifecycle tracking, and reactive analytics interface.",
    shortDesc: "A production-ready internal operations dashboard for managing an online store — similar to Shopify Admin. Features sales analytics, inventory tracking, order lifecycle management, and customer insights with role-based access for Admin and Staff users.",
    fullDesc: "A production-ready internal operations dashboard for managing an online store — similar to Shopify Admin. Features sales analytics, inventory tracking, order lifecycle management, and customer insights with role-based access for Admin and Staff users. Internal ops dashboard — not a customer storefront.",
    imageSrc: "/ecommerce-admin.png",
    tech: ["Laravel", "React", "TypeScript", "PostgreSQL", "Supabase", "Tailwind CSS", "Sanctum"],
    architecture: {
      backend: "Laravel API backend utilizing Sanctum token authentication, resource controllers, and transactional database queries.",
      coreEngine: "Real-time analytics computation engine tracking gross revenue, average order value, inventory restock thresholds, and order fulfillment states.",
      safetyLayer: "Strict granular role-based authorization differentiating Admin and Staff permissions, input validation, and audit logging.",
      frontend: "Modern React and TypeScript single-page application styled with Tailwind CSS, featuring responsive charts, interactive data tables, and modal drawers.",
      futureReadiness: "Prepared for automated courier API integrations (FedEx, DHL, Lalamove) and multi-channel marketplace synchronization.",
    },
    stackText: "Laravel, React, TypeScript, PostgreSQL, Supabase, Tailwind CSS, Laravel Sanctum, Vercel.",
    mediaText: "Internal operations web application deployed at https://ecomlaravel.vercel.app/.",
    outcomeText: "Provided store administrators and operational staff with a unified command center for order processing, inventory forecasting, and real-time sales visibility, cutting manual order verification cycles by over 50%.",
    liveUrl: "https://ecomlaravel.vercel.app/",
    githubUrl: "https://github.com/jayloludovice",
    statusText: "INTERNAL OPS DASHBOARD",
  },
  {
    id: "dynasty-barber",
    tag: "SYS-07",
    category: "FULL STACK SAAS",
    title: "Dynasty Barber Digital Platform & Booking SaaS",
    tagline: "FULL-STACK BARBERSHOP PLATFORM WITH ONLINE BOOKING & STRIPE SUBSCRIPTIONS",
    client: "DYNASTY BARBER",
    role: "Full-Stack SaaS Developer & Product Architect. Engineered the online appointment calendar, automated Stripe subscriptions, multi-level referral network, and SMS notification dispatch.",
    shortDesc: "A full-stack barbershop platform with online booking, Stripe-powered subscriptions, multi-level referral network, commission tracking, and admin dashboard.",
    fullDesc: "A full-stack barbershop platform with online booking, Stripe-powered subscriptions, multi-level referral network, commission tracking, and admin dashboard.",
    imageSrc: "/barber.png",
    tech: ["Next.js", "TypeScript", "Tailwind", "Supabase", "Stripe", "Twilio"],
    architecture: {
      backend: "Next.js App Router API endpoints and Supabase database with real-time appointment calendar syncing.",
      coreEngine: "Automated recurring subscription engine powered by Stripe Billing with automated commission calculations across multi-tier referral trees.",
      safetyLayer: "Stripe webhook signature verification, SMS fraud protection via Twilio, and authenticated customer session cookies.",
      frontend: "Sleek dark-mode interface optimized for mobile booking, featuring interactive stylist selection, time-slot pickers, and earnings dashboards.",
      futureReadiness: "Architected for multi-branch salon expansion, automated stylist tip splitting, and inventory product add-ons.",
    },
    stackText: "Next.js, TypeScript, Tailwind CSS, Supabase, Stripe, Twilio SMS API, Vercel.",
    mediaText: "Production SaaS application deployed live at https://dynasty-barber-five.vercel.app/auth/login.",
    outcomeText: "Digitized 100% of customer bookings, eliminated walk-in scheduling collisions, and created recurring monthly revenue streams via VIP membership subscriptions and referral incentives.",
    liveUrl: "https://dynasty-barber-five.vercel.app/auth/login",
    githubUrl: "https://github.com/jayloludovice",
    statusText: "LIVE SAAS PLATFORM",
  },
  {
    id: "propmait",
    tag: "SYS-08",
    category: "FULL STACK SAAS",
    title: "PropMaint UK Housing Services Management",
    tagline: "CLOUD-BASED PROPERTY MAINTENANCE MANAGEMENT SYSTEM FOR UK SOCIAL HOUSING",
    client: "UK SOCIAL HOUSING & HOUSING ASSOCIATIONS",
    role: "Full-Stack Cloud Engineer & Lead Architect. Architected the central dispatch dashboard, tenant/contractor portal, mobile operative workflow, and automated Xero accounting sync.",
    shortDesc: "A cloud-based property maintenance management system for UK social housing with admin dashboard, client portal, and operative mobile app. Features job management, variation workflows, PDF reports, and Xero/QuickBooks integration.",
    fullDesc: "A cloud-based property maintenance management system for UK social housing with admin dashboard, client portal, and operative mobile app. Features job management, variation workflows, PDF reports, and Xero/QuickBooks integration.",
    imageSrc: "/propmaint-thumb.png",
    videoUrl: "/propmaint.mp4",
    videoDriveUrl: "https://drive.google.com/file/d/1mvLdx68_J-HIDKBeKZgI9VyKmbkFEEmQ/view?usp=sharing",
    tech: ["React", "TypeScript", "Tailwind CSS", "Node.js", "REST APIs", "Google Maps"],
    architecture: {
      backend: "Node.js and Express REST microservices with Prisma ORM querying high-availability PostgreSQL for multi-tenant property portfolios.",
      coreEngine: "Automated trade operative dispatch engine matching contractor skill sets, geographic estate zones, and tenant urgency levels.",
      safetyLayer: "Cryptographic photo-verification timestamps, tenant digital sign-offs, and compliance audit logging for UK housing regulations.",
      frontend: "React-powered administrative dispatch console coupled with a companion React Native mobile application for on-site field engineers.",
      futureReadiness: "Prepared for automated scheduled maintenance sensors (IoT boiler and damp monitors) and municipal housing authority data lakes.",
    },
    stackText: "React, Node.js, PostgreSQL, React Native, Prisma, Express, Xero API, Tailwind CSS.",
    mediaText: "Executive production video demonstration showcasing full property maintenance workflow, dispatch dashboard, and contractor mobile app.",
    outcomeText: "Significantly accelerated work order approval workflows, eliminated invoice reconciliation errors through automated Xero syncing, and established complete photographic audit trails for public housing compliance.",
    githubUrl: "https://github.com/jayloludovice",
    statusText: "EXECUTIVE VIDEO DEMO",
  },
  {
    id: "ccs",
    tag: "SYS-09 • BSIT THESIS CAPSTONE",
    category: "COLLEGE THESIS & CAPSTONE",
    isThesisCapstone: true,
    title: "CCS Student Services Academic Portal (LSPU)",
    tagline: "OFFICIAL UNDERGRADUATE THESIS & CAPSTONE PROJECT • ACADEMIC SERVICES SYSTEM FOR LSPU-STA. CRUZ",
    client: "LAGUNA STATE POLYTECHNIC UNIVERSITY (LSPU)",
    role: "Lead Full-Stack Developer & Thesis Lead. Spearheaded the complete database architecture (27 tables), secure PHP backend, role-based access control for 6 user types, UI/UX implementation, thesis documentation, faculty panel defense, and deployment.",
    shortDesc: "Official BSIT Undergraduate Thesis & Capstone Project: A centralized academic services portal for LSPU-Sta. Cruz featuring 6 user roles, grade encoding, crediting workflows, OJT management, and dynamic PDF generation.",
    fullDesc: "Official BSIT Undergraduate Thesis & Capstone Project: A centralized academic services portal for LSPU-Sta. Cruz featuring 6 user roles, grade encoding, crediting workflows, OJT management, and dynamic PDF generation. Defended and approved with distinction by the LSPU College of Computer Studies faculty panel.",
    imageSrc: "/ccs.png",
    driveId: "1iHXPoCNNLzG37KBjfRfYNfA3n08tai01",
    videoDriveUrl: "https://drive.google.com/file/d/1iHXPoCNNLzG37KBjfRfYNfA3n08tai01/view?usp=sharing",
    tech: ["PHP", "MySQL", "JavaScript", "PHPMailer", "FPDF", "Chart.js"],
    architecture: {
      backend: "Application Layer built on PHP 8.0 and Apache handling session management, core business logic, automated email notifications via PHPMailer, and dynamic credential generation via FPDF.",
      coreEngine: "Monolithic Architecture with MVC-like structure coordinating 27 relational database tables for grade computation, student rankings (GWA/GPA), INC/removal exam requests, subject crediting, and OJT deployment tracking.",
      safetyLayer: "Data Layer powered by MySQL/MariaDB with UTF-8mb4 character set. Strict multi-role authentication (Students, Teachers, Dean, Secretary, Program Head, System Admin), password hashing, profile photo/signature verification, and audit logs.",
      frontend: "Presentation Layer built with semantic HTML5, custom CSS3 styling and animations, Vanilla JavaScript interactivity, Font Awesome, and Google Fonts (Inter) typography.",
      futureReadiness: "Designed for seamless migration to cloud hosting and bi-directional synchronization with campus-wide registrar systems.",
    },
    stackText: "PHP, MySQL, JavaScript, PHPMailer, FPDF, Chart.js, HTML, CSS, Apache, XAMPP.",
    mediaText: "Official undergraduate thesis capstone walkthrough video showing 6 user roles, student grade portal, Dean and Program Head approval workflows, and dynamic PDF credential generation.",
    outcomeText: "Official College Thesis & Capstone Project defended and approved at LSPU. For Students: 24/7 access to grades and academic services, faster processing of INC and crediting requests, transparency in academic standing, and instant email alerts. For Teachers: Centralized grade management, easy INC request tracking, digital signature integration, and class management tools. For Administrators: Real-time monitoring of student progress, automated approval workflows, data-driven decision making, and reduced paperwork.",
    liveUrl: "https://ccsstudentservices.online/login",
    githubUrl: "https://github.com/jayloludovice",
    statusText: "OFFICIAL THESIS CAPSTONE",
  },
  {
    id: "mobile-app",
    tag: "SYS-10",
    category: "MOBILE APP",
    title: "Mobile Application (Cross-Platform Flutter & Android Studio)",
    tagline: "CROSS-PLATFORM MOBILE APPLICATION DEVELOPED USING FLUTTER & ANDROID STUDIO",
    client: "MOBILE PRODUCT DEVELOPMENT",
    role: "Mobile Application Developer & UI Designer. Designed the clean mobile interface, implemented state management, and optimized native platform bridges.",
    shortDesc: "Cross-platform mobile application developed using Flutter and Android Studio with clean UI design.",
    fullDesc: "Cross-platform mobile application developed using Flutter and Android Studio with clean UI design. Features responsive mobile widgets, real-time analytics graphs, user authentication, and smooth transitions tailored for Android and iOS devices.",
    imageSrc: "/mobile-app.jpg",
    tech: ["Flutter", "Android Studio", "Dart", "Firebase"],
    architecture: {
      backend: "RESTful API and Firebase backend services handling user authentication, profile data, and real-time push notifications.",
      coreEngine: "Declarative Flutter widget tree optimized for high-refresh-rate rendering, smooth page route transitions, and responsive layout scaling.",
      safetyLayer: "Secure on-device token storage using Flutter Secure Storage and encrypted local SQLite caching.",
      frontend: "Modern dark-themed mobile user interface adhering to Material Design 3 and iOS Cupertino standards with custom glassmorphism widgets.",
      futureReadiness: "Modular BLoC / Provider architecture enabling rapid addition of offline sync and background location tracking features.",
    },
    stackText: "Flutter, Android Studio, Dart, Firebase, Material Design 3, iOS & Android SDKs.",
    mediaText: "Cross-platform mobile application presentation and design system showcase.",
    outcomeText: "Delivered a fluid, responsive 60fps mobile application experience across Android and iOS with clean typography, intuitive user interactions, and robust state management.",
    githubUrl: "https://github.com/jayloludovice",
    statusText: "MOBILE APP SHOWCASE",
  },
];

interface WorkExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  badge: string;
  skills: string[];
  points: string[];
}

const WORK_EXPERIENCES: WorkExperienceItem[] = [
  {
    id: "freelance-fullstack",
    role: "Freelance Full-Stack Developer",
    company: "Self-Employed / Freelance",
    period: "2023 – Present",
    badge: "FREELANCE",
    skills: [
      "Next.js",
      "React",
      "TypeScript",
      "JavaScript",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "Node.js",
      "Laravel",
      "PHP",
      "C#",
      "Flutter",
      "React Native",
      "Supabase",
      "PostgreSQL",
      "MySQL",
      "Prisma",
      "Groq AI",
      "OpenAI",
      "ChatGPT",
      "Claude Code",
      "Gemini",
      "Amazon Q",
      "Antigravity",
      "Codex",
      "Kiro",
      "Stripe",
      "Twilio",
      "REST APIs",
      "Git",
      "GitHub",
      "Vercel",
      "Netlify",
    ],
    points: [
      "Architected and deployed custom production websites and full-stack web applications for academic, institutional, and business clients—including college capstones, municipal portals, and SaaS platforms.",
      "Engineered full-stack solutions utilizing modern frameworks: Next.js (App Router/Server Actions), React, TypeScript, Laravel, and PHP with Tailwind CSS styling and responsive micro-interactions.",
      "Leveraged an advanced AI-assisted engineering workflow (ChatGPT for system brainstorming & architecture, Claude Code, Codex, Antigravity, Kiro, Amazon Q, and Gemini) to rapidly accelerate prototyping, optimize clean codebases, and deliver high-velocity production deliverables.",
      "Integrated cutting-edge AI and third-party APIs: Groq AI (LLaMA) and OpenAI (GPT) for intelligent bilingual assistants, Stripe for subscription payments, and Twilio for automated SMS alerts.",
      "Designed and managed secure relational and cloud databases using PostgreSQL, MySQL, Supabase, and Prisma with strict role-based access control (RBAC), data encryption, and automated backups.",
      "Delivered diverse production systems: AI CRMs, property maintenance management, barbershop booking SaaS, e-commerce admin dashboards, academic student records (with FPDF dynamic documents), and mobile applications in Flutter.",
      "Handled end-to-end software lifecycles from UI/UX wireframing in Figma to cloud edge deployment on Vercel and Netlify, consistently meeting strict deadlines with 100% client satisfaction.",
    ],
  },
  {
    id: "real-estate-editor",
    role: "Real Estate Video Editor, Graphic Designer & SMM",
    company: "Your Real Estate Experts",
    period: "6-Month Contract",
    badge: "CONTRACT",
    skills: ["Adobe Premiere Pro", "CapCut", "Adobe Photoshop", "Canva", "Blotato AI", "Google Business Suite"],
    points: [
      "Edited high-retention real estate listing videos, architectural property tours, talking-head authority clips, and short/long-form social media content.",
      "Created polished property marketing graphics, social media layouts, YouTube thumbnails, and promotional campaign materials.",
      "Polished media with precision captions, dynamic transitions, spatial audio balance, cinematic color adjustments, and consistent brand identity.",
      "Managed multi-platform social media distribution by uploading, scheduling, formatting, and publishing posts across social channels.",
      "Leveraged Blotato AI and automated workflows to streamline content syndication and accelerate turnaround times.",
    ],
  },
  {
    id: "assessor-intern",
    role: "Municipal Assessor Intern",
    company: "Municipality of Mabitac, Laguna",
    period: "Feb 2026 – May 2026",
    badge: "ON-THE-JOB TRAINING",
    skills: ["Microsoft Excel", "Microsoft Word", "Government Documentation", "Database Encoding", "Public Records Management"],
    points: [
      "Encoded, verified, and systematically updated municipal real property records, tax declarations, and official assessment registries.",
      "Organized, classified, and maintained confidential government archives, land records, and municipal administrative documents.",
      "Assisted local residents and constituents with frontline inquiries, document clearance requests, and official municipal procedures.",
      "Collaborated closely with municipal officers and administrative personnel to streamline daily office operations and constituent service delivery.",
    ],
  },
  {
    id: "jlr-consultancy",
    role: "Web Developer, Video Editor & Graphic Designer",
    company: "JLR Consultancy",
    period: "Sept 2024 – Jul 2025",
    badge: "OFFSHORE CONSULTING",
    skills: ["Wix", "WordPress", "Figma", "HTML", "CSS", "JavaScript", "Adobe Photoshop", "CapCut", "Canva"],
    points: [
      "Developed and maintained corporate Wix and WordPress websites, handling complete website migrations, layout redesigns, and custom code integrations.",
      "Edited and produced promotional video reels and corporate presentations utilizing client-supplied B-roll footage and motion graphics.",
      "Designed corporate marketing collateral, event visuals, digital branding packages, and client-facing promotional assets aligned with brand standards.",
      "Crafted responsive UI/UX prototypes and web layouts in Figma, including custom product and suit catalog layouts for AltonLane.com.",
      "Collaborated with cross-functional offshore teams to deliver website feature enhancements, visual assets, and multimedia campaigns on schedule.",
    ],
  },
];

const RESUME_SKILLS_CATEGORIES = [
  {
    category: "Development",
    skills: ["HTML", "CSS", "JavaScript", "TypeScript", "PHP", "C#", "Python", "React.js", "Next.js", "Node.js", "Laravel", "Tailwind CSS", "REST APIs", "Chart.js", "FPDF", "PHPMailer", "Responsive Web Design", "CRUD Operations", "API Integration"],
  },
  {
    category: "Database & Backend",
    skills: ["MySQL", "PostgreSQL", "Supabase", "Prisma", "Authentication", "Role-Based Access Control", "Database Design"],
  },
  {
    category: "AI Tools & Workflow",
    skills: ["ChatGPT", "Claude Code", "Gemini", "Amazon Q", "Antigravity", "Codex", "Kiro", "Blotato AI"],
  },
  {
    category: "AI APIs & Integrations",
    skills: ["Groq AI", "OpenAI", "LLaMA", "Stripe", "Twilio"],
  },
  {
    category: "Tools & Deployment",
    skills: ["Git", "GitHub", "Vercel", "Netlify", "Railway", "Render", "Cloud Deployment"],
  },
  {
    category: "Design & CMS",
    skills: ["Figma", "Adobe Photoshop", "Adobe XD", "Canva", "WordPress", "Wix", "Squarespace"],
  },
  {
    category: "Mobile & Multimedia",
    skills: ["Flutter", "Dart", "React Native", "Android Studio", "Adobe Premiere Pro", "CapCut", "Blotato AI"],
  },
];

export default function WorkPage() {
  const { playHoverSound, playSelectSound, playTransitionSound } = useSound();
  
  // Category state: null means user is on the initial 3D selection screen; "PERSONAL" shows 2-col grid, "INDUSTRY" shows WORK EXPERIENCE paragraphs
  const [selectedCategory, setSelectedCategory] = useState<"PERSONAL" | "INDUSTRY" | null>(null);
  
  // Active Project Detail modal state (for Personal Projects)
  const [activeProject, setActiveProject] = useState<ProjectCaseStudy | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(true);

  // Filter state for Personal Projects
  const [archiveFilter, setArchiveFilter] = useState("ALL");

  // Read URL query parameter if navigated with ?category=PERSONAL or ?category=INDUSTRY
  useEffect(() => {
    const handleCheckCategory = () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const cat = params.get("category");
        if (cat === "PERSONAL" || cat === "INDUSTRY") {
          setSelectedCategory(cat);
        }
      }
    };

    handleCheckCategory();
    window.addEventListener("popstate", handleCheckCategory);
    return () => window.removeEventListener("popstate", handleCheckCategory);
  }, []);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaContainerRef = useRef<HTMLDivElement>(null);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    playSelectSound();
    if (videoRef.current.paused) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err.name !== "AbortError") {
            console.warn("Video playback interrupted:", err);
          }
        });
      }
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const toggleFullscreen = () => {
    playSelectSound();
    const elem = mediaContainerRef.current || videoRef.current;
    if (!document.fullscreenElement) {
      if (elem?.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if ((elem as any)?.webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const activeProjectsList = PERSONAL_PROJECTS;

  // Filtered Personal Projects (Linear / Vercel style grid)
  const filteredPersonalProjects = PERSONAL_PROJECTS.filter((p) => {
    if (archiveFilter === "ALL") return true;
    if (archiveFilter === "VIDEO") return Boolean(p.videoUrl || p.driveId);
    if (archiveFilter === "LIVE") return Boolean(p.liveUrl && !p.liveUrl.includes("drive.google.com"));
    if (archiveFilter === "SAAS") return p.category.includes("SAAS");
    if (archiveFilter === "CIVIC") return p.category.includes("COMMUNITY") || p.category.includes("GOVERNANCE");
    return true;
  });

  const handleSelectCategory = (cat: "PERSONAL" | "INDUSTRY") => {
    playTransitionSound();
    setSelectedCategory(cat);
  };

  const handleOpenProject = (project: ProjectCaseStudy) => {
    playSelectSound();
    setActiveProject(project);
    setIsVideoPlaying(true);
    setIsTheaterMode(true);
  };

  const handleCloseProject = () => {
    playSelectSound();
    setActiveProject(null);
    setIsTheaterMode(true);
  };

  const handleNextProject = () => {
    if (!activeProject) return;
    playSelectSound();
    const currentIndex = activeProjectsList.findIndex(p => p.id === activeProject.id);
    const nextIndex = (currentIndex + 1) % activeProjectsList.length;
    setActiveProject(activeProjectsList[nextIndex]);
  };

  const handlePrevProject = () => {
    if (!activeProject) return;
    playSelectSound();
    const currentIndex = activeProjectsList.findIndex(p => p.id === activeProject.id);
    const prevIndex = (currentIndex - 1 + activeProjectsList.length) % activeProjectsList.length;
    setActiveProject(activeProjectsList[prevIndex]);
  };

  // Keyboard navigation for Case Study View
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeProject) return;
      if (e.key === "Escape") handleCloseProject();
      if (e.key === "ArrowRight") handleNextProject();
      if (e.key === "ArrowLeft") handlePrevProject();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeProject, activeProjectsList]);

  // Resize Lenis whenever selectedCategory changes so the page can be scrolled completely to the bottom
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (selectedCategory === null && window.innerWidth >= 768) {
        window.scrollTo(0, 0);
        if ((window as any).lenis) {
          (window as any).lenis.scrollTo(0, { immediate: true });
        }
      }
      if ((window as any).lenis) {
        setTimeout(() => {
          (window as any).lenis.resize();
        }, 50);
        setTimeout(() => {
          (window as any).lenis.resize();
        }, 350);
      }
    }
  }, [selectedCategory]);

  // Lock window scroll (both documentElement and body) & disable Lenis when modal is open so only the modal scrolls
  useEffect(() => {
    if (activeProject) {
      if (videoRef.current) {
        videoRef.current.volume = 0.3;
      }
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      if (typeof window !== "undefined" && (window as any).lenis) {
        (window as any).lenis.stop();
      }
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (typeof window !== "undefined" && (window as any).lenis) {
        (window as any).lenis.start();
        (window as any).lenis.resize();
      }
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (typeof window !== "undefined" && (window as any).lenis) {
        (window as any).lenis.start();
        (window as any).lenis.resize();
      }
    };
  }, [activeProject]);

  return (
    <div className={`relative w-full bg-transparent text-typography select-none page-transition-enter overflow-x-clip ${selectedCategory === null ? "min-h-screen md:h-screen md:overflow-hidden flex flex-col justify-between" : "min-h-screen"}`}>
      
      {/* Background Ambience allowing 3D particles to shine through */}
      <div className="fixed inset-0 bg-atmospheric pointer-events-none opacity-40"></div>
      <div className="fixed inset-0 bg-digital-grid pointer-events-none opacity-15"></div>

      {/* Unified Persistent Navigation */}
      <Navigation />

      {/* Giant Outline Watermark Header Section (Exact same placement as creatives and info) */}
      <div className={`${selectedCategory === null ? "pt-16 sm:pt-20 md:pt-22 shrink-0" : "pt-20 sm:pt-28"}`}>
        <SectionHeader
          watermark="WORK"
          compact={selectedCategory === null}
          subtitle={
            selectedCategory === null
              ? undefined
              : selectedCategory === "PERSONAL"
              ? "PROJECTS | COLLABORATIONS | EXPLORATIONS"
              : "EXPERIENCE | ROLES | ENGAGEMENTS"
          }
        />
      </div>

      {/* ========================================================================= */}
      {/* 1. INITIAL STATE: 3D CATEGORY SELECTOR (Responsive Cards on Mobile & Web) */}
      {/* ========================================================================= */}
      {selectedCategory === null && (
        <div className="relative z-10 w-full max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 flex-1 flex items-center justify-center my-auto pb-6 md:pb-10 animate-in fade-in duration-700">
          <CategorySelector3D
            activeCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ACTIVE CATEGORY VIEW: 2-COLUMN PROJECT GRID (Matches frames 16 & 22) */}
      {/* ========================================================================= */}
      {selectedCategory !== null && (
        <main className={`relative z-10 ${selectedCategory === "PERSONAL" ? "max-w-[1560px] 2xl:max-w-[1680px] px-3 sm:px-8 lg:px-10" : "max-w-7xl px-3 sm:px-12 lg:px-16"} mx-auto pb-12 sm:pb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 transition-all`}>
          
          {/* Category Switcher & Back Control Bar */}
          <div className="mb-6 sm:mb-16 flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 sm:gap-4 border-b border-white/10 pb-4 sm:pb-5">
            <button
              type="button"
              onClick={() => {
                playTransitionSound();
                setSelectedCategory(null);
              }}
              onMouseEnter={() => playHoverSound()}
              className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 font-mono text-xs sm:text-sm tracking-[0.16em] sm:tracking-[0.2em] text-white/80 hover:text-coreCyan transition-colors cursor-pointer py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>← CHOOSE A CATEGORY</span>
            </button>

            {/* Quick Category Toggle Pills */}
            <div className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 font-mono text-[11px] sm:text-sm tracking-[0.08em] sm:tracking-[0.15em]">
              <button
                type="button"
                onClick={() => handleSelectCategory("PERSONAL")}
                onMouseEnter={() => playHoverSound()}
                className={`py-1.5 sm:py-2 px-3 sm:px-6 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === "PERSONAL"
                    ? "border-yellow-400 bg-yellow-400/25 text-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.4)] font-semibold"
                    : "border-white/20 bg-black/50 text-white/70 hover:text-white"
                }`}
              >
                PERSONAL PROJECTS
              </button>
              <button
                type="button"
                onClick={() => handleSelectCategory("INDUSTRY")}
                onMouseEnter={() => playHoverSound()}
                className={`py-1.5 sm:py-2 px-3 sm:px-6 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === "INDUSTRY"
                    ? "border-sky-400 bg-sky-400/25 text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.4)] font-semibold"
                    : "border-white/20 bg-black/50 text-white/70 hover:text-white"
                }`}
              >
                INDUSTRY
              </button>
            </div>
          </div>

          {/* Conditional Display: INDUSTRY (Ultra-Readable Glass Cards) vs PERSONAL (2-Column Grid) */}
          {selectedCategory === "INDUSTRY" ? (
            /* ========================================================================= */
            /* INDUSTRY: WORK EXPERIENCE (Ultra-Readable, High-Contrast Frosted Cards) */
            /* ========================================================================= */
            <div className="w-full max-w-6xl xl:max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500 text-left">
              
              {/* Section Header */}
              <div className="border-b border-white/15 pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h2 className="font-grotesk font-light text-2xl sm:text-5xl text-white tracking-[0.12em] sm:tracking-[0.15em] uppercase">
                    WORK EXPERIENCE
                  </h2>
                  <p className="text-zinc-400 text-xs sm:text-base font-sans mt-1">
                    Verified commercial industry track record, specialized roles, and client project deliverables.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="font-mono text-[10px] sm:text-sm tracking-widest text-sky-400 uppercase bg-sky-950/70 border border-sky-400/40 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                    4 VERIFIED ROLES
                  </span>
                  <a
                    href="/resume.pdf"
                    download="JAYLO_LUDOVICE_RESUME.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 sm:gap-2 font-mono text-[10px] sm:text-sm tracking-widest text-white uppercase bg-white/10 hover:bg-coreCyan hover:text-black border border-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-coreCyan" />
                    <span>DOWNLOAD RESUME (PDF)</span>
                  </a>
                </div>
              </div>

              {/* Education Card matching official resume */}
              <div className="relative bg-[#090c15]/95 backdrop-blur-3xl border border-emerald-500/30 hover:border-emerald-400/60 rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-300 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <span className="font-mono text-[11px] sm:text-xs tracking-widest text-emerald-400 uppercase font-semibold flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      // ACADEMIC EDUCATION
                    </span>
                    <h3 className="font-grotesk text-2xl sm:text-3xl text-white font-semibold tracking-wide">
                      Laguna State Polytechnic University
                    </h3>
                    <p className="font-mono text-sm sm:text-base text-zinc-300">
                      Bachelor of Science in Information Technology — <span className="text-emerald-400 font-medium">Web and Mobile Application Development</span>
                    </p>
                  </div>
                  <div className="flex flex-col sm:items-end gap-1.5 font-mono text-xs sm:text-sm">
                    <span className="text-zinc-400 flex items-center gap-1 sm:justify-end">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      Santa Cruz, Laguna
                    </span>
                    <span className="text-emerald-300 font-semibold bg-emerald-950/70 border border-emerald-400/40 px-3.5 py-1 rounded-full text-xs">
                      JUL 2026 • GWA: 1.89
                    </span>
                  </div>
                </div>
              </div>

              {/* Experiences Cards with Frosted Dark Glass Backdrop */}
              <div className="space-y-8">
                {WORK_EXPERIENCES.map((exp) => (
                  <article
                    key={exp.id}
                    className="relative bg-[#090c15]/95 backdrop-blur-3xl border border-white/15 hover:border-sky-400/50 rounded-2xl p-6 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-300 space-y-6 group"
                  >
                    {/* Top Accent Glow Line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Role Header & Meta */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-white/10 pb-5">
                      <div className="space-y-2">
                        <h3 className="font-grotesk text-2xl sm:text-3xl text-white font-semibold tracking-wide group-hover:text-sky-300 transition-colors">
                          {exp.role}
                        </h3>
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm sm:text-base font-mono">
                          <span className="text-sky-400 font-medium flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-sky-400 shrink-0" />
                            <span>{exp.company}</span>
                          </span>
                          <span className="text-zinc-500 hidden sm:inline">•</span>
                          <span className="text-zinc-300 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span>{exp.period}</span>
                          </span>
                        </div>
                      </div>

                      <span className="self-start font-mono text-xs tracking-wider text-sky-300 bg-sky-950/70 border border-sky-400/40 px-3.5 py-1.5 rounded-full uppercase font-medium shrink-0">
                        {exp.badge}
                      </span>
                    </div>

                    {/* Tech & Skills Badges */}
                    <div className="space-y-2.5">
                      <div className="font-mono text-xs tracking-wider text-coreCyan font-bold uppercase flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>TECH & TOOLS:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {exp.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="font-mono text-xs sm:text-[13px] px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/15 text-zinc-200 hover:text-white hover:border-coreCyan/50 hover:bg-coreCyan/10 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Bullet Points / Responsibilities */}
                    <div className="space-y-3.5 pt-2">
                      <div className="font-mono text-xs tracking-wider text-zinc-400 uppercase font-semibold">
                        KEY CONTRIBUTIONS & ACHIEVEMENTS:
                      </div>
                      <ul className="space-y-3">
                        {exp.points.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-3">
                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-coreCyan shrink-0 mt-0.5" />
                            <p className="text-zinc-100 text-sm sm:text-base leading-relaxed font-sans font-normal">
                              {point}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>

              {/* Technical Skills & Competencies Matrix from Resume */}
              <div className="relative bg-[#090c15]/95 backdrop-blur-3xl border border-white/15 rounded-2xl p-6 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6">
                <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="font-mono text-[11px] sm:text-xs tracking-widest text-coreCyan uppercase font-semibold flex items-center gap-2">
                      <Terminal className="w-4 h-4" />
                      // RESUME SKILLS & INTERESTS
                    </span>
                    <h3 className="font-grotesk text-2xl sm:text-3xl text-white font-semibold tracking-wide">
                      Technical Skills & Competency Matrix
                    </h3>
                  </div>
                  <span className="self-start sm:self-center font-mono text-xs tracking-widest text-zinc-400 uppercase bg-white/[0.04] border border-white/10 px-3.5 py-1.5 rounded-full">
                    {RESUME_SKILLS_CATEGORIES.length} TECHNICAL DOMAINS
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {RESUME_SKILLS_CATEGORIES.map((cat, cIdx) => (
                    <div key={cIdx} className="space-y-2.5 p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors">
                      <h4 className="font-mono text-xs text-coreCyan font-bold uppercase tracking-wider">
                        {cat.category}
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="font-mono text-xs px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-zinc-200 hover:text-white hover:border-coreCyan/40 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* PERSONAL PROJECTS: 3D FOLDING DECK (Beeyond Tech Inspired) & GRID VIEW   */
            /* ========================================================================= */
            <PersonalProjectsRolodex
              projects={PERSONAL_PROJECTS}
              onOpenProject={handleOpenProject}
            />
          )}

        </main>
      )}

      {/* ========================================================================= */}
      {/* 3. FULL-SCREEN DEDICATED CASE STUDY VIEW (Rendered in Portal directly on body) */}
      {/* ========================================================================= */}
      {activeProject && typeof document !== "undefined" && createPortal(
        <div 
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
          className="fixed inset-0 z-[9999] w-screen h-screen bg-[#050507]/95 backdrop-blur-2xl overflow-y-auto overscroll-contain animate-in fade-in duration-300"
        >
          
          {/* Top Sticky Case Study Navigation Bar */}
          <header className="sticky top-0 z-30 w-full px-4 sm:px-12 py-3.5 sm:py-5 bg-[#050507]/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between">
            
            {/* Left: Back Button */}
            <button
              type="button"
              onClick={handleCloseProject}
              onMouseEnter={() => playHoverSound()}
              className="flex items-center gap-2 font-mono text-xs sm:text-sm tracking-[0.18em] sm:tracking-[0.22em] text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-coreCyan" />
              <span className="hidden sm:inline">← BACK TO WORK</span>
              <span className="sm:hidden">BACK</span>
            </button>

            {/* Right: Code Link </>, Next Project [->], Close [X] */}
            <div className="flex items-center gap-3 sm:gap-6 font-mono text-xs sm:text-sm">
              {/* Source Code </ > Button */}
              {activeProject.githubUrl && (
                <a
                  href={activeProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSelectSound()}
                  onMouseEnter={() => playHoverSound()}
                  className="px-3 sm:px-3.5 py-1.5 rounded border border-white/20 hover:border-coreCyan bg-white/[0.03] text-white/90 hover:text-coreCyan transition-all flex items-center gap-1.5 sm:gap-2 text-xs"
                  title="View Source Code"
                >
                  <Code2 className="w-4 h-4 text-coreCyan" />
                  <span className="hidden sm:inline">&lt;/&gt;</span>
                </a>
              )}

              {/* Next Project [ -> ] Button (Square Border) */}
              <button
                type="button"
                onClick={handleNextProject}
                onMouseEnter={() => playHoverSound()}
                className="w-8 sm:w-9 h-8 sm:h-9 rounded border border-white/25 hover:border-coreCyan bg-white/[0.04] text-white hover:text-coreCyan flex items-center justify-center transition-all cursor-pointer"
                title="Next Project"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Close [ X ] Button */}
              <button
                type="button"
                onClick={handleCloseProject}
                onMouseEnter={() => playHoverSound()}
                className="p-2 rounded hover:bg-white/10 text-muted hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

          </header>

          {/* Case Study Content Body */}
          <div className={`${isTheaterMode ? "w-full max-w-[97vw] xl:max-w-[94vw]" : "max-w-6xl"} mx-auto px-2 sm:px-8 pt-6 sm:pt-10 pb-10 sm:pb-14 space-y-8 sm:space-y-12 transition-all duration-500 ease-out`}>
            
            {/* Project Title Watermark Banner */}
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="flex items-center justify-center gap-2.5 flex-wrap font-mono text-xs sm:text-sm tracking-[0.28em] text-coreCyan uppercase font-medium">
                <span>{activeProject.category}</span>
                {activeProject.isThesisCapstone && (
                  <>
                    <span className="text-zinc-600">•</span>
                    <span className="px-3.5 py-1 rounded-full bg-amber-500/20 border border-yellow-400/60 text-yellow-300 font-bold tracking-widest text-[11px] sm:text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(250,204,21,0.35)]">
                      <span>🎓</span>
                      <span>OFFICIAL UNDERGRADUATE THESIS & CAPSTONE (LSPU)</span>
                    </span>
                  </>
                )}
              </div>
              <h1 className="font-grotesk font-light text-3xl sm:text-5xl md:text-7xl tracking-wide sm:tracking-wider text-white uppercase leading-tight">
                {activeProject.title}
              </h1>
              <p className="font-mono text-xs sm:text-sm text-coreCyan/80 tracking-wider max-w-3xl mx-auto uppercase">
                {activeProject.tagline}
              </p>
            </div>

            {/* Showcase Media Preview Frame with Simulated Browser Chrome & Theater Mode */}
            <div className="space-y-3">
              <div
                ref={mediaContainerRef}
                className={`relative w-full rounded-2xl overflow-hidden border border-white/15 bg-[#09090c] shadow-[0_25px_70px_rgba(0,0,0,0.95)] transition-all duration-500 ${
                  isTheaterMode
                    ? "ring-1 ring-coreCyan/30 shadow-[0_30px_90px_rgba(77,242,255,0.12)]"
                    : ""
                }`}
              >
                
                {/* Browser Window Chrome */}
                <div className="w-full px-4 py-3 bg-[#111114] border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                  </div>
                  <div className="font-mono text-xs sm:text-sm text-white/70 tracking-wider truncate max-w-sm sm:max-w-md px-4 py-1.5 rounded bg-black/50 border border-white/10">
                    {activeProject.liveUrl && !activeProject.liveUrl.includes("drive.google.com")
                      ? activeProject.liveUrl
                      : (activeProject.driveId ? "IN-APP HD VIDEO WALKTHROUGH PLAYER" : "http://localhost:3000")}
                  </div>
                  
                  {/* Chrome Right Action: Quick Theater Switch */}
                  {(activeProject.videoUrl || activeProject.driveId) && (
                    <button
                      type="button"
                      onClick={() => {
                        playSelectSound();
                        setIsTheaterMode(!isTheaterMode);
                      }}
                      className="flex items-center gap-1.5 font-mono text-[11px] sm:text-xs tracking-wider px-3 py-1 rounded bg-white/[0.06] hover:bg-coreCyan hover:text-black border border-white/20 hover:border-coreCyan text-coreCyan transition-all cursor-pointer shadow-md"
                    >
                      <Tv className="w-3.5 h-3.5" />
                      <span>{isTheaterMode ? "DEFAULT VIEW" : "THEATER VIEW"}</span>
                    </button>
                  )}
                  {!activeProject.videoUrl && !activeProject.driveId && <div className="w-8"></div>}
                </div>

                {/* Media Container (Drive Video Iframe, Local Video, or Screenshot) */}
                <div
                  className={`relative w-full bg-black flex items-center justify-center overflow-hidden transition-all duration-500 ${
                    isTheaterMode
                      ? "aspect-[16/9] min-h-[50vh] sm:min-h-[72vh] max-h-[88vh]"
                      : "aspect-video min-h-[300px] sm:min-h-[480px]"
                  }`}
                >
                  {activeProject.driveId ? (
                    <div className="relative w-full h-full bg-black flex items-center justify-center">
                      <iframe
                        src={`https://drive.google.com/file/d/${activeProject.driveId}/preview`}
                        className="w-full h-full border-0"
                        allow="autoplay; encrypted-media; fullscreen"
                        allowFullScreen
                        title={`${activeProject.title} Video Showcase`}
                      />
                    </div>
                  ) : activeProject.videoUrl ? (
                    <video
                      ref={videoRef}
                      src={activeProject.videoUrl}
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      onLoadedMetadata={(e) => {
                        e.currentTarget.volume = 0.3;
                      }}
                      onClick={togglePlayPause}
                      className={`w-full h-full cursor-pointer ${
                        isTheaterMode ? "object-contain bg-black" : "object-cover"
                      }`}
                    />
                  ) : (
                    <Image
                      src={activeProject.imageSrc}
                      alt={activeProject.title}
                      fill
                      className="object-cover object-top"
                    />
                  )}

                  {/* Video Control Bar if local HTML5 video is present (Drive iframe has built-in controls) */}
                  {!activeProject.driveId && activeProject.videoUrl && (
                    <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex items-center justify-between font-mono text-xs text-white z-20 backdrop-blur-[2px]">
                      
                      {/* Left: Play/Pause, Sound Toggle, Status */}
                      <div className="flex items-center gap-2 sm:gap-4">
                        {/* Play/Pause Button */}
                        <button
                          type="button"
                          onClick={togglePlayPause}
                          className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-black/70 hover:bg-black/95 border border-white/20 hover:border-coreCyan text-white transition-all flex items-center gap-1.5 cursor-pointer"
                          title={isVideoPlaying ? "Pause Video" : "Play Video"}
                        >
                          {isVideoPlaying ? (
                            <Pause className="w-3.5 h-3.5 text-coreCyan" />
                          ) : (
                            <Play className="w-3.5 h-3.5 text-coreCyan" />
                          )}
                          <span className="hidden sm:inline text-[11px] font-medium">
                            {isVideoPlaying ? "PAUSE" : "PLAY"}
                          </span>
                        </button>

                        {/* Mute/Unmute Button */}
                        <button
                          type="button"
                          onClick={() => {
                            playSelectSound();
                            setIsMuted(!isMuted);
                          }}
                          className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-black/70 hover:bg-black/95 border border-white/20 hover:border-coreCyan text-white transition-all flex items-center gap-1.5 cursor-pointer"
                          title={isMuted ? "Unmute Audio" : "Mute Audio"}
                        >
                          {isMuted ? (
                            <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5 text-coreCyan" />
                          )}
                          <span className="hidden sm:inline text-[11px]">
                            {isMuted ? "MUTED" : "SOUND ON"}
                          </span>
                        </button>

                        <span className="hidden md:inline font-mono text-[11px] tracking-wider text-white/60">
                          SHOWCASE VIDEO
                        </span>
                      </div>

                      {/* Right: Theater Mode, Fullscreen, HD Badge */}
                      <div className="flex items-center gap-2 sm:gap-3">
                        {/* Theater Mode Button */}
                        <button
                          type="button"
                          onClick={() => {
                            playSelectSound();
                            setIsTheaterMode(!isTheaterMode);
                          }}
                          className={`p-2 sm:px-3 sm:py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                            isTheaterMode
                              ? "border-coreCyan bg-coreCyan/25 text-coreCyan font-medium shadow-[0_0_12px_rgba(77,242,255,0.4)]"
                              : "border-white/20 bg-black/70 hover:bg-black/95 text-white/80 hover:text-white"
                          }`}
                          title="Toggle Theater Mode"
                        >
                          <Tv className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline text-[11px]">
                            {isTheaterMode ? "DEFAULT" : "THEATER"}
                          </span>
                        </button>

                        {/* Fullscreen Button */}
                        <button
                          type="button"
                          onClick={toggleFullscreen}
                          className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-black/70 hover:bg-black/95 border border-white/20 hover:border-coreCyan text-white transition-all flex items-center gap-1.5 cursor-pointer"
                          title="Fullscreen"
                        >
                          <Maximize2 className="w-3.5 h-3.5 text-coreCyan" />
                          <span className="hidden sm:inline text-[11px]">FULLSCREEN</span>
                        </button>

                        <span className="hidden sm:inline font-mono text-[10px] text-coreCyan tracking-widest uppercase bg-coreCyan/10 border border-coreCyan/30 px-2 py-1 rounded">
                          HD 60FPS
                        </span>
                      </div>

                    </div>
                  )}
                </div>

              </div>

              {/* Client Name Under Media matching frame 30 */}
              <div className="text-center pt-2">
                <span className="font-mono text-sm sm:text-base tracking-[0.3em] text-white/80 uppercase font-medium">
                  CLIENT: {activeProject.client}
                </span>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* STRUCTURED CASE STUDY SPECIFICATIONS (Matches frames 35, 40) */}
            {/* ========================================================================= */}
            <div className="space-y-12 max-w-5xl mx-auto pt-6 border-t border-white/10">
              
              {/* 1. ROLE SECTION */}
              <div className="space-y-3">
                <div className="font-mono text-sm sm:text-base tracking-[0.25em] text-coreCyan uppercase font-bold">
                  ROLE
                </div>
                <p className="text-zinc-200 text-base sm:text-lg font-sans leading-relaxed font-light">
                  {activeProject.role}
                </p>
              </div>

              {/* 2. ARCHITECTURE SECTION (Glassmorphic Spec Rows with Badges) */}
              <div className="space-y-4">
                <div className="font-mono text-sm sm:text-base tracking-[0.25em] text-coreCyan uppercase font-bold">
                  ARCHITECTURE
                </div>

                <div className="space-y-3">
                  {/* Backend Spec */}
                  <div className="p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-start gap-3">
                    <span className="px-3 py-1.5 rounded-full bg-yellow-400/20 border border-yellow-400/35 text-yellow-300 font-mono text-xs sm:text-sm tracking-wider shrink-0 w-fit font-semibold">
                      Backend:
                    </span>
                    <span className="text-base sm:text-lg text-zinc-200 font-sans leading-relaxed pt-0.5 font-light">
                      {activeProject.architecture.backend}
                    </span>
                  </div>

                  {/* Core Engine Spec */}
                  <div className="p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-start gap-3">
                    <span className="px-3 py-1.5 rounded-full bg-yellow-400/20 border border-yellow-400/35 text-yellow-300 font-mono text-xs sm:text-sm tracking-wider shrink-0 w-fit font-semibold">
                      Core Engine:
                    </span>
                    <span className="text-base sm:text-lg text-zinc-200 font-sans leading-relaxed pt-0.5 font-light">
                      {activeProject.architecture.coreEngine}
                    </span>
                  </div>

                  {/* Safety Layer Spec */}
                  <div className="p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-start gap-3">
                    <span className="px-3 py-1.5 rounded-full bg-yellow-400/20 border border-yellow-400/35 text-yellow-300 font-mono text-xs sm:text-sm tracking-wider shrink-0 w-fit font-semibold">
                      Safety Layer:
                    </span>
                    <span className="text-base sm:text-lg text-zinc-200 font-sans leading-relaxed pt-0.5 font-light">
                      {activeProject.architecture.safetyLayer}
                    </span>
                  </div>

                  {/* Frontend Spec */}
                  <div className="p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-start gap-3">
                    <span className="px-3 py-1.5 rounded-full bg-yellow-400/20 border border-yellow-400/35 text-yellow-300 font-mono text-xs sm:text-sm tracking-wider shrink-0 w-fit font-semibold">
                      Frontend:
                    </span>
                    <span className="text-base sm:text-lg text-zinc-200 font-sans leading-relaxed pt-0.5 font-light">
                      {activeProject.architecture.frontend}
                    </span>
                  </div>

                  {/* Future Readiness Spec */}
                  <div className="p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-start gap-3">
                    <span className="px-3 py-1.5 rounded-full bg-yellow-400/20 border border-yellow-400/35 text-yellow-300 font-mono text-xs sm:text-sm tracking-wider shrink-0 w-fit font-semibold">
                      Future Readiness:
                    </span>
                    <span className="text-base sm:text-lg text-zinc-200 font-sans leading-relaxed pt-0.5 font-light">
                      {activeProject.architecture.futureReadiness}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. STACK SECTION */}
              <div className="space-y-3">
                <div className="font-mono text-sm sm:text-base tracking-[0.25em] text-coreCyan uppercase font-bold">
                  STACK
                </div>
                <p className="font-mono text-sm sm:text-base text-zinc-200 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/10">
                  {activeProject.stackText}
                </p>
              </div>

              {/* 4. MEDIA SECTION */}
              <div className="space-y-3">
                <div className="font-mono text-sm sm:text-base tracking-[0.25em] text-coreCyan uppercase font-bold">
                  MEDIA
                </div>
                <p className="text-zinc-200 text-base sm:text-lg font-sans leading-relaxed font-light">
                  {activeProject.mediaText}
                </p>
              </div>

              {/* 5. OUTCOME / IMPACT SECTION */}
              <div className="space-y-3">
                <div className="font-mono text-sm sm:text-base tracking-[0.25em] text-coreCyan uppercase font-bold">
                  OUTCOME / IMPACT
                </div>
                <p className="text-zinc-200 text-base sm:text-lg font-sans leading-relaxed font-light">
                  {activeProject.outcomeText}
                </p>
              </div>

              {/* 6. ACTIONS & DEPLOYMENT LINKS */}
              <div className="pt-8 border-t border-white/10 space-y-6 pb-2">
                <div className="text-center">
                  <span className="font-mono text-xs sm:text-sm tracking-[0.3em] text-muted uppercase font-medium">
                    | DEPLOYMENT & REPOSITORIES |
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  {activeProject.liveUrl && !activeProject.liveUrl.includes("drive.google.com") && (
                    <a
                      href={activeProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => playSelectSound()}
                      className="px-9 py-4 rounded-lg bg-coreCyan hover:bg-white text-black font-mono text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 flex items-center gap-3 font-semibold shadow-[0_0_30px_rgba(77,242,255,0.35)] hover:scale-105"
                    >
                      <span>VISIT LIVE SYSTEM</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}

                  {activeProject.githubUrl && (
                    <a
                      href={activeProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => playSelectSound()}
                      className="px-9 py-4 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/20 hover:border-coreCyan font-mono text-xs sm:text-sm tracking-widest text-white/90 hover:text-white transition-all flex items-center gap-3 hover:scale-105 font-medium"
                    >
                      <span>VIEW SOURCE CODE</span>
                      <ExternalLink className="w-4 h-4 text-coreCyan" />
                    </a>
                  )}

                  {activeProject.videoDriveUrl && (
                    <a
                      href={activeProject.videoDriveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => playSelectSound()}
                      className="px-7 py-4 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/20 hover:border-white/40 font-mono text-xs sm:text-sm tracking-widest text-zinc-300 hover:text-white transition-all flex items-center gap-2.5 font-medium"
                    >
                      <span>OPEN IN DRIVE</span>
                      <ExternalLink className="w-4 h-4 text-zinc-400" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={handleCloseProject}
                    className="px-7 py-4 rounded-lg border border-white/15 hover:border-white/35 text-white/80 hover:text-white font-mono text-xs sm:text-sm tracking-widest uppercase transition-all cursor-pointer"
                  >
                    CLOSE CASE STUDY
                  </button>
                </div>
              </div>

              {/* Extra guaranteed bottom scrolling clearance */}
              <div className="h-24 w-full pointer-events-none" />

            </div>

          </div>

        </div>,
        document.body
      )}

    </div>
  );
}

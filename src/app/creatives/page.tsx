"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { 
  Play, 
  Pause, 
  ExternalLink, 
  Video, 
  Sparkles, 
  X, 
  ChevronRight, 
  ChevronLeft,
  FolderOpen, 
  Volume2, 
  VolumeX, 
  Palette, 
  Maximize2,
  Bookmark,
  Check,
  Grid,
  ArrowUpRight,
  Eye,
  EyeOff,
  SlidersHorizontal,
  Smartphone,
  Monitor,
  Share2
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { SectionHeader } from "@/components/SectionHeader";
import { useSound } from "@/components/SoundController";
import { HireModal } from "@/components/HireModal";

interface CreativeVideoItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  videoSrc?: string;
  driveId?: string;
  thumbnailSrc: string;
  description: string;
  tags: string[];
  isPortrait?: boolean;
  aspectRatio?: string;
}

export interface CreativeGraphicItem {
  id: string;
  title: string;
  category: string;
  imageSrc: string;
  description: string;
  isPortrait: boolean;
  dimensions: string;
  aspectRatio: string;
  tags: string[];
}

const CREATIVE_VIDEOS: CreativeVideoItem[] = [
  {
    id: "rejine-18th-debut",
    title: "Rejine @ 18 — Debut Cinematic Highlights",
    category: "Events & Debut Cinematography",
    duration: "1:22",
    videoSrc: "/rejine18th.mp4",
    thumbnailSrc: "/creatives/rejine18th-thumb.jpg",
    description: "Cinematic 18th birthday debut highlight reel capturing authentic emotion, elegant outdoor portraiture, smooth slow-motion pacing, and rich cinematic color grading.",
    tags: ["Debut Highlights", "Event Cinematography", "Color Grading", "Visual Storytelling"],
    isPortrait: false,
    aspectRatio: "Landscape (16:9 Cinema)",
  },
  {
    id: "brand-launch-promo",
    title: "Brand Launch Commercial Reel",
    category: "Commercial & Paid Ads",
    duration: "0:45",
    videoSrc: "/creatives/brand-launch-web.mp4",
    driveId: "1c_rY-903uYl_4cNCXL16R2dP6Xema_iC",
    thumbnailSrc: "/creatives/video-13.jpg",
    description: "High-retention commercial cut engineered for paid ads, featuring kinetic text typography, punchy transitions, and direct-response value hooks.",
    tags: ["Commercial Cut", "Motion Typography", "Paid Ads", "Direct Response"],
    isPortrait: true,
    aspectRatio: "Portrait (9:16 Vertical Reel)",
  },
  {
    id: "luxury-estate-tour",
    title: "Luxury Estate Architectural Walkthrough",
    category: "Real Estate & Architecture",
    duration: "0:50",
    videoSrc: "/creatives/luxury-estate-web.mp4",
    driveId: "1FOo2FINf1QJ6fyNMKPOH9fJs5ROjnaVI",
    thumbnailSrc: "/creatives/video-7.jpg",
    description: "Cinematic architectural property walkthrough highlighting luxury interior spaces, smooth gimbal stabilization, and atmospheric ambient soundscapes.",
    tags: ["Real Estate", "Architecture", "Color Grading", "Cinematic Reel"],
    isPortrait: true,
    aspectRatio: "Portrait (9:16 Vertical Reel)",
  },
  {
    id: "solar-energy-reel",
    title: "Solar Energy Commercial Reel",
    category: "Clean Energy Commercial",
    duration: "0:30",
    videoSrc: "/intro.mp4",
    driveId: "1-cyNdxaOdkL9JCXIrEr3fWyCXCmJABS1",
    thumbnailSrc: "/creatives/video-4.jpg",
    description: "High-impact commercial video designed for direct-response lead generation, conversion-focused pacing, and crisp sound design.",
    tags: ["Commercial Ad", "Lead Generation", "Sound Design", "High CTR"],
    isPortrait: false,
    aspectRatio: "Landscape (16:9 Cinema)",
  },
  {
    id: "viral-social-reel",
    title: "Viral Algorithm Social Media Reel",
    category: "Short-Form / TikTok & IG Reels",
    duration: "0:35",
    videoSrc: "/creatives/viral-social-web.mp4",
    driveId: "1ULPFKqqF7VhdzLVVjT_jwRUFSRQb6S8f",
    thumbnailSrc: "/creatives/video-15.jpg",
    description: "Fast-paced vertical social media cut optimized for organic algorithm reach with beat-synced cuts, speed ramps, and engaging micro-effects.",
    tags: ["Viral Hooks", "Beat Sync", "Short-Form", "Retention Editing"],
    isPortrait: true,
    aspectRatio: "Portrait (9:16 Vertical Reel)",
  },
  {
    id: "cinematic-storytelling",
    title: "Cinematic Narrative & Documentary Cut",
    category: "High-Impact Storytelling",
    duration: "1:15",
    videoSrc: "/creatives/cinematic-story-web.mp4",
    driveId: "1w8wZGxiF-KDOERSkG4VUiiRJe0YfYGnn",
    thumbnailSrc: "/creatives/video-6.jpg",
    description: "Long-form narrative cut featuring layered multi-track B-roll synchronization, voiceover pacing, and cinematic color grading.",
    tags: ["Documentary Style", "Multi-Layer B-Roll", "Storytelling", "SMM"],
    isPortrait: true,
    aspectRatio: "Portrait (9:16 Vertical Reel)",
  },
  {
    id: "stylistic-rhythm-edit",
    title: "Stylistic Audio-Visual Reel",
    category: "Rhythm & Stylistic Visuals",
    duration: "0:40",
    videoSrc: "/creatives/stylistic-rhythm-web.mp4",
    driveId: "1hn6aBdnd-PwPQkQOfjglp2ivYPSQWSEp",
    thumbnailSrc: "/creatives/video-8.jpg",
    description: "Creative music-driven edit showcasing artistic rhythm cutting, moody aesthetic color grading, and trend-focused visual composition.",
    tags: ["Stylistic Visuals", "Audio Sync", "Color Grading", "Creative Cut"],
    isPortrait: false,
    aspectRatio: "Landscape (16:9 Cinema)",
  },

  {
    id: "roofing-construction-promo",
    title: "Roofing & Construction Commercial Promo",
    category: "Local Business & Home Services",
    duration: "0:45",
    videoSrc: "/creatives/roofing-construction-web.mp4",
    driveId: "14ObdUCaZXR5HuXdz9oUySCsAd2my6THR",
    thumbnailSrc: "/creatives/video-3.jpg",
    description: "High-converting service advertisement showcasing drone rooftop footage, customer trust badges, and direct call-to-action hooks.",
    tags: ["Home Services", "Commercial Ad", "Drone Footage", "Lead Gen"],
    isPortrait: true,
    aspectRatio: "Portrait (9:16 Vertical Reel)",
  },
  {
    id: "debt-relief-campaign",
    title: "Financial Freedom & Debt Relief Campaign",
    category: "Direct-Response Paid Ads",
    duration: "0:50",
    videoSrc: "/creatives/debt-relief-web.mp4",
    driveId: "1TKA8KKMMHlp1lTwoi63ZiFVaHBEYSWZo",
    thumbnailSrc: "/creatives/video-20.jpg",
    description: "High-retention paid ad creative utilizing pain-point pattern interrupts, dynamic text animation, and compelling financial clarity hooks.",
    tags: ["Paid Ads", "Finance", "Direct Response", "Motion Graphics"],
    isPortrait: true,
    aspectRatio: "Portrait (9:16 Vertical Reel)",
  },
  {
    id: "family-home-insurance",
    title: "Family Home Protection Insurance Ad",
    category: "Insurance & Security Promo",
    duration: "0:30",
    videoSrc: "/creatives/family-insurance-web.mp4",
    driveId: "1p0hCybUGsYZSaOZoz2fShpr_2Wg1HcNI",
    thumbnailSrc: "/creatives/video-21.jpg",
    description: "Emotionally resonant insurance commercial highlighting home safety, peace of mind, and accessible policy quotes.",
    tags: ["Insurance Ad", "Storytelling", "Visual Hook", "Conversion Edit"],
    isPortrait: true,
    aspectRatio: "Portrait (9:16 Vertical Reel)",
  },
  {
    id: "yonkers-app-walkthrough",
    title: "Yonkers Mobile App Showcase & UX Demo",
    category: "SaaS & App Demo",
    duration: "0:55",
    videoSrc: "/creatives/yonkers-app-web.mp4",
    driveId: "1FwXuzRJxRMNC5jgd0qKYHa0QgDiimLKq",
    thumbnailSrc: "/creatives/video-14.jpg",
    description: "Sleek software product walkthrough featuring simulated device mockups, UI screen zooms, and clear feature benefit callouts.",
    tags: ["App Showcase", "SaaS Demo", "Motion UI", "Product Promo"],
    isPortrait: true,
    aspectRatio: "Portrait (9:16 Vertical Reel)",
  },
  {
    id: "automotive-cinematic-reel",
    title: "Automotive Cinematic Showcase Reel",
    category: "Automotive & Lifestyle",
    duration: "0:25",
    videoSrc: "/creatives/automotive-reel-web.mp4",
    driveId: "1WR4zubPr7LzYUMFQnDLGkK-RqNsv9Btp",
    thumbnailSrc: "/creatives/video-18.jpg",
    description: "Punchy vehicle promo showcasing sleek reflections, rolling shot cuts, exhaust audio design, and aggressive color grading.",
    tags: ["Automotive", "Speed Ramping", "Audio Design", "Color Grading"],
    isPortrait: true,
    aspectRatio: "Portrait (9:16 Vertical Reel)",
  },
  {
    id: "contractor-bidding-leadgen",
    title: "Contractor Bidding & Commercial Lead Gen",
    category: "B2B & Construction Ads",
    duration: "0:45",
    videoSrc: "/creatives/contractor-bidding-web.mp4",
    driveId: "1O0YD5_ZxJIQDCVzWvCdfD2qWs-k9S_vC",
    thumbnailSrc: "/creatives/video-12.jpg",
    description: "B2B commercial video focused on high-trust corporate contracting, verified bidding, and commercial property development.",
    tags: ["B2B Commercial", "Construction", "Lead Generation", "Corporate"],
    isPortrait: true,
    aspectRatio: "Portrait (9:16 Vertical Reel)",
  },
  {
    id: "social-retention-cut",
    title: "Social Retention & Brand Engagement Cut",
    category: "Social Media Campaign",
    duration: "1:00",
    videoSrc: "/creatives/social-retention-web.mp4",
    driveId: "1_dHReB8wYAjXC8c4n7xKmVtK3Y0HPNlI",
    thumbnailSrc: "/creatives/video-10.jpg",
    description: "Fast-paced lifestyle commercial edit engineered with sound effects, dynamic transitions, and modern grading.",
    tags: ["Brand Campaign", "Sound Design", "Dynamic Cuts", "Pacing"],
    isPortrait: true,
    aspectRatio: "Portrait (9:16 Vertical Reel)",
  },
  {
    id: "autumn-campaign-story",
    title: "Autumn Campaign Visual Story",
    category: "Seasonal & Social Ad",
    duration: "1:00",
    videoSrc: "/creatives/autumn-campaign-web.mp4",
    driveId: "1fbk1gd2ztgS4ZhIHmAC1gEgKFfwd-4YX",
    thumbnailSrc: "/creatives/video-11.jpg",
    description: "Atmospheric seasonal brand campaign video with cinematic lighting, natural pacing, and warm aesthetic color tones.",
    tags: ["Seasonal Campaign", "Cinematic Lighting", "Brand Story", "Aesthetic"],
    isPortrait: true,
    aspectRatio: "Portrait (9:16 Vertical Reel)",
  },
  {
    id: "residential-roofing-master",
    title: "Residential Roofing Master Series",
    category: "Home Improvement Commercial",
    duration: "0:35",
    videoSrc: "/creatives/residential-roofing-web.mp4",
    driveId: "19PsPdvp2PQF3BIXvw3SMsCL8oX3VDRoF",
    thumbnailSrc: "/creatives/video-19.jpg",
    description: "Targeted localized home improvement ad highlighting storm damage repair, certified warranties, and fast free inspections.",
    tags: ["Storm Repair", "Roofing", "Localized Ad", "High CTR"],
    isPortrait: true,
    aspectRatio: "Portrait (9:16 Vertical Reel)",
  },
  {
    id: "dynamic-brand-spot",
    title: "Dynamic Commercial Brand Spot",
    category: "Commercial & Social Ad",
    duration: "0:45",
    videoSrc: "/creatives/dynamic-brand-web.mp4",
    driveId: "1mBBKZuWE6DlJvxeFysOLYWvZqm0z24gO",
    thumbnailSrc: "/creatives/video-17.jpg",
    description: "Polished brand commercial combining studio product shots, kinetic text typography, and clean corporate pacing.",
    tags: ["Product Commercial", "Kinetic Text", "Corporate", "High Retention"],
    isPortrait: true,
    aspectRatio: "Portrait (9:16 Vertical Reel)",
  },
  {
    id: "algorithm-organic-hook",
    title: "Short-Form Organic Algorithm Hook",
    category: "Short-Form & Reels",
    duration: "0:30",
    videoSrc: "/creatives/algorithm-organic-web.mp4",
    driveId: "1Vg8TOXFYR105ooFgGMV8FZSde1ARU3rc",
    thumbnailSrc: "/creatives/video-16.jpg",
    description: "Algorithmic engagement video designed with visual pattern interrupts, fast captions, and high-energy transitions.",
    tags: ["Algorithm Hook", "Short-Form", "Pattern Interrupt", "Viral Content"],
    isPortrait: true,
    aspectRatio: "Portrait (9:16 Vertical Reel)",
  },
  {
    id: "debt-relief-direct-hook",
    title: "Debt Relief Direct-Response Hook Cut",
    category: "Finance & Lead Gen",
    duration: "0:30",
    videoSrc: "/creatives/debt-relief-hook-web.mp4",
    driveId: "1FTE-bonlhQK2X56E3ajOzEN3jDWFDncI",
    thumbnailSrc: "/creatives/video-2.jpg",
    description: "Punchy 30-second variation focused on immediate qualification hooks, bold captions, and rapid conversion.",
    tags: ["Finance", "Lead Gen", "Fast Hook", "Direct Response"],
    isPortrait: true,
    aspectRatio: "Portrait (9:16 Vertical Reel)",
  },
  {
    id: "property-protection-social",
    title: "Property Protection Social Ad",
    category: "Insurance Commercial",
    duration: "0:30",
    videoSrc: "/creatives/property-protection-web.mp4",
    driveId: "18Xkbr3wNfVHZ4CxI6bj7W5XF4gdmaghY",
    thumbnailSrc: "/creatives/video-5.jpg",
    description: "Engaging social video ad built for Facebook and Instagram feeds with bold text hooks and clear policy advantages.",
    tags: ["Social Ad", "Property Protection", "Facebook Ads", "Instagram Feed"],
    isPortrait: true,
    aspectRatio: "Portrait (9:16 Vertical Reel)",
  },
];

const ALL_CREATIVE_GRAPHICS: CreativeGraphicItem[] = [
  {
    id: "carousel-slide-1",
    title: "Stop Only Negotiating The Price (Slide 1/7) — Real Estate Carousel",
    category: "Real Estate & Carousel",
    imageSrc: "/creatives/carousel-1.png",
    description: "High-impact opening hook slide for an educational Instagram carousel by Your Real Estate Experts, challenging buyers to look beyond purchase price.",
    tags: ["Real Estate", "Instagram Carousel", "Social Media", "Lead Generation", "Photoshop"],
    isPortrait: true,
    dimensions: "1080 x 1350",
    aspectRatio: "Portrait (4:5 Carousel)",
  },
  {
    id: "carousel-slide-2",
    title: "The Market Shift: 44.7% Seller Concessions (Slide 2/7)",
    category: "Real Estate & Carousel",
    imageSrc: "/creatives/carousel-2.png",
    description: "Data-driven statistical breakdown highlighting Redfin market shift data on seller concessions in modern home sales negotiations.",
    tags: ["Real Estate", "Market Data", "Instagram Carousel", "Infographic", "Photoshop"],
    isPortrait: true,
    dimensions: "1080 x 1350",
    aspectRatio: "Portrait (4:5 Carousel)",
  },
  {
    id: "carousel-slide-3",
    title: "Closing Costs, Repairs & Rate Buydown (Slide 3/7)",
    category: "Real Estate & Carousel",
    imageSrc: "/creatives/carousel-3.png",
    description: "Educational graphic outlining high-leverage negotiation levers including seller-paid closing costs, inspection repair credits, and mortgage rate buydowns.",
    tags: ["Real Estate", "Advisory", "Rate Buydown", "Carousel Design", "Photoshop"],
    isPortrait: true,
    dimensions: "1080 x 1350",
    aspectRatio: "Portrait (4:5 Carousel)",
  },
  {
    id: "carousel-slide-4",
    title: "When The Seller Won't Move Price (Slide 4/7)",
    category: "Real Estate & Carousel",
    imageSrc: "/creatives/carousel-4.png",
    description: "Tactical advisory slide shifting perspective from 'lower the price' to 'what improves the deal' with contract terms and financing levers.",
    tags: ["Real Estate", "Negotiation", "Instagram Carousel", "Contract Terms", "Photoshop"],
    isPortrait: true,
    dimensions: "1080 x 1350",
    aspectRatio: "Portrait (4:5 Carousel)",
  },
  {
    id: "carousel-slide-5",
    title: "Negotiate With A Purpose: Ask For What Matters (Slide 5/7)",
    category: "Real Estate & Carousel",
    imageSrc: "/creatives/carousel-5.png",
    description: "Structured decision-tree visual matching buyer scenarios (cash tight, monthly payment, inspection repairs) to targeted negotiation strategies.",
    tags: ["Real Estate", "Strategy", "Social Carousel", "Client Education", "Photoshop"],
    isPortrait: true,
    dimensions: "1080 x 1350",
    aspectRatio: "Portrait (4:5 Carousel)",
  },
  {
    id: "carousel-slide-6",
    title: "The Best Offer Isn't Always The Lowest Price (Slide 6/7)",
    category: "Real Estate & Carousel",
    imageSrc: "/creatives/carousel-6.png",
    description: "Luxury twilight architectural backdrop highlighting the holistic deal structure formula: price, closing costs, repairs, financing, and timing.",
    tags: ["Real Estate", "Deal Structure", "Luxury Architecture", "Instagram Carousel", "Photoshop"],
    isPortrait: true,
    dimensions: "1080 x 1350",
    aspectRatio: "Portrait (4:5 Carousel)",
  },
  {
    id: "carousel-slide-7",
    title: "Before You Ask 'How Low Will They Go?' (Slide 7/7)",
    category: "Real Estate & Carousel",
    imageSrc: "/creatives/carousel-7.png",
    description: "High-converting closing CTA slide featuring gold architectural keychain, purchase agreement contract, and direct-response DM trigger.",
    tags: ["Real Estate", "Direct Response", "Call to Action", "Instagram Carousel", "Lead Gen"],
    isPortrait: true,
    dimensions: "1080 x 1350",
    aspectRatio: "Portrait (4:5 Carousel)",
  },
  {
    id: "design-1",
    title: "Velvet Ice Flavor Menu & Italian Ice Social Poster",
    category: "Brand Identity",
    imageSrc: "/creatives/design-1.png",
    description: "Vibrant brand visual menu showcasing authentic Italian Ice flavors with product photography and colorful flavor cards.",
    tags: ["Brand Identity", "Menu Design", "Photoshop", "High Resolution"],
    isPortrait: true,
    dimensions: "1066 x 1600",
    aspectRatio: "Portrait (Vertical)"
  },
  {
    id: "design-2",
    title: "Velvet Ice Italian Ice Storefront & Flavor Lineup Flyer",
    category: "Marketing Flyer",
    imageSrc: "/creatives/design-2.jpg",
    description: "Complete promotional marketing flyer highlighting the artisan Italian ice storefront, signature scoops, QR code, and social links.",
    tags: ["Marketing Flyer", "Print & Digital", "Photoshop", "High Resolution"],
    isPortrait: true,
    dimensions: "1066 x 1600",
    aspectRatio: "Portrait (Vertical)"
  },
  {
    id: "design-3",
    title: "Stay Cool with Velvet Ice — Cherry Pop Campaign Poster",
    category: "Brand Identity",
    imageSrc: "/creatives/design-3.jpg",
    description: "Eye-catching summer promotional poster highlighting the signature Cherry Pop cups, vibrant typography, and refreshing dessert theme.",
    tags: ["Brand Identity", "Campaign Poster", "Photoshop", "High Resolution"],
    isPortrait: true,
    dimensions: "1066 x 1600",
    aspectRatio: "Portrait (Vertical)"
  },
  {
    id: "design-5",
    title: "Best Restaurants in the Bronx — Food Guide Reel Cover",
    category: "Social Media Graphic",
    imageSrc: "/creatives/design-5.png",
    description: "Editorial food guide graphic spotlighting legendary dining spots across Arthur Avenue and City Island in the Bronx.",
    tags: ["Social Media Graphic", "Food & Dining", "Reel Cover", "Photoshop"],
    isPortrait: true,
    dimensions: "900 x 1600",
    aspectRatio: "Portrait (Vertical)"
  },
  {
    id: "design-6",
    title: "The Agent Who Never Gives Up — Typographic Story Graphic",
    category: "Social Media Graphic",
    imageSrc: "/creatives/design-6.png",
    description: "Bold contrast typographic storytelling poster designed for social feed engagement and thought leadership.",
    tags: ["Social Media Graphic", "Typography", "Storytelling", "High CTR"],
    isPortrait: true,
    dimensions: "900 x 1600",
    aspectRatio: "Portrait (Vertical)"
  },
  {
    id: "design-7",
    title: "Real Estate Tip of the Day — Authority Social Visual",
    category: "Personal Branding",
    imageSrc: "/creatives/design-7.png",
    description: "High-contrast personal branding creative featuring expert advice hook and signature orange/black aesthetic.",
    tags: ["Personal Branding", "Real Estate", "Social Media", "Photoshop"],
    isPortrait: true,
    dimensions: "900 x 1600",
    aspectRatio: "Portrait (Vertical)"
  },
  {
    id: "design-8",
    title: "Why the Right Agent Matters — Typographic Educational Graphic",
    category: "Social Media Graphic",
    imageSrc: "/creatives/design-8.png",
    description: "Minimalist bold typographic visual emphasizing market expertise and advisory value for home sellers and buyers.",
    tags: ["Social Media Graphic", "Typography", "Advisory", "Photoshop"],
    isPortrait: true,
    dimensions: "900 x 1600",
    aspectRatio: "Portrait (Vertical)"
  },
  {
    id: "design-9",
    title: "Proof Is in the Numbers: 234 Leads — Direct-Response Flyer",
    category: "Marketing Flyer",
    imageSrc: "/creatives/design-9.png",
    description: "Data-driven conversion recruitment flyer detailing monthly agent production KPIs, appointment metrics, and scale opportunities.",
    tags: ["Marketing Flyer", "Direct Response", "Data Infographic", "High Conversion"],
    isPortrait: true,
    dimensions: "900 x 1600",
    aspectRatio: "Portrait (Vertical)"
  },
  {
    id: "design-10",
    title: "Wanted: Liquor Stores & Car Washes — Commercial Acquisition Poster",
    category: "Commercial Real Estate",
    imageSrc: "/creatives/design-10.png",
    description: "Targeted commercial real estate acquisition flyer seeking existing retail business opportunities with prime land corridors.",
    tags: ["Commercial Real Estate", "Acquisition Flyer", "Print & Digital", "Photoshop"],
    isPortrait: true,
    dimensions: "1066 x 1600",
    aspectRatio: "Portrait (Vertical)"
  },
  {
    id: "design-11",
    title: "For Sale: Zen Dining Lounge — Commercial Real Estate Flyer",
    category: "Commercial Real Estate",
    imageSrc: "/creatives/design-11.png",
    description: "Comprehensive turnkey commercial listing flyer complete with location details, interior photography, and verified net income financials.",
    tags: ["Commercial Real Estate", "Listing Flyer", "Financial Snapshot", "Photoshop"],
    isPortrait: true,
    dimensions: "900 x 1600",
    aspectRatio: "Portrait (Vertical)"
  },
  {
    id: "design-14",
    title: "The Real Opportunity Agents Are Missing — Authority Visual",
    category: "Personal Branding",
    imageSrc: "/creatives/design-14.png",
    description: "Energetic personal branding social asset targeting growth-oriented agents with high-contrast text and warm accent tones.",
    tags: ["Personal Branding", "Agent Growth", "Social Media", "Photoshop"],
    isPortrait: true,
    dimensions: "900 x 1600",
    aspectRatio: "Portrait (Vertical)"
  },
  {
    id: "design-15",
    title: "Crush Your Real Estate Goals 2026 — High-CTR YouTube Thumbnail",
    category: "YouTube Thumbnail",
    imageSrc: "/creatives/design-15.png",
    description: "High-retention 16:9 widescreen YouTube cover art with sleek topographic dark background and vibrant orange call-to-action badges.",
    tags: ["YouTube Thumbnail", "16:9 Widescreen", "High CTR", "Photoshop"],
    isPortrait: false,
    dimensions: "1280 x 720",
    aspectRatio: "Landscape (16:9)"
  },
  {
    id: "design-16",
    title: "This Is Why You're Stuck — Real Estate Masterclass Thumbnail",
    category: "YouTube Thumbnail",
    imageSrc: "/creatives/design-16.png",
    description: "Direct-response 16:9 YouTube cover engineered for maximum click-through rate with strong pain-point hook and subscribe branding.",
    tags: ["YouTube Thumbnail", "16:9 Widescreen", "High CTR", "Direct Response"],
    isPortrait: false,
    dimensions: "1280 x 720",
    aspectRatio: "Landscape (16:9)"
  },
  {
    id: "design-17",
    title: "Get Real About Your Goals — Executive Personal Branding Visual",
    category: "Personal Branding",
    imageSrc: "/creatives/design-17.png",
    description: "Authoritative executive portrait creative designed to project trust, professional stature, and decisive clarity.",
    tags: ["Personal Branding", "Executive Portrait", "Photoshop", "High Resolution"],
    isPortrait: true,
    dimensions: "900 x 1600",
    aspectRatio: "Portrait (Vertical)"
  },
  {
    id: "design-20",
    title: "Relentless Follow-Up Isn't Annoying — YouTube Shorts / Reel Cover",
    category: "YouTube Thumbnail",
    imageSrc: "/creatives/design-20.png",
    description: "Authentic on-the-go perspective reel cover addressing client outreach mindset and proven communication cadence.",
    tags: ["YouTube Thumbnail", "Shorts & Reels", "Video Cover", "High CTR"],
    isPortrait: true,
    dimensions: "900 x 1600",
    aspectRatio: "Portrait (Vertical)"
  },
  {
    id: "design-21",
    title: "Buying a Home? Must Know Tips — High-Impact Real Estate Cover",
    category: "YouTube Thumbnail",
    imageSrc: "/creatives/design-21.png",
    description: "Compelling residential buyer education cover featuring atmospheric sunset home photography and bold callout badges.",
    tags: ["YouTube Thumbnail", "Homebuyers Guide", "Shorts & Reels", "Photoshop"],
    isPortrait: true,
    dimensions: "900 x 1600",
    aspectRatio: "Portrait (Vertical)"
  },
  {
    id: "design-22",
    title: "Skip the Break, Secure the Win! — Video Masterclass Thumbnail",
    category: "YouTube Thumbnail",
    imageSrc: "/creatives/design-22.png",
    description: "Action-oriented video thumbnail designed to drive motivation and immediate audience follow-through.",
    tags: ["YouTube Thumbnail", "Masterclass", "Shorts & Reels", "Photoshop"],
    isPortrait: true,
    dimensions: "900 x 1600",
    aspectRatio: "Portrait (Vertical)"
  },
  {
    id: "design-23",
    title: "Most Agents Are Lazy... How We're Different — Reel Cover",
    category: "YouTube Thumbnail",
    imageSrc: "/creatives/design-23.png",
    description: "Pattern-interrupt video cover contrasting industry standard practices against a proactive client-first methodology.",
    tags: ["YouTube Thumbnail", "Pattern Interrupt", "Shorts & Reels", "High CTR"],
    isPortrait: true,
    dimensions: "900 x 1600",
    aspectRatio: "Portrait (Vertical)"
  },
  {
    id: "design-25",
    title: "Renters vs Homeowners: Who's Winning? — High-Retention Cover",
    category: "YouTube Thumbnail",
    imageSrc: "/creatives/design-25.png",
    description: "Engaging financial breakdown thumbnail comparing wealth accumulation through home equity versus leasing.",
    tags: ["YouTube Thumbnail", "Real Estate Finance", "Shorts & Reels", "Photoshop"],
    isPortrait: true,
    dimensions: "900 x 1600",
    aspectRatio: "Portrait (Vertical)"
  },
  {
    id: "design-26",
    title: "Zestimate Is Wrong! — Real Estate Authority Cover Art",
    category: "YouTube Thumbnail",
    imageSrc: "/creatives/design-26.png",
    description: "Viral controversy hook breaking down automated valuation models versus actual market comparative analysis.",
    tags: ["YouTube Thumbnail", "Viral Hook", "Shorts & Reels", "Photoshop"],
    isPortrait: true,
    dimensions: "900 x 1600",
    aspectRatio: "Portrait (Vertical)"
  },
  {
    id: "design-27",
    title: "Selling As Is? — Property Sellers Guide Thumbnail",
    category: "YouTube Thumbnail",
    imageSrc: "/creatives/design-27.png",
    description: "Advisory video cover detailing the critical considerations, repair trade-offs, and pricing strategies for 'as is' sales.",
    tags: ["YouTube Thumbnail", "Seller Advisory", "Shorts & Reels", "Photoshop"],
    isPortrait: true,
    dimensions: "900 x 1600",
    aspectRatio: "Portrait (Vertical)"
  },
  {
    id: "design-28",
    title: "The #1 Mistake First-Time Investors Make — Video Cover",
    category: "YouTube Thumbnail",
    imageSrc: "/creatives/design-28.png",
    description: "Strategic investor advisory cover warning beginner property investors against common underwriting and cash-flow traps.",
    tags: ["YouTube Thumbnail", "Real Estate Investing", "Shorts & Reels", "High CTR"],
    isPortrait: true,
    dimensions: "900 x 1600",
    aspectRatio: "Portrait (Vertical)"
  },
  {
    id: "design-29",
    title: "Why Good Buyers Get Ignored — Skyscraper Architectural Cover",
    category: "Editorial Layout",
    imageSrc: "/creatives/design-29.png",
    description: "Monochrome architectural editorial visual with sharp modern angles exploring offer presentation and buyer readiness.",
    tags: ["Editorial Layout", "Architecture", "Buyer Strategy", "Photoshop"],
    isPortrait: true,
    dimensions: "900 x 1600",
    aspectRatio: "Portrait (Vertical)"
  },
  {
    id: "design-30",
    title: "Inventory at All Time High — Market Analysis Graphic",
    category: "YouTube Thumbnail",
    imageSrc: "/creatives/design-30.png",
    description: "Analytical infographic thumbnail showcasing historical housing supply data with bold numeric bars and expert breakdown.",
    tags: ["YouTube Thumbnail", "Market Analytics", "Shorts & Reels", "Photoshop"],
    isPortrait: true,
    dimensions: "900 x 1600",
    aspectRatio: "Portrait (Vertical)"
  },
  {
    id: "design-32",
    title: "Don't Wait to Buy Here's Why... — First-Time Homebuyers Cover",
    category: "YouTube Thumbnail",
    imageSrc: "/creatives/design-32.png",
    description: "High-emotion residential market creative addressing mortgage rate hesitation and long-term appreciation advantages.",
    tags: ["YouTube Thumbnail", "Homebuyer Education", "Shorts & Reels", "Photoshop"],
    isPortrait: true,
    dimensions: "900 x 1600",
    aspectRatio: "Portrait (Vertical)"
  },
  {
    id: "design-33",
    title: "Nobody Told Me This About White Plains — High-CTR YouTube Cover",
    category: "YouTube Thumbnail",
    imageSrc: "/creatives/design-33.png",
    description: "High-retention 16:9 YouTube cover exploring local neighborhood secrets, community amenities, and relocation pros and cons.",
    tags: ["YouTube Thumbnail", "16:9 Widescreen", "Relocation Guide", "High CTR"],
    isPortrait: false,
    dimensions: "1280 x 720",
    aspectRatio: "Landscape (16:9)"
  },
  {
    id: "design-34",
    title: "35 Greenlawn Road, Amawalk — $999K Price Improvement Flyer",
    category: "Real Estate Flyer",
    imageSrc: "/creatives/design-34.jpg",
    description: "Striking property price improvement flyer showcasing aerial estate photography, stone architecture, and agent contact credentials.",
    tags: ["Real Estate Flyer", "Price Improvement", "Photoshop", "Print & Digital"],
    isPortrait: true,
    dimensions: "819 x 1024",
    aspectRatio: "Portrait (Vertical)"
  },
  {
    id: "design-35",
    title: "29 Keasel Road, Middletown — $499K Back on the Market Flyer",
    category: "Real Estate Flyer",
    imageSrc: "/creatives/design-35.jpg",
    description: "High-visibility property marketing flyer for 29 Keasel Road highlighting expansive yard acreage and modern suburban living.",
    tags: ["Real Estate Flyer", "Back on Market", "Photoshop", "Social Graphic"],
    isPortrait: true,
    dimensions: "819 x 1024",
    aspectRatio: "Portrait (Vertical)"
  },
  {
    id: "design-36",
    title: "1670 Longfellow Ave #4A, Bronx — $140K Co-op Property Flyer",
    category: "Real Estate Flyer",
    imageSrc: "/creatives/design-36.jpg",
    description: "Multi-panel interior and exterior showcase flyer for an affordable Bronx residence featuring dual agent co-branding.",
    tags: ["Real Estate Flyer", "Co-op Listing", "Collage Layout", "Photoshop"],
    isPortrait: true,
    dimensions: "819 x 1024",
    aspectRatio: "Portrait (Vertical)"
  },
  {
    id: "design-37",
    title: "29 Keasel Road, Middletown — $499K Just Listed Feature Flyer",
    category: "Real Estate Flyer",
    imageSrc: "/creatives/design-37.jpg",
    description: "Launch campaign flyer promoting a newly listed ranch estate with lush landscape imagery and direct realtor inquiry links.",
    tags: ["Real Estate Flyer", "Just Listed", "Photoshop", "Print & Digital"],
    isPortrait: true,
    dimensions: "819 x 1024",
    aspectRatio: "Portrait (Vertical)"
  },
  {
    id: "design-38",
    title: "49 Gail Road, Yonkers — $675K Just Listed Promotional Flyer",
    category: "Real Estate Flyer",
    imageSrc: "/creatives/design-38.jpg",
    description: "Clean suburban home listing flyer featuring two-story exterior elevation, high-contrast branding, and verified agent licensing.",
    tags: ["Real Estate Flyer", "Just Listed", "Yonkers Homes", "Photoshop"],
    isPortrait: true,
    dimensions: "819 x 1024",
    aspectRatio: "Portrait (Vertical)"
  }
];

export default function CreativesPage() {
  const { playHoverSound, playSelectSound } = useSound();
  const [activeTab, setActiveTab] = useState<"ALL" | "VIDEOS" | "GRAPHICS">("ALL");
  
  // Video Cards Opening Showcase State (Style A)
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isVideoCardsDeckVisible, setIsVideoCardsDeckVisible] = useState(true);
  const [bookmarkedVideoIds, setBookmarkedVideoIds] = useState<string[]>([]);
  const [theaterVideo, setTheaterVideo] = useState<CreativeVideoItem | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  // Graphics Cards Opening Slider State
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [graphicCategoryFilter, setGraphicCategoryFilter] = useState<string>("ALL");
  
  // Custom Controls for Portrait vs Landscape
  const [isCardsDeckVisible, setIsCardsDeckVisible] = useState(true);
  const [imageFitMode, setImageFitMode] = useState<"ADAPTIVE" | "COVER" | "CONTAIN">("ADAPTIVE");

  const [lightboxGraphic, setLightboxGraphic] = useState<CreativeGraphicItem | null>(null);
  const [isHireOpen, setIsHireOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const googleDriveFolderUrl = "https://drive.google.com/drive/folders/1IumS3hapEtmF50LPV98m6K5ZChYeNdEO?usp=sharing";

  // Lock scroll when lightbox, theater video or hire modal is open
  useEffect(() => {
    if (lightboxGraphic || isHireOpen || theaterVideo) {
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
  }, [lightboxGraphic, isHireOpen, theaterVideo]);


  // Filtered graphics list for grid view
  const filteredGraphics = ALL_CREATIVE_GRAPHICS.filter((item) => {
    if (graphicCategoryFilter === "ALL") return true;
    if (graphicCategoryFilter === "THUMBNAILS") return item.category.includes("Thumbnail");
    if (graphicCategoryFilter === "BRANDING") return item.category.includes("Brand") || item.category.includes("Poster");
    if (graphicCategoryFilter === "FLYERS") return item.category.includes("Flyer") || item.category.includes("Editorial") || item.category.includes("Real Estate");
    if (graphicCategoryFilter === "CAROUSELS") return item.category.includes("Carousel");
    if (graphicCategoryFilter === "ADS") return item.category.includes("Ad") || item.category.includes("Graphic");
    return true;
  });

  const activeGraphic = ALL_CREATIVE_GRAPHICS[activeCardIndex] || ALL_CREATIVE_GRAPHICS[0];

  const handlePrevCard = () => {
    playSelectSound();
    setActiveCardIndex((prev) => (prev - 1 + ALL_CREATIVE_GRAPHICS.length) % ALL_CREATIVE_GRAPHICS.length);
  };

  const handleNextCard = () => {
    playSelectSound();
    setActiveCardIndex((prev) => (prev + 1) % ALL_CREATIVE_GRAPHICS.length);
  };

  const handleCardClick = (targetIndex: number) => {
    playSelectSound();
    setActiveCardIndex(targetIndex);
  };

  const toggleBookmark = (id: string) => {
    playSelectSound();
    setBookmarkedIds((prev) => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Dynamic Real Estate & Brands count derived from actual video and graphic entries
  const realEstateAndBrandsCount = useMemo(() => {
    const videoMatches = CREATIVE_VIDEOS.filter((v) =>
      /real estate|brand|commercial|corporate|business/i.test(v.category) ||
      v.tags.some((t) => /real estate|brand|commercial|corporate/i.test(t))
    ).length;
    const graphicMatches = ALL_CREATIVE_GRAPHICS.filter((g) =>
      /brand|real estate|flyer|ads|poster|carousel/i.test(g.category) ||
      g.tags.some((t) => /brand|real estate|flyer|ads|carousel/i.test(t))
    ).length;
    return videoMatches + graphicMatches;
  }, []);

  // Video Showcase computed values and handlers
  const activeVideo = CREATIVE_VIDEOS[activeVideoIndex] || CREATIVE_VIDEOS[0];
  const isPortraitVideoActive = !!activeVideo.isPortrait;
  const videoSliderProgress = ((activeVideoIndex + 1) / CREATIVE_VIDEOS.length) * 100;

  const upcomingVideos = [
    (activeVideoIndex + 1) % CREATIVE_VIDEOS.length,
    (activeVideoIndex + 2) % CREATIVE_VIDEOS.length,
    (activeVideoIndex + 3) % CREATIVE_VIDEOS.length,
    (activeVideoIndex + 4) % CREATIVE_VIDEOS.length,
  ].map((idx) => ({ ...CREATIVE_VIDEOS[idx], originalIndex: idx }));

  const handlePrevVideo = () => {
    playSelectSound();
    setIsVideoPlaying(true);
    setActiveVideoIndex((prev) => (prev - 1 + CREATIVE_VIDEOS.length) % CREATIVE_VIDEOS.length);
  };

  const handleNextVideo = () => {
    playSelectSound();
    setIsVideoPlaying(true);
    setActiveVideoIndex((prev) => (prev + 1) % CREATIVE_VIDEOS.length);
  };

  const handleVideoCardClick = (targetIndex: number) => {
    playSelectSound();
    setIsVideoPlaying(true);
    setActiveVideoIndex(targetIndex);
  };

  // Automatically start playing video whenever active video changes
  useEffect(() => {
    setIsVideoPlaying(true);
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser blocked unmuted autoplay (standard mobile policy),
          // fallback to muted playback immediately so video plays instantly every single time!
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsVideoMuted(true);
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, [activeVideoIndex]);

  const toggleVideoBookmark = (id: string) => {
    playSelectSound();
    setBookmarkedVideoIds((prev) => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleDirectVideoPlay = () => {
    if (!videoRef.current) return;
    playSelectSound();
    if (videoRef.current.paused) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err.name !== "AbortError") {
            console.warn("Creative video playback interrupted:", err);
          }
        });
      }
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  // Display the next 4 upcoming cards in the floating deck
  const upcomingCards = [
    (activeCardIndex + 1) % ALL_CREATIVE_GRAPHICS.length,
    (activeCardIndex + 2) % ALL_CREATIVE_GRAPHICS.length,
    (activeCardIndex + 3) % ALL_CREATIVE_GRAPHICS.length,
    (activeCardIndex + 4) % ALL_CREATIVE_GRAPHICS.length,
  ].map((idx) => ({ ...ALL_CREATIVE_GRAPHICS[idx], originalIndex: idx }));

  const sliderProgress = ((activeCardIndex + 1) / ALL_CREATIVE_GRAPHICS.length) * 100;

  // Determine if active design is portrait
  const isPortraitActive = activeGraphic.isPortrait;

  return (
    <div className="relative min-h-screen bg-[#040406] text-white selection:bg-coreCyan selection:text-black overflow-x-hidden">
      {/* Background Visual Atmospheres */}
      <div className="fixed inset-0 bg-atmospheric pointer-events-none opacity-40" />
      <div className="fixed inset-0 bg-digital-grid pointer-events-none opacity-15" />
      <div className="fixed -bottom-28 left-1/2 -translate-x-1/2 w-[750px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navigation */}
      <Navigation />

      {/* Hero Header Section */}
      <div className="pt-24 sm:pt-28">
        <SectionHeader
          watermark="CREATIVES"
          subtitle="SOCIAL MEDIA MANAGEMENT • VIDEO EDITING • GRAPHIC DESIGN"
        />
      </div>

      <main className="w-full overflow-x-hidden pb-24 sm:pb-32 space-y-12 sm:space-y-16 relative z-10">
        
        {/* Filter Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 font-mono text-xs tracking-wider">
            <button
              type="button"
              onClick={() => {
                playSelectSound();
                setActiveTab("ALL");
              }}
              className={`px-4 sm:px-6 py-2.5 rounded-full border transition-all cursor-pointer ${
                activeTab === "ALL"
                  ? "bg-coreCyan text-black border-coreCyan font-semibold shadow-[0_0_15px_rgba(77,242,255,0.4)]"
                  : "bg-white/[0.04] text-zinc-400 border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              ALL CREATIVES ({CREATIVE_VIDEOS.length + ALL_CREATIVE_GRAPHICS.length})
            </button>

            <button
              type="button"
              onClick={() => {
                playSelectSound();
                setActiveTab("VIDEOS");
              }}
              className={`px-4 sm:px-6 py-2.5 rounded-full border transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "VIDEOS"
                  ? "bg-coreCyan text-black border-coreCyan font-semibold shadow-[0_0_15px_rgba(77,242,255,0.4)]"
                  : "bg-white/[0.04] text-zinc-400 border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>VIDEO EDITS ({CREATIVE_VIDEOS.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playSelectSound();
                setActiveTab("GRAPHICS");
              }}
              className={`px-4 sm:px-6 py-2.5 rounded-full border transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "GRAPHICS"
                  ? "bg-coreCyan text-black border-coreCyan font-semibold shadow-[0_0_15px_rgba(77,242,255,0.4)]"
                  : "bg-white/[0.04] text-zinc-400 border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>GRAPHICS & THUMBNAILS ({ALL_CREATIVE_GRAPHICS.length})</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 1. VIDEO EDITING & REELS - FULL-SCREEN CARDS OPENING SHOWCASE (STYLE A) */}
        {/* ========================================================================= */}
        {(activeTab === "ALL" || activeTab === "VIDEOS") && (
          <section className="relative w-full bg-black border-y border-white/10 shadow-2xl overflow-hidden">
            {/* Edge-to-Edge Showcase Frame */}
            <div className="relative w-full min-h-0 h-auto lg:h-[88vh] lg:max-h-[960px] flex flex-col justify-between px-4 sm:px-8 lg:px-14 xl:px-20 pt-6 sm:pt-10 lg:pt-14 pb-6 select-none bg-black">
              
              {/* Dynamic Backdrop with ambient blur glow */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <Image
                  key={`video-bg-${activeVideo.id}`}
                  src={activeVideo.thumbnailSrc}
                  alt={activeVideo.title}
                  fill
                  priority
                  className="object-cover scale-110 filter blur-3xl opacity-35 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-y-0 left-0 w-full lg:w-3/5 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 to-transparent" />
              </div>

              {/* Top Bar inside Video Showcase */}
              <div className="relative z-20 shrink-0 flex items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 font-mono text-xs text-white/90">
                    <span className="font-grotesk font-light text-base tracking-[0.25em] text-white">JL</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-coreCyan shadow-[0_0_8px_#4df2ff]" />
                    <span className="font-mono text-[10px] tracking-widest text-white/70 uppercase">VIDEO EDITING STUDIO</span>
                  </div>

                  {/* Orientation / Format Badge */}
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-mono text-[10px] text-zinc-300">
                    {isPortraitVideoActive ? (
                      <Smartphone className="w-3 h-3 text-[#f59e0b]" />
                    ) : (
                      <Monitor className="w-3 h-3 text-coreCyan" />
                    )}
                    <span>{activeVideo.aspectRatio || "Landscape (16:9)"}</span>
                  </span>
                </div>

                {/* Right Top Actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Toggle Cards Deck */}
                  <button
                    type="button"
                    onClick={() => {
                      playSelectSound();
                      setIsVideoCardsDeckVisible(!isVideoCardsDeckVisible);
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-white/20 border border-white/30 text-white font-mono text-[11px] tracking-wider transition-all backdrop-blur-md cursor-pointer flex items-center gap-1.5"
                    title={isVideoCardsDeckVisible ? "Hide cards deck" : "Show upcoming video cards"}
                  >
                    {isVideoCardsDeckVisible ? <EyeOff className="w-3.5 h-3.5 text-coreCyan" /> : <Eye className="w-3.5 h-3.5 text-coreCyan" />}
                    <span className="hidden sm:inline">{isVideoCardsDeckVisible ? "REVEAL FULL STAGE" : "SHOW CARDS"}</span>
                  </button>

                  {/* Hire CTA */}
                  <button
                    type="button"
                    onClick={() => {
                      playSelectSound();
                      setIsHireOpen(true);
                    }}
                    className="px-4 py-1.5 rounded-full bg-coreCyan text-black hover:bg-white border border-coreCyan font-mono text-[11px] font-semibold tracking-wider transition-all backdrop-blur-md cursor-pointer shadow-[0_0_20px_rgba(77,242,255,0.3)]"
                  >
                    <span>HIRE FOR VIDEO ↗</span>
                  </button>
                </div>
              </div>

              {/* Main Stage Area (Constrained flex-1 on desktop, natural flow on mobile so portraits never overlap) */}
              <div className="relative z-10 flex-1 min-h-0 w-full flex items-center justify-center lg:my-auto py-2 sm:py-4">
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center lg:h-full lg:max-h-full min-w-0 max-w-full">
                
                  {/* CASE 1: PORTRAIT VIDEO (Vertical 9:16 Short-Form Reel) */}
                  {isPortraitVideoActive ? (
                    <div className={`transition-all duration-500 w-full min-w-0 max-w-full ${
                      isVideoCardsDeckVisible
                        ? "lg:col-span-6 flex flex-col sm:flex-row items-center gap-5 sm:gap-8 text-center sm:text-left"
                        : "lg:col-span-12 flex justify-center items-center mx-auto"
                    }`}>
                      {/* Vertical Phone/Player Card - Centers when cards are hidden */}
                      <div className={`group relative shrink-0 aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/30 shadow-[0_25px_70px_rgba(0,0,0,0.95)] bg-black transition-all duration-500 ${
                        isVideoCardsDeckVisible
                          ? "h-[28vh] xs:h-[32vh] sm:h-[48vh] lg:h-[54vh] max-h-[250px] xs:max-h-[290px] sm:max-h-[460px] lg:max-h-[520px]"
                          : "h-[38vh] sm:h-[54vh] lg:h-[62vh] max-h-[360px] sm:max-h-[520px] lg:max-h-[580px]"
                      }`}>
                        {activeVideo.videoSrc ? (
                          <div className="relative w-full h-full">
                            <video
                              ref={videoRef}
                              key={activeVideo.id}
                              src={activeVideo.videoSrc}
                              autoPlay
                              loop
                              muted={isVideoMuted}
                              playsInline
                              onLoadedMetadata={(e) => {
                                e.currentTarget.volume = 0.3;
                              }}
                              onCanPlay={(e) => {
                                const v = e.currentTarget;
                                if (v.paused) {
                                  const p = v.play();
                                  if (p !== undefined) {
                                    p.catch(() => {
                                      v.muted = true;
                                      setIsVideoMuted(true);
                                      v.play().catch(() => {});
                                    });
                                  }
                                }
                              }}
                              onLoadedData={(e) => {
                                const v = e.currentTarget;
                                if (v.paused) {
                                  const p = v.play();
                                  if (p !== undefined) {
                                    p.catch(() => {
                                      v.muted = true;
                                      setIsVideoMuted(true);
                                      v.play().catch(() => {});
                                    });
                                  }
                                }
                              }}
                              onPlay={() => setIsVideoPlaying(true)}
                              onPause={() => setIsVideoPlaying(false)}
                              onClick={toggleDirectVideoPlay}
                              className="w-full h-full object-contain bg-black cursor-pointer"
                            />

                            {/* Floating Play/Pause Center Indicator when paused */}
                            {!isVideoPlaying && (
                              <div 
                                onClick={toggleDirectVideoPlay}
                                className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer z-10 transition-opacity"
                              >
                                <div className="w-12 h-12 rounded-full bg-coreCyan text-black flex items-center justify-center shadow-[0_0_20px_#4df2ff]">
                                  <Play className="w-5 h-5 fill-current ml-0.5" />
                                </div>
                              </div>
                            )}

                            {/* Bottom-left Mute / Unmute Toggle on Phone Card */}
                            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 z-20">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playSelectSound();
                                  if (videoRef.current) {
                                    videoRef.current.muted = !videoRef.current.muted;
                                    setIsVideoMuted(videoRef.current.muted);
                                  } else {
                                    setIsVideoMuted(!isVideoMuted);
                                  }
                                }}
                                className="p-1 px-2.5 rounded-full bg-black/80 hover:bg-coreCyan hover:text-black text-white border border-white/20 transition-all cursor-pointer shadow-lg flex items-center gap-1.5 backdrop-blur-md"
                                title={isVideoMuted ? "Unmute Sound" : "Mute Sound"}
                              >
                                {isVideoMuted ? <VolumeX className="w-3 h-3 text-amber-400" /> : <Volume2 className="w-3 h-3 text-coreCyan" />}
                                <span className="font-mono text-[9px] uppercase tracking-wider">{isVideoMuted ? "MUTED" : "SOUND ON"}</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Crisp Fallback with Play Trigger */
                          <div 
                            onClick={() => {
                              playSelectSound();
                              setTheaterVideo(activeVideo);
                            }}
                            className="relative w-full h-full cursor-pointer group/fallback"
                          >
                            <Image
                              src={activeVideo.thumbnailSrc}
                              alt={activeVideo.title}
                              fill
                              className="object-contain"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover/fallback:bg-black/20 flex items-center justify-center transition-colors">
                              <div className="w-12 h-12 rounded-full bg-coreCyan/90 text-black flex items-center justify-center shadow-lg group-hover/fallback:scale-110 transition-transform">
                                <Play className="w-5 h-5 fill-current ml-0.5" />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Floating Duration Pill - Placed Top-Left so it never collides with iframe icons */}
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 font-mono text-[10px] text-coreCyan z-20 pointer-events-none">
                          {activeVideo.duration}
                        </div>

                        {/* Expand Button Overlay */}
                        <button
                          type="button"
                          onClick={() => {
                            playSelectSound();
                            setTheaterVideo(activeVideo);
                          }}
                          className="absolute bottom-2.5 right-2.5 p-2 rounded-full bg-black/80 hover:bg-coreCyan hover:text-black text-white border border-white/20 transition-all z-20 cursor-pointer shadow-lg"
                          title="Expand Theater"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Headline and Description Next to Vertical Reel (ONLY SHOWN WHEN CARDS ARE VISIBLE) */}
                      {isVideoCardsDeckVisible && (
                        <div className="space-y-3 sm:space-y-3.5 animate-fadeIn w-full min-w-0 max-w-full flex flex-col items-center sm:items-start text-center sm:text-left px-2 sm:px-0">
                          <div className="flex items-center gap-2 font-mono text-xs text-white/80 tracking-wider">
                            <span className="w-5 h-[1.5px] bg-coreCyan" />
                            <span className="uppercase text-coreCyan font-semibold">{activeVideo.category}</span>
                          </div>

                          <h2 className="font-grotesk font-black text-xl sm:text-3xl lg:text-5xl text-white tracking-tight uppercase leading-[1.05] drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)] break-words w-full">
                            {activeVideo.title}
                          </h2>

                          <p className="text-white/80 text-xs sm:text-sm font-sans leading-relaxed drop-shadow-md line-clamp-2 sm:line-clamp-3 w-full">
                            {activeVideo.description}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 pt-1 w-full">
                            {activeVideo.tags.map((tag) => (
                              <span
                                key={tag}
                                className="font-mono text-[10px] px-2.5 py-0.5 rounded-md bg-white/10 border border-white/15 text-zinc-300"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-start items-center gap-2.5 sm:gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => toggleVideoBookmark(activeVideo.id)}
                              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg shrink-0 ${
                                bookmarkedVideoIds.includes(activeVideo.id)
                                  ? "bg-coreCyan text-black shadow-[0_0_15px_#4df2ff]"
                                  : "bg-coreCyan hover:bg-white text-black"
                              }`}
                              title="Save / Bookmark"
                            >
                              <Bookmark className="w-4 h-4 fill-current" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                playSelectSound();
                                setTheaterVideo(activeVideo);
                              }}
                              onMouseEnter={() => playHoverSound()}
                              className="px-4 sm:px-5 py-2 rounded-full border border-white/40 hover:border-white bg-black/40 hover:bg-white/20 backdrop-blur-md text-white font-mono text-[11px] sm:text-xs tracking-widest uppercase transition-all flex items-center gap-2 cursor-pointer shadow-lg shrink-0"
                            >
                              <Play className="w-3.5 h-3.5 fill-current text-coreCyan" />
                              <span>EXPAND THEATER</span>
                            </button>

                            <a
                              href={activeVideo.videoSrc || (activeVideo.driveId ? `https://drive.google.com/file/d/${activeVideo.driveId}/view` : "#")}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => playSelectSound()}
                              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer shrink-0"
                              title={activeVideo.videoSrc ? "Open Video File" : "Open Master on Google Drive"}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* CASE 2: LANDSCAPE VIDEO (Cinematic 16:9) */
                    <div className={`transition-all duration-500 w-full min-w-0 max-w-full ${
                      isVideoCardsDeckVisible
                        ? "lg:col-span-6 flex flex-col justify-center space-y-4 text-left"
                        : "lg:col-span-12 max-w-4xl mx-auto w-full flex flex-col justify-center items-center"
                    }`}>
                      {/* 16:9 Video Player Container - Expands safely without pushing controls */}
                      <div className={`relative aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-white/25 shadow-[0_25px_70px_rgba(0,0,0,0.95)] bg-black group transition-all duration-500 ${
                        isVideoCardsDeckVisible ? "max-h-[46vh] lg:max-h-[52vh]" : "max-h-[52vh] lg:max-h-[58vh]"
                      }`}>
                        {activeVideo.videoSrc ? (
                          <div className="relative w-full h-full">
                            <video
                              ref={videoRef}
                              key={activeVideo.id}
                              src={activeVideo.videoSrc}
                              autoPlay
                              loop
                              muted={isVideoMuted}
                              playsInline
                              onLoadedMetadata={(e) => {
                                e.currentTarget.volume = 0.3;
                              }}
                              onCanPlay={(e) => {
                                const v = e.currentTarget;
                                if (v.paused) {
                                  const p = v.play();
                                  if (p !== undefined) {
                                    p.catch(() => {
                                      v.muted = true;
                                      setIsVideoMuted(true);
                                      v.play().catch(() => {});
                                    });
                                  }
                                }
                              }}
                              onLoadedData={(e) => {
                                const v = e.currentTarget;
                                if (v.paused) {
                                  const p = v.play();
                                  if (p !== undefined) {
                                    p.catch(() => {
                                      v.muted = true;
                                      setIsVideoMuted(true);
                                      v.play().catch(() => {});
                                    });
                                  }
                                }
                              }}
                              onPlay={() => setIsVideoPlaying(true)}
                              onPause={() => setIsVideoPlaying(false)}
                              onClick={toggleDirectVideoPlay}
                              className="w-full h-full object-contain cursor-pointer"
                            />
                            {/* Bottom Control Bar for direct video */}
                            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between font-mono text-xs text-white z-20">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={toggleDirectVideoPlay}
                                  className="p-1.5 rounded-lg bg-black/70 hover:bg-black/95 border border-white/20 hover:border-coreCyan transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                  {isVideoPlaying ? <Pause className="w-3 h-3 text-coreCyan" /> : <Play className="w-3 h-3 text-coreCyan" />}
                                  <span className="text-[10px]">{isVideoPlaying ? "PAUSE" : "PLAY"}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    playSelectSound();
                                    setIsVideoMuted(!isVideoMuted);
                                  }}
                                  className="p-1.5 rounded-lg bg-black/70 hover:bg-black/95 border border-white/20 hover:border-coreCyan transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                  {isVideoMuted ? <VolumeX className="w-3 text-zinc-400" /> : <Volume2 className="w-3 text-coreCyan" />}
                                  <span className="text-[10px]">{isVideoMuted ? "MUTED" : "SOUND (0.3)"}</span>
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  playSelectSound();
                                  setTheaterVideo(activeVideo);
                                }}
                                className="p-1.5 rounded-lg bg-black/70 hover:bg-black/95 border border-white/20 hover:border-coreCyan transition-all text-white flex items-center gap-1 cursor-pointer"
                                title="Expand Theater"
                              >
                                <Maximize2 className="w-3 h-3 text-coreCyan" />
                                <span className="text-[10px]">FULLSCREEN</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* High-Tech Fallback with Play / Drive Trigger */
                          <div 
                            onClick={() => {
                              playSelectSound();
                              setTheaterVideo(activeVideo);
                            }}
                            className="relative w-full h-full cursor-pointer group/fallback bg-black flex items-center justify-center"
                          >
                            <Image
                              src={activeVideo.thumbnailSrc}
                              alt={activeVideo.title}
                              fill
                              className="object-cover sm:object-contain"
                            />
                            <div className="absolute inset-0 bg-black/50 group-hover/fallback:bg-black/30 flex flex-col items-center justify-center gap-2 transition-colors">
                              <div className="w-14 h-14 rounded-full bg-coreCyan text-black flex items-center justify-center shadow-[0_0_25px_rgba(77,242,255,0.6)] group-hover/fallback:scale-110 transition-transform">
                                <Play className="w-6 h-6 fill-current ml-0.5" />
                              </div>
                              <span className="font-mono text-xs tracking-widest text-white/90 uppercase bg-black/60 px-3 py-1 rounded-full border border-white/20">
                                PLAY IN THEATER
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Meta info below Player (ONLY SHOWN WHEN CARDS ARE VISIBLE) */}
                      {isVideoCardsDeckVisible && (
                        <div className="space-y-2 pt-1 animate-fadeIn w-full min-w-0 max-w-full">
                          <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-white/80 tracking-wider">
                            <span className="w-5 h-[1.5px] bg-coreCyan" />
                            <span className="uppercase text-coreCyan font-semibold">{activeVideo.category}</span>
                            <span className="text-zinc-500">•</span>
                            <span className="text-zinc-400 font-mono text-xs">{activeVideo.duration}</span>
                          </div>

                          <h2 className="font-grotesk font-black text-xl sm:text-3xl lg:text-4xl text-white tracking-tight uppercase leading-tight drop-shadow-lg break-words w-full">
                            {activeVideo.title}
                          </h2>

                          <p className="text-white/80 text-xs sm:text-sm font-sans leading-relaxed drop-shadow-md line-clamp-2 w-full">
                            {activeVideo.description}
                          </p>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => toggleVideoBookmark(activeVideo.id)}
                              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg shrink-0 ${
                                bookmarkedVideoIds.includes(activeVideo.id)
                                  ? "bg-coreCyan text-black shadow-[0_0_15px_#4df2ff]"
                                  : "bg-coreCyan hover:bg-white text-black"
                              }`}
                              title="Save / Bookmark"
                            >
                              <Bookmark className="w-4 h-4 fill-current" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                playSelectSound();
                                setTheaterVideo(activeVideo);
                              }}
                              onMouseEnter={() => playHoverSound()}
                              className="px-4 sm:px-5 py-2 rounded-full border border-white/40 hover:border-white bg-black/40 hover:bg-white/20 backdrop-blur-md text-white font-mono text-[11px] sm:text-xs tracking-widest uppercase transition-all flex items-center gap-2 cursor-pointer shadow-lg shrink-0"
                            >
                              <Play className="w-3.5 h-3.5 fill-current text-coreCyan" />
                              <span>EXPAND THEATER</span>
                            </button>

                            <a
                              href={activeVideo.videoSrc || (activeVideo.driveId ? `https://drive.google.com/file/d/${activeVideo.driveId}/view` : "#")}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => playSelectSound()}
                              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer shrink-0"
                              title={activeVideo.videoSrc ? "Open Video File" : "Open Master on Google Drive"}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* RIGHT COLUMN: FLOATING VIDEO CARDS DECK (Tucks away when full stage is revealed) */}
                  <div className={`lg:col-span-6 transition-all duration-500 w-full min-w-0 max-w-full overflow-hidden ${
                    isVideoCardsDeckVisible
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 translate-y-10 pointer-events-none hidden"
                  }`}>
                    <div className="flex items-center gap-3 sm:gap-5 overflow-x-auto pb-4 pt-2 scrollbar-none select-none w-full max-w-full">
                      {upcomingVideos.map((card, cIdx) => (
                        <div
                          key={`video-deck-${card.id}-${cIdx}`}
                          onClick={() => handleVideoCardClick(card.originalIndex)}
                          onMouseEnter={() => playHoverSound()}
                          className="group relative shrink-0 w-32 sm:w-44 lg:w-60 h-[190px] sm:h-[260px] lg:h-[340px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/25 hover:border-coreCyan transition-all duration-500 hover:-translate-y-2 cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.85)] bg-black/60 backdrop-blur-sm"
                        >
                          {/* Ambient Blur Backdrop */}
                          <Image
                            src={card.thumbnailSrc}
                            alt=""
                            fill
                            className="object-cover scale-125 filter blur-xl opacity-30 pointer-events-none"
                          />

                          {/* 100% Uncropped Sharp Thumbnail */}
                          <div className="relative w-full h-full p-2 flex items-center justify-center">
                            <Image
                              src={card.thumbnailSrc}
                              alt={card.title}
                              fill
                              className="object-contain drop-shadow-md group-hover:scale-[1.02] transition-transform duration-500"
                            />
                          </div>

                          {/* Top Duration Pill */}
                          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 font-mono text-[10px] text-coreCyan z-10">
                            {card.duration}
                          </div>

                          {/* Center Pulsing Play Icon */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-12 h-12 rounded-full bg-black/60 border border-white/40 group-hover:border-coreCyan group-hover:bg-coreCyan/20 group-hover:scale-110 flex items-center justify-center transition-all backdrop-blur-md shadow-lg">
                              <Play className="w-5 h-5 text-white group-hover:text-coreCyan fill-current ml-0.5" />
                            </div>
                          </div>

                          {/* Subtle Bottom Gradient */}
                          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

                          {/* Card Subtitle & Title */}
                          <div className="absolute bottom-4 left-4 right-4 space-y-1 z-10 text-left">
                            <div className="flex items-center gap-1.5 font-mono text-[9px] text-coreCyan tracking-widest uppercase">
                              <span className="w-3 h-[1.5px] bg-coreCyan" />
                              <span className="truncate">{card.category}</span>
                            </div>
                            <h4 className="font-grotesk text-sm sm:text-base font-bold text-white uppercase tracking-tight line-clamp-2 leading-tight drop-shadow-md">
                              {card.title}
                            </h4>
                          </div>

                          {/* Hover Border Ring */}
                          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border-2 border-white/0 group-hover:border-coreCyan transition-colors pointer-events-none" />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Floating Side Nav Arrows when in Full Stage Mode */}
                {!isVideoCardsDeckVisible && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevVideo}
                      onMouseEnter={() => playHoverSound()}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/80 hover:bg-coreCyan hover:text-black text-white border border-white/30 flex items-center justify-center transition-all backdrop-blur-md shadow-2xl cursor-pointer hover:scale-105 active:scale-95 group"
                      title="Previous Video"
                    >
                      <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextVideo}
                      onMouseEnter={() => playHoverSound()}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/80 hover:bg-coreCyan hover:text-black text-white border border-white/30 flex items-center justify-center transition-all backdrop-blur-md shadow-2xl cursor-pointer hover:scale-105 active:scale-95 group"
                      title="Next Video"
                    >
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </>
                )}
              </div>

              {/* BOTTOM CONTROLS (Permanently visible and pinned at bottom) */}
              <div className="relative z-20 shrink-0 mt-auto flex items-center justify-between pt-4 border-t border-white/10">
                {/* Circular Nav Buttons (<) (>) */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrevVideo}
                    onMouseEnter={() => playHoverSound()}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/30 hover:border-coreCyan bg-black/50 hover:bg-coreCyan hover:text-black text-white flex items-center justify-center transition-all backdrop-blur-md cursor-pointer shadow-lg group active:scale-95"
                    title="Previous Video"
                  >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextVideo}
                    onMouseEnter={() => playHoverSound()}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/30 hover:border-coreCyan bg-black/50 hover:bg-coreCyan hover:text-black text-white flex items-center justify-center transition-all backdrop-blur-md cursor-pointer shadow-lg group active:scale-95"
                    title="Next Video"
                  >
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                {/* Progress Bar in Center */}
                <div className="flex-1 max-w-xs sm:max-w-md mx-6 sm:mx-10">
                  <div className="w-full h-[2px] bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-coreBlue to-coreCyan transition-all duration-500 ease-out shadow-[0_0_10px_#4df2ff]"
                      style={{ width: `${videoSliderProgress}%` }}
                    />
                  </div>
                </div>

                {/* Number Counter (01 / 22) */}
                <div className="font-mono text-sm sm:text-base tracking-widest text-white/90">
                  <span className="font-bold text-white text-base sm:text-lg">
                    {String(activeVideoIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="text-zinc-500 mx-1">/</span>
                  <span className="text-zinc-400 text-xs sm:text-sm">
                    {String(CREATIVE_VIDEOS.length).padStart(2, "0")}
                  </span>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* 2. GRAPHIC DESIGN & THUMBNAILS - FULL-SCREEN ADAPTIVE CARDS OPENING SLIDER */}
        {/* ========================================================================= */}
        {(activeTab === "ALL" || activeTab === "GRAPHICS") && (
          <section className="relative w-full bg-black border-y border-white/10 shadow-2xl overflow-hidden space-y-12">
            
            {/* 
              ===========================================================================
              FULL-SCREEN / EDGE-TO-EDGE CARDS OPENING SHOWCASE
              ===========================================================================
            */}
            <div className="relative w-full min-h-0 h-auto lg:h-[88vh] lg:max-h-[960px] flex flex-col justify-between px-4 sm:px-8 lg:px-14 xl:px-20 pt-6 sm:pt-10 lg:pt-14 pb-6 select-none bg-black">
              
              {/* 
                ========================================================================
                BACKGROUND LAYER:
                If Landscape: Full-bleed crystal-clear sharp image.
                If Portrait: Ambient soft glow backdrop + sharp vertical centerpiece.
                ========================================================================
              */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Ambient Base Backdrop (Always crisp, or ambient for portrait) */}
                <Image
                  key={`bg-${activeGraphic.id}`}
                  src={activeGraphic.imageSrc}
                  alt={activeGraphic.title}
                  fill
                  priority
                  className={`object-center transition-all duration-700 ease-out ${
                    isPortraitActive
                      ? "object-cover scale-110 filter blur-xl opacity-40"
                      : "object-cover scale-100 filter-none opacity-100"
                  }`}
                />
                
                {/* 
                  Targeted Vignettes:
                  Soft shadow behind text on left, clear viewing area on center/right
                */}
                <div className={`absolute inset-y-0 left-0 w-full lg:w-3/5 bg-gradient-to-r from-black/90 via-black/45 to-transparent pointer-events-none transition-opacity duration-700 ${
                  isCardsDeckVisible ? "opacity-100" : "opacity-0"
                }`} />
                <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
              </div>

              {/* Top Controls Bar inside Slider */}
              <div className="relative z-20 shrink-0 flex items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 font-mono text-xs text-white/90">
                    <span className="font-grotesk font-light text-base tracking-[0.25em] text-white">JL</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]" />
                    <span className="font-mono text-[10px] tracking-widest text-white/70 uppercase">CREATIVE STUDIO</span>
                  </div>

                  {/* Orientation Indicator Pill */}
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 font-mono text-[10px] text-zinc-300">
                    {isPortraitActive ? <Smartphone className="w-3 h-3 text-[#f59e0b]" /> : <Monitor className="w-3 h-3 text-coreCyan" />}
                    <span>{activeGraphic.aspectRatio}</span>
                  </span>
                </div>

                {/* Right Top Actions: Toggle Cards Deck Visibility + Hire CTA */}
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* "REVEAL FULL ARTWORK" / Clean View Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      playSelectSound();
                      setIsCardsDeckVisible(!isCardsDeckVisible);
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-white/20 border border-white/30 text-white font-mono text-[11px] tracking-wider transition-all backdrop-blur-md cursor-pointer flex items-center gap-1.5"
                    title={isCardsDeckVisible ? "Hide cards to reveal 100% full background artwork" : "Show upcoming cards deck"}
                  >
                    {isCardsDeckVisible ? <EyeOff className="w-3.5 h-3.5 text-[#f59e0b]" /> : <Eye className="w-3.5 h-3.5 text-coreCyan" />}
                    <span className="hidden sm:inline">{isCardsDeckVisible ? "REVEAL FULL ARTWORK" : "SHOW CARDS"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playSelectSound();
                      setIsHireOpen(true);
                    }}
                    className="px-4 py-1.5 rounded-full bg-black/40 hover:bg-white text-white hover:text-black border border-white/30 font-mono text-[11px] font-semibold tracking-wider transition-all backdrop-blur-md cursor-pointer"
                  >
                    <span>HIRE FOR DESIGN ↗</span>
                  </button>
                </div>
              </div>

              {/* 
                ========================================================================
                MAIN STAGE CONTENT (ADAPTIVE FOR BOTH PORTRAIT AND LANDSCAPE WITH FULL REVEAL MODE):
                ========================================================================
              */}
              <div className="relative z-10 flex-1 min-h-0 w-full flex items-center justify-center lg:my-auto py-2 sm:py-4">
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center lg:h-full lg:max-h-full">
                
                  {/* 
                    CASE A: WHEN PORTRAIT DESIGN IS ACTIVE
                    When cards are hidden (REVEAL FULL ARTWORK), the vertical poster centers horizontally!
                  */}
                  {isPortraitActive ? (
                    <div className={`transition-all duration-500 w-full ${
                      isCardsDeckVisible 
                        ? "lg:col-span-6 flex flex-col sm:flex-row items-center gap-5 sm:gap-8 text-center sm:text-left"
                        : "lg:col-span-12 flex justify-center items-center mx-auto"
                    }`}>
                      {/* The Full Uncropped Vertical Poster / Flyer Card - Centers when cards are hidden */}
                      <div 
                        onClick={() => {
                          playSelectSound();
                          setLightboxGraphic(activeGraphic);
                        }}
                        onMouseEnter={() => playHoverSound()}
                        className={`group relative shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/30 shadow-[0_25px_70px_rgba(0,0,0,0.95)] cursor-pointer hover:scale-[1.01] transition-all duration-500 bg-[#070a14] ${
                          isCardsDeckVisible
                            ? "h-[28vh] xs:h-[32vh] sm:h-[48vh] lg:h-[54vh] max-h-[250px] xs:max-h-[290px] sm:max-h-[460px] lg:max-h-[520px]"
                            : "h-[38vh] sm:h-[54vh] lg:h-[62vh] max-h-[360px] sm:max-h-[520px] lg:max-h-[580px] mx-auto"
                        } ${
                          activeGraphic.dimensions.includes("900 x 1600")
                            ? "aspect-[9/16]"
                            : activeGraphic.dimensions.includes("819 x 1024")
                            ? "aspect-[4/5]"
                            : "aspect-[2/3]"
                        }`}
                      >
                        {/* Ambient soft glow inside container */}
                        <Image
                          src={activeGraphic.imageSrc}
                          alt=""
                          fill
                          className="object-cover scale-125 filter blur-xl opacity-20 pointer-events-none"
                        />
                        {/* Main Sharp 100% Uncropped Fitted Image with Protective Padding */}
                        <div className="relative w-full h-full p-2.5 sm:p-3 flex items-center justify-center">
                          <Image
                            src={activeGraphic.imageSrc}
                            alt={activeGraphic.title}
                            fill
                            priority
                            className="object-contain drop-shadow-2xl group-hover:scale-[1.01] transition-transform duration-700"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 pointer-events-none">
                          <span className="font-mono text-[10px] text-white bg-black/75 px-3 py-1 rounded-full border border-white/20">
                            CLICK TO EXPAND
                          </span>
                        </div>
                      </div>

                      {/* Headline and Description Next to Portrait Poster (ONLY SHOWN WHEN CARDS ARE VISIBLE) */}
                      {isCardsDeckVisible && (
                        <div className="space-y-3 sm:space-y-3.5 animate-fadeIn w-full max-w-xl flex flex-col items-center sm:items-start text-center sm:text-left">
                          <div className="flex items-center gap-2 font-mono text-xs text-white/80 tracking-wider">
                            <span className="w-5 h-[1.5px] bg-[#f59e0b]" />
                            <span className="uppercase text-[#f59e0b] font-semibold">{activeGraphic.category}</span>
                          </div>

                          <h2 className="font-grotesk font-black text-xl sm:text-3xl lg:text-5xl text-white tracking-tight uppercase leading-[1.05] drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
                            {activeGraphic.title}
                          </h2>

                          <p className="text-white/80 text-xs sm:text-sm font-sans leading-relaxed drop-shadow-md line-clamp-2 sm:line-clamp-3">
                            {activeGraphic.description}
                          </p>

                          <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-start items-center gap-2.5 sm:gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => toggleBookmark(activeGraphic.id)}
                              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg shrink-0 ${
                                bookmarkedIds.includes(activeGraphic.id)
                                  ? "bg-[#f59e0b] text-black shadow-[0_0_15px_#f59e0b]"
                                  : "bg-[#f59e0b] hover:bg-[#fbbf24] text-black"
                              }`}
                              title="Save / Bookmark"
                            >
                              <Bookmark className="w-4 h-4 fill-current" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                playSelectSound();
                                setLightboxGraphic(activeGraphic);
                              }}
                              onMouseEnter={() => playHoverSound()}
                              className="px-4 sm:px-5 py-2 rounded-full border border-white/40 hover:border-white bg-black/40 hover:bg-white/20 backdrop-blur-md text-white font-mono text-[11px] sm:text-xs tracking-widest uppercase transition-all flex items-center gap-2 cursor-pointer shadow-lg shrink-0"
                            >
                              <span>DISCOVER DESIGN</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* 
                      CASE B: WHEN LANDSCAPE DESIGN IS ACTIVE (16:9 Wide)
                      The 16:9 design is presented in a full-width framed card so the entire thumbnail is 100% visible!
                    */
                    <div className={`transition-all duration-500 w-full ${
                      isCardsDeckVisible 
                        ? "lg:col-span-6 flex flex-col items-center gap-6 text-left"
                        : "lg:col-span-12 max-w-4xl flex justify-center items-center mx-auto"
                    }`}>
                      {/* The Full Uncropped 16:9 Landscape Card */}
                      <div 
                        onClick={() => {
                          playSelectSound();
                          setLightboxGraphic(activeGraphic);
                        }}
                        onMouseEnter={() => playHoverSound()}
                        className={`group relative shrink-0 aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-white/30 shadow-[0_25px_70px_rgba(0,0,0,0.95)] cursor-pointer hover:scale-[1.01] transition-all duration-500 bg-[#070a14] p-2 flex items-center justify-center ${
                          isCardsDeckVisible
                            ? "max-h-[46vh] lg:max-h-[52vh]"
                            : "max-h-[52vh] lg:max-h-[58vh] max-w-4xl mx-auto"
                        }`}
                      >
                        <Image
                          src={activeGraphic.imageSrc}
                          alt=""
                          fill
                          className="object-cover scale-110 filter blur-xl opacity-20 pointer-events-none"
                        />
                        <div className="relative w-full h-full flex items-center justify-center p-1">
                          <Image
                            src={activeGraphic.imageSrc}
                            alt={activeGraphic.title}
                            fill
                            priority
                            className="object-contain drop-shadow-2xl"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 pointer-events-none">
                          <span className="font-mono text-[10px] text-white bg-black/75 px-3 py-1 rounded-full border border-white/20">
                            CLICK TO EXPAND
                          </span>
                        </div>
                      </div>

                      {/* Headline and Description Next to Landscape Poster */}
                      {isCardsDeckVisible && (
                        <div className="space-y-3 sm:space-y-3.5 animate-fadeIn w-full">
                          <div className="flex items-center gap-2 font-mono text-xs text-white/80 tracking-wider">
                            <span className="w-5 h-[1.5px] bg-[#f59e0b]" />
                            <span className="uppercase text-[#f59e0b] font-semibold">{activeGraphic.category}</span>
                          </div>

                          <h2 className="font-grotesk font-black text-xl sm:text-3xl lg:text-4xl text-white tracking-tight uppercase leading-[1.05] drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
                            {activeGraphic.title}
                          </h2>

                          <p className="text-white/80 text-xs sm:text-sm font-sans leading-relaxed drop-shadow-md line-clamp-2 sm:line-clamp-3">
                            {activeGraphic.description}
                          </p>

                          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => toggleBookmark(activeGraphic.id)}
                              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg shrink-0 ${
                                bookmarkedIds.includes(activeGraphic.id)
                                  ? "bg-[#f59e0b] text-black shadow-[0_0_15px_#f59e0b]"
                                  : "bg-[#f59e0b] hover:bg-[#fbbf24] text-black"
                              }`}
                              title="Save / Bookmark"
                            >
                              <Bookmark className="w-4 h-4 fill-current" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                playSelectSound();
                                setLightboxGraphic(activeGraphic);
                              }}
                              onMouseEnter={() => playHoverSound()}
                              className="px-4 sm:px-5 py-2 rounded-full border border-white/40 hover:border-white bg-black/40 hover:bg-white/20 backdrop-blur-md text-white font-mono text-[11px] sm:text-xs tracking-widest uppercase transition-all flex items-center gap-2 cursor-pointer shadow-lg shrink-0"
                            >
                              <span>DISCOVER DESIGN</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 
                    RIGHT COLUMN: FLOATING CARDS DECK
                    Tucks away smoothly if user clicks "REVEAL FULL ARTWORK" or hovers away!
                  */}
                  <div className={`lg:col-span-6 transition-all duration-500 w-full ${
                    isCardsDeckVisible 
                      ? "opacity-100 translate-y-0 pointer-events-auto" 
                      : "opacity-0 translate-y-10 pointer-events-none hidden"
                  }`}>
                    <div className="flex items-center gap-3 sm:gap-5 overflow-x-auto pb-4 pt-2 scrollbar-none select-none">
                      {upcomingCards.map((card, cIdx) => (
                        <div
                          key={`deck-${card.id}-${cIdx}`}
                          onClick={() => handleCardClick(card.originalIndex)}
                          onMouseEnter={() => playHoverSound()}
                          className="group relative shrink-0 w-32 sm:w-44 lg:w-60 h-[190px] sm:h-[260px] lg:h-[340px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 hover:border-white transition-all duration-500 hover:-translate-y-2 cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.85)] bg-[#070a14] backdrop-blur-sm flex flex-col"
                        >
                          {/* Artwork Area - 100% Fully Fitted, Zero Cropping */}
                          <div className="relative flex-1 w-full overflow-hidden p-2.5 flex items-center justify-center bg-[#05070e]">
                            {/* Ambient glow behind artwork */}
                            <Image
                              src={card.imageSrc}
                              alt=""
                              fill
                              className="object-cover scale-125 filter blur-xl opacity-20 pointer-events-none"
                            />

                            {/* Sharp Image 100% Uncropped */}
                            <div className="relative w-full h-full flex items-center justify-center">
                              <Image
                                src={card.imageSrc}
                                alt={card.title}
                                fill
                                className="object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                              />
                            </div>
                          </div>

                          {/* Card Meta Info Bar - Placed Below Artwork so Design is Never Blocked */}
                          <div className="p-3 sm:p-3.5 bg-[#0a0d18] border-t border-white/10 shrink-0 text-left space-y-1">
                            <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#f59e0b] tracking-widest uppercase">
                              <span className="w-2.5 h-[1.5px] bg-[#f59e0b]" />
                              <span className="truncate">{card.category}</span>
                            </div>
                            <h4 className="font-grotesk text-xs sm:text-sm font-bold text-white uppercase tracking-tight line-clamp-1 leading-tight group-hover:text-[#f59e0b] transition-colors">
                              {card.title}
                            </h4>
                          </div>

                          {/* Hover Border Ring */}
                          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border-2 border-white/0 group-hover:border-white/80 transition-colors pointer-events-none" />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Floating Side Nav Arrows when in Full View Mode */}
                {!isCardsDeckVisible && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevCard}
                      onMouseEnter={() => playHoverSound()}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/80 hover:bg-[#f59e0b] hover:text-black text-white border border-white/30 flex items-center justify-center transition-all backdrop-blur-md shadow-2xl cursor-pointer hover:scale-105 active:scale-95 group"
                      title="Previous Design"
                    >
                      <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextCard}
                      onMouseEnter={() => playHoverSound()}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/80 hover:bg-[#f59e0b] hover:text-black text-white border border-white/30 flex items-center justify-center transition-all backdrop-blur-md shadow-2xl cursor-pointer hover:scale-105 active:scale-95 group"
                      title="Next Design"
                    >
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </>
                )}
              </div>

              {/* 
                ========================================================================
                BOTTOM CONTROLS (Exact Replica of Reference):
                - Circular (<) (>) buttons side by side
                - Horizontal progress bar
                - Number counter on the right (05 / 38)
                ========================================================================
              */}
              <div className="relative z-20 shrink-0 mt-auto flex items-center justify-between border-t border-white/10 pt-4">
                {/* Left: Circular Arrow Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrevCard}
                    onMouseEnter={() => playHoverSound()}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/35 hover:border-[#f59e0b] bg-black/50 hover:bg-[#f59e0b] hover:text-black text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-md active:scale-95 group"
                    title="Previous Design"
                  >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextCard}
                    onMouseEnter={() => playHoverSound()}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/35 hover:border-[#f59e0b] bg-black/50 hover:bg-[#f59e0b] hover:text-black text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-md active:scale-95 group"
                    title="Next Design"
                  >
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <span className="hidden sm:inline font-mono text-xs text-white/60 tracking-wider ml-2">
                    {isPortraitActive ? "PORTRAIT POSTER ADAPTED • ZERO CROPPING" : "LANDSCAPE VIEW • FULL VIEW ADAPTED"}
                  </span>
                </div>

                {/* Middle: Long Horizontal Progress Line */}
                <div className="flex-1 max-w-xs sm:max-w-md mx-6 hidden sm:block">
                  <div className="w-full h-[2.5px] bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#f59e0b] sm:bg-[#fbbf24] transition-all duration-300 shadow-[0_0_10px_#f59e0b]"
                      style={{ width: `${sliderProgress}%` }}
                    />
                  </div>
                </div>

                {/* Right: Big Bold Condensed Number */}
                <div className="text-4xl sm:text-5xl font-grotesk font-black text-white tracking-tighter">
                  {String(activeCardIndex + 1).padStart(2, "0")}
                </div>
              </div>

            </div>

            {/* 
              ===========================================================================
              ALL 33 DESIGNS VISIBLE - FULL-WIDTH EDGE-TO-EDGE (SAGAD SA KALIWA AT KANAN) • 5 PER LAYER
              ===========================================================================
            */}
            <div className="relative w-full px-4 sm:px-8 lg:px-14 xl:px-20 space-y-8 pt-12 border-t border-white/10">
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-mono text-xs tracking-widest text-coreCyan uppercase font-semibold">
                    // COMPLETE DESIGN ARCHIVE ({ALL_CREATIVE_GRAPHICS.length} DESIGNS • 5 PER LAYER)
                  </span>
                  <h4 className="font-grotesk text-2xl sm:text-3xl text-white font-light">
                    Browse All Graphic Assets & Thumbnails
                  </h4>
                </div>

                {/* Filter Pills with dynamic counts */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
                  {[
                    { label: `ALL (${ALL_CREATIVE_GRAPHICS.length})`, val: "ALL" },
                    { label: `INSTAGRAM CAROUSELS (${ALL_CREATIVE_GRAPHICS.filter(i => i.category.includes("Carousel")).length})`, val: "CAROUSELS" },
                    { label: `REAL ESTATE & FLYERS (${ALL_CREATIVE_GRAPHICS.filter(i => i.category.includes("Flyer") || i.category.includes("Editorial") || i.category.includes("Real Estate")).length})`, val: "FLYERS" },
                    { label: `YOUTUBE THUMBNAILS (${ALL_CREATIVE_GRAPHICS.filter(i => i.category.includes("Thumbnail")).length})`, val: "THUMBNAILS" },
                    { label: `BRAND IDENTITY & POSTERS (${ALL_CREATIVE_GRAPHICS.filter(i => i.category.includes("Brand") || i.category.includes("Poster")).length})`, val: "BRANDING" },
                    { label: `SOCIAL ADS (${ALL_CREATIVE_GRAPHICS.filter(i => i.category.includes("Ad") || i.category.includes("Graphic")).length})`, val: "ADS" },
                  ].map((f) => (
                    <button
                      key={f.val}
                      type="button"
                      onClick={() => {
                        playSelectSound();
                        setGraphicCategoryFilter(f.val);
                      }}
                      className={`px-4 py-2 rounded-full border transition-all cursor-pointer shrink-0 ${
                        graphicCategoryFilter === f.val
                          ? "bg-coreCyan text-black border-coreCyan font-semibold shadow-[0_0_15px_rgba(77,242,255,0.4)]"
                          : "bg-white/[0.04] text-zinc-400 border-white/10 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Edge-to-Edge Grid (5 per layer) with Original Full-Size Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-5 sm:gap-6">
                {filteredGraphics.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      playSelectSound();
                      setLightboxGraphic(item);
                    }}
                    onMouseEnter={() => playHoverSound()}
                    className="group relative rounded-2xl overflow-hidden border border-white/15 bg-[#090c15]/95 hover:border-coreCyan/70 transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.8)] hover:-translate-y-1.5 flex flex-col cursor-pointer"
                  >
                    {/* Image Container with Crisp Clear 100% Uncropped Artwork */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#05070e] p-2.5 sm:p-3 flex items-center justify-center border-b border-white/10">
                      {/* Ambient blur backdrop for aesthetic framing */}
                      <Image
                        src={item.imageSrc}
                        alt=""
                        fill
                        className="object-cover scale-125 filter blur-xl opacity-20 pointer-events-none"
                      />
                      
                      {/* 100% Fitted Sharp Image - ZERO CROPPING */}
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                          src={item.imageSrc}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                          className="object-contain group-hover:scale-[1.03] transition-transform duration-500 drop-shadow-xl"
                        />
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-2.5 left-2.5 font-mono text-[9px] px-2.5 py-1 rounded-full bg-black/85 border border-white/20 backdrop-blur-md text-coreCyan shadow-md">
                        {item.category}
                      </div>

                      {/* Expand Icon */}
                      <div className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-black/80 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-coreCyan shadow-lg">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Card Info - Clean Info Below Artwork */}
                    <div className="p-3.5 sm:p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h4 className="font-grotesk text-sm sm:text-base text-white font-medium group-hover:text-coreCyan transition-colors line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-zinc-400 text-xs font-sans leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-2 border-t border-white/10">
                        {item.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="font-mono text-[9px] px-2 py-0.5 rounded bg-white/[0.04] text-zinc-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </section>
        )}

        {/* ========================================================================= */}
        {/* 3. BOTTOM MULTIMEDIA & SMM SHOWCASE BANNER WITH DRIVE LINK & METRICS */}
        {/* ========================================================================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <section className="relative bg-[#090c15]/95 backdrop-blur-3xl border border-white/15 rounded-2xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="font-mono text-xs tracking-widest text-coreCyan uppercase font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-coreCyan" />
                  // MULTIMEDIA & SMM SHOWCASE
                </span>
                <h2 className="font-grotesk text-3xl sm:text-4xl text-white font-light tracking-wide">
                  Video Editing, Thumbnails & Social Media Content
                </h2>
                <p className="text-zinc-300 text-sm sm:text-base max-w-3xl leading-relaxed font-sans">
                  Professional creative assets designed for high viewer retention, authority personal branding, and direct-response conversions. Featuring commercial cuts, talking heads, real estate property reels, and high-CTR YouTube covers.
                </p>
              </div>

              {/* Direct Google Drive Archive Link Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <a
                  href={googleDriveFolderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSelectSound()}
                  onMouseEnter={() => playHoverSound()}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-coreBlue/80 to-coreCyan/80 hover:from-coreBlue hover:to-coreCyan text-black font-mono text-xs sm:text-sm font-semibold tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(77,242,255,0.4)] transition-all cursor-pointer"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>OPEN GOOGLE DRIVE ARCHIVE</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    setIsHireOpen(true);
                  }}
                  onMouseEnter={() => playHoverSound()}
                  className="px-5 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/20 hover:border-coreCyan text-white font-mono text-xs sm:text-sm font-medium tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>HIRE FOR CREATIVES</span>
                  <ChevronRight className="w-3.5 h-3.5 text-coreCyan" />
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar - 100% Dynamic from Collection Data */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 font-mono">
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl text-white font-light tracking-wider font-grotesk">
                  {CREATIVE_VIDEOS.length}
                </div>
                <div className="text-xs text-zinc-400 uppercase tracking-widest">Video Projects</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl text-coreCyan font-light tracking-wider font-grotesk">
                  {ALL_CREATIVE_GRAPHICS.length}
                </div>
                <div className="text-xs text-zinc-400 uppercase tracking-widest">Thumbnails & Graphics</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl text-white font-light tracking-wider font-grotesk">
                  {realEstateAndBrandsCount}
                </div>
                <div className="text-xs text-zinc-400 uppercase tracking-widest">Real Estate & Brands</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl text-emerald-400 font-light tracking-wider font-grotesk">100%</div>
                <div className="text-xs text-zinc-400 uppercase tracking-widest">On-Time Delivery</div>
              </div>
            </div>
          </section>
        </div>

      </main>

      {/* ========================================================================= */}
      {/* 4. LIGHTBOX MODAL FOR FULL-RES GRAPHICS */}
      {/* ========================================================================= */}
      {lightboxGraphic && (
        <div
          onClick={() => setLightboxGraphic(null)}
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200 select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full bg-[#0a0d16] border border-white/20 rounded-2xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col max-h-[92vh]"
          >
            {/* Modal Top Bar */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-[#111624]">
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] text-coreCyan tracking-widest uppercase">
                  {lightboxGraphic.category} // {lightboxGraphic.aspectRatio}
                </span>
                <h3 className="font-grotesk text-lg sm:text-xl text-white font-medium">
                  {lightboxGraphic.title}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    setIsHireOpen(true);
                  }}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-coreCyan/20 hover:bg-coreCyan text-coreCyan hover:text-black border border-coreCyan/40 font-mono text-xs transition-all cursor-pointer"
                >
                  <span>HIRE FOR THIS STYLE</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    setLightboxGraphic(null);
                  }}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5 text-coreCyan" />
                </button>
              </div>
            </div>

            {/* Modal Body: Image */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className={`relative w-full rounded-xl overflow-hidden bg-[#05070e] border border-white/10 flex items-center justify-center p-3 ${
                lightboxGraphic.isPortrait
                  ? "h-[45vh] sm:h-[66vh] max-w-lg aspect-[9/16] sm:aspect-[2/3] mx-auto"
                  : "aspect-video max-w-4xl mx-auto w-full max-h-[50vh] sm:max-h-[66vh]"
              }`}>
                {/* Ambient glow */}
                <Image
                  src={lightboxGraphic.imageSrc}
                  alt=""
                  fill
                  className="object-cover scale-125 filter blur-xl opacity-20 pointer-events-none"
                />
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={lightboxGraphic.imageSrc}
                    alt={lightboxGraphic.title}
                    fill
                    priority
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10">
                <h4 className="font-mono text-xs text-coreCyan tracking-widest uppercase font-semibold">
                  // ABOUT THIS ASSET ({lightboxGraphic.dimensions})
                </h4>
                <p className="text-zinc-300 text-sm font-sans leading-relaxed">
                  {lightboxGraphic.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {lightboxGraphic.tags.map((t, idx) => (
                    <span key={idx} className="font-mono text-[10px] px-2.5 py-0.5 rounded bg-white/10 text-white">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#0d101a] border-t border-white/10 flex items-center justify-between font-mono text-xs">
              <span className="text-zinc-500 text-[11px]">JAYLO LUDOVICE // CREATIVE DESIGN PORTFOLIO</span>
              <button
                type="button"
                onClick={() => setLightboxGraphic(null)}
                className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              >
                CLOSE [ESC]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hire Modal */}
      {/* Expanded Theater Video Modal */}
      {theaterVideo && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200 select-none"
          onClick={() => setTheaterVideo(null)}
        >
          <div 
            className="relative w-full max-w-5xl bg-[#090c15] rounded-3xl border border-white/20 overflow-hidden shadow-[0_0_90px_rgba(77,242,255,0.25)] flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 bg-[#0f1422] border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-coreCyan animate-pulse" />
                <span className="font-grotesk font-semibold text-white text-sm sm:text-base uppercase tracking-wider">
                  {theaterVideo.title}
                </span>
                <span className="hidden sm:inline font-mono text-xs text-coreCyan bg-coreCyan/10 border border-coreCyan/30 px-2.5 py-0.5 rounded-full">
                  {theaterVideo.category}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setTheaterVideo(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5 text-coreCyan" />
              </button>
            </div>

            {/* Video Stage - Fits both Vertical Reels (9:16) and Landscape (16:9) */}
            <div className={`relative w-full bg-black flex items-center justify-center ${
              theaterVideo.isPortrait 
                ? "aspect-[9/16] max-h-[58vh] sm:max-h-[72vh] max-w-[270px] sm:max-w-sm mx-auto my-2" 
                : "aspect-video"
            }`}>
              {theaterVideo.videoSrc ? (
                <video
                  src={theaterVideo.videoSrc}
                  autoPlay
                  controls
                  loop
                  onLoadedMetadata={(e) => {
                    e.currentTarget.volume = 0.3;
                  }}
                  className="w-full h-full object-contain"
                />
              ) : (
                <iframe
                  src={`https://drive.google.com/file/d/${theaterVideo.driveId}/preview`}
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen"
                  title={theaterVideo.title}
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-[#0f1422] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
              <p className="text-zinc-300 font-sans text-xs sm:text-sm max-w-2xl">
                {theaterVideo.description}
              </p>
              <a
                href={`https://drive.google.com/file/d/${theaterVideo.driveId}/view`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-coreCyan text-black font-semibold tracking-wider flex items-center gap-2 shrink-0 hover:bg-white transition-all cursor-pointer"
              >
                <span>OPEN MASTER ON DRIVE</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      <HireModal
        isOpen={isHireOpen}
        onClose={() => setIsHireOpen(false)}
      />
    </div>
  );
}

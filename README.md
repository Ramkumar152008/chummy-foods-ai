# Chummy Foods AI Kitchen & Heritage South Indian Foods

Production-ready, brand-matched Next.js (App Router, Tailwind CSS, Google Gemini) shopping and meal-planning web application built for **[Chummy Foods](https://chummyfoods.com)**.

![Chummy Foods Brand Banner](https://chummyfoods.com/cdn/shop/files/Orange_White_Modern_Natural_Honey_Promotion_Banner.jpg?v=1728541945&width=3840)

---

## 🌟 Key Features

### 1. 🌾 Chummy Kitchen AI (7-Day Heritage Meal Planner)
* **Tailored Health Regimens:**
  * ☀️ **Daily Family Breakfast** (தினசரி குடும்ப காலை உணவு)
  * 🩺 **Diabetic Friendly** (சர்க்கரை நோய் கட்டுப்பாட்டு உணவு - Low GI)
  * 🏃 **Weight Loss** (உடல் எடை குறைப்பு உணவு - High Fiber)
  * 🎒 **Kids Tiffin** (குழந்தைகள் டிபன் - Maida-Free)
  * 💪 **High Protein** (அதிக புரத உணவு - Plant Protein)
* **Family Size Customization:** 1–2, 3–4, and 5+ members.
* **Structured Gemini Output:** Uses `@google/genai` and Gemini with strict JSON schema definitions for reliable 7-day schedules, culinary preparation tips, and nutritional insights.
* **1-Click Shopify Permacart Checkout:** Instantly wires the recommended bundle into Chummy Foods' live checkout permalink:
  ```
  https://chummyfoods.com/cart/{variantId1}:1,{variantId2}:1
  ```

### 2. 🚚 Live Free Delivery Progress Bar (₹750 Threshold) & Smart Upsells
* **Store-Policy Matched:** Real-time progress tracker towards Chummy Foods' **₹750 Free Delivery** policy.
* **Smart Upsell Engine:** Intelligently suggests complementary real mixes (like Idly Dosa Podi or Instant Sambar) to bridge the deficit and unlock free delivery.

### 3. 💬 Tamil, Tanglish & English AI Recipe & Shopping Chatbot
* **Docked Interactive Assistant:** Responds in the exact language the user communicates:
  * **Tamil Script (தமிழ்):** e.g., *"ராகி தோசை எப்படி செய்வது?"*
  * **Tanglish:** e.g., *"Adai dosa epdi crispy-ah panradhu?"*
  * **English:** e.g., *"What breakfast mixes are high in plant protein?"*
* **Clickable Product Cards:** In-chat cards with real images, pricing, and 1-click cart insertion.

### 4. 🛒 Strict Real-Product Catalog Integration
* Sourced directly from Chummy Foods' live catalog (`chummy_products.json`).
* Safe parser in `lib/catalog.js` strips HTML, extracts images, handles variants, and links to real Shopify cart URLs with zero hallucinations.

---

## 🎨 Brand Design System
* **Brand Yellow:** `#FFBD3C` / `#F0A71C` (Signature turmeric gold)
* **Deep Plum:** `#2E2A39` (Primary typography & headers)
* **Heritage Berry / Maroon:** `#9B046F` (Traditional South Indian accents & badges)
* **Warm Canvas Cream:** `#FDFBF7` (Full-bleed heritage backdrop)
* **Typography:** `DM Sans` (Google Fonts) matching the live brand storefront.

---

## 🚀 Quick Start

### Prerequisites
* Node.js v18+ (tested on Node v24)
* npm v9+

### 1. Clone the repository
```bash
git clone https://github.com/Ramkumar152008/chummy-foods-ai.git
cd chummy-foods-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy `.env.example` to `.env.local` and add your Google Gemini API key:
```bash
cp .env.example .env.local
```
Edit `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run development or production server
Development server:
```bash
npm run dev
```

Production build & start:
```bash
npm run build
npm start
```
Visit **`http://localhost:3000`** in your browser.

---

## 📁 Project Structure

```
chummy-ai/
├── app/
│   ├── api/
│   │   ├── chat/route.js          # Multi-lingual AI chat endpoint
│   │   ├── meal-planner/route.js   # 7-Day meal planner endpoint
│   │   └── products/route.js       # Live catalog search & filter endpoint
│   ├── globals.css                # Tailwind utilities & Google Fonts DM Sans
│   ├── layout.js                  # Root layout with brand metadata & font
│   └── page.js                    # Full-bleed responsive homepage
├── components/
│   ├── CartDrawer.jsx             # Slide-out cart with ₹750 free shipping progress
│   ├── ChatAssistant.jsx          # Docked Tamil/Tanglish/English AI chef
│   ├── Footer.jsx                 # Heritage footer & trust ribbons
│   ├── Hero.jsx                   # Grand heritage banner & showcase card
│   ├── MealPlanner.jsx            # Interactive 7-Day studio & bundle builder
│   ├── Navbar.jsx                 # Top announcement ribbon & responsive header
│   └── ProductGrid.jsx            # 20 live product catalog cards with quick view
├── lib/
│   ├── catalog.js                 # Real product pipeline & Shopify permalink builders
│   └── gemini.js                  # Gemini Gen AI SDK client with JSON schema
├── chummy_products.json           # Live Shopify product catalog JSON
├── .env.example                   # Safe environment template
├── .gitignore                     # Git ignore rules (.env.local & node_modules protected)
└── package.json                   # Dependencies: @google/genai, lucide-react, next, tailwindcss
```

---

## 🔒 Security
* `.env.local` and secret keys are strictly excluded from version control via `.gitignore`.
* A safe `.env.example` template is provided for deployment.

---

© 2026 Chummy Foods. Built with Next.js App Router, Tailwind CSS, and Google Gemini AI.

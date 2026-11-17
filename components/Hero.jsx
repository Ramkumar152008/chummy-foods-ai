'use client';

import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Leaf, ChefHat, CheckCircle2 } from 'lucide-react';

export default function Hero({ onOpenChat }) {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FDF9F0] to-chummy-cream border-b border-amber-900/10 py-12 md:py-20 lg:py-24">
      {/* Subtle South Indian traditional decorative radial background */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-chummy-yellow/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-chummy-maroon/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heritage Storytelling & AI Hooks */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Heritage Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs sm:text-sm font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
              <span>South Indian Heritage Food Meets Modern Kitchen AI</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-chummy-plum leading-[1.12] tracking-tight">
              Pure Heritage Flavors.{' '}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900">
                Personalized 7-Day AI Meal Plans.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Experience grandmother’s traditional recipes with zero preservatives, stone-ground millets, and organic red rice. Let our <strong>Chummy Kitchen AI</strong> build your family’s customized 7-day breakfast routine—complete with cooking tips and 1-click Shopify cart delivery.
            </p>

            {/* Quick Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs sm:text-sm font-medium text-chummy-plum">
              <div className="flex items-center gap-2 bg-white/80 border border-amber-200/60 p-2.5 rounded-xl shadow-xs">
                <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Preservatives</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 border border-amber-200/60 p-2.5 rounded-xl shadow-xs">
                <Heart className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Diabetic & Kid Friendly</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 border border-amber-200/60 p-2.5 rounded-xl shadow-xs col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Free Shipping ≥ ₹750</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#ai-meal-planner"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-chummy-yellow hover:bg-chummy-yellowHover text-chummy-plum font-bold text-base shadow-md hover:shadow-lg transition-all duration-200 group"
              >
                <Sparkles className="w-5 h-5 text-amber-900 fill-amber-700 group-hover:rotate-12 transition-transform" />
                <span>Launch AI Meal Planner</span>
                <ArrowRight className="w-4 h-4 text-chummy-plum group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#product-catalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white hover:bg-stone-50 text-chummy-plum font-semibold text-base border border-stone-300 shadow-xs transition-colors"
              >
                <span>Browse 20 Real Mixes</span>
              </a>

              <button
                onClick={onOpenChat}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-chummy-maroon/10 hover:bg-chummy-maroon/20 text-chummy-maroon font-bold text-sm border border-chummy-maroon/20 transition-colors"
              >
                <ChefHat className="w-4 h-4" />
                <span>AI Chef (தமிழ் / Tanglish)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Product Showcase Carousel Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Highlight Card */}
              <div className="relative bg-white rounded-3xl p-6 shadow-chummy-lg border border-amber-200/80 overflow-hidden">
                <div className="absolute top-0 right-0 bg-chummy-maroon text-white text-[11px] font-bold px-4 py-1.5 rounded-bl-2xl tracking-wide uppercase">
                  Heritage South Indian
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 font-bold">
                    🌾
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-chummy-plum">Traditional Grains & Millets</h2>
                    <p className="text-xs text-stone-500">Naturally ground with unadulterated goodness</p>
                  </div>
                </div>

                {/* Hero Showcase Image */}
                <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-amber-50/50 flex items-center justify-center border border-amber-100 group">
                  <img
                    src="https://cdn.shopify.com/s/files/1/0699/4962/0453/files/Health_mix_front.png?v=1728638848"
                    alt="Chummy Foods Health Mix"
                    className="h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Floating floating badge 1 */}
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200 shadow-md text-xs font-bold text-chummy-plum flex items-center gap-1.5">
                    <span className="text-amber-500">★</span> Health Mix 250g • ₹150
                  </div>

                  {/* Floating badge 2 */}
                  <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
                    20+ Sprouted Grains
                  </div>
                </div>

                {/* Mini real product thumbnails from chummy_products.json */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-stone-100">
                  <div className="flex flex-col items-center p-2 rounded-xl bg-amber-50/60 border border-amber-100 text-center">
                    <img
                      src="https://cdn.shopify.com/s/files/1/0699/4962/0453/files/REdPuttu.png?v=1761117959"
                      alt="Red Rice Puttu"
                      className="w-10 h-10 object-contain mb-1"
                    />
                    <span className="text-[11px] font-bold text-chummy-plum truncate w-full">Red Rice Puttu</span>
                    <span className="text-[10px] text-amber-800 font-semibold">₹100</span>
                  </div>

                  <div className="flex flex-col items-center p-2 rounded-xl bg-amber-50/60 border border-amber-100 text-center">
                    <img
                      src="https://cdn.shopify.com/s/files/1/0699/4962/0453/files/Adai_dosa_Front.png?v=1728638461"
                      alt="Adai Dosa Mix"
                      className="w-10 h-10 object-contain mb-1"
                    />
                    <span className="text-[11px] font-bold text-chummy-plum truncate w-full">Adai Dosa Mix</span>
                    <span className="text-[10px] text-amber-800 font-semibold">₹95</span>
                  </div>

                  <div className="flex flex-col items-center p-2 rounded-xl bg-amber-50/60 border border-amber-100 text-center">
                    <img
                      src="https://cdn.shopify.com/s/files/1/0699/4962/0453/files/Combo-1.jpg?v=1734543700"
                      alt="Breakfast Combo"
                      className="w-10 h-10 object-contain mb-1"
                    />
                    <span className="text-[11px] font-bold text-chummy-plum truncate w-full">Breakfast Combo</span>
                    <span className="text-[10px] text-amber-800 font-semibold">₹435</span>
                  </div>
                </div>

                {/* Cart link notice */}
                <div className="mt-4 pt-3 flex items-center justify-between text-xs text-stone-500">
                  <span>⚡ Instant Shopify permalink checkout</span>
                  <span className="font-bold text-chummy-maroon">Free delivery &gt; ₹750</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}


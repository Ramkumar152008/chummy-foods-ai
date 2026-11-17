'use client';

import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Heart, Sparkles, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-chummy-plum text-white border-t border-stone-800">
      {/* Trust Badges Ribbon */}
      <div className="w-full bg-[#24202D] border-b border-white/5 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-chummy-yellow/15 flex items-center justify-center text-chummy-yellow shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Free Delivery &gt; ₹750</h3>
              <p className="text-xs text-stone-400">Doorstep delivery across all Indian pin codes</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-chummy-yellow/15 flex items-center justify-center text-chummy-yellow shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Zero Preservatives</h3>
              <p className="text-xs text-stone-400">No chemicals, artificial colors or adulterants</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-chummy-yellow/15 flex items-center justify-center text-chummy-yellow shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">AI Kitchen Planner</h3>
              <p className="text-xs text-stone-400">7-Day customized routines with Gemini 2.5</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-chummy-yellow/15 flex items-center justify-center text-chummy-yellow shrink-0">
              <Heart className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">South Indian Heritage</h3>
              <p className="text-xs text-stone-400">Traditional stone-ground recipe authenticity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="w-44 h-12 flex items-center">
              <img
                src="https://chummyfoods.com/cdn/shop/files/logo-view-2.png?v=1724573298&width=1100"
                alt="Chummy Foods"
                className="w-full h-full object-contain brightness-110"
              />
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-sm">
              Chummy Foods brings the uncompromised authenticity of traditional South Indian breakfasts directly to your kitchen. From high-fiber finger millets and organic red rice to spicy Chettinad podis and 5-minute hakka noodles.
            </p>
            <div className="text-xs text-chummy-yellow font-medium">
              🌿 100% Vegetarian • Pure Ingredients • Made in India
            </div>
          </div>

          {/* Quick Categories */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">
              Food Mixes
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li><a href="#product-catalog" className="hover:text-chummy-yellow transition-colors">Idli & Dosa Mix</a></li>
              <li><a href="#product-catalog" className="hover:text-chummy-yellow transition-colors">Ragi Dosa Mix</a></li>
              <li><a href="#product-catalog" className="hover:text-chummy-yellow transition-colors">Red Rice Puttu</a></li>
              <li><a href="#product-catalog" className="hover:text-chummy-yellow transition-colors">Multimillet Mix</a></li>
              <li><a href="#product-catalog" className="hover:text-chummy-yellow transition-colors">Adai Dosa Mix</a></li>
            </ul>
          </div>

          {/* AI Features & Combos */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">
              AI Kitchen
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li><a href="#ai-meal-planner" className="hover:text-chummy-yellow transition-colors">7-Day Meal Planner</a></li>
              <li><a href="#ai-meal-planner" className="hover:text-chummy-yellow transition-colors">Diabetic Friendly Plan</a></li>
              <li><a href="#ai-meal-planner" className="hover:text-chummy-yellow transition-colors">Weight Loss Schedule</a></li>
              <li><a href="#ai-meal-planner" className="hover:text-chummy-yellow transition-colors">Kids Tiffin Combos</a></li>
              <li><a href="#ai-meal-planner" className="hover:text-chummy-yellow transition-colors">Free Delivery (≥ ₹750)</a></li>
            </ul>
          </div>

          {/* Real Shopify Direct Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">
              Store & Orders
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Every order in this application routes directly into Chummy Foods’ live Shopify checkout with real variant IDs and live shipping calculation.
            </p>
            <div className="pt-2">
              <a
                href="https://chummyfoods.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-chummy-yellow hover:underline"
              >
                <span>Visit Official Store (chummyfoods.com)</span>
              </a>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <div>
            © {new Date().getFullYear()} Chummy Foods. Built with Next.js App Router, Tailwind CSS & Google Gemini 2.5 Flash.
          </div>
          <div className="flex items-center gap-4">
            <span>Powered by Gemini 2.5 Flash</span>
            <span>•</span>
            <span>Shopify Integrated</span>
          </div>
        </div>
      </div>
    </footer>
  );
}


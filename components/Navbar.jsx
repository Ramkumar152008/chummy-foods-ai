'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Sparkles, Menu, X, ShieldCheck, HeartPulse, ChevronRight } from 'lucide-react';

export default function Navbar({ cartCount = 0, cartTotal = 0, onOpenCart }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const freeDeliveryThreshold = 750;
  const isFreeDelivery = cartTotal >= freeDeliveryThreshold;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-sm transition-all">
      {/* Top Heritage Announcement Banner */}
      <div className="w-full bg-chummy-plum text-white text-xs sm:text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-chummy-yellow animate-pulse"></span>
            <span className="font-medium tracking-wide">
              100% Preservative-Free South Indian Heritage Foods
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="hidden md:inline-flex items-center gap-1.5 text-stone-300">
              <ShieldCheck className="w-3.5 h-3.5 text-chummy-yellow" /> Traditional Stone-Ground Millets
            </span>
            <span className="bg-chummy-maroon px-2.5 py-0.5 rounded-full text-white font-semibold flex items-center gap-1 shadow-sm">
              🚚 FREE Delivery above ₹750!
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-20">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-40 sm:w-48 h-12 flex items-center">
              <img
                src="https://chummyfoods.com/cdn/shop/files/logo-view.png?v=1724484357&width=600"
                alt="Chummy Foods Logo"
                className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-200"
              />
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-chummy-plum">
            <a
              href="#ai-meal-planner"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-chummy-yellow/15 text-chummy-plum hover:bg-chummy-yellow/25 transition-colors font-semibold"
            >
              <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>Chummy Kitchen AI</span>
              <span className="bg-chummy-maroon text-white text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
                7-Day Plan
              </span>
            </a>
            <a href="#product-catalog" className="hover:text-amber-600 transition-colors">
              Live Catalog (20)
            </a>
            <a href="#millets-health" className="hover:text-amber-600 transition-colors">
              Millets & Health Mix
            </a>
            <a href="#noodles" className="hover:text-amber-600 transition-colors">
              Hakka Noodles
            </a>
            <a href="#combos" className="hover:text-amber-600 transition-colors">
              Breakfast Combos
            </a>
          </nav>

          {/* Actions & Cart Trigger */}
          <div className="flex items-center gap-3">
            {/* Quick Delivery Tag */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
                Shopify Cart
              </span>
              <span className="text-xs font-bold text-chummy-plum">
                {cartTotal > 0 ? `₹${cartTotal.toFixed(0)}` : 'Empty'}
                {isFreeDelivery && (
                  <span className="text-emerald-600 ml-1 text-[11px]">✓ Free Delivery</span>
                )}
              </span>
            </div>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-chummy-yellow hover:bg-chummy-yellowHover text-chummy-plum font-semibold shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2 group"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5 text-chummy-plum group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline text-xs font-bold uppercase tracking-wider">
                Cart
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-chummy-maroon text-white text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-chummy-plum hover:bg-stone-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full bg-white border-b border-stone-200 px-4 py-4 space-y-3 animate-fade-in shadow-xl">
          <a
            href="#ai-meal-planner"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-xl bg-chummy-yellow/15 text-chummy-plum font-bold"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Chummy Kitchen AI (7-Day Plan)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </a>
          <a
            href="#product-catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-stone-700 hover:text-amber-600 font-medium"
          >
            All Products (20 Real Mixes)
          </a>
          <a
            href="#millets-health"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-stone-700 hover:text-amber-600 font-medium"
          >
            Millets & Health Mix
          </a>
          <a
            href="#noodles"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-stone-700 hover:text-amber-600 font-medium"
          >
            Healthy Hakka Noodles
          </a>
          <a
            href="#combos"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-stone-700 hover:text-amber-600 font-medium"
          >
            Breakfast Combos
          </a>
          <div className="pt-2 border-t border-stone-100">
            <p className="text-xs text-stone-500 text-center">
              🚚 Orders above ₹750 qualify for Free Shipping across India!
            </p>
          </div>
        </div>
      )}
    </header>
  );
}


'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
  Users,
  Check,
  Plus,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Flame,
  Clock,
  Heart,
  ShieldCheck,
  AlertCircle,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { buildCartUrl } from '@/lib/catalog';

const HEALTH_GOALS = [
  {
    id: 'Daily Family Breakfast',
    name: 'Daily Family Breakfast',
    tamil: 'தினசரி குடும்ப காலை உணவு',
    description: 'Wholesome variety of fluffy idlis, crispy dosas, and steamed puttu for the whole family.',
    icon: '☀️',
    badge: 'Popular',
  },
  {
    id: 'Diabetic Friendly',
    name: 'Diabetic Friendly',
    tamil: 'சர்க்கரை நோய் கட்டுப்பாட்டு உணவு',
    description: 'Low-GI finger millets, red rice, and multi-millet mixes that stabilize morning glucose.',
    icon: '🩺',
    badge: 'Low GI',
  },
  {
    id: 'Weight Loss',
    name: 'Weight Loss',
    tamil: 'உடல் எடை குறைப்பு உணவு',
    description: 'High-fiber, high-satiety traditional grains that curb cravings and boost metabolism.',
    icon: '🏃',
    badge: 'High Fiber',
  },
  {
    id: 'Kids Tiffin',
    name: 'Kids Tiffin',
    tamil: 'குழந்தைகள் டிபன்',
    description: 'Crunchy rava dosas, veggie noodles, and sweet puttu boxes without refined flour.',
    icon: '🎒',
    badge: 'Maida-Free',
  },
  {
    id: 'High Protein',
    name: 'High Protein',
    tamil: 'அதிக புரத உணவு',
    description: 'Dense multi-lentil adai, medu vada, and 20+ sprouted grains health mix for muscle fuel.',
    icon: '💪',
    badge: 'Plant Protein',
  },
];

const FAMILY_SIZES = [
  { id: '1-2', label: '1 - 2 Members', desc: 'Couple / Individual', multiplier: 1 },
  { id: '3-4', label: '3 - 4 Members', desc: 'Standard Family', multiplier: 1 },
  { id: '5+', label: '5+ Members', desc: 'Joint Family / Large', multiplier: 2 },
];

export default function MealPlanner({ onAddToCart }) {
  const [selectedGoal, setSelectedGoal] = useState('Daily Family Breakfast');
  const [selectedSize, setSelectedSize] = useState('3-4');
  const [loading, setLoading] = useState(false);
  const [planData, setPlanData] = useState(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Bundle customization state
  const [selectedPackIds, setSelectedPackIds] = useState(new Set());
  const [extraPacks, setExtraPacks] = useState([]);

  // Generate initial plan on mount
  useEffect(() => {
    fetchPlan('Daily Family Breakfast', '3-4');
  }, []);

  const fetchPlan = async (goal, size) => {
    setLoading(true);
    try {
      const res = await fetch('/api/meal-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, familySize: size }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setPlanData(data.data);
        const initialPackIds = new Set(data.data.recommendedProducts.map((p) => p.id));
        setSelectedPackIds(initialPackIds);
        setExtraPacks([]);
        setSelectedDayIndex(0);
      }
    } catch (err) {
      console.error('Error fetching plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    fetchPlan(selectedGoal, selectedSize);
  };

  // Toggle pack selection in bundle
  const togglePackSelection = (productId) => {
    const updated = new Set(selectedPackIds);
    if (updated.has(productId)) {
      if (updated.size > 1) {
        updated.delete(productId);
      }
    } else {
      updated.add(productId);
    }
    setSelectedPackIds(updated);
  };

  // Add upsell product to bundle
  const handleAddUpsell = (product) => {
    if (!product) return;
    if (!extraPacks.some((p) => p.id === product.id)) {
      setExtraPacks([...extraPacks, product]);
    }
    const updated = new Set(selectedPackIds);
    updated.add(product.id);
    setSelectedPackIds(updated);
  };

  // Calculate current bundle items & totals
  const allAvailablePacks = planData
    ? [...planData.recommendedProducts, ...extraPacks]
    : [];

  const activeBundlePacks = allAvailablePacks.filter((p) => selectedPackIds.has(p.id));
  const bundleSubtotal = activeBundlePacks.reduce((sum, p) => sum + (p.price || 0), 0);
  const freeDeliveryThreshold = 750;
  const isFreeDelivery = bundleSubtotal >= freeDeliveryThreshold;
  const deficit = Math.max(0, freeDeliveryThreshold - bundleSubtotal);
  const progressPercent = Math.min(100, Math.round((bundleSubtotal / freeDeliveryThreshold) * 100));

  // Build real Shopify permalink URL for all active bundle packs
  const bundleCartItems = activeBundlePacks.map((p) => ({
    variantId: p.variantId,
    quantity: 1,
  }));
  const dynamicBundleCartUrl = buildCartUrl(bundleCartItems);

  return (
    <section id="ai-meal-planner" className="w-full py-16 lg:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span>Chummy Kitchen AI Studio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-chummy-plum tracking-tight">
            7-Day Heritage South Indian Meal Planner
          </h2>
          <p className="text-base sm:text-lg text-stone-600">
            Powered by <strong>Gemini 2.5 Flash</strong> and tailored exclusively with Chummy Foods’ real 100% natural product catalog. Select your health goal below to plan your week.
          </p>
        </div>

        {/* Input Controls Card */}
        <div className="bg-[#FFFDF9] border border-amber-200/80 rounded-3xl p-6 sm:p-8 shadow-chummy mb-12">
          <form onSubmit={handleGenerate} className="space-y-8">
            
            {/* Step 1: Health Goal */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-bold uppercase tracking-wider text-chummy-plum flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-chummy-yellow text-chummy-plum flex items-center justify-center text-xs font-black">
                    1
                  </span>
                  <span>Select Family Health Goal</span>
                </label>
                <span className="text-xs text-stone-500 font-medium hidden sm:inline">
                  5 specialized South Indian wellness regimens
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {HEALTH_GOALS.map((goal) => {
                  const isSelected = selectedGoal === goal.id;
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`relative text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? 'bg-white border-amber-500 shadow-md ring-2 ring-amber-400/40'
                          : 'bg-white/60 border-stone-200 hover:border-amber-300 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-2xl">{goal.icon}</span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                            isSelected
                              ? 'bg-chummy-yellow text-chummy-plum'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {goal.badge}
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-sm text-chummy-plum">{goal.name}</div>
                        <div className="text-[11px] text-amber-800 font-medium mb-1.5">{goal.tamil}</div>
                        <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                          {goal.description}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="mt-2 pt-2 border-t border-amber-100 flex items-center gap-1 text-[11px] font-bold text-amber-700">
                          <Check className="w-3.5 h-3.5" /> Selected
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Family Size */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-bold uppercase tracking-wider text-chummy-plum flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-chummy-yellow text-chummy-plum flex items-center justify-center text-xs font-black">
                    2
                  </span>
                  <span>Select Family Size</span>
                </label>
                <span className="text-xs text-stone-500 font-medium hidden sm:inline">
                  Adjusts portion quantities & breakfast pack counts
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {FAMILY_SIZES.map((size) => {
                  const isSelected = selectedSize === size.id;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSize(size.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-white border-amber-500 shadow-md ring-2 ring-amber-400/40'
                          : 'bg-white/60 border-stone-200 hover:border-amber-300 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-chummy-plum">{size.label}</span>
                        <Users className={`w-4 h-4 ${isSelected ? 'text-amber-600' : 'text-stone-400'}`} />
                      </div>
                      <span className="text-xs text-stone-500">{size.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-amber-200/60">
              <div className="text-xs text-stone-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Hallucinations: Every meal links directly to Chummy Foods verified Shopify catalog</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-chummy-yellow hover:bg-chummy-yellowHover text-chummy-plum font-extrabold text-base shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-chummy-plum border-t-transparent rounded-full animate-spin" />
                    <span>Planning 7-Day Nutrition with Gemini 2.5...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-900 fill-amber-700" />
                    <span>Generate 7-Day Plan</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Loading Spinner Skeleton */}
        {loading && (
          <div className="w-full py-16 text-center space-y-4 bg-amber-50/50 rounded-3xl border border-amber-200 animate-pulse">
            <div className="w-12 h-12 mx-auto rounded-full bg-chummy-yellow/30 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-700 animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-chummy-plum">Calibrating South Indian Nutrition Schedule...</h3>
            <p className="text-sm text-stone-500 max-w-md mx-auto">
              Analyzing finger millets, red rice bran, lentil proteins, and authentic Chettinad prep secrets for your family.
            </p>
          </div>
        )}

        {/* Plan Output Presentation */}
        {!loading && planData && (
          <div className="space-y-10 animate-fade-in">
            
            {/* Plan Header Card */}
            <div className="bg-gradient-to-r from-chummy-plum via-[#383344] to-chummy-plum text-white rounded-3xl p-6 sm:p-8 shadow-chummy-lg">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-chummy-yellow text-chummy-plum text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      {planData.goal}
                    </span>
                    <span className="bg-white/10 text-stone-200 text-xs px-3 py-1 rounded-full">
                      Family: {planData.familySize} Members
                    </span>
                    {planData.isAiGenerated && (
                      <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-500/30">
                        <Sparkles className="w-3 h-3" /> Gemini 2.5 Flash Verified
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {planData.planTitle}
                  </h3>
                  <p className="text-stone-300 text-sm sm:text-base max-w-3xl leading-relaxed">
                    {planData.planOverview}
                  </p>
                </div>

                {/* Dietary Highlights Chips */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 lg:w-80 shrink-0 space-y-2">
                  <div className="text-xs uppercase tracking-wider font-bold text-chummy-yellow">
                    Weekly Highlights
                  </div>
                  <div className="space-y-1.5">
                    {(planData.dietaryHighlights || []).map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-stone-200">
                        <Check className="w-3.5 h-3.5 text-chummy-yellow shrink-0" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 7-Day Interactive Visual Schedule */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-chummy-plum flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-600" />
                    <span>7-Day Breakfast & Tiffin Schedule</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500">
                    Click any day tab to view authentic dish details, chef prep tips, and matching products.
                  </p>
                </div>

                {/* Day counter pill */}
                <div className="hidden sm:inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                  Day {selectedDayIndex + 1} of 7
                </div>
              </div>

              {/* Day Selector Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {planData.schedule.map((item, idx) => {
                  const isDaySelected = selectedDayIndex === idx;
                  const dayName = item.day.split(' ')[0] || `Day ${idx + 1}`;
                  const weekday = item.day.match(/\((.*?)\)/)?.[1] || '';
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDayIndex(idx)}
                      className={`px-4 py-3 rounded-2xl text-left shrink-0 transition-all border ${
                        isDaySelected
                          ? 'bg-chummy-yellow text-chummy-plum border-amber-500 shadow-md font-bold ring-2 ring-amber-400/30'
                          : 'bg-white text-stone-600 border-stone-200 hover:border-amber-300 hover:bg-amber-50/50'
                      }`}
                    >
                      <div className="text-xs uppercase tracking-wider font-semibold opacity-80">{dayName}</div>
                      <div className="text-sm font-extrabold">{weekday || `Day ${idx + 1}`}</div>
                    </button>
                  );
                })}
              </div>

              {/* Active Day Detail Spotlight Card */}
              {planData.schedule[selectedDayIndex] && (() => {
                const dayItem = planData.schedule[selectedDayIndex];
                const prod = dayItem.product;

                return (
                  <div className="bg-[#FFFDF9] border border-amber-200 rounded-3xl p-6 sm:p-8 shadow-chummy">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                      
                      {/* Left: Dish & Recipe Information */}
                      <div className="lg:col-span-7 space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                          <span className="px-2.5 py-1 rounded-full bg-amber-100">
                            {dayItem.day}
                          </span>
                          {dayItem.healthBenefit && (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                              🌱 {dayItem.healthBenefit}
                            </span>
                          )}
                        </div>

                        <h4 className="text-2xl sm:text-3xl font-extrabold text-chummy-plum leading-snug">
                          {dayItem.mealName}
                        </h4>

                        {/* Traditional Prep Tip */}
                        <div className="bg-white border border-amber-200/60 rounded-2xl p-4 space-y-1.5 shadow-xs">
                          <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                            <Flame className="w-4 h-4 text-amber-600" />
                            <span>Chef&apos;s Authentic Preparation Tip</span>
                          </div>
                          <p className="text-sm text-stone-700 leading-relaxed italic">
                            &ldquo;{dayItem.prepTip}&rdquo;
                          </p>
                        </div>

                        {/* Product Quick Info Box */}
                        <div className="pt-2 flex flex-wrap items-center gap-3">
                          <button
                            onClick={() => onAddToCart && onAddToCart(prod)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-chummy-plum hover:bg-stone-800 text-white font-bold text-xs shadow-sm transition-all"
                          >
                            <ShoppingBag className="w-4 h-4 text-chummy-yellow" />
                            <span>Add Single Pack (₹{prod?.price})</span>
                          </button>

                          <a
                            href={prod?.cartUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 underline underline-offset-4"
                          >
                            <span>Open Shopify Permacart</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                      {/* Right: Real Verified Product Card from chummy_products.json */}
                      <div className="lg:col-span-5">
                        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                            <span>Real Catalog Mix</span>
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">In Stock</span>
                          </div>

                          <div className="relative w-full h-44 rounded-xl overflow-hidden bg-stone-50 mb-3 flex items-center justify-center">
                            <img
                              src={prod?.image}
                              alt={prod?.title}
                              className="h-full object-contain p-2 hover:scale-105 transition-transform"
                            />
                            <div className="absolute top-2 right-2 bg-chummy-maroon text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              ₹{prod?.price}
                            </div>
                          </div>

                          <h5 className="font-bold text-chummy-plum text-base truncate mb-1">
                            {prod?.title}
                          </h5>
                          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-3">
                            {prod?.description}
                          </p>

                          <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                            <span className="text-stone-500">Variant ID: {prod?.variantId}</span>
                            <span className="font-bold text-amber-800">{prod?.category}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Recommended Pack List & Smart Free-Delivery Progress Bar */}
            <div className="bg-[#FFFDF9] border border-amber-300 rounded-3xl p-6 sm:p-8 shadow-chummy-lg space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/60 pb-6">
                <div>
                  <h3 className="text-2xl font-extrabold text-chummy-plum">
                    Recommended 7-Day Complete Pack List
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600">
                    Includes all authentic mixes needed to prepare the whole week&apos;s meals. Uncheck any you already have in your pantry.
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs uppercase tracking-wider text-stone-500 font-bold">Combo Total</div>
                  <div className="text-3xl font-black text-chummy-plum">₹{bundleSubtotal.toFixed(0)}</div>
                </div>
              </div>

              {/* Free Delivery Live Progress Bar (Unlocks at ₹750) */}
              <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-2 font-bold text-chummy-plum">
                    <Truck className={`w-5 h-5 ${isFreeDelivery ? 'text-emerald-600' : 'text-amber-600'}`} />
                    <span>Free Shipping Across India</span>
                    <span className="text-xs font-normal text-stone-500">(Threshold ₹750)</span>
                  </div>

                  <div className="font-extrabold">
                    {isFreeDelivery ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <Check className="w-4 h-4" /> 🎉 Unlocked! Free Delivery Applied
                      </span>
                    ) : (
                      <span className="text-amber-800">
                        Add <strong className="text-chummy-maroon font-black">₹{deficit.toFixed(0)}</strong> more to get FREE Delivery!
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar line */}
                <div className="w-full bg-stone-100 h-3.5 rounded-full overflow-hidden border border-stone-200/80">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      isFreeDelivery
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                        : 'bg-gradient-to-r from-amber-400 to-amber-600'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>Current: ₹{bundleSubtotal.toFixed(0)}</span>
                  <span>Target: ₹750</span>
                </div>
              </div>

              {/* Smart Cart & Free-Delivery Upsell Engine */}
              {!isFreeDelivery && planData.upsellItems && planData.upsellItems.length > 0 && (
                <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <h4 className="text-xs sm:text-sm font-extrabold text-amber-950 uppercase tracking-wide">
                        Smart Free-Delivery Upsell Picks
                      </h4>
                    </div>
                    <span className="text-xs text-stone-500">Complementary real products to cross ₹750</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {planData.upsellItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl p-3 border border-amber-200 flex items-center justify-between gap-3 shadow-xs hover:border-amber-400 transition-colors"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-10 h-10 object-contain shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-chummy-plum truncate">{item.title}</div>
                          <div className="text-xs font-extrabold text-amber-800">₹{item.price}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddUpsell(item)}
                          className="p-1.5 rounded-lg bg-chummy-yellow hover:bg-chummy-yellowHover text-chummy-plum font-bold text-xs shrink-0 flex items-center gap-1 shadow-xs"
                          title="Add to bundle to get Free Delivery"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pack List Grid with Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {allAvailablePacks.map((pack) => {
                  const isChecked = selectedPackIds.has(pack.id);
                  return (
                    <div
                      key={pack.id}
                      onClick={() => togglePackSelection(pack.id)}
                      className={`cursor-pointer p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                        isChecked
                          ? 'bg-white border-amber-400 shadow-sm'
                          : 'bg-stone-50 border-stone-200 opacity-60'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-chummy-yellow border-amber-600 text-chummy-plum'
                            : 'border-stone-400 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <img
                        src={pack.image}
                        alt={pack.title}
                        className="w-12 h-12 object-contain shrink-0"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-chummy-plum truncate">{pack.title}</div>
                        <div className="text-[11px] text-stone-500">{pack.category}</div>
                        <div className="text-xs font-extrabold text-amber-800">₹{pack.price}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add All Combo Packs to Cart Button directly wired to Shopify Cart Permalink */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-amber-200/60">
                <div className="text-xs text-stone-500">
                  Selected: <strong className="text-chummy-plum">{activeBundlePacks.length} packs</strong> • Total: <strong className="text-chummy-plum">₹{bundleSubtotal.toFixed(0)}</strong>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      activeBundlePacks.forEach((p) => onAddToCart && onAddToCart(p));
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-chummy-plum font-bold text-sm border border-stone-300 shadow-xs transition-colors"
                  >
                    Add All to App Cart
                  </button>

                  <a
                    href={dynamicBundleCartUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-chummy-yellow hover:bg-chummy-yellowHover text-chummy-plum font-black text-sm shadow-md hover:shadow-lg transition-all duration-200 group"
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-900 group-hover:scale-110 transition-transform" />
                    <span>Add All Combo Packs to Cart (Shopify)</span>
                    <ExternalLink className="w-4 h-4 text-chummy-plum" />
                  </a>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}


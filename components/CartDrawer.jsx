'use client';

import React from 'react';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ExternalLink,
  Truck,
  Check,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { buildCartUrl, getUpsellRecommendations } from '@/lib/catalog';

export default function CartDrawer({
  isOpen,
  onClose,
  items = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onAddToCart,
}) {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const totalCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const freeDeliveryThreshold = 750;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const deficit = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  // Upsell recommendations
  const currentItemIds = items.map((i) => i.id);
  const upsellItems = getUpsellRecommendations(currentItemIds, subtotal, freeDeliveryThreshold);

  // Direct Shopify permalink URL for all items in cart
  const shopifyCartUrl = buildCartUrl(
    items.map((i) => ({
      variantId: i.variantId,
      quantity: i.quantity || 1,
    }))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-[#FFFDF9]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-extrabold text-chummy-plum">
                Your Kitchen Cart ({totalCount})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Live Progress Bar */}
          <div className="p-4 bg-amber-50/60 border-b border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-chummy-plum">
                <Truck className={`w-4 h-4 ${isFreeDelivery ? 'text-emerald-600' : 'text-amber-600'}`} />
                <span>Free Delivery Progress</span>
              </span>
              <span>
                {isFreeDelivery ? (
                  <strong className="text-emerald-600">✓ Unlocked! (≥ ₹750)</strong>
                ) : (
                  <span className="text-amber-800">
                    Add <strong className="text-chummy-maroon">₹{deficit.toFixed(0)}</strong> for FREE Shipping
                  </span>
                )}
              </span>
            </div>

            {/* Progress line */}
            <div className="w-full bg-stone-200/80 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isFreeDelivery ? 'bg-emerald-600' : 'bg-chummy-yellow'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-base text-chummy-plum">Your cart is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Explore our 7-Day AI Meal Planner or pick from 20 authentic South Indian mixes!
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-stone-200 bg-[#FFFDF9]"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-14 h-14 object-contain bg-white rounded-xl p-1 border border-stone-100 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-chummy-plum truncate">{item.title}</h4>
                    <div className="text-xs font-black text-amber-800 mt-0.5">
                      ₹{(item.price * (item.quantity || 1)).toFixed(0)}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                          className="p-1 hover:bg-stone-100 text-stone-600 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-chummy-plum">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                          className="p-1 hover:bg-stone-100 text-stone-600 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-stone-400 hover:text-rose-600 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Smart Free-Delivery Upsell Carousel inside Cart */}
            {!isFreeDelivery && upsellItems.length > 0 && (
              <div className="mt-4 pt-4 border-t border-stone-200 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-900 uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Reach ₹750 for Free Shipping:</span>
                </div>

                <div className="space-y-2">
                  {upsellItems.slice(0, 2).map((up) => (
                    <div
                      key={up.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 border border-amber-200"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={up.image} alt={up.title} className="w-9 h-9 object-contain shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold text-chummy-plum truncate">{up.title}</div>
                          <div className="text-[11px] font-extrabold text-amber-800">₹{up.price}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => onAddToCart(up)}
                        className="px-2.5 py-1 rounded-lg bg-chummy-yellow hover:bg-chummy-yellowHover text-chummy-plum text-xs font-bold shrink-0 shadow-xs flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer & Shopify Permacart Checkout */}
          <div className="p-5 border-t border-stone-200 bg-white space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-stone-500">
                <span>Items Subtotal</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-xs text-stone-500">
                <span>Shipping</span>
                <span className={isFreeDelivery ? 'text-emerald-600 font-bold' : ''}>
                  {isFreeDelivery ? 'FREE' : 'Calculated at Shopify checkout'}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-chummy-plum pt-2 border-t border-stone-100">
                <span>Total Amount</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
            </div>

            {/* Direct Shopify Permacart Button */}
            <a
              href={items.length > 0 ? shopifyCartUrl : '#'}
              target={items.length > 0 ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className={`w-full py-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md ${
                items.length > 0
                  ? 'bg-chummy-yellow hover:bg-chummy-yellowHover text-chummy-plum hover:shadow-lg'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed pointer-events-none'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-amber-900" />
              <span>Checkout on Shopify ({totalCount} items)</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            {items.length > 0 && (
              <button
                onClick={onClearCart}
                className="w-full text-center text-xs text-stone-400 hover:text-stone-600 font-semibold"
              >
                Clear entire cart
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}


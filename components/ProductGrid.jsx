'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ShoppingBag,
  ExternalLink,
  Check,
  Eye,
  X,
  Sparkles,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

const CATEGORIES = [
  'All Mixes',
  'Idli, Dosa & Breakfast',
  'Millets & Health Mix',
  'Healthy Noodles',
  'Traditional Snacks',
  'Spices & Podis',
  'Value Combos',
];

export default function ProductGrid({ products = [], onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState('All Mixes');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalProduct, setActiveModalProduct] = useState(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState(null);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory =
        selectedCategory === 'All Mixes' ||
        p.category === selectedCategory ||
        p.productType === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.healthBenefits.some((b) => b.toLowerCase().includes(q));

      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleAddWithFeedback = (product) => {
    if (onAddToCart) onAddToCart(product);
    setRecentlyAddedId(product.id);
    setTimeout(() => {
      setRecentlyAddedId((curr) => (curr === product.id ? null : curr));
    }, 1500);
  };

  return (
    <section id="product-catalog" className="w-full py-16 lg:py-24 bg-chummy-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Authentic Live Inventory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-chummy-plum tracking-tight">
              Chummy Foods Live Product Catalog
            </h2>
            <p className="text-sm sm:text-base text-stone-600 max-w-2xl mt-1">
              Parsed directly from <code className="bg-amber-100/70 text-amber-900 px-1.5 py-0.5 rounded text-xs">chummy_products.json</code> with real high-resolution images, honest ingredients, and zero preservatives.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-stone-500">
              Showing <strong>{filteredProducts.length}</strong> of {products.length} products
            </span>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-sm mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ragi, puttu, noodles, adai..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm focus:outline-none focus:border-amber-500 focus:bg-white text-chummy-plum"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-chummy-plum text-white shadow-xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isAdded = recentlyAddedId === product.id;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-3xl border border-stone-200/90 hover:border-amber-400 shadow-sm hover:shadow-chummy-lg transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Product Card Media */}
                <div className="relative w-full pt-[90%] bg-gradient-to-b from-[#FFFDF9] to-stone-100/60 overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                    <span className="bg-chummy-plum/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {product.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-white/90 backdrop-blur-xs text-chummy-plum border border-stone-200 text-xs font-black px-2.5 py-1 rounded-xl shadow-xs">
                      ₹{product.price.toFixed(0)}
                    </span>
                  </div>

                  {/* Quick View Button */}
                  <button
                    onClick={() => setActiveModalProduct(product)}
                    className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 p-2 rounded-xl bg-white/90 hover:bg-white text-stone-700 shadow-md transition-opacity"
                    title="Quick View Recipe Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Product Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-extrabold text-chummy-plum text-base leading-snug line-clamp-1 group-hover:text-amber-800 transition-colors">
                      {product.title}
                    </h3>

                    {/* Health Tag Chips */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {product.healthBenefits.slice(0, 2).map((b, i) => (
                        <span
                          key={i}
                          className="bg-emerald-50 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-emerald-100"
                        >
                          {b}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-stone-500 line-clamp-2 mt-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Pricing and Cart Actions */}
                  <div className="pt-3 border-t border-stone-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-stone-400 block">Unit Price</span>
                        <span className="text-xl font-black text-chummy-plum">
                          ₹{product.price.toFixed(0)}
                        </span>
                      </div>

                      {/* Real Shopify permalink link */}
                      <a
                        href={product.cartUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 underline underline-offset-2"
                        title="Direct Shopify cart link"
                      >
                        <span>Buy on Shopify</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Add to Cart button */}
                    <button
                      onClick={() => handleAddWithFeedback(product)}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-xs ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-chummy-yellow hover:bg-chummy-yellowHover text-chummy-plum'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Empty Search Result */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-chummy-plum">No matching mixes found</h3>
            <p className="text-sm text-stone-500">
              Try searching for &quot;ragi&quot;, &quot;puttu&quot;, &quot;noodle&quot;, or reset your filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All Mixes');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-chummy-yellow text-chummy-plum rounded-xl font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Quick View Modal */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModalProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="relative w-full h-64 bg-stone-50 rounded-2xl flex items-center justify-center p-4">
                <img
                  src={activeModalProduct.image}
                  alt={activeModalProduct.title}
                  className="max-h-full object-contain"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded-full">
                    {activeModalProduct.category}
                  </span>
                  <h3 className="text-xl font-extrabold text-chummy-plum mt-1">
                    {activeModalProduct.title}
                  </h3>
                  <div className="text-2xl font-black text-chummy-plum mt-2">
                    ₹{activeModalProduct.price.toFixed(0)}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {activeModalProduct.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <div className="text-xs font-bold text-chummy-plum">Health & Purity Highlights:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeModalProduct.healthBenefits.map((b, i) => (
                      <span
                        key={i}
                        className="bg-emerald-50 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full border border-emerald-100"
                      >
                        ✓ {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-stone-100">
                  <button
                    onClick={() => {
                      handleAddWithFeedback(activeModalProduct);
                      setActiveModalProduct(null);
                    }}
                    className="w-full py-3 rounded-xl bg-chummy-yellow hover:bg-chummy-yellowHover text-chummy-plum font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to App Cart</span>
                  </button>

                  <a
                    href={activeModalProduct.cartUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-chummy-plum font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <span>Instant Shopify Direct Checkout</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}


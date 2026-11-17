/**
 * Chummy Foods - Self-Contained AI 7-Day Meal Planner Studio Embed
 * Injected on Shopify store (https://chummyfoods.com) inside <div id="chummy-ai-planner"></div>
 * Zero dependencies, pure vanilla JS & isolated scoped styles.
 */
(function () {
  'use strict';

  if (window.__CHUMMY_PLANNER_EMBED_LOADED__) return;
  window.__CHUMMY_PLANNER_EMBED_LOADED__ = true;

  // Auto-detect backend script origin
  const currentScript = document.currentScript || (function () {
    const scripts = document.getElementsByTagName('script');
    for (let i = scripts.length - 1; i >= 0; i--) {
      if (scripts[i].src && scripts[i].src.indexOf('embed-planner.js') !== -1) {
        return scripts[i];
      }
    }
    return scripts[scripts.length - 1];
  })();

  const SCRIPT_ORIGIN = (currentScript && currentScript.src)
    ? new URL(currentScript.src).origin
    : (window.location.origin.includes('chummyfoods.com') ? 'https://chummy-foods-ai.vercel.app' : window.location.origin);

  const HEALTH_GOALS = [
    { id: 'Daily Family Breakfast', name: 'Daily Family Breakfast', tamil: 'தினசரி குடும்ப காலை உணவு', icon: '☀️', badge: 'Popular' },
    { id: 'Diabetic Friendly', name: 'Diabetic Friendly', tamil: 'சர்க்கரை நோய் கட்டுப்பாடு', icon: '🩺', badge: 'Low GI' },
    { id: 'Weight Loss', name: 'Weight Loss', tamil: 'உடல் எடை குறைப்பு', icon: '🏃', badge: 'High Fiber' },
    { id: 'Kids Tiffin', name: 'Kids Tiffin', tamil: 'குழந்தைகள் டிபன்', icon: '🎒', badge: 'Maida-Free' },
    { id: 'High Protein', name: 'High Protein', tamil: 'அதிக புரத உணவு', icon: '💪', badge: 'Plant Protein' },
  ];

  const FAMILY_SIZES = [
    { id: '1-2', label: '1 - 2 Members', desc: 'Couple / Single' },
    { id: '3-4', label: '3 - 4 Members', desc: 'Standard Family' },
    { id: '5+', label: '5+ Members', desc: 'Joint Family' },
  ];

  // SVG Icons
  const SPARKLES_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`;
  const TRUCK_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`;
  const CART_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;
  const CHECK_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

  // Scoped CSS
  const styleEl = document.createElement('style');
  styleEl.id = 'chummy-ai-planner-styles';
  styleEl.textContent = `
    #chummy-ai-planner {
      width: 100%;
      max-width: 1200px;
      margin: 40px auto;
      padding: 0 16px;
      font-family: -apple-system, BlinkMacSystemFont, "DM Sans", "Segoe UI", Roboto, sans-serif;
      box-sizing: border-box;
      color: #2E2A39;
    }
    #chummy-ai-planner * {
      box-sizing: border-box;
    }
    .chpl-card {
      background: #FFFDF9;
      border: 1px solid #FCD34D;
      border-radius: 24px;
      padding: 24px;
      box-shadow: 0 10px 30px rgba(46, 42, 57, 0.06);
    }
    .chpl-header {
      text-align: center;
      margin-bottom: 28px;
    }
    .chpl-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #FEF3C7;
      color: #92400E;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      padding: 6px 14px;
      border-radius: 9999px;
      margin-bottom: 10px;
    }
    .chpl-title {
      font-size: 28px;
      font-weight: 900;
      color: #2E2A39;
      margin: 0 0 8px 0;
      line-height: 1.2;
    }
    .chpl-desc {
      font-size: 14px;
      color: #6B7280;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.5;
    }

    /* Step Selector */
    .chpl-step-title {
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #2E2A39;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .chpl-step-num {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #FFBD3C;
      color: #2E2A39;
      font-size: 11px;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .chpl-goals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 10px;
      margin-bottom: 24px;
    }
    .chpl-goal-btn {
      background: #FFFFFF;
      border: 1px solid #E5E7EB;
      border-radius: 16px;
      padding: 14px;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s;
    }
    .chpl-goal-btn:hover {
      border-color: #FFBD3C;
      background: #FFFBEB;
    }
    .chpl-goal-btn.selected {
      border-color: #F59E0B;
      background: #FFFFFF;
      box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.3), 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    .chpl-goal-icon {
      font-size: 24px;
      margin-bottom: 6px;
    }
    .chpl-goal-name {
      font-size: 13px;
      font-weight: 800;
      color: #2E2A39;
    }
    .chpl-goal-tamil {
      font-size: 11px;
      color: #92400E;
      margin-top: 2px;
    }

    .chpl-size-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 10px;
      margin-bottom: 24px;
    }
    .chpl-size-btn {
      background: #FFFFFF;
      border: 1px solid #E5E7EB;
      border-radius: 14px;
      padding: 12px 14px;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s;
    }
    .chpl-size-btn.selected {
      border-color: #F59E0B;
      background: #FFFFFF;
      box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.3);
    }
    .chpl-size-title {
      font-size: 13px;
      font-weight: 800;
      color: #2E2A39;
    }
    .chpl-size-desc {
      font-size: 11px;
      color: #6B7280;
    }

    /* Generate Button */
    .chpl-generate-btn {
      width: 100%;
      background: #FFBD3C;
      color: #2E2A39;
      font-size: 15px;
      font-weight: 900;
      border: none;
      border-radius: 16px;
      padding: 14px 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 6px 18px rgba(255, 189, 60, 0.4);
      transition: all 0.2s;
    }
    .chpl-generate-btn:hover {
      background: #F0A71C;
      transform: translateY(-1px);
    }
    .chpl-generate-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Results Container */
    .chpl-results {
      margin-top: 32px;
    }
    .chpl-plan-banner {
      background: #2E2A39;
      color: #FFFFFF;
      border-radius: 20px;
      padding: 20px;
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .chpl-plan-banner h3 {
      font-size: 20px;
      font-weight: 800;
      margin: 0;
    }
    .chpl-plan-banner p {
      font-size: 13px;
      color: #D1D5DB;
      margin: 0;
      line-height: 1.5;
    }

    /* Day Tabs */
    .chpl-day-tabs {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 8px;
      margin-bottom: 16px;
      scrollbar-width: none;
    }
    .chpl-day-tab {
      background: #FFFFFF;
      border: 1px solid #E5E7EB;
      border-radius: 12px;
      padding: 8px 14px;
      font-size: 12px;
      font-weight: 700;
      color: #4B5563;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s;
    }
    .chpl-day-tab.active {
      background: #FFBD3C;
      border-color: #F59E0B;
      color: #2E2A39;
      font-weight: 900;
    }

    /* Day Detail Card */
    .chpl-day-card {
      background: #FFFFFF;
      border: 1px solid #FCD34D;
      border-radius: 20px;
      padding: 20px;
      margin-bottom: 24px;
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }
    @media (min-width: 768px) {
      .chpl-day-card {
        grid-template-columns: 3fr 2fr;
      }
    }
    .chpl-day-meal-title {
      font-size: 18px;
      font-weight: 900;
      color: #2E2A39;
      margin: 0 0 8px 0;
    }
    .chpl-day-tip-box {
      background: #FFFBEB;
      border: 1px solid #FDE68A;
      border-radius: 12px;
      padding: 10px 14px;
      font-size: 12px;
      color: #4B5563;
      line-height: 1.5;
      font-style: italic;
    }
    .chpl-prod-preview {
      border: 1px solid #E5E7EB;
      border-radius: 14px;
      padding: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      background: #FDFBF7;
    }
    .chpl-prod-preview img {
      width: 60px;
      height: 60px;
      object-fit: contain;
      border-radius: 8px;
      background: #FFFFFF;
    }

    /* Free Delivery Progress Bar (₹750) */
    .chpl-progress-box {
      background: #FFFFFF;
      border: 1px solid #FDE68A;
      border-radius: 18px;
      padding: 18px;
      margin-bottom: 20px;
    }
    .chpl-progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 800;
      margin-bottom: 10px;
    }
    .chpl-progress-bar-bg {
      width: 100%;
      height: 12px;
      background: #F3F4F6;
      border-radius: 9999px;
      overflow: hidden;
      margin-bottom: 8px;
    }
    .chpl-progress-bar-fill {
      height: 100%;
      background: #FFBD3C;
      border-radius: 9999px;
      transition: width 0.3s ease;
    }
    .chpl-progress-bar-fill.unlocked {
      background: #16A34A;
    }

    /* Upsells Section */
    .chpl-upsells-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
      margin-top: 10px;
    }
    .chpl-upsell-item {
      background: #FFFBEB;
      border: 1px solid #FDE68A;
      border-radius: 12px;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .chpl-upsell-info {
      font-size: 11px;
      line-height: 1.3;
    }
    .chpl-upsell-title {
      font-weight: 700;
      color: #2E2A39;
    }
    .chpl-upsell-price {
      font-weight: 800;
      color: #92400E;
    }
    .chpl-upsell-add-btn {
      background: #FFBD3C;
      color: #2E2A39;
      border: none;
      border-radius: 8px;
      padding: 4px 8px;
      font-size: 11px;
      font-weight: 800;
      cursor: pointer;
    }

    /* Pack List Checkboxes */
    .chpl-packs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 10px;
      margin: 20px 0;
    }
    .chpl-pack-item {
      background: #FFFFFF;
      border: 1px solid #E5E7EB;
      border-radius: 12px;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      user-select: none;
    }
    .chpl-pack-item.selected {
      border-color: #F59E0B;
      background: #FFFDF9;
    }
    .chpl-pack-checkbox {
      width: 18px;
      height: 18px;
      accent-color: #F59E0B;
    }

    /* Checkout CTA */
    .chpl-checkout-footer {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #E5E7EB;
    }
    @media (min-width: 640px) {
      .chpl-checkout-footer {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
    }
    .chpl-checkout-btn {
      background: #FFBD3C;
      color: #2E2A39;
      font-size: 14px;
      font-weight: 900;
      border: none;
      border-radius: 14px;
      padding: 14px 24px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 4px 14px rgba(255, 189, 60, 0.4);
      transition: all 0.2s;
    }
    .chpl-checkout-btn:hover {
      background: #F0A71C;
    }
    .chpl-checkout-btn.added {
      background: #16A34A;
      color: #FFFFFF;
    }
  `;
  document.head.appendChild(styleEl);

  function initPlanner() {
    let target = document.getElementById('chummy-ai-planner');
    if (!target) {
      // Create if user didn't pre-add the element
      target = document.createElement('div');
      target.id = 'chummy-ai-planner';
      document.body.appendChild(target);
    }

    // Initial render
    target.innerHTML = `
      <div class="chpl-card">
        <div class="chpl-header">
          <div class="chpl-badge">${SPARKLES_ICON} Chummy Kitchen AI</div>
          <h2 class="chpl-title">7-Day South Indian Breakfast & Meal Planner</h2>
          <p class="chpl-desc">Personalized weekly breakfast routines powered by Gemini AI and 100% natural, preservative-free Chummy Foods mixes.</p>
        </div>

        <!-- Step 1: Health Goal -->
        <div class="chpl-step-title">
          <span class="chpl-step-num">1</span>
          <span>Select Health Goal</span>
        </div>
        <div class="chpl-goals-grid" id="chpl-goals-container">
          ${HEALTH_GOALS.map((g, idx) => `
            <div class="chpl-goal-btn ${idx === 0 ? 'selected' : ''}" data-goal="${g.id}">
              <div class="chpl-goal-icon">${g.icon}</div>
              <div class="chpl-goal-name">${g.name}</div>
              <div class="chpl-goal-tamil">${g.tamil}</div>
            </div>
          `).join('')}
        </div>

        <!-- Step 2: Family Size -->
        <div class="chpl-step-title">
          <span class="chpl-step-num">2</span>
          <span>Select Family Size</span>
        </div>
        <div class="chpl-size-grid" id="chpl-size-container">
          ${FAMILY_SIZES.map((s, idx) => `
            <div class="chpl-size-btn ${idx === 1 ? 'selected' : ''}" data-size="${s.id}">
              <div class="chpl-size-title">${s.label}</div>
              <div class="chpl-size-desc">${s.desc}</div>
            </div>
          `).join('')}
        </div>

        <button class="chpl-generate-btn" id="chpl-gen-btn">
          ${SPARKLES_ICON} Generate 7-Day Plan with Gemini AI
        </button>

        <div id="chpl-plan-display" class="chpl-results" style="display: none;"></div>
      </div>
    `;

    // State
    let selectedGoal = 'Daily Family Breakfast';
    let selectedSize = '3-4';
    let currentPlan = null;
    let selectedDayIdx = 0;
    let selectedPackIds = new Set();
    let upsellExtras = [];

    const goalsContainer = document.getElementById('chpl-goals-container');
    const sizeContainer = document.getElementById('chpl-size-container');
    const genBtn = document.getElementById('chpl-gen-btn');
    const planDisplay = document.getElementById('chpl-plan-display');

    goalsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.chpl-goal-btn');
      if (!btn) return;
      document.querySelectorAll('.chpl-goal-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedGoal = btn.getAttribute('data-goal');
    });

    sizeContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.chpl-size-btn');
      if (!btn) return;
      document.querySelectorAll('.chpl-size-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSize = btn.getAttribute('data-size');
    });

    genBtn.addEventListener('click', async () => {
      genBtn.disabled = true;
      genBtn.innerHTML = `<span>⏳ Planning 7-Day Nutrition with Gemini AI...</span>`;

      try {
        const res = await fetch(`${SCRIPT_ORIGIN}/api/meal-planner`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ goal: selectedGoal, familySize: selectedSize })
        });
        const data = await res.json();
        if (data.success && data.data) {
          currentPlan = data.data;
          selectedDayIdx = 0;
          selectedPackIds = new Set(data.data.recommendedProducts.map(p => p.id));
          upsellExtras = [];
          renderPlan();
        }
      } catch (err) {
        console.error('Planner Embed Error:', err);
      } finally {
        genBtn.disabled = false;
        genBtn.innerHTML = `${SPARKLES_ICON} Re-Generate 7-Day Plan`;
      }
    });

    function renderPlan() {
      if (!currentPlan) return;
      planDisplay.style.display = 'block';

      const allPacks = [...currentPlan.recommendedProducts, ...upsellExtras];
      const activePacks = allPacks.filter(p => selectedPackIds.has(p.id));
      const subtotal = activePacks.reduce((sum, p) => sum + (p.price || 0), 0);
      const threshold = 750;
      const isFree = subtotal >= threshold;
      const deficit = Math.max(0, threshold - subtotal);
      const progressPercent = Math.min(100, Math.round((subtotal / threshold) * 100));

      const activeDay = currentPlan.schedule[selectedDayIdx];

      planDisplay.innerHTML = `
        <!-- Banner -->
        <div class="chpl-plan-banner">
          <div style="font-size: 11px; font-weight: 800; color: #FFBD3C; text-transform: uppercase;">
            ${currentPlan.goal} • Family of ${currentPlan.familySize}
          </div>
          <h3>${currentPlan.planTitle}</h3>
          <p>${currentPlan.planOverview}</p>
        </div>

        <!-- 7-Day Tabs -->
        <div class="chpl-day-tabs">
          ${currentPlan.schedule.map((item, idx) => `
            <button class="chpl-day-tab ${idx === selectedDayIdx ? 'active' : ''}" data-day-idx="${idx}">
              Day ${idx + 1}
            </button>
          `).join('')}
        </div>

        <!-- Active Day Card -->
        <div class="chpl-day-card">
          <div>
            <div style="font-size: 11px; font-weight: 800; color: #92400E; margin-bottom: 6px;">
              ${activeDay.day} ${activeDay.healthBenefit ? `• 🌱 ${activeDay.healthBenefit}` : ''}
            </div>
            <div class="chpl-day-meal-title">${activeDay.mealName}</div>
            <div class="chpl-day-tip-box">
              <strong>Chef's Prep Secret:</strong> "${activeDay.prepTip}"
            </div>
          </div>
          <div>
            <div class="chpl-prod-preview">
              <img src="${activeDay.product.image}" alt="${activeDay.product.title}" />
              <div style="flex: 1; min-width: 0;">
                <div style="font-size: 13px; font-weight: 800; color: #2E2A39;">${activeDay.product.title}</div>
                <div style="font-size: 13px; font-weight: 900; color: #92400E;">₹${activeDay.product.price}</div>
              </div>
              <button class="chpl-upsell-add-btn" id="chpl-add-single-day-btn" data-variant-id="${activeDay.product.variantId}">
                Add Pack
              </button>
            </div>
          </div>
        </div>

        <!-- Free Delivery Progress Bar (₹750 threshold) -->
        <div class="chpl-progress-box">
          <div class="chpl-progress-header">
            <span style="display: flex; align-items: center; gap: 6px;">
              ${TRUCK_ICON} Free Shipping Across India (Orders ≥ ₹750)
            </span>
            <span>
              ${isFree
                ? `<strong style="color: #16A34A;">🎉 Free Delivery Unlocked!</strong>`
                : `<span style="color: #92400E;">Add <strong>₹${deficit}</strong> more for Free Shipping</span>`
              }
            </span>
          </div>

          <div class="chpl-progress-bar-bg">
            <div class="chpl-progress-bar-fill ${isFree ? 'unlocked' : ''}" style="width: ${progressPercent}%;"></div>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 11px; color: #6B7280;">
            <span>Current: ₹${subtotal}</span>
            <span>Target: ₹750</span>
          </div>

          <!-- Upsells if under ₹750 -->
          ${!isFree && currentPlan.upsellItems && currentPlan.upsellItems.length > 0 ? `
            <div style="margin-top: 14px; font-size: 11px; font-weight: 800; color: #92400E; text-transform: uppercase;">
              💡 Add Complementary Mixes to reach ₹750:
            </div>
            <div class="chpl-upsells-grid">
              ${currentPlan.upsellItems.map(item => `
                <div class="chpl-upsell-item">
                  <div class="chpl-upsell-info">
                    <div class="chpl-upsell-title">${item.title}</div>
                    <div class="chpl-upsell-price">₹${item.price}</div>
                  </div>
                  <button class="chpl-upsell-add-btn chpl-add-upsell" data-id="${item.id}">+ Add</button>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Weekly Pack List with Checkboxes -->
        <div style="font-size: 14px; font-weight: 800; color: #2E2A39; margin-top: 16px;">
          Recommended 7-Day Combo Packs:
        </div>
        <div class="chpl-packs-grid">
          ${allPacks.map(p => {
            const isChecked = selectedPackIds.has(p.id);
            return `
              <label class="chpl-pack-item ${isChecked ? 'selected' : ''}">
                <input type="checkbox" class="chpl-pack-checkbox" data-id="${p.id}" ${isChecked ? 'checked' : ''} />
                <img src="${p.image}" alt="${p.title}" style="width: 36px; height: 36px; object-fit: contain;" />
                <div style="flex: 1; min-width: 0; font-size: 12px;">
                  <div style="font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.title}</div>
                  <div style="color: #92400E; font-weight: 800;">₹${p.price}</div>
                </div>
              </label>
            `;
          }).join('')}
        </div>

        <!-- Checkout Footer -->
        <div class="chpl-checkout-footer">
          <div style="font-size: 13px; color: #4B5563;">
            Selected: <strong>${activePacks.length} packs</strong> | Total: <strong>₹${subtotal}</strong>
          </div>
          <button class="chpl-checkout-btn" id="chpl-add-all-btn">
            ${CART_ICON} Add All Combo Packs to Cart (${activePacks.length})
          </button>
        </div>
      `;

      // Event listeners for day tabs
      planDisplay.querySelectorAll('.chpl-day-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          selectedDayIdx = parseInt(tab.getAttribute('data-day-idx'), 10);
          renderPlan();
        });
      });

      // Single day add pack button
      const singleDayBtn = document.getElementById('chpl-add-single-day-btn');
      if (singleDayBtn) {
        singleDayBtn.addEventListener('click', () => {
          const vId = singleDayBtn.getAttribute('data-variant-id');
          handleShopifyAddItems([{ id: vId, quantity: 1 }], singleDayBtn);
        });
      }

      // Upsell add buttons
      planDisplay.querySelectorAll('.chpl-add-upsell').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = parseInt(btn.getAttribute('data-id'), 10);
          const found = currentPlan.upsellItems.find(p => p.id === id);
          if (found && !upsellExtras.some(p => p.id === id)) {
            upsellExtras.push(found);
            selectedPackIds.add(id);
            renderPlan();
          }
        });
      });

      // Pack checkboxes
      planDisplay.querySelectorAll('.chpl-pack-checkbox').forEach(cb => {
        cb.addEventListener('change', () => {
          const id = parseInt(cb.getAttribute('data-id'), 10);
          if (cb.checked) {
            selectedPackIds.add(id);
          } else {
            if (selectedPackIds.size > 1) {
              selectedPackIds.delete(id);
            }
          }
          renderPlan();
        });
      });

      // Add All to Cart button
      const addAllBtn = document.getElementById('chpl-add-all-btn');
      if (addAllBtn) {
        addAllBtn.addEventListener('click', () => {
          const itemsToAdd = activePacks.map(p => ({
            id: p.variantId,
            quantity: 1
          }));
          handleShopifyAddItems(itemsToAdd, addAllBtn);
        });
      }
    }

    // Native Shopify cart integration
    function handleShopifyAddItems(items, btnElement) {
      if (!items || items.length === 0) return;
      const originalText = btnElement.innerHTML;
      btnElement.innerHTML = 'Adding to Cart...';
      btnElement.disabled = true;

      fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ items: items })
      })
        .then(res => {
          if (!res.ok) throw new Error('Not on shopify or cart endpoint failed');
          return res.json();
        })
        .then(cartData => {
          btnElement.classList.add('added');
          btnElement.innerHTML = `${CHECK_ICON} Added All to Cart!`;
          document.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart: cartData } }));
          document.dispatchEvent(new CustomEvent('ajaxProduct:added', { detail: { product: cartData } }));
          setTimeout(() => {
            btnElement.classList.remove('added');
            btnElement.innerHTML = originalText;
            btnElement.disabled = false;
          }, 2500);
        })
        .catch(() => {
          // Fallback: Shopify cart permalink redirect
          const permalinkSegments = items.map(i => `${i.id}:${i.quantity || 1}`).join(',');
          window.open(`https://chummyfoods.com/cart/${permalinkSegments}`, '_blank');
          btnElement.innerHTML = `${CHECK_ICON} Opening Cart...`;
          setTimeout(() => {
            btnElement.innerHTML = originalText;
            btnElement.disabled = false;
          }, 2500);
        });
    }
  }

  // Load when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlanner);
  } else {
    initPlanner();
  }

})();


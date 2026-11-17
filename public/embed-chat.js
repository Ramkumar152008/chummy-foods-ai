/**
 * Chummy Foods - Self-Contained AI Culinary & Recipe Assistant Embed
 * Injected on Shopify store (https://chummyfoods.com)
 * Zero dependencies, pure vanilla JS & isolated scoped styles.
 */
(function () {
  'use strict';

  if (window.__CHUMMY_CHAT_EMBED_LOADED__) return;
  window.__CHUMMY_CHAT_EMBED_LOADED__ = true;

  // Auto-detect backend script origin
  const currentScript = document.currentScript || (function () {
    const scripts = document.getElementsByTagName('script');
    for (let i = scripts.length - 1; i >= 0; i--) {
      if (scripts[i].src && scripts[i].src.indexOf('embed-chat.js') !== -1) {
        return scripts[i];
      }
    }
    return scripts[scripts.length - 1];
  })();

  const SCRIPT_ORIGIN = (currentScript && currentScript.src)
    ? new URL(currentScript.src).origin
    : (window.location.origin.includes('chummyfoods.com') ? 'https://chummy-foods-ai.vercel.app' : window.location.origin);

  // SVG Icons
  const CHEF_ICON = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>`;
  const SEND_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
  const CLOSE_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
  const RESET_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>`;
  const CART_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;

  // Inject Styles
  const styleEl = document.createElement('style');
  styleEl.id = 'chummy-ai-chat-styles';
  styleEl.textContent = `
    #chummy-chat-launcher {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99999;
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: -apple-system, BlinkMacSystemFont, "DM Sans", "Segoe UI", Roboto, sans-serif;
    }
    #chummy-chat-chip {
      background: #2E2A39;
      color: #FFFFFF;
      font-size: 12px;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 9999px;
      box-shadow: 0 4px 15px rgba(46, 42, 57, 0.25);
      border: 1px solid rgba(255, 189, 60, 0.4);
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      animation: chummyBounce 2.5s infinite;
    }
    #chummy-chat-chip span.dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #FFBD3C;
    }
    #chummy-chat-btn {
      width: 56px;
      height: 56px;
      border-radius: 18px;
      background: #FFBD3C;
      color: #2E2A39;
      border: none;
      box-shadow: 0 8px 24px rgba(46, 42, 57, 0.25), 0 0 15px rgba(255, 189, 60, 0.5);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: transform 0.2s, background 0.2s;
    }
    #chummy-chat-btn:hover {
      transform: scale(1.06);
      background: #F0A71C;
    }
    #chummy-chat-btn .ai-badge {
      position: absolute;
      top: -3px;
      right: -3px;
      background: #9B046F;
      color: #FFF;
      font-size: 9px;
      font-weight: 900;
      padding: 2px 5px;
      border-radius: 9999px;
      border: 2px solid #FFF;
    }
    @keyframes chummyBounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }

    /* Chat Drawer Container */
    #chummy-chat-drawer {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 390px;
      max-width: calc(100vw - 32px);
      height: 600px;
      max-height: calc(100vh - 80px);
      background: #FFFFFF;
      border-radius: 24px;
      box-shadow: 0 20px 50px rgba(46, 42, 57, 0.3), 0 0 1px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(46, 42, 57, 0.1);
      z-index: 100000;
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "DM Sans", "Segoe UI", Roboto, sans-serif;
      box-sizing: border-box;
      animation: chummyFadeIn 0.25s ease-out;
    }
    #chummy-chat-drawer * {
      box-sizing: border-box;
    }
    @keyframes chummyFadeIn {
      from { opacity: 0; transform: translateY(12px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Drawer Header */
    .chummy-header {
      background: #2E2A39;
      color: #FFFFFF;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .chummy-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .chummy-avatar {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      background: #FFBD3C;
      color: #2E2A39;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
    .chummy-title {
      font-size: 14px;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 6px;
      color: #FFFFFF;
    }
    .chummy-online {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #22C55E;
    }
    .chummy-subtitle {
      font-size: 11px;
      color: #D1D5DB;
    }
    .chummy-actions {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .chummy-icon-btn {
      background: transparent;
      border: none;
      color: #9CA3AF;
      cursor: pointer;
      padding: 6px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .chummy-icon-btn:hover {
      color: #FFFFFF;
      background: rgba(255, 255, 255, 0.1);
    }

    /* Messages Stream */
    .chummy-body {
      flex: 1;
      overflow-y: auto;
      padding: 14px;
      background: #FDFBF7;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .chummy-msg-row {
      display: flex;
      flex-direction: column;
      max-width: 88%;
    }
    .chummy-msg-row.user {
      align-self: flex-end;
      align-items: flex-end;
    }
    .chummy-msg-row.assistant {
      align-self: flex-start;
      align-items: flex-start;
    }
    .chummy-lang-badge {
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      padding: 2px 7px;
      border-radius: 9999px;
      background: #FEF3C7;
      color: #92400E;
      margin-bottom: 4px;
      display: inline-block;
    }
    .chummy-bubble {
      padding: 10px 14px;
      border-radius: 16px;
      font-size: 13px;
      line-height: 1.5;
    }
    .chummy-msg-row.user .chummy-bubble {
      background: #2E2A39;
      color: #FFFFFF;
      border-bottom-right-radius: 3px;
    }
    .chummy-msg-row.assistant .chummy-bubble {
      background: #FFFFFF;
      color: #1F2937;
      border: 1px solid #E5E7EB;
      border-bottom-left-radius: 3px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    .chummy-time {
      font-size: 10px;
      color: #9CA3AF;
      margin-top: 3px;
      padding: 0 4px;
    }

    /* Cooking steps */
    .chummy-steps-card {
      margin-top: 10px;
      padding: 10px 12px;
      background: #FFFBEB;
      border: 1px solid #FDE68A;
      border-radius: 12px;
      font-size: 12px;
    }
    .chummy-steps-title {
      font-weight: 800;
      color: #92400E;
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .chummy-steps-list {
      margin: 0;
      padding-left: 18px;
      color: #4B5563;
      line-height: 1.4;
    }

    /* Product Cards inside chat */
    .chummy-prod-card {
      margin-top: 8px;
      background: #FFFFFF;
      border: 1px solid #FCD34D;
      border-radius: 12px;
      padding: 8px 10px;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    }
    .chummy-prod-img {
      width: 44px;
      height: 44px;
      object-fit: contain;
      border-radius: 8px;
      background: #F9FAFB;
      border: 1px solid #F3F4F6;
      flex-shrink: 0;
    }
    .chummy-prod-info {
      flex: 1;
      min-width: 0;
    }
    .chummy-prod-name {
      font-size: 12px;
      font-weight: 700;
      color: #111827;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .chummy-prod-price {
      font-size: 12px;
      font-weight: 800;
      color: #92400E;
      margin-top: 2px;
    }
    .chummy-add-btn {
      background: #FFBD3C;
      color: #2E2A39;
      border: none;
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 11px;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
      transition: background 0.15s;
    }
    .chummy-add-btn:hover {
      background: #F0A71C;
    }
    .chummy-add-btn.added {
      background: #16A34A;
      color: #FFFFFF;
    }

    /* Quick Action Chips */
    .chummy-chips-tray {
      padding: 8px 12px;
      background: #F3F4F6;
      border-top: 1px solid #E5E7EB;
      display: flex;
      gap: 6px;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .chummy-chip-btn {
      white-space: nowrap;
      background: #FFFFFF;
      border: 1px solid #D1D5DB;
      border-radius: 9999px;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 600;
      color: #374151;
      cursor: pointer;
      transition: all 0.15s;
    }
    .chummy-chip-btn:hover {
      border-color: #FFBD3C;
      background: #FFFBEB;
      color: #92400E;
    }

    /* Input Footer */
    .chummy-footer {
      padding: 10px 12px;
      background: #FFFFFF;
      border-top: 1px solid #E5E7EB;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .chummy-input {
      flex: 1;
      border: 1px solid #D1D5DB;
      border-radius: 12px;
      padding: 9px 12px;
      font-size: 13px;
      outline: none;
      color: #1F2937;
      background: #F9FAFB;
    }
    .chummy-input:focus {
      border-color: #FFBD3C;
      background: #FFFFFF;
    }
    .chummy-send-btn {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      background: #FFBD3C;
      color: #2E2A39;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.15s;
    }
    .chummy-send-btn:hover {
      background: #F0A71C;
    }
    .chummy-send-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .chummy-typing {
      font-size: 11px;
      color: #6B7280;
      font-style: italic;
      padding: 4px 8px;
    }
  `;
  document.head.appendChild(styleEl);

  // Create UI Root
  const root = document.createElement('div');
  root.id = 'chummy-ai-chat-root';
  root.innerHTML = `
    <!-- Floating Launcher -->
    <div id="chummy-chat-launcher">
      <div id="chummy-chat-chip">
        <span class="dot"></span>
        <span>AI Chef (தமிழ் / Tanglish)</span>
      </div>
      <button id="chummy-chat-btn" aria-label="Open Chummy Foods AI Chef">
        ${CHEF_ICON}
        <span class="ai-badge">AI</span>
      </button>
    </div>

    <!-- Chat Drawer -->
    <div id="chummy-chat-drawer">
      <div class="chummy-header">
        <div class="chummy-header-left">
          <div class="chummy-avatar">${CHEF_ICON}</div>
          <div>
            <div class="chummy-title">
              <span>Chummy AI Chef</span>
              <span class="chummy-online"></span>
            </div>
            <div class="chummy-subtitle">தமிழ் • Tanglish • English</div>
          </div>
        </div>
        <div class="chummy-actions">
          <button class="chummy-icon-btn" id="chummy-reset-btn" title="Reset chat">${RESET_ICON}</button>
          <button class="chummy-icon-btn" id="chummy-close-btn" title="Close">${CLOSE_ICON}</button>
        </div>
      </div>

      <div class="chummy-body" id="chummy-messages-container"></div>

      <div class="chummy-chips-tray" id="chummy-chips-container">
        <button class="chummy-chip-btn" data-prompt="ராகி தோசை எப்படி செய்வது? செய்முறை சொல்லுங்கள்.">🇮🇳 ராகி தோசை</button>
        <button class="chummy-chip-btn" data-prompt="Adai dosa epdi crispy-ah panradhu?">🗣️ Crispy Adai</button>
        <button class="chummy-chip-btn" data-prompt="Diabetic friendly breakfast suggestions?">🩺 Low GI / Diabetic</button>
        <button class="chummy-chip-btn" data-prompt="Instant Sambar mix epdi quick-ah cook panradhu?">🍲 Quick Sambar</button>
      </div>

      <form class="chummy-footer" id="chummy-chat-form">
        <input type="text" class="chummy-input" id="chummy-input-field" placeholder="Ask in தமிழ், Tanglish, or English..." autocomplete="off" />
        <button type="submit" class="chummy-send-btn" id="chummy-submit-btn">${SEND_ICON}</button>
      </form>
    </div>
  `;
  document.body.appendChild(root);

  // State
  let isOpen = false;
  let isSending = false;
  const messages = [
    {
      role: 'assistant',
      content: 'வணக்கம் & Welcome to Chummy Foods! I am your AI Nutritionist & Heritage Chef. Ask me recipes, cooking tips, or product recommendations in Tamil (தமிழ்), Tanglish, or English!',
      language: 'Welcome',
      time: 'Just now'
    }
  ];

  const launcher = document.getElementById('chummy-chat-launcher');
  const chip = document.getElementById('chummy-chat-chip');
  const btn = document.getElementById('chummy-chat-btn');
  const drawer = document.getElementById('chummy-chat-drawer');
  const closeBtn = document.getElementById('chummy-close-btn');
  const resetBtn = document.getElementById('chummy-reset-btn');
  const msgContainer = document.getElementById('chummy-messages-container');
  const chipsContainer = document.getElementById('chummy-chips-container');
  const form = document.getElementById('chummy-chat-form');
  const input = document.getElementById('chummy-input-field');
  const submitBtn = document.getElementById('chummy-submit-btn');

  function toggleChat(force) {
    isOpen = typeof force === 'boolean' ? force : !isOpen;
    drawer.style.display = isOpen ? 'flex' : 'none';
    launcher.style.display = isOpen ? 'none' : 'flex';
    if (isOpen) {
      renderMessages();
      input.focus();
    }
  }

  btn.addEventListener('click', () => toggleChat(true));
  chip.addEventListener('click', () => toggleChat(true));
  closeBtn.addEventListener('click', () => toggleChat(false));

  resetBtn.addEventListener('click', () => {
    messages.length = 0;
    messages.push({
      role: 'assistant',
      content: 'வணக்கம்! How can I assist your South Indian kitchen today? Ask in Tamil, Tanglish, or English.',
      time: 'Just now'
    });
    renderMessages();
  });

  // Prompt chips
  chipsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.chummy-chip-btn');
    if (!btn) return;
    const prompt = btn.getAttribute('data-prompt');
    if (prompt) {
      sendMessage(prompt);
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text) {
      sendMessage(text);
      input.value = '';
    }
  });

  async function sendMessage(text) {
    if (isSending || !text) return;
    isSending = true;
    submitBtn.disabled = true;

    // Add user message
    messages.push({
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    renderMessages();

    // Show typing
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chummy-typing';
    typingIndicator.id = 'chummy-typing-indicator';
    typingIndicator.textContent = 'Chef is thinking in your language...';
    msgContainer.appendChild(typingIndicator);
    msgContainer.scrollTop = msgContainer.scrollHeight;

    try {
      const res = await fetch(`${SCRIPT_ORIGIN}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        messages.push({
          role: 'assistant',
          content: data.data.reply,
          language: data.data.languageDetected,
          prepInstructions: data.data.prepInstructions || [],
          cookingTime: data.data.cookingTime || '',
          recommendedProducts: data.data.recommendedProducts || [],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      } else {
        throw new Error(data.error || 'Failed to get answer');
      }
    } catch (err) {
      console.error('Chummy AI Chat Error:', err);
      messages.push({
        role: 'assistant',
        content: 'மன்னிக்கவும், Sorry! Please try again or select one of our quick recipe options.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } finally {
      isSending = false;
      submitBtn.disabled = false;
      const indicator = document.getElementById('chummy-typing-indicator');
      if (indicator) indicator.remove();
      renderMessages();
    }
  }

  function renderMessages() {
    msgContainer.innerHTML = '';
    messages.forEach((msg) => {
      const row = document.createElement('div');
      row.className = `chummy-msg-row ${msg.role}`;

      if (msg.role === 'assistant' && msg.language && msg.language !== 'Welcome') {
        const langBadge = document.createElement('div');
        langBadge.className = 'chummy-lang-badge';
        langBadge.textContent = `${msg.language} Response`;
        row.appendChild(langBadge);
      }

      const bubble = document.createElement('div');
      bubble.className = 'chummy-bubble';
      bubble.textContent = msg.content;

      // Step-by-step cooking steps
      if (msg.prepInstructions && msg.prepInstructions.length > 0) {
        const stepsCard = document.createElement('div');
        stepsCard.className = 'chummy-steps-card';
        stepsCard.innerHTML = `
          <div class="chummy-steps-title">
            <span>🍳 Step-by-Step Cooking Steps</span>
            ${msg.cookingTime ? `<span>⏱️ ${msg.cookingTime}</span>` : ''}
          </div>
          <ol class="chummy-steps-list">
            ${msg.prepInstructions.map(s => `<li>${s}</li>`).join('')}
          </ol>
        `;
        bubble.appendChild(stepsCard);
      }

      // Recommended Products from chummy_products.json
      if (msg.recommendedProducts && msg.recommendedProducts.length > 0) {
        msg.recommendedProducts.forEach((p) => {
          const prodCard = document.createElement('div');
          prodCard.className = 'chummy-prod-card';
          prodCard.innerHTML = `
            <img src="${p.image}" alt="${p.title}" class="chummy-prod-img" />
            <div class="chummy-prod-info">
              <div class="chummy-prod-name">${p.title}</div>
              <div class="chummy-prod-price">₹${p.price}</div>
            </div>
            <button class="chummy-add-btn" data-variant-id="${p.variantId}">
              ${CART_ICON} Add
            </button>
          `;

          // Add to Cart handler via Shopify's native POST /cart/add.js
          const addBtn = prodCard.querySelector('.chummy-add-btn');
          addBtn.addEventListener('click', () => {
            handleShopifyAddToCart(p.variantId, addBtn);
          });

          bubble.appendChild(prodCard);
        });
      }

      row.appendChild(bubble);

      const timeEl = document.createElement('div');
      timeEl.className = 'chummy-time';
      timeEl.textContent = msg.time || '';
      row.appendChild(timeEl);

      msgContainer.appendChild(row);
    });

    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  // Native Shopify Add to Cart Execution with Permacart fallback
  function handleShopifyAddToCart(variantId, btnElement) {
    if (!variantId) return;
    const originalText = btnElement.innerHTML;
    btnElement.innerHTML = '...';
    btnElement.disabled = true;

    // Check if on Shopify store (chummyfoods.com)
    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        items: [{ id: variantId, quantity: 1 }]
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Not on shopify or cart endpoint failed');
        return res.json();
      })
      .then(cartData => {
        btnElement.classList.add('added');
        btnElement.innerHTML = '✓ Added!';
        // Trigger theme cart drawer update if shopify theme supports it
        document.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart: cartData } }));
        document.dispatchEvent(new CustomEvent('ajaxProduct:added', { detail: { product: cartData } }));
        setTimeout(() => {
          btnElement.classList.remove('added');
          btnElement.innerHTML = originalText;
          btnElement.disabled = false;
        }, 2000);
      })
      .catch(() => {
        // Fallback: direct Shopify permacart redirect
        btnElement.innerHTML = '✓ Opening Cart';
        window.open(`https://chummyfoods.com/cart/${variantId}:1`, '_blank');
        setTimeout(() => {
          btnElement.innerHTML = originalText;
          btnElement.disabled = false;
        }, 2000);
      });
  }

})();


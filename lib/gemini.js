import fs from 'fs';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { getProducts } from './catalog.js';

// Safely get API key from process.env or directly from .env.local
function getApiKey() {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    return process.env.GEMINI_API_KEY.trim();
  }
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed.startsWith('GEMINI_API_KEY=')) {
          const val = trimmed.replace('GEMINI_API_KEY=', '').trim();
          if (val && val !== 'your_gemini_api_key_here') {
            return val;
          }
        }
      }
    }
  } catch (err) {
    console.warn('Could not read .env.local:', err.message);
  }
  return null;
}

function getGenAI() {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

// Ordered models: Try gemini-2.5-flash first (user requirement), with resilient fallback to modern flash models
const MODEL_CANDIDATES = [
  'gemini-2.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
  'gemini-3.5-flash',
];

/**
 * Helper to safely extract text from SDK response
 */
function extractResponseText(response) {
  if (!response) return '';
  if (typeof response.text === 'string') return response.text;
  if (typeof response.text === 'function') return response.text();
  return JSON.stringify(response);
}

/**
 * 7-Day Meal Planner Response Schema
 */
const mealPlanResponseSchema = {
  type: Type.OBJECT,
  properties: {
    planTitle: { type: Type.STRING },
    planOverview: { type: Type.STRING },
    goal: { type: Type.STRING },
    familySize: { type: Type.STRING },
    dietaryHighlights: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    schedule: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING },
          mealName: { type: Type.STRING },
          productId: { type: Type.NUMBER },
          prepTip: { type: Type.STRING },
          healthBenefit: { type: Type.STRING },
        },
        required: ['day', 'mealName', 'productId', 'prepTip'],
      },
    },
    recommendedPackIds: {
      type: Type.ARRAY,
      items: { type: Type.NUMBER },
    },
    nutritionTip: { type: Type.STRING },
  },
  required: ['planTitle', 'planOverview', 'schedule', 'recommendedPackIds'],
};

/**
 * Generates a 7-day meal plan using Gemini models or curated real-product fallback
 */
export async function generateMealPlan({ goal = 'Daily Family Breakfast', familySize = '3-4' }) {
  const products = getProducts();
  const catalogContext = products.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    variantId: p.variantId,
    description: p.description,
    category: p.category,
    healthBenefits: p.healthBenefits,
  }));

  const ai = getGenAI();

  if (ai) {
    const prompt = `
You are the Executive Nutritionist & Traditional South Indian Chef at Chummy Foods (chummyfoods.com).
Generate a customized 7-Day South Indian Breakfast & Meal Plan for:
- Health Goal: "${goal}"
- Family Size: "${familySize} members"

STRICT REQUIREMENT:
You MUST ONLY recommend products that exist in this exact product catalog:
${JSON.stringify(catalogContext, null, 2)}

Rules:
1. Every item in 'schedule' MUST have a valid 'productId' matching one of the products in the catalog above.
2. 'day' should be: "Day 1 (Monday)", "Day 2 (Tuesday)", "Day 3 (Wednesday)", "Day 4 (Thursday)", "Day 5 (Friday)", "Day 6 (Saturday)", "Day 7 (Sunday)".
3. 'mealName' must be an appetizing authentic South Indian dish name utilizing that product (e.g., "Crispy High-Fiber Ragi Dosa with Chutney", "Steamed Soft Red Rice Puttu with Jaggery & Banana").
4. 'prepTip' must provide an authentic culinary or preparation tip (e.g. resting time, iron tawa temperature, pairing with Idly Dosa Podi or Instant Sambar).
5. 'recommendedPackIds' should contain the unique list of product IDs needed to cover this 7-day plan.
6. Provide inspiring 'dietaryHighlights' and a holistic 'nutritionTip'.
`;

    for (const model of MODEL_CANDIDATES) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: mealPlanResponseSchema,
            temperature: 0.2,
          },
        });

        const rawText = extractResponseText(response);
        const parsed = JSON.parse(rawText);

        // Validate all productIds against real catalog
        const validIds = new Set(products.map((p) => p.id));
        const sanitizedSchedule = parsed.schedule.map((item) => {
          const found = validIds.has(item.productId)
            ? item.productId
            : products[Math.floor(Math.random() * products.length)].id;
          return {
            ...item,
            productId: found,
          };
        });

        const sanitizedPackIds = (parsed.recommendedPackIds || []).filter((id) => validIds.has(id));

        return {
          ...parsed,
          schedule: sanitizedSchedule,
          recommendedPackIds:
            sanitizedPackIds.length > 0
              ? sanitizedPackIds
              : Array.from(new Set(sanitizedSchedule.map((s) => s.productId))),
          isAiGenerated: true,
          activeModel: model,
        };
      } catch (err) {
        console.warn(`Gemini model ${model} error:`, err.message);
      }
    }
  }

  // Curated deterministic fallback strictly adhering to chummy_products.json
  return getCuratedMealPlan(goal, familySize, products);
}

/**
 * Intelligent curated meal plan generator strictly using chummy_products.json
 */
function getCuratedMealPlan(goal, familySize, products) {
  const byHandle = (handle) => products.find((p) => p.handle === handle) || products[0];

  const ragiDosa = byHandle('ragi-idli-dosa-mix');
  const multimillet = byHandle('multimillet-mix');
  const redRicePuttu = byHandle('red-rice-puttu-powder');
  const healthMix = byHandle('health-mix');
  const adaiDosa = byHandle('adai-dosa-mix');
  const ravaDosa = byHandle('rava-dosa-mix');
  const idliDosa = byHandle('idli-dosa-mix');
  const redRiceMix = byHandle('red-rice-mix-idli-and-dosa-mix');
  const meduVada = byHandle('medu-vada');
  const masalVada = byHandle('masal-vada');
  const sambarMix = byHandle('instant-sambar-mix');
  const idlyPodi = byHandle('idly-podi');
  const wheatNoodles = byHandle('wheat-hakka-noodles');
  const ragiNoodles = byHandle('ragi-hakka-noodles');
  const multimilletNoodles = byHandle('multimillet-hakka-noodles');
  const kozhukattai = byHandle('kozhukattai-mix');

  let planTitle = `Chummy 7-Day ${goal} Nutrition Plan`;
  let planOverview = `A wholesome South Indian meal routine crafted with slow-digesting millets, traditional red rice, and natural pulses tailored for a family size of ${familySize}.`;
  let highlights = ['100% Traditional South Indian Grains', 'Zero Refined Flours & Preservatives', 'Rich in Fiber & Natural Minerals'];
  let schedule = [];

  if (goal === 'Diabetic Friendly') {
    planTitle = '7-Day Low-GI Diabetic Friendly Plan';
    planOverview = 'Carefully curated low glycemic index traditional grains like finger millet (ragi), multi-millets, and red rice that help stabilize blood sugar and prevent insulin spikes.';
    highlights = ['Low Glycemic Index Grains', 'High In Soluble & Insoluble Fiber', 'Sustained Satiety Without Sugar Spikes'];
    schedule = [
      { day: 'Day 1 (Monday)', mealName: 'Ragi Idli & Mint Chutney', productId: ragiDosa.id, prepTip: 'Ferment mix lightly for 20 mins; steam on medium flame for fluffy texture.', healthBenefit: 'Rich in polyphenols and dietary fiber for morning blood sugar control.' },
      { day: 'Day 2 (Tuesday)', mealName: 'Multimillet Crispy Dosa', productId: multimillet.id, prepTip: 'Spread batter thin on cast iron tawa; brush sparingly with cold-pressed sesame oil.', healthBenefit: 'Blend of native millets providing sustained steady glucose release.' },
      { day: 'Day 3 (Wednesday)', mealName: 'Red Rice Puttu with Grated Coconut', productId: redRicePuttu.id, prepTip: 'Drizzle with warm water, let sit 5 mins before layering in puttu maker with fresh grated coconut.', healthBenefit: 'Anthocyanin-rich red bran keeps you satiated till lunch.' },
      { day: 'Day 4 (Thursday)', mealName: 'High-Protein Adai Dosa', productId: adaiDosa.id, prepTip: 'Add chopped shallots, curry leaves, and ginger to batter for authentic Chettinad flavor.', healthBenefit: 'Multi-pulse protein slows carbohydrate absorption.' },
      { day: 'Day 5 (Friday)', mealName: 'Warm Health Mix Kanji', productId: healthMix.id, prepTip: 'Whisk 2 tbsp powder with 1 cup water, simmer 5 mins, finish with buttermilk or warm milk.', healthBenefit: 'Packed with 20+ sprouted grains, nuts, and natural herbs.' },
      { day: 'Day 6 (Saturday)', mealName: 'Multimillet Hakka Noodles with Stir-Fried Veggies', productId: multimilletNoodles.id, prepTip: 'Boil noodles 4 mins, drain and rinse with cold water; toss with bell peppers and green beans.', healthBenefit: 'Guilt-free weekend breakfast with whole grain goodness.' },
      { day: 'Day 7 (Sunday)', mealName: 'Red Rice Dosa with Instant Sambar', productId: redRiceMix.id, prepTip: 'Pair with piping hot Chummy Instant Sambar simmered with shallots and drumstick.', healthBenefit: 'Nutrient-dense Sunday feast that is light on digestion.' },
    ];
  } else if (goal === 'Weight Loss') {
    planTitle = '7-Day High-Fiber Calorie-Smart Plan';
    planOverview = 'Packed with whole grains, complex dietary fibers, and plant proteins that keep hunger cravings at bay and boost daily metabolic rate.';
    highlights = ['High Caloric Efficiency', 'Extremely Satiating Millets', 'No Empty Refined Starches'];
    schedule = [
      { day: 'Day 1 (Monday)', mealName: 'Fiber-Rich Ragi Dosa with Idly Podi', productId: ragiDosa.id, prepTip: 'Dust with Chummy Idly Dosa Podi using minimal gingelly oil.', healthBenefit: 'High dietary fiber keeps appetite suppressed.' },
      { day: 'Day 2 (Tuesday)', mealName: 'Traditional Adai Dosa with Coconut Mint Chutney', productId: adaiDosa.id, prepTip: 'Cook both sides until golden brown; hearty meal that needs no snacks later.', healthBenefit: 'Heavy pulse content burns steady energy throughout work hours.' },
      { day: 'Day 3 (Wednesday)', mealName: 'Nutritious Multimillet Porridge', productId: multimillet.id, prepTip: 'Cook in earthen pot with a pinch of roasted cumin and sea salt.', healthBenefit: 'Hydrating, gut-friendly breakfast that flushes toxins.' },
      { day: 'Day 4 (Thursday)', mealName: 'Steamed Red Rice Idli with Sambar', productId: redRiceMix.id, prepTip: 'Serve with piping hot Chummy Sambar made without heavy oil.', healthBenefit: 'Low calorie density with gut-friendly prebiotic starch.' },
      { day: 'Day 5 (Friday)', mealName: 'Wheat Hakka Noodles Tossed with Greens', productId: wheatNoodles.id, prepTip: 'Boil, strain, and sauté with garlic, broccoli, and crunchy carrots.', healthBenefit: 'Complex whole wheat carbs provide clean workout energy.' },
      { day: 'Day 6 (Saturday)', mealName: 'Steamed Idiyappam with Coconut Milk', productId: kozhukattai.id, prepTip: 'Press delicate noodles into idli plates and steam for just 6 minutes.', healthBenefit: 'Steam-cooked, zero oil traditional breakfast.' },
      { day: 'Day 7 (Sunday)', mealName: 'Chummy Health Mix Nutri-Bowl', productId: healthMix.id, prepTip: 'Garnish with toasted almond slivers and a dash of cinnamon.', healthBenefit: 'Dense micronutrients prevent sweet cravings all day.' },
    ];
  } else if (goal === 'Kids Tiffin') {
    planTitle = '7-Day Kid-Approved Crunchy & Delicious Tiffin';
    planOverview = 'Tastier, healthier South Indian tiffin boxes your kids will bring back empty, made with wholesome grains that support growth and brain focus.';
    highlights = ['No Maida or Synthetic Preservatives', 'Crispy & Colorful Presentations', 'Kid-Loved Mild Aromas'];
    schedule = [
      { day: 'Day 1 (Monday)', mealName: 'Golden Crispy Rava Dosa', productId: ravaDosa.id, prepTip: 'Pour watery batter from outside in for lace-like honeycomb crispiness.', healthBenefit: 'Crunchy bite kids adore with quick morning preparation.' },
      { day: 'Day 2 (Tuesday)', mealName: 'Ragi Hakka Veggie Noodles Box', productId: ragiNoodles.id, prepTip: 'Toss with sweet corn, shredded cabbage, and mild soy-tomato sauce.', healthBenefit: 'Sneaks high-calcium finger millet into tasty noodles.' },
      { day: 'Day 3 (Wednesday)', mealName: 'Mini Button Idlis with Chummy Podi & Ghee', productId: idliDosa.id, prepTip: 'Toss hot steamed coin idlis in 1 tsp pure ghee and aromatic Idly Podi.', healthBenefit: 'Easy finger-food for school breaks, packed with gentle carbs.' },
      { day: 'Day 4 (Thursday)', mealName: 'Sweet Red Rice Puttu with Jaggery', productId: redRicePuttu.id, prepTip: 'Layer with crushed palm jaggery, cardamom, and fresh coconut.', healthBenefit: 'Natural iron from organic red rice and unrefined jaggery.' },
      { day: 'Day 5 (Friday)', mealName: 'Crispy Medu Vada Bites with Sambar', productId: meduVada.id, prepTip: 'Shape into bite-sized rings with a wet thumb; fry to golden perfection.', healthBenefit: 'Urad dal protein supports muscle growth in active children.' },
      { day: 'Day 6 (Saturday)', mealName: 'Multimillet Chocolate Smoothie', productId: healthMix.id, prepTip: 'Blend 2 tbsp warm Health Mix with cocoa powder, banana, and chilled milk.', healthBenefit: 'Power-packed weekend shake with almonds, cashews, and grains.' },
      { day: 'Day 7 (Sunday)', mealName: 'Steamed Kozhukattai Dumplings', productId: kozhukattai.id, prepTip: 'Stuff with grated coconut and jaggery; steam until glossy.', healthBenefit: 'Festive traditional sweet with pure rice goodness.' },
    ];
  } else if (goal === 'High Protein') {
    planTitle = '7-Day Plant-Protein & Strength Nutrition Plan';
    planOverview = 'High-protein South Indian traditional staples combining multi-lentil adai, urad dal medu vada, sprouted health mix, and nutrient-dense millets.';
    highlights = ['Complete Amino Acid Profile', 'Fuel for Active Lifestyles', 'Rich in Urad, Moong, Toor & Millet Proteins'];
    schedule = [
      { day: 'Day 1 (Monday)', mealName: 'Power Adai Dosa with Coriander Chutney', productId: adaiDosa.id, prepTip: 'Cook thick like a pancake; poke small holes and add a drop of gingelly oil.', healthBenefit: 'Rich multi-lentil protein for lean muscle recovery.' },
      { day: 'Day 2 (Tuesday)', mealName: 'Crispy Masal Vada with Mint Chutney', productId: masalVada.id, prepTip: 'Coarsely mix with minced green chilies and onions; fry till extra crunchy.', healthBenefit: 'Dense Bengal gram pulse protein and crunchy satiety.' },
      { day: 'Day 3 (Wednesday)', mealName: 'Super Sprouted Health Mix Porridge', productId: healthMix.id, prepTip: 'Boil with double milk and top with crushed walnuts and chia seeds.', healthBenefit: 'Nutrient-dense protein fuel with 20+ grains and nuts.' },
      { day: 'Day 4 (Thursday)', mealName: 'High-Protein Medu Vada with Sambar', productId: meduVada.id, prepTip: 'Whip batter vigorously for 2 minutes to trap air before shaping.', healthBenefit: 'High urad dal protein building blocks for muscle repair.' },
      { day: 'Day 5 (Friday)', mealName: 'Multimillet Dosa with Lentil Podi', productId: multimillet.id, prepTip: 'Serve hot off the tawa dusted generously with Idly Dosa Podi.', healthBenefit: 'Balanced protein-carb ratio for midday endurance.' },
      { day: 'Day 6 (Saturday)', mealName: 'Wheat Hakka Noodles with Tofu / Paneer', productId: wheatNoodles.id, prepTip: 'Wok-toss with paneer cubes, capsicum, and toasted sesame.', healthBenefit: 'High protein macro meal with clean whole wheat foundation.' },
      { day: 'Day 7 (Sunday)', mealName: 'Traditional Idli with Thick Instant Sambar', productId: idliDosa.id, prepTip: 'Use extra dal in the Sambar mix for a rich, aromatic high-protein stew.', healthBenefit: 'Easily assimilated fermented protein and plant enzymes.' },
    ];
  } else {
    // Daily Family Breakfast
    planTitle = '7-Day Authentic South Indian Family Breakfast';
    planOverview = 'A diverse and satisfying weekly schedule of iconic South Indian breakfast items—from soft fluffy idlis to aromatic dosas, steamed puttu, and wholesome noodles.';
    highlights = ['Authentic Home-Cooked Heritage Taste', 'Quick & Convenient 15-Minute Cooking', 'Complete Family Nutrition'];
    schedule = [
      { day: 'Day 1 (Monday)', mealName: 'Fluffy Idlis with Instant Sambar & Podi', productId: idliDosa.id, prepTip: 'Steam in idli cooker for 10-12 mins; pair with Chummy Sambar and Podi.', healthBenefit: 'Gentle on the stomach to start the work week fresh.' },
      { day: 'Day 2 (Tuesday)', mealName: 'Crispy Golden Rava Dosa', productId: ravaDosa.id, prepTip: 'Pour hot batter on very hot tawa from outside inward; do not spread with ladle.', healthBenefit: 'Restaurant-style crispy texture with zero hassle.' },
      { day: 'Day 3 (Wednesday)', mealName: 'Steamed Red Rice Puttu with Banana & Cardamom', productId: redRicePuttu.id, prepTip: 'Moisten slowly until mixture holds shape when squeezed; steam in puttu maker.', healthBenefit: 'Traditional Kerala breakfast rich in red bran fiber.' },
      { day: 'Day 4 (Thursday)', mealName: 'Nutritious Multimillet Dosa', productId: multimillet.id, prepTip: 'Cook till golden brown; pair with coconut chutney and tomato thokku.', healthBenefit: 'Wholesome multigrain blend supporting family immunity.' },
      { day: 'Day 5 (Friday)', mealName: 'Classic Ragi Dosa with Chutney', productId: ragiDosa.id, prepTip: 'Add chopped green chilies and curry leaves for extra zing.', healthBenefit: 'Rich calcium & iron boost before the weekend.' },
      { day: 'Day 6 (Saturday)', mealName: 'Family Weekend Noodles Feast', productId: wheatNoodles.id, prepTip: 'Sauté carrots, bell peppers, beans, and spring onions; toss with boiled noodles.', healthBenefit: 'Wholesome wheat alternative to junk instant noodles.' },
      { day: 'Day 7 (Sunday)', mealName: 'Crispy Medu Vada & Adai Dosa Combo', productId: adaiDosa.id, prepTip: 'Enjoy a leisurely Sunday brunch with freshly made crispy adai and medu vada.', healthBenefit: 'Festive protein-rich celebration for the entire family.' },
    ];
  }

  const recommendedPackIds = Array.from(new Set(schedule.map((s) => s.productId)));

  return {
    planTitle,
    planOverview,
    goal,
    familySize,
    dietaryHighlights: highlights,
    schedule,
    recommendedPackIds,
    nutritionTip: 'All Chummy Foods mixes are free from artificial chemicals, colors, and preservatives. Use cold-pressed oils for optimal taste and vitality.',
    isAiGenerated: false,
  };
}

/**
 * Chatbot Structured Response Schema
 */
const chatResponseSchema = {
  type: Type.OBJECT,
  properties: {
    reply: { type: Type.STRING },
    languageDetected: { type: Type.STRING },
    recommendedProductIds: {
      type: Type.ARRAY,
      items: { type: Type.NUMBER },
    },
    prepInstructions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    cookingTime: { type: Type.STRING },
    quickActions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ['reply', 'languageDetected', 'recommendedProductIds'],
};

/**
 * Handles Tamil, Tanglish & English AI Shopping & Recipe inquiries
 */
export async function generateChatResponse({ message, history = [] }) {
  const products = getProducts();
  const catalogContext = products.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    variantId: p.variantId,
    description: p.description,
    category: p.category,
    healthBenefits: p.healthBenefits,
  }));

  const ai = getGenAI();

  if (ai) {
    const prompt = `
You are Chummy Foods' expert AI Culinary & Shopping Assistant.
Chummy Foods (chummyfoods.com) is a revered brand producing authentic South Indian food mixes, millet staples, instant sambar, and podis.

PRODUCT CATALOG (You MUST ONLY recommend products from this list):
${JSON.stringify(catalogContext, null, 2)}

User's message: "${message}"

CRITICAL LANGUAGE & TONE RULES:
1. Detect user's language carefully:
   - If user writes in Tamil script (e.g., "வணக்கம்", "தோசை செய்வது எப்படி?"): Reply strictly in rich, polite Tamil script (தமிழ்).
   - If user writes in Tanglish (Tamil written in English script, e.g., "epdi adai dosa panradhu?", "health mix la enna benefits iruku?"): Reply warmly in fluent, natural Tanglish (e.g., "Vanakkam! Chummy Foods Adai Dosa Mix la super crispy adai easy ah panlaam...").
   - If user writes in English: Reply warmly and professionally in English.
2. In 'recommendedProductIds', only provide IDs of matching real products from the catalog above.
3. If user asks about recipes or preparation (e.g. how to make Ragi Dosa, Puttu, Sambar, Vada), provide accurate step-by-step points in 'prepInstructions'.
4. Provide estimated 'cookingTime' (e.g., "10 mins").
5. Provide 2-3 contextual follow-up questions or suggestions in 'quickActions' in the same language.
`;

    for (const model of MODEL_CANDIDATES) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: chatResponseSchema,
            temperature: 0.3,
          },
        });

        const rawText = extractResponseText(response);
        const parsed = JSON.parse(rawText);
        const validIds = new Set(products.map((p) => p.id));
        const sanitizedIds = (parsed.recommendedProductIds || []).filter((id) => validIds.has(id));

        return {
          ...parsed,
          recommendedProductIds: sanitizedIds,
          isAiGenerated: true,
          activeModel: model,
        };
      } catch (err) {
        console.warn(`Gemini chat model ${model} error:`, err.message);
      }
    }
  }

  // Curated multi-lingual fallback
  return getCuratedChatResponse(message, products);
}

/**
 * Intelligent Multi-lingual Fallback
 */
function getCuratedChatResponse(message = '', products) {
  const msg = (message || '').toLowerCase().trim();

  // Detect script/language
  const isTamilScript = /[\u0B80-\u0BFF]/.test(message);
  const isTanglish = /\b(epdi|enna|iruku|panradhu|seivathu|solunga|nallatha|thosa|dhosai|dosa|sambar|saapadu|vanakkam|romba|sapda|vara|vada)\b/i.test(message);

  const byHandle = (h) => products.find((p) => p.handle === h);

  // Match products
  const matched = [];
  if (msg.includes('ragi') || msg.includes('ராகி')) {
    const p1 = byHandle('ragi-idli-dosa-mix');
    const p2 = byHandle('ragi-hakka-noodles');
    if (p1) matched.push(p1);
    if (p2) matched.push(p2);
  }
  if (msg.includes('puttu') || msg.includes('புட்டு')) {
    const p = byHandle('red-rice-puttu-powder');
    if (p) matched.push(p);
  }
  if (msg.includes('health') || msg.includes('ஹெல்த்') || msg.includes('kanji') || msg.includes('porridge')) {
    const p = byHandle('health-mix');
    if (p) matched.push(p);
  }
  if (msg.includes('adai') || msg.includes('அடை')) {
    const p = byHandle('adai-dosa-mix');
    if (p) matched.push(p);
  }
  if (msg.includes('vada') || msg.includes('வட')) {
    const p1 = byHandle('medu-vada');
    const p2 = byHandle('masal-vada');
    if (p1) matched.push(p1);
    if (p2) matched.push(p2);
  }
  if (msg.includes('sambar') || msg.includes('சாம்பார்') || msg.includes('podi') || msg.includes('பொடி')) {
    const p1 = byHandle('instant-sambar-mix');
    const p2 = byHandle('idly-podi');
    if (p1) matched.push(p1);
    if (p2) matched.push(p2);
  }
  if (msg.includes('millet') || msg.includes('தினை') || msg.includes('சிறு தானிய')) {
    const p1 = byHandle('multimillet-mix');
    const p2 = byHandle('multimillet-hakka-noodles');
    if (p1) matched.push(p1);
    if (p2) matched.push(p2);
  }
  if (msg.includes('noodle') || msg.includes('நூடுல்ஸ்')) {
    const p1 = byHandle('wheat-hakka-noodles');
    const p2 = byHandle('ragi-hakka-noodles');
    if (p1) matched.push(p1);
    if (p2) matched.push(p2);
  }

  // Default fallback product if none detected
  if (matched.length === 0) {
    matched.push(products[0], products[1]);
  }

  const productIds = matched.map((p) => p.id);

  if (isTamilScript) {
    return {
      reply: `வணக்கம்! சம்மி ஃபுட்ஸ்-ன் பாரம்பரிய சுவையான உணவுகள் உங்கள் ஆரோக்கியத்திற்கு மிகச் சிறந்தது. நீங்கள் கேட்ட ${matched[0]?.title || 'உணவு'} தயாரிப்பது மிக சுலபம். இயற்கை முறையில் தயாரிக்கப்பட்டதால் உடலுக்கு அதிக சத்து மற்றும் ஆற்றலைத் தருகிறது.`,
      languageDetected: 'Tamil',
      recommendedProductIds: productIds,
      prepInstructions: [
        'மாவை தேவையான அளவு தண்ணீர் மற்றும் சிறிதளவு உப்பு சேர்த்து கட்டியில்லாமல் கலக்கவும்.',
        '10 முதல் 15 நிமிடங்கள் ஊறவைக்கவும்.',
        'சூடான தோசைக்கல்லில் அல்லது இட்லி பாத்திரத்தில் சமைக்கவும்.',
        'சுவையான சம்மி இட்லி பொடி அல்லது சாம்பாருடன் சூடாக பரிமாறவும்.',
      ],
      cookingTime: '10-15 நிமிடங்கள்',
      quickActions: ['ராகி தோசை எப்படி செய்வது?', 'ரெட் ரைஸ் புட்டு விளக்கம்', 'உடனடி சாம்பார் செய்முறை'],
      isAiGenerated: false,
    };
  }

  if (isTanglish) {
    return {
      reply: `Vanakkam! Chummy Foods oda authentic traditional product ${matched[0]?.title || 'mix'} pathi ketadhukku nandri. Idhula zero chemicals & zero preservatives. Traditional iron tawa-la senja super crispy ah varum!`,
      languageDetected: 'Tanglish',
      recommendedProductIds: productIds,
      prepInstructions: [
        'Mix required quantity with water into smooth lump-free batter.',
        '10 mins rest panna vacha nalla soft and crispy ah varum.',
        'Medium heat iron tawa-la spread panni cold-pressed nallennai oothunga.',
        'Chummy Instant Sambar or Idly Podi kooda hot ah serve pannunga!',
      ],
      cookingTime: '10 mins',
      quickActions: ['Adai Dosa epdi panradhu?', 'Health Mix benefits enna?', 'Weight loss-ku entha mix best?'],
      isAiGenerated: false,
    };
  }

  // English
  return {
    reply: `Hello and welcome to Chummy Foods! We take immense pride in crafting 100% natural, preservative-free traditional South Indian staples. For your request, here are our recommended products and preparation guidelines:`,
    languageDetected: 'English',
    recommendedProductIds: productIds,
    prepInstructions: [
      'Blend the mix with room-temperature water until a smooth, pouring consistency is achieved.',
      'Allow batter to rest for 10-15 minutes for natural grain hydration.',
      'Cook on a moderately heated cast-iron tawa with a drizzle of cold-pressed oil or ghee until golden brown.',
      'Serve fresh and hot with coconut chutney and Chummy Instant Sambar.',
    ],
    cookingTime: '10-12 mins',
    quickActions: ['How to prepare Red Rice Puttu?', 'Tell me about Diabetic Friendly mixes', 'Suggest High Protein Breakfast'],
    isAiGenerated: false,
  };
}

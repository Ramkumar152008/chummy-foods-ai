import rawData from '../chummy_products.json';

/**
 * Strips HTML tags and decodes common HTML entities/artifacts
 */
export function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/â€“|—|–/g, '-')
    .replace(/â€™/g, "'")
    .replace(/â€˜/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalizes and parses the raw Shopify products JSON
 */
export function getProducts() {
  const products = rawData?.products || [];
  
  return products.map((item) => {
    const firstVariant = item.variants && item.variants.length > 0 ? item.variants[0] : {};
    const firstImage = item.images && item.images.length > 0 ? item.images[0] : null;
    const variantId = firstVariant.id || null;
    const price = parseFloat(firstVariant.price || '0');
    const comparePrice = firstVariant.compare_at_price ? parseFloat(firstVariant.compare_at_price) : null;
    
    // Clean fallback image
    const fallbackImage = 'https://cdn.shopify.com/s/files/1/0699/4962/0453/files/Health_mix_front.png?v=1728638848';
    const image = firstImage?.src || fallbackImage;
    const allImages = item.images && item.images.length > 0 ? item.images.map((img) => img.src) : [image];

    // Determine category / highlight tags
    const titleLower = (item.title || '').toLowerCase();
    let category = 'Traditional South Indian';
    if (titleLower.includes('noodle')) category = 'Healthy Noodles';
    else if (titleLower.includes('combo')) category = 'Value Combos';
    else if (titleLower.includes('podi') || titleLower.includes('sambar')) category = 'Spices & Podis';
    else if (titleLower.includes('health mix') || titleLower.includes('ragi') || titleLower.includes('millet')) category = 'Millets & Health Mix';
    else if (titleLower.includes('murruku') || titleLower.includes('vada') || titleLower.includes('adhirasam')) category = 'Traditional Snacks';
    else if (titleLower.includes('idli') || titleLower.includes('dosa') || titleLower.includes('puttu') || titleLower.includes('kozhukattai')) category = 'Idli, Dosa & Breakfast';

    // Health tags
    const healthBenefits = [];
    if (titleLower.includes('millet') || titleLower.includes('ragi') || titleLower.includes('red rice')) {
      healthBenefits.push('Diabetic Friendly', 'High Fiber');
    }
    if (titleLower.includes('health mix') || titleLower.includes('vada') || titleLower.includes('adai')) {
      healthBenefits.push('High Protein', 'Sustained Energy');
    }
    if (titleLower.includes('puttu') || titleLower.includes('idli') || titleLower.includes('dosa') || titleLower.includes('rava')) {
      healthBenefits.push('Daily Breakfast', 'Easy Digest');
    }
    if (titleLower.includes('noodle') || titleLower.includes('combo')) {
      healthBenefits.push('Kids Tiffin', 'Quick 5-Min Meal');
    }
    if (healthBenefits.length === 0) {
      healthBenefits.push('100% Natural', 'Zero Preservatives');
    }

    return {
      id: item.id,
      title: item.title,
      handle: item.handle,
      variantId,
      price,
      compareAtPrice: comparePrice,
      image,
      images: allImages,
      bodyHtml: item.body_html || '',
      description: stripHtml(item.body_html) || `${item.title} - authentic traditional South Indian food crafted with pure, unadulterated ingredients for your family's health and wellness.`,
      productType: item.product_type || category,
      tags: item.tags || [],
      category,
      healthBenefits,
      cartUrl: variantId ? `https://chummyfoods.com/cart/${variantId}:1` : `https://chummyfoods.com/products/${item.handle}`,
    };
  });
}

/**
 * Get product by ID
 */
export function getProductById(id) {
  const products = getProducts();
  const numId = Number(id);
  return products.find((p) => p.id === numId || p.variantId === numId) || null;
}

/**
 * Get product by handle
 */
export function getProductByHandle(handle) {
  const products = getProducts();
  return products.find((p) => p.handle === handle) || null;
}

/**
 * Builds the Shopify permalink cart URL:
 * https://chummyfoods.com/cart/{variantId1}:1,{variantId2}:1
 */
export function buildCartUrl(items) {
  if (!items || items.length === 0) return 'https://chummyfoods.com';
  
  const segments = items
    .filter((item) => item && (item.variantId || item.id))
    .map((item) => {
      const vid = item.variantId || item.id;
      const qty = item.quantity || 1;
      return `${vid}:${qty}`;
    });

  if (segments.length === 0) return 'https://chummyfoods.com';
  return `https://chummyfoods.com/cart/${segments.join(',')}`;
}

/**
 * Suggests complementary products from chummy_products.json
 * to help user reach or exceed the ₹750 free delivery threshold.
 */
export function getUpsellRecommendations(currentProductIds = [], currentTotal = 0, threshold = 750) {
  const allProducts = getProducts();
  const currentSet = new Set(currentProductIds.map(String));
  
  // Available items not currently in selection
  const remaining = allProducts.filter((p) => !currentSet.has(String(p.id)) && !currentSet.has(String(p.variantId)));
  const deficit = Math.max(0, threshold - currentTotal);

  if (deficit <= 0) {
    // Already unlocked free delivery, recommend top breakfast / podi combos
    return remaining.slice(0, 3);
  }

  // Find products that bridge the deficit effectively
  const smartPicks = remaining
    .sort((a, b) => {
      const diffA = Math.abs(a.price - deficit);
      const diffB = Math.abs(b.price - deficit);
      return diffA - diffB;
    })
    .slice(0, 4);

  return smartPicks;
}

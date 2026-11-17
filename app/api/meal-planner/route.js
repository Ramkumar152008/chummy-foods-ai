import { NextResponse } from 'next/server';
import { generateMealPlan } from '@/lib/gemini';
import { getProducts, buildCartUrl, getUpsellRecommendations } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const goal = body.goal || 'Daily Family Breakfast';
    const familySize = body.familySize || '3-4';

    const plan = await generateMealPlan({ goal, familySize });
    const allProducts = getProducts();
    const productMap = new Map(allProducts.map((p) => [p.id, p]));

    // Enrich schedule items with full product details
    const enrichedSchedule = plan.schedule.map((item) => {
      const prod = productMap.get(item.productId) || allProducts[0];
      return {
        ...item,
        product: prod,
      };
    });

    // Determine unique recommended packs
    const uniqueIds = Array.from(new Set(plan.recommendedPackIds || enrichedSchedule.map((s) => s.product.id)));
    const recommendedProducts = uniqueIds
      .map((id) => productMap.get(id))
      .filter(Boolean);

    // Calculate bundle pricing
    const subtotal = recommendedProducts.reduce((sum, p) => sum + (p.price || 0), 0);
    const freeDeliveryThreshold = 750;
    const isFreeDelivery = subtotal >= freeDeliveryThreshold;
    const deliveryDeficit = Math.max(0, freeDeliveryThreshold - subtotal);
    const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

    // Upsell complementary products if under threshold
    const upsellItems = getUpsellRecommendations(uniqueIds, subtotal, freeDeliveryThreshold);

    // Build Shopify direct permalink cart URL for all recommended packs
    const cartItems = recommendedProducts.map((p) => ({
      variantId: p.variantId,
      quantity: 1,
    }));
    const shopifyBundleCartUrl = buildCartUrl(cartItems);

    return NextResponse.json({
      success: true,
      data: {
        ...plan,
        schedule: enrichedSchedule,
        recommendedProducts,
        pricing: {
          subtotal,
          freeDeliveryThreshold,
          isFreeDelivery,
          deliveryDeficit,
          progressPercent,
        },
        upsellItems,
        shopifyBundleCartUrl,
      },
    });
  } catch (error) {
    console.error('Meal Planner API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate meal plan' },
      { status: 500 }
    );
  }
}

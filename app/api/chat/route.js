import { NextResponse } from 'next/server';
import { generateChatResponse } from '@/lib/gemini';
import { getProducts, buildCartUrl } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const message = body.message || '';
    const history = body.history || [];

    if (!message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    const chatResult = await generateChatResponse({ message, history });
    const allProducts = getProducts();
    const productMap = new Map(allProducts.map((p) => [p.id, p]));

    // Enrich recommended products
    const recommendedProducts = (chatResult.recommendedProductIds || [])
      .map((id) => productMap.get(id))
      .filter(Boolean);

    // Build combo cart permalink if multiple products recommended
    const comboCartUrl = recommendedProducts.length > 0
      ? buildCartUrl(recommendedProducts.map((p) => ({ variantId: p.variantId, quantity: 1 })))
      : null;

    return NextResponse.json({
      success: true,
      data: {
        ...chatResult,
        recommendedProducts,
        comboCartUrl,
      },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

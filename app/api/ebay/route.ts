import { NextRequest, NextResponse } from 'next/server';
import { fetchCardPrices } from '@/utils/ebay';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({ error: 'Invalid query parameter' }, { status: 400 });
    }

    const items = await fetchCardPrices(query);
    return NextResponse.json(items);
}

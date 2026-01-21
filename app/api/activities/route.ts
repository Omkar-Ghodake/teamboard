import { NextResponse } from 'next/server';
import { getActivities } from '@/lib/data/activities';

export async function GET() {
  try {
    const activities = await getActivities();
    return NextResponse.json(activities);
  } catch (error) {
    console.error('API error fetching activities:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}

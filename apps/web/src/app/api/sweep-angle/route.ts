import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

let cachedAngle = 0;
let lastUpdate = 0;

export async function GET() {
  try {
    // Call the Python detection endpoint
    const response = await fetch('http://localhost:5000/angle', {
      signal: AbortSignal.timeout(2000),
    });

    if (response.ok) {
      const data = await response.json();
      cachedAngle = data.angle;
      lastUpdate = Date.now();

      return NextResponse.json({
        angle: data.angle,
        detecting: data.detecting,
        timestamp: lastUpdate,
      });
    }
  } catch (error) {
    // Return cached angle if detection service is down
    return NextResponse.json({
      angle: cachedAngle,
      detecting: false,
      timestamp: lastUpdate,
      error: 'Detection service unavailable',
    });
  }

  return NextResponse.json({
    angle: cachedAngle,
    detecting: false,
    timestamp: lastUpdate,
  });
}

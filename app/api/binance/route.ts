import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const timeParam = searchParams.get("time");

  if (!timeParam) {
    return NextResponse.json({ error: "Missing 'time' query parameter" }, { status: 400 });
  }

  const unixTimeMs = Number(timeParam);

  if (isNaN(unixTimeMs)) {
    return NextResponse.json({ error: "Invalid 'time' format" }, { status: 400 });
  }

  const res = await fetch(`https://testnet.binancefuture.com/fapi/v1/klines?symbol=BTCUSDT&interval=1m&startTime=${unixTimeMs}&limit=1`);
  const data = await res.json();
  return NextResponse.json(data);
}
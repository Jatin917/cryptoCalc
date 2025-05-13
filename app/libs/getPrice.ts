"use server"
export async function getPrice() {
    let toPrice = await fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&startTime=${1746897000}&limit=1`);
    toPrice = await toPrice.json();
    let fromPrice = await fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&startTime=${1746983400}&limit=1`);
    fromPrice = await fromPrice.json();
    console.log("prices are ", toPrice)
}
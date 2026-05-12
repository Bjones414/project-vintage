export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomBetween(minMs: number, maxMs: number): number {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

export async function detailPageDelay(): Promise<void> {
  await sleep(randomBetween(5_000, 10_000));
}

export async function auctionCodeDelay(): Promise<void> {
  await sleep(randomBetween(60_000, 90_000));
}

export async function paginationDelay(): Promise<void> {
  await sleep(randomBetween(3_000, 6_000));
}

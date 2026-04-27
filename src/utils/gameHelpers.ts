import type { Player, CardType, RawCard } from "@/types/game";

let activeSounds: HTMLAudioElement[] = [];
let backgroundMusic: HTMLAudioElement | null = null;

export const playSound = (
  file: string,
  {
    volume = 0.5,
    loop = false,
    isBackground = false,
  }: {
    volume?: number;
    loop?: boolean;
    isBackground?: boolean;
  } = {}
) => {
  // stop previous bg music before creating a new one
  if (isBackground && backgroundMusic) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
  }

  const audio = new Audio(`/sounds/${file}`);
  audio.volume = volume;
  audio.loop = loop;

  if (isBackground) {
    backgroundMusic = audio;
  } else {
    activeSounds.push(audio);

    audio.onended = () => {
      activeSounds = activeSounds.filter((a) => a !== audio);
    };
  }

  void audio.play();

  return audio;
};

export const stopAllSounds = () => {
  activeSounds.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });

  activeSounds = [];

  if (backgroundMusic) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    backgroundMusic = null;
  }
};

export const restartBackgroundMusic = () => {
  if (!backgroundMusic) return;

  backgroundMusic.currentTime = 0;
  void backgroundMusic.play();
};

export const toggleBackgroundMusic = () => {
  if (!backgroundMusic) return false;

  if (backgroundMusic.paused) {
    void backgroundMusic.play();
    return true;
  }

  backgroundMusic.pause();
  return false;
};

export const isBackgroundMusicPlaying = () => {
  return !!backgroundMusic && !backgroundMusic.paused;
};

export function getNeighbors(index: number) {
  const row = Math.floor(index / 3);
  const col = index % 3;

  const neighbors: { index: number; side: keyof CardType; opposite: keyof CardType }[] = [];

  if (row > 0) neighbors.push({ index: index - 3, side: "top", opposite: "bottom" });
  if (row < 2) neighbors.push({ index: index + 3, side: "bottom", opposite: "top" });
  if (col > 0) neighbors.push({ index: index - 1, side: "left", opposite: "right" });
  if (col < 2) neighbors.push({ index: index + 1, side: "right", opposite: "left" });

  return neighbors;
}

export function applyCaptures(board: (CardType | null)[], placedIndex: number, card: CardType) {
  const updated = [...board];
  const neighbors = getNeighbors(placedIndex);

  for (const n of neighbors) {
    const target = updated[n.index];
    if (!target) continue;
    if (target.owner === card.owner) continue;

    if (card[n.side] > target[n.opposite]) {
      updated[n.index] = { ...target, owner: card.owner };
      playSound("card-turn.wav");
    }
  }

  return updated;
}

// Fisher-Yates shuffle
// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
// Start from the end of the array and repeatedly swap each item with a random item before it (or itself)
export function shuffleDeck<T>(deck: T[]): T[] {
  const shuffled = [...deck];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export function sanitizeCardName(name: string): string {
  return name
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\s+/g, "-");
}

export function formatCard(card: RawCard): CardType {
  const [top, left, right, bottom] = card.ranks;

  return {
    id: card.id,
    name: card.name,
    top,
    right,
    bottom,
    left,
    image: `/cards/${sanitizeCardName(card.name)}.png`,
    element: card.element?.toLowerCase() ?? "neutral",
    level: card.level
  };
}

export function assignOwner(cards: RawCard[], owner: Player): CardType[] {
  return cards.map(card => ({
    ...formatCard(card),
    owner,
    id: `${card.id}-${sanitizeCardName(card.name)}-${owner}`
  }));
}

export function dealHands(deck: RawCard[]) {
  const shuffled = shuffleDeck(deck);

  return {
    player1Cards: assignOwner(shuffled.slice(0, 5), "p1"),
    player2Cards: assignOwner(shuffled.slice(5, 10), "p2"),
    computerCards: assignOwner(shuffled.slice(10, 15), "computer")
  };
}

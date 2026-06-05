"use client";

import { useEffect, useState } from "react";

const ROWS = 6;

const LETTERS: Record<string, string[]> = {
  C: [
    "   ____ ",
    "  / ___|",
    " | |    ",
    " | |___ ",
    "  \\____|",
    "        ",
  ],
  h: [
    "  _     ",
    " | |__  ",
    " | '_ \\ ",
    " | | | |",
    " |_| |_|",
    "        ",
  ],
  r: [
    "       ",
    "  _ __ ",
    " | '__|",
    " | |   ",
    " |_|   ",
    "       ",
  ],
  i: ["  _ ", " (_)", " | |", " | |", " |_|", "    "],
  s: [
    "      ",
    "  ___ ",
    " / __|",
    " \\__ \\",
    " |___/",
    "      ",
  ],
  t: [
    "  _   ",
    " | |_ ",
    " | __|",
    " | |_ ",
    "  \\__|",
    "      ",
  ],
  o: [
    "        ",
    "   ___  ",
    "  / _ \\ ",
    " | (_) |",
    "  \\___/ ",
    "        ",
  ],
  p: [
    "        ",
    "  _ __  ",
    " | '_ \\ ",
    " | |_) |",
    " | .__/ ",
    " |_|    ",
  ],
  e: [
    "       ",
    "   ___ ",
    "  / _ \\",
    " |  __/",
    "  \\___|",
    "       ",
  ],
  P: [
    "  ____  ",
    " |  _ \\ ",
    " | |_) |",
    " |  __/ ",
    " |_|    ",
    "        ",
  ],
  g: [
    "        ",
    "   __ _ ",
    "  / _` |",
    " | (_| |",
    "  \\__, |",
    "  |___/ ",
  ],
  " ": [
    "    ",
    "    ",
    "    ",
    "    ",
    "    ",
    "    ",
  ],
};

const WORD = "Chris Prigg";
const TOTAL = WORD.length;
const REVEAL_MS = 110;

function renderWord(word: string, revealed: number): string {
  const visible = word.slice(0, revealed);
  if (visible.length === 0) return "";
  const lines: string[] = [];
  for (let row = 0; row < ROWS; row++) {
    let line = "";
    for (const ch of visible) {
      line += LETTERS[ch][row];
    }
    lines.push(line);
  }
  return lines.join("\n");
}

export default function AsciiFooter() {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setRevealed(TOTAL);
      return;
    }
    const id = window.setInterval(() => {
      setRevealed((n) => {
        if (n >= TOTAL) {
          window.clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, REVEAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      role="img"
      aria-label="Chris Prigg"
      className="w-full flex justify-center pt-4 pb-8 text-zinc-400 dark:text-zinc-600 select-none overflow-x-auto"
    >
      <pre
        aria-hidden="true"
        className="font-mono leading-none text-[10px] sm:text-xs md:text-sm m-0 min-h-[6em] whitespace-pre"
      >
        {renderWord(WORD, revealed)}
      </pre>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useContent } from "@/lib/content-context";
import { messengerUrl } from "@/lib/messenger";
import { formatPeso } from "@/lib/format";
import type { Faq } from "@/lib/types";

type Cta = { label: string; href: string };
type Message = {
  id: number;
  from: "bot" | "user";
  text: string;
  ctas?: Cta[];
};

type BotOptions = { ctas?: Cta[]; chips?: string[] };

const STARTERS = [
  "How do I order?",
  "Shipping & delivery",
  "What are the prices?",
  "Returns & exchanges",
];

const FOLLOW_UPS = ["Something else", "Talk to a human"];

const STOP_WORDS = new Set([
  "the", "and", "how", "what", "when", "where", "your", "you", "are", "for",
  "can", "does", "this", "that", "with", "from", "have", "has", "about", "tell",
  "please", "micsapparel", "mics", "apparel",
]);

const INTENTS: { test: RegExp; faq: RegExp }[] = [
  { test: /ship|deliver|freight|padala/, faq: /ship|deliver/ },
  { test: /return|exchange|refund|palit/, faq: /return|exchange/ },
  { test: /payment|gcash|maya|cod|bank|pay/, faq: /payment|method/ },
  { test: /wholesale|bulk|resell/, faq: /bulk|wholesale/ },
  { test: /where|location|located|address|based/, faq: /where|based/ },
  { test: /authentic|original|legit|genuine/, faq: /authentic/ },
  { test: /order|buy|purchase|paano/, faq: /order/ },
];

function findFaq(faqs: Faq[], pattern: RegExp): string | null {
  const hit = faqs.find((f) => pattern.test(f.question.toLowerCase()));
  return hit ? hit.answer : null;
}

function bestFaqMatch(faqs: Faq[], input: string): string | null {
  const words = input
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
  if (words.length === 0) return null;

  let best: { answer: string; score: number } | null = null;
  for (const faq of faqs) {
    const question = faq.question.toLowerCase();
    let score = 0;
    for (const word of words) {
      if (question.includes(word)) score += 1;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { answer: faq.answer, score };
    }
  }
  return best ? best.answer : null;
}

export default function MessengerChat() {
  const { business, faqs } = useContent();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chips, setChips] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");

  const idRef = useRef(0);
  const timersRef = useRef<number[]>([]);
  const startedRef = useRef(false);
  const minPriceRef = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const messengerLink = messengerUrl(
    business.social.messenger,
    "Hi MicsApparel! I have a question from your website."
  );

  const nextId = () => {
    idRef.current += 1;
    return idRef.current;
  };

  function botSay(text: string, opts: BotOptions = {}) {
    setChips([]);
    setTyping(true);
    const delay = 650 + Math.min(text.length * 6, 700);
    const t = window.setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { id: nextId(), from: "bot", text, ctas: opts.ctas }]);
      setChips(opts.chips ?? []);
    }, delay);
    timersRef.current.push(t);
  }

  function pushUser(text: string) {
    setChips([]);
    setMessages((prev) => [...prev, { id: nextId(), from: "user", text }]);
  }

  function handOff() {
    botSay(
      "Sure — tap below to chat with us directly on Messenger. We usually reply fast.",
      {
        ctas: [{ label: "Continue in Messenger", href: messengerLink }],
        chips: STARTERS,
      }
    );
  }

  async function priceAnswer() {
    if (minPriceRef.current === null) {
      try {
        const res = await fetch("/api/catalog");
        const data = await res.json();
        const prices: number[] = (data.products ?? [])
          .map((p: { price?: number }) => p.price)
          .filter((p: unknown): p is number => typeof p === "number");
        if (prices.length) minPriceRef.current = Math.min(...prices);
      } catch {
        // leave null; answer below still works
      }
    }
    const min = minPriceRef.current;
    botSay(
      min !== null
        ? `Pieces start at ${formatPeso(min)} — quality streetwear that won't break the bank. Browse the full lineup below.`
        : "Check the shop for current prices — new drops land regularly.",
      {
        ctas: [{ label: "Browse products", href: "/products" }],
        chips: FOLLOW_UPS,
      }
    );
  }

  async function handleUserInput(raw: string) {
    const text = raw.trim();
    if (!text || typing) return;
    setInput("");
    pushUser(text);

    const lower = text.toLowerCase();

    if (/human|talk to|real person|agent/.test(lower)) {
      handOff();
      return;
    }
    if (/something else|another question|more/.test(lower)) {
      botSay("What would you like to know?", { chips: STARTERS });
      return;
    }
    if (/price|cost|how much|magkano|mura|mahal/.test(lower)) {
      await priceAnswer();
      return;
    }

    for (const intent of INTENTS) {
      if (!intent.test.test(lower)) continue;
      const answer = findFaq(faqs, intent.faq);
      if (answer) {
        botSay(answer, { chips: FOLLOW_UPS });
        return;
      }
    }

    const matched = bestFaqMatch(faqs, lower);
    if (matched) {
      botSay(matched, { chips: FOLLOW_UPS });
      return;
    }

    botSay(
      "I'm not sure about that one yet — a human on Messenger can help right away.",
      {
        ctas: [{ label: "Continue in Messenger", href: messengerLink }],
        chips: STARTERS,
      }
    );
  }

  function runCta(href: string) {
    if (/^https?:\/\//.test(href)) return;
    setOpen(false);
    router.push(href);
  }

  function renderCta(cta: Cta) {
    const external = /^https?:\/\//.test(cta.href);
    const className =
      "px-3.5 py-2 bg-black text-white text-[10px] font-bold tracking-[0.15em] uppercase hover:bg-neutral-800 transition-colors";
    if (external) {
      return (
        <a key={cta.href} href={cta.href} target="_blank" rel="noopener noreferrer" className={className}>
          {cta.label}
        </a>
      );
    }
    return (
      <button key={cta.href} type="button" onClick={() => runCta(cta.href)} className={className}>
        {cta.label}
      </button>
    );
  }

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open || startedRef.current) return;
    startedRef.current = true;
    botSay(
      `Hi! I'm the MicsApparel assistant. Ask me about orders, shipping, prices, and more.`,
      {
        chips: STARTERS,
        ctas: [{ label: "Continue in Messenger", href: messengerLink }],
      }
    );
    const t = window.setTimeout(() => inputRef.current?.focus(), 400);
    timersRef.current.push(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, chips]);

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed right-4 bottom-20 lg:right-6 lg:bottom-6 z-[55] w-14 h-14 bg-black text-white flex items-center justify-center shadow-lg hover:bg-neutral-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.26.35.27.57l.05 1.78c.02.57.6.94 1.12.71l1.99-.88c.17-.07.36-.09.53-.04.91.25 1.88.38 2.9.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm6 6.76c0 1.62-1.35 2.94-3 2.94-1.05 0-2.05-.43-2.77-1.17l-.79-.8a.5.5 0 0 0-.7 0l-.86.84C9.17 11.1 8.24 11.5 7.2 11.5c-1.65 0-3-1.32-3-2.94S5.55 5.62 7.2 5.62c1.04 0 1.97.4 2.68 1.04l.76.78c.19.2.51.2.7 0l.8-.79A3.64 3.64 0 0 1 14.96 5.6c1.65 0 3.04 1.32 3.04 2.94v.22z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed z-[55] left-3 right-3 top-20 bottom-36 sm:left-auto sm:right-4 sm:bottom-36 sm:w-[380px] sm:h-[min(540px,calc(100dvh-220px))] sm:top-auto lg:right-6 lg:bottom-24 lg:h-[min(540px,calc(100dvh-160px))] bg-white border border-neutral-200 shadow-2xl flex flex-col animate-chat-pop"
          role="dialog"
          aria-label="Chat with MicsApparel"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-200 bg-black text-white shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={business.logo}
              alt=""
              className="w-9 h-9 object-cover ring-1 ring-white/30 bg-white"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.src.endsWith("/logo.svg")) return;
                target.src = "/logo.svg";
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-oswald text-sm font-bold tracking-[0.12em] uppercase leading-tight">
                MicsApparel
              </p>
              <p className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" aria-hidden="true" />
                Auto-replies instantly
              </p>
            </div>
            <a
              href={messengerLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-neutral-400 hover:text-white transition-colors"
              aria-label="Open Messenger"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.26.35.27.57l.05 1.78c.02.57.6.94 1.12.71l1.99-.88c.17-.07.36-.09.53-.04.91.25 1.88.38 2.9.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm6 6.76c0 1.62-1.35 2.94-3 2.94-1.05 0-2.05-.43-2.77-1.17l-.79-.8a.5.5 0 0 0-.7 0l-.86.84C9.17 11.1 8.24 11.5 7.2 11.5c-1.65 0-3-1.32-3-2.94S5.55 5.62 7.2 5.62c1.04 0 1.97.4 2.68 1.04l.76.78c.19.2.51.2.7 0l.8-.79A3.64 3.64 0 0 1 14.96 5.6c1.65 0 3.04 1.32 3.04 2.94v.22z" />
              </svg>
            </a>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-2 text-neutral-400 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-neutral-50">
            {messages.map((msg) => (
              <div key={msg.id}>
                <div
                  className={`max-w-[88%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                    msg.from === "user"
                      ? "bg-black text-white ml-auto rounded-2xl rounded-tr-sm"
                      : "bg-white text-neutral-800 border border-neutral-200 rounded-2xl rounded-tl-sm"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.ctas && msg.ctas.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.ctas.map((cta) => renderCta(cta))}
                  </div>
                )}
              </div>
            ))}

            {typing && (
              <div className="bg-white border border-neutral-200 rounded-2xl rounded-tl-sm px-4 py-3 w-fit" aria-hidden="true">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                </span>
              </div>
            )}
          </div>

          {/* Quick replies */}
          {chips.length > 0 && !typing && (
            <div className="flex flex-wrap gap-2 px-4 py-3 border-t border-neutral-200 bg-white shrink-0">
              {chips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleUserInput(chip)}
                  className="px-3 py-2 border border-neutral-300 text-[10px] font-bold tracking-[0.12em] uppercase text-neutral-600 hover:border-black hover:text-black transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            className="flex items-center gap-2 px-3 py-3 border-t border-neutral-200 bg-white shrink-0"
            onSubmit={(e) => {
              e.preventDefault();
              handleUserInput(input);
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              aria-label="Message"
              className="flex-1 min-w-0 px-3 py-2.5 bg-neutral-100 border border-transparent text-sm focus:outline-none focus:border-black transition-colors"
            />
            <button
              type="submit"
              disabled={typing || !input.trim()}
              className="p-2.5 bg-black text-white hover:bg-neutral-800 transition-colors disabled:opacity-40"
              aria-label="Send message"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}

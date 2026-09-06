import { useState } from "react";
import ChatWidget from "@/components/landing/ChatWidget";
import { WHATSAPP_URL } from "@/lib/constants";

/*
 * One floating launcher, not two. The old Ask Glam Bot bubble and the
 * floating WhatsApp bubble are merged here. In-page WhatsApp links are
 * untouched, several enquiry paths depend on them.
 *
 * Position matches the old chat bubble: bottom-24 on mobile so it clears
 * the sticky Book Your Glam bar, bottom-6 from large up. Do not move it
 * over the sticky CTA, that collision was fixed once already.
 */

const WHATSAPP_HREF = `${WHATSAPP_URL}?text=${encodeURIComponent(
  "Hi Carnival Glam Hub",
)}`;

const openExternal = (href: string) => {
  const topWindow = window.top;
  if (topWindow && topWindow !== window) {
    topWindow.location.href = href;
    return;
  }
  const win = window.open(href, "_blank", "noopener,noreferrer");
  if (win) {
    win.opener = null;
    return;
  }
  window.location.href = href;
};

const HelpLauncher = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <ChatWidget open={chatOpen} onOpenChange={setChatOpen} />

      {!chatOpen && (
        <div className="fixed bottom-24 left-4 z-50 lg:bottom-6 lg:left-6 flex flex-col items-start gap-2">
          {menuOpen && (
            <div className="w-[min(280px,calc(100vw-2rem))] rounded-2xl border border-border bg-background p-2 shadow-2xl">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setChatOpen(true);
                }}
                className="flex w-full min-h-[44px] flex-col items-start rounded-xl px-3 py-2 text-left hover:bg-muted transition-colors"
              >
                <span className="font-body text-sm font-semibold text-foreground">
                  Ask JADE
                </span>
                <span className="font-body text-sm text-muted-foreground leading-snug">
                  Quick answers about services, destinations, bookings and Carnival morning.
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openExternal(WHATSAPP_HREF);
                }}
                className="flex w-full min-h-[44px] flex-col items-start rounded-xl px-3 py-2 text-left hover:bg-muted transition-colors"
              >
                <span className="font-body text-sm font-semibold text-foreground">
                  WhatsApp the team
                </span>
                <span className="font-body text-sm text-muted-foreground leading-snug">
                  Speak to a person.
                </span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label="Ask JADE or message the team"
            className="flex min-h-[44px] items-center gap-2 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="font-body text-sm font-semibold">Ask JADE</span>
          </button>
        </div>
      )}
    </>
  );
};

export default HelpLauncher;

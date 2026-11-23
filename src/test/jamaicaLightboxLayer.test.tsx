/**
 * /jamaica gallery lightbox sits above the cookie banner, Ask JADE and the
 * sticky booking bar, hides them while a photo is open, restores them on
 * close and never answers the cookie question for the visitor.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import JamaicaGallery from "@/components/destinations/JamaicaGallery";
import CookieConsent from "@/components/CookieConsent";
import HelpLauncher from "@/components/landing/HelpLauncher";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";
import { CONSENT_STORAGE_KEY, getConsent } from "@/lib/consent";
import { HIDE_UNDER_LIGHTBOX_ATTR, LIGHTBOX_OPEN_ATTR } from "@/lib/lightboxLayer";

const zOf = (el: Element) => Number(el.className.match(/\bz-\[?(\d+)\]?/)?.[1] ?? 0);

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/jamaica"]}>
      <JamaicaGallery />
      <HelpLauncher />
      <CookieConsent />
      <StickyMobileCTA />
    </MemoryRouter>,
  );

describe("Jamaica gallery lightbox layering", () => {
  beforeEach(() => {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
    document.documentElement.removeAttribute(LIGHTBOX_OPEN_ATTR);
  });

  it("stacks above the cookie banner, Ask JADE and the sticky bar", () => {
    renderPage();
    const banner = screen.getByTestId("cookie-consent");
    const launcher = screen.getByTestId("help-launcher");
    const sticky = screen.getByTestId("sticky-mobile-cta");
    fireEvent.click(screen.getByRole("button", { name: "View larger photo 1 of 5" }));
    const overlay = screen.getByTestId("lightbox-overlay");
    const box = screen.getByTestId("lightbox");
    const top = Math.max(zOf(banner), zOf(launcher), zOf(sticky));
    expect(top).toBe(60);
    expect(zOf(overlay)).toBeGreaterThan(top);
    expect(zOf(box)).toBeGreaterThan(top);
    // Inside the safe area on every side, with all three controls present.
    expect(box.classList.contains("lightbox-safe")).toBe(true);
    expect(screen.getByRole("button", { name: "Close photo" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous photo" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next photo" })).toBeInTheDocument();
    expect(box.querySelector("img")!.classList.contains("lightbox-photo")).toBe(true);
  });

  it("hides the three floating layers while open and restores them, with consent still unanswered", () => {
    renderPage();
    expect(getConsent()).toBe("unknown");
    const layers = ["cookie-consent", "help-launcher", "sticky-mobile-cta"].map((id) => screen.getByTestId(id));
    for (const el of layers) expect(el.hasAttribute(HIDE_UNDER_LIGHTBOX_ATTR)).toBe(true);
    expect(document.documentElement.hasAttribute(LIGHTBOX_OPEN_ATTR)).toBe(false);

    fireEvent.click(screen.getByRole("button", { name: "View larger photo 2 of 5" }));
    expect(document.documentElement.hasAttribute(LIGHTBOX_OPEN_ATTR)).toBe(true);

    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Close photo" }));
    });
    expect(screen.queryByTestId("lightbox")).toBeNull();
    expect(document.documentElement.hasAttribute(LIGHTBOX_OPEN_ATTR)).toBe(false);
    // Same banner, still unanswered, nothing stored.
    expect(screen.getByTestId("cookie-consent")).toBe(layers[0]);
    expect(screen.getByTestId("cookie-accept")).toBeInTheDocument();
    expect(getConsent()).toBe("unknown");
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull();
    expect(screen.getByTestId("help-launcher")).toBe(layers[1]);
    expect(screen.getByTestId("sticky-mobile-cta")).toBe(layers[2]);
  });

  it("fits inside the screen and every safe-area inset", () => {
    const css = readFileSync(resolve(process.cwd(), "src/index.css"), "utf8");
    for (const side of ["top", "right", "bottom", "left"]) {
      expect(css).toContain(`max(1rem, env(safe-area-inset-${side}))`);
    }
    expect(css).toContain(
      "max-height: calc(100dvh - max(1rem, env(safe-area-inset-top)) - max(1rem, env(safe-area-inset-bottom)));",
    );
  });

  it("hides by visibility only, so nothing unmounts or changes state", () => {
    const css = readFileSync(resolve(process.cwd(), "src/index.css"), "utf8");
    expect(css).toMatch(
      /html\[data-lightbox-open\] \[data-hide-under-lightbox\] \{\s*visibility: hidden !important;\s*pointer-events: none !important;\s*\}/,
    );
  });
});

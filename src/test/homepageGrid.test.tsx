/**
 * ONWARD DESTINATION RULE, at the component boundary.
 *
 * The homepage grid is in scope for the rule, so this test asserts the
 * rendered card set itself rather than the helper. The helper was already
 * passing while the grid still shipped wrapped Carnivals, so the helper
 * alone is not enough enforcement.
 *
 * The clock is fixed on purpose, so this never starts failing on its own.
 */
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Destinations from "@/components/landing/Destinations";
import { destinations } from "@/data/destinations";
import { WHATSAPP_URL } from "@/lib/constants";

const FIXED_NOW = new Date("2026-08-26T12:00:00Z");

const WRAPPED_SLUGS = [
  "guyana",
  "saint-lucia",
  "toronto",
  "barbados",
  "antigua",
  "grenada",
] as const;

function renderGrid() {
  return render(
    <MemoryRouter>
      <Destinations />
    </MemoryRouter>,
  );
}

describe("homepage destination grid", () => {
  beforeAll(() => {
    class StubObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    }
    (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
      StubObserver;
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(FIXED_NOW);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("renders no wrapped Carnival as a card", () => {
    const { container } = renderGrid();
    const grid = container.querySelector("#destinations");
    expect(grid).not.toBeNull();
    const html = grid!.innerHTML;

    for (const slug of WRAPPED_SLUGS) {
      const name = destinations.find((d) => d.slug === slug)?.name;
      if (!name) continue;
      expect(html).not.toContain(name);
    }
  });

  it("never shows a wrapped badge or a Gallery link in the grid", () => {
    const { container } = renderGrid();
    const html = container.innerHTML;
    expect(html.toLowerCase()).not.toContain("wrapped");
    expect(container.querySelectorAll('a[href="/#gallery"]').length).toBe(0);
  });

  it("still shows the upcoming Carnivals", () => {
    const { container } = renderGrid();
    const text = container.textContent ?? "";
    for (const name of ["Miami Carnival", "Tobago Carnival"]) {
      expect(text).toContain(name);
    }
  });

  it("sends a territory with no date and no event to a WhatsApp enquiry", () => {
    const { container } = renderGrid();
    const anchors: HTMLAnchorElement[] = Array.from(
      container.querySelectorAll<HTMLAnchorElement>("a"),
    );
    const anchor = anchors.find((a) =>
      /Ask about Atlanta/i.test(a.textContent ?? ""),
    );
    expect(anchor).toBeTruthy();
    expect(anchor!.getAttribute("href")).toContain(WHATSAPP_URL);
    expect(anchor!.getAttribute("href")).not.toContain("masos.app/events");
  });

  it("never offers Epic Cruise as a booking", () => {
    const { container } = renderGrid();
    const anchors: HTMLAnchorElement[] = Array.from(
      container.querySelectorAll<HTMLAnchorElement>("a"),
    );
    const epic = anchors.find((a) => /Epic Cruise/i.test(a.textContent ?? ""));
    expect(epic).toBeTruthy();
    expect(epic!.getAttribute("href") ?? "").not.toContain("masos.app/events/");
  });
});

/**
 * Homepage "Book now" territory row and where generic "Book Now" buttons go.
 *
 * Today (22 November 2026) the row is Trinidad, Jamaica, Grenada, in that
 * order, each going straight to its own MasOS event. The clock is fixed so
 * the test never starts failing on its own.
 */
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { render } from "@testing-library/react";

import TerritoryBookingRow from "@/components/booking/TerritoryBookingRow";
import { getActiveBookingTerritories, resolveBookNowLink } from "@/lib/bookingBar";

const TODAY = new Date("2026-11-22T12:00:00Z");
const TRINIDAD = "https://carnivalglamhub.masos.app/events/cef3860d-c2e6-4753-a065-4ea39c0eb8cb";
const JAMAICA = "https://carnivalglamhub.masos.app/events/0ad062ce-d1e0-4838-aeaf-f418ed526440";
const GRENADA = "https://carnivalglamhub.masos.app/events/19940fc1-1fa1-4d34-8a7b-a4c3562df100";

describe("homepage booking row", () => {
  it("lists exactly Trinidad, Jamaica and Grenada (pre-register) today", () => {
    const row = getActiveBookingTerritories(TODAY);
    expect(row.map((t) => t.label)).toEqual(["Trinidad", "Jamaica", "Grenada (pre-register)"]);
    expect(row.map((t) => t.href.split("?")[0])).toEqual([TRINIDAD, JAMAICA, GRENADA]);
  });

  it("carries the site UTM convention on every button", () => {
    for (const t of getActiveBookingTerritories(TODAY)) {
      const u = new URL(t.href);
      expect(u.searchParams.get("utm_source")).toBe("carnivalglamhub");
      expect(u.searchParams.get("utm_medium")).toBe("website");
      expect(u.searchParams.get("utm_campaign")).toBe("home_booking_bar");
      expect(u.searchParams.get("utm_content")).toBe(t.slug);
    }
  });

  it("drops Trinidad the day after its season ends", () => {
    const row = getActiveBookingTerritories(new Date("2027-02-10T12:00:00Z"));
    expect(row.map((t) => t.slug)).not.toContain("trinidad");
    expect(row.map((t) => t.slug)).toContain("jamaica");
  });

  describe("rendered", () => {
    beforeAll(() => {
      vi.useFakeTimers({ toFake: ["Date"] });
      vi.setSystemTime(TODAY);
    });
    afterAll(() => vi.useRealTimers());

    it("renders three buttons opening each MasOS event in a new tab", () => {
      const { container } = render(<TerritoryBookingRow anchor />);
      const links = Array.from(container.querySelectorAll("a"));
      expect(links.map((a) => a.textContent?.replace(" (opens in a new tab)", ""))).toEqual([
        "Trinidad",
        "Jamaica",
        "Grenada(pre-register)",
      ]);
      expect(links.map((a) => a.getAttribute("href")!.split("?")[0])).toEqual([TRINIDAD, JAMAICA, GRENADA]);
      for (const a of links) {
        expect(a.getAttribute("target")).toBe("_blank");
        expect(a.getAttribute("rel")).toBe("noopener noreferrer");
        expect(a.getAttribute("href")).not.toMatch(/masos\.app\/events(\?|$)/);
      }
      expect(container.querySelector("#book-territory")).not.toBeNull();
    });
  });
});

describe("generic Book Now buttons", () => {
  it("scroll to the row on the homepage, never the bare events list", () => {
    expect(resolveBookNowLink("/", "navbar_book_now", TODAY)).toEqual({ href: "#book-territory", external: false });
  });

  it("send other non-territory pages to the homepage row", () => {
    expect(resolveBookNowLink("/about", "navbar_book_now", TODAY)).toEqual({ href: "/#book-territory", external: false });
  });

  it("deep-link a territory page to its own event", () => {
    expect(resolveBookNowLink("/jamaica", "sticky", TODAY).href.split("?")[0]).toBe(JAMAICA);
    expect(resolveBookNowLink("/trinidad", "sticky", TODAY).href.split("?")[0]).toBe(TRINIDAD);
    expect(resolveBookNowLink("/trinidad-carnival-2027", "sticky", TODAY).href.split("?")[0]).toBe(TRINIDAD);
    expect(resolveBookNowLink("/grenada", "sticky", TODAY).href.split("?")[0]).toBe(GRENADA);
  });

  it("never deep-link a wrapped territory", () => {
    expect(resolveBookNowLink("/barbados", "sticky", TODAY)).toEqual({ href: "/#book-territory", external: false });
  });
});

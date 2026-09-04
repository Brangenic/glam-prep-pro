/**
 * A one product territory must never render a package grid with an empty
 * row beside the single card. When there is exactly one package the
 * section becomes two columns, with the territory's companion panel on the
 * right. With no companion content the card centres instead.
 *
 * This is a pattern rule, not a Grenada special case, so the assertions
 * work off the package count rather than the slug.
 */
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import Destination from "@/pages/Destination";
import { getDestinationBySlug } from "@/data/destinations";
import { getDestinationPackages } from "@/data/destinationPackages";

const FIXED_NOW = new Date("2026-08-26T12:00:00Z");

function renderDestination(slug: string) {
  return render(
    <MemoryRouter initialEntries={[`/${slug}`]}>
      <Routes>
        <Route path="/:slug" element={<Destination />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("single package territory layout", () => {
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

  it("Grenada sells exactly one package", () => {
    const data = getDestinationPackages("grenada");
    expect(data).toBeTruthy();
    const count = data!.sections.reduce((n, s) => n + s.packages.length, 0);
    expect(count).toBe(1);
  });

  it("never renders the multi card grid for a one product territory", () => {
    const { container } = renderDestination("grenada");
    const section = container.querySelector('[aria-labelledby="packages-heading"]');
    expect(section).not.toBeNull();
    expect(section!.innerHTML).not.toContain("lg:grid-cols-4");
  });

  it("fills the row with the companion panel when the territory has one", () => {
    const dest = getDestinationBySlug("grenada");
    expect(dest?.companion).toBeTruthy();
    const { container } = renderDestination("grenada");
    const panel = container.querySelector('[data-companion-panel="true"]');
    expect(panel).not.toBeNull();
    expect(panel!.textContent).toContain(dest!.companion!.heading);
    expect(
      container.querySelector(
        `a[href="${dest!.companion!.linkTo}"]`,
      ),
    ).not.toBeNull();
  });
});

import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import TrinidadBook from "@/pages/TrinidadBook";
import TrinidadBookResult from "@/pages/TrinidadBookResult";
import { TRINIDAD_PACKAGES } from "@/data/trinidadPackages";
import { TRINIDAD_BOOK_CATALOGUE as C } from "@/data/trinidadBookPage";
import { BOOKING_TERMS_LABEL } from "@/data/policies";
import { TRUSTPILOT_REVIEW_URL } from "@/lib/constants";

vi.mock("@/components/landing/Navbar", () => ({ default: () => null }));
vi.mock("@/components/landing/Footer", () => ({ default: () => null }));
const location = window.location;
const mockFetch = vi.fn();
beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
  mockFetch.mockResolvedValue({ ok: true, json: async () => ({ availability: Object.fromEntries(C.dates.map((d) => [d.day, C.slot_times.map((time) => ({ time, spots_left: C.slot_capacity }))])) }) });
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); mockFetch.mockReset(); Object.defineProperty(window, "location", { value: location, configurable: true }); });
function open(path: string) { return render(<MemoryRouter initialEntries={[path]}><Routes><Route path="/trinidad/book/:service/:day" element={<TrinidadBook />} /><Route path="/trinidad/book" element={<TrinidadBook />} /></Routes></MemoryRouter>); }

describe("package selection and Stripe hand-off", () => {
  it.each(TRINIDAD_PACKAGES)("$path preselects only its catalogue product and dates", async (p) => {
    open(p.path);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(p.h1);
    expect(screen.getByLabelText("Selected package").textContent).toContain(p.summary);
    expect(screen.queryByRole("radiogroup", { name: "Service" })).toBeNull();
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
  });
  it("unknown pairs fall back to the normal booking page", async () => {
    open("/trinidad/book/photoshoot/both-days-8-9-feb");
    await screen.findByRole("radiogroup", { name: "Day" });
  });
  it("live full days cannot be paid and link to the other dated day and WhatsApp", async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ availability: { tuesday: C.slot_times.map((time) => ({ time, spots_left: 0 })) } }) });
    open("/trinidad/book/makeup/tuesday-9-feb");
    await screen.findByText("Tuesday 9 February 2027 is fully booked.");
    expect(screen.getByRole("link", { name: "Book Monday 8 February 2027" })).toHaveAttribute("href", "/trinidad/book/makeup/monday-8-feb");
    expect(screen.getByRole("link", { name: "Message us on WhatsApp" })).toHaveAttribute("href", C.whatsapp);
    expect(screen.getByRole("button", { name: /^Pay US/ })).toBeDisabled();
  });
  it.each(TRINIDAD_PACKAGES)("$path posts the exact product and booked slots, then reaches mocked Stripe without payment", async (p) => {
    Object.defineProperty(window, "location", { value: { href: "" }, configurable: true });
    mockFetch.mockImplementation(async (_url, options) => ({ ok: true, json: async () => options?.method === "POST" ? { checkout_url: "https://checkout.stripe.com/c/pay/test_package" } : { availability: Object.fromEntries(C.dates.map((d) => [d.day, C.slot_times.map((time) => ({ time, spots_left: C.slot_capacity }))])) } }));
    open(p.path);
    await waitFor(() => expect(screen.getAllByRole("button", { name: new RegExp(C.slot_times[0]) })[0]).not.toBeDisabled());
    for (const button of screen.getAllByRole("button", { name: new RegExp(C.slot_times[0]) })) fireEvent.click(button);
    for (const [label, value] of [["First name", "Test"], ["Last name", "Customer"], ["Email", "test@example.com"], ["Cell, with country code", "+18685550100"]]) fireEvent.change(screen.getByLabelText(label), { target: { value } });
    fireEvent.click(screen.getByRole("checkbox"));
    const pay = screen.getByRole("button", { name: /^Pay US/ });
    expect(pay).not.toBeDisabled();
    fireEvent.click(pay);
    await waitFor(() => expect(window.location.href).toBe("https://checkout.stripe.com/c/pay/test_package"));
    const post = mockFetch.mock.calls.find(([, options]) => options?.method === "POST");
    expect(post?.[0]).toContain("/web/book");
    expect(JSON.parse(post?.[1].body)).toEqual({ product_id: p.product.id, first_name: "Test", last_name: "Customer", email: "test@example.com", phone: "+18685550100", accepted_terms: true, ...Object.fromEntries(p.dates.map((d) => [`${d.day}_slot`, C.slot_times[0]])) });
    expect(JSON.parse(post?.[1].body)).not.toHaveProperty("price");
    expect(screen.getByRole("link", { name: BOOKING_TERMS_LABEL })).toHaveAttribute("href", "/policies");
  });
});

it("every paid confirmation shows the same Trustpilot invitation", () => {
  render(<MemoryRouter><TrinidadBookResult paid /></MemoryRouter>);
  expect(screen.getByRole("link", { name: "Review us on Trustpilot" })).toHaveAttribute("href", TRUSTPILOT_REVIEW_URL);
});
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.mock("@/integrations/supabase/client", () => ({ supabase: { auth: { signInWithPassword: vi.fn(), signUp: vi.fn() } } }));
vi.mock("@/integrations/lovable/index", () => ({ lovable: { auth: { signInWithOAuth: vi.fn() } } }));

import Auth from "@/pages/Auth";
import { readFileSync } from "fs";
import path from "path";

describe("Admin sign-in page", () => {
  it("renders no Sign up control", () => {
    render(<MemoryRouter><Auth /></MemoryRouter>);
    expect(screen.queryByText(/sign\s*up/i)).toBeNull();
    expect(screen.queryByText(/don't have an account/i)).toBeNull();
    expect(screen.getByRole("button", { name: /continue with google/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^sign in$/i })).toBeInTheDocument();
  });

  it("has no sign-up code path", () => {
    const src = readFileSync(path.resolve(__dirname, "../pages/Auth.tsx"), "utf8");
    expect(src).not.toMatch(/signUp\s*\(/);
  });
});

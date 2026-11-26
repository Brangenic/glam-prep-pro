import { describe, expect, it } from "vitest";
import { buildKnowledgePack } from "@/data/botKnowledge";
import { directTrinidadBookingReply, type Pack } from "../../supabase/functions/chat/logic";

const pack = buildKnowledgePack() as Pack;
const now = new Date("2026-11-26T21:12:00Z");
const reply = (text: string) => directTrinidadBookingReply(pack, [{ role: "user", content: text }], now);
describe("JADE direct catalogue booking replies", () => {
  it("book me makeup on Carnival Tuesday returns the Tuesday makeup package", () => {
    expect(reply("book me makeup on Carnival Tuesday")).toContain("/trinidad/book/makeup/tuesday-9-feb");
  });
  it("asks only for missing day or service", () => {
    expect(reply("book Trinidad makeup")).toMatch(/^Which day/);
    expect(reply("book Trinidad Carnival Tuesday")).toMatch(/^Which service/);
  });
  it("never invents both-days photoshoot or handles another territory as Trinidad", () => {
    expect(reply("book Trinidad photoshoot both days")).not.toContain("/trinidad/book/photoshoot/both-days");
    expect(reply("book Grenada makeup on Carnival Tuesday")).toBeNull();
  });
});
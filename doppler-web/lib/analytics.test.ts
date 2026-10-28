import { describe, it, expect, vi, afterEach } from "vitest";
import { trackEvent, trackLead } from "./analytics";

afterEach(() => {
  delete window.gtag;
});

describe("analytics", () => {
  it("does nothing when gtag is not loaded", () => {
    expect(() => trackLead("form")).not.toThrow();
  });

  it("sends a generate_lead event with the method", () => {
    window.gtag = vi.fn();
    trackLead("whatsapp");
    expect(window.gtag).toHaveBeenCalledWith("event", "generate_lead", { method: "whatsapp" });
  });

  it("sends custom events", () => {
    window.gtag = vi.fn();
    trackEvent("cta_click", { place: "hero" });
    expect(window.gtag).toHaveBeenCalledWith("event", "cta_click", { place: "hero" });
  });
});

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import WhatsAppLink from "./WhatsAppLink";

afterEach(() => {
  delete window.gtag;
});

describe("WhatsAppLink", () => {
  it("renders nothing when the number is empty", () => {
    const { container } = render(<WhatsAppLink number="" label="WhatsApp" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("links to wa.me and tracks a lead on click", () => {
    window.gtag = vi.fn();
    render(<WhatsAppLink number="5491112345678" label="WhatsApp" />);
    const link = screen.getByRole("link", { name: "WhatsApp" });
    expect(link.getAttribute("href")).toMatch(/^https:\/\/wa\.me\/5491112345678\?text=/);
    fireEvent.click(link);
    expect(window.gtag).toHaveBeenCalledWith("event", "generate_lead", { method: "whatsapp" });
  });
});

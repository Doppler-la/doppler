import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";
import { footerLinks } from "@/lib/content";

describe("Footer", () => {
  it("renders all footer links and the current year in the copyright", () => {
    render(<Footer />);
    footerLinks.forEach((link) => {
      expect(screen.getByRole("link", { name: link.label })).toHaveAttribute("href", link.href);
    });
    const year = new Date().getFullYear().toString();
    expect(screen.getByText((text) => text.includes(year) && text.includes("Doppler"))).toBeInTheDocument();
  });
});

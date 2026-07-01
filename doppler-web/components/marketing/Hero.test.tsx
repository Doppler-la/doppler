import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "./Hero";
import { heroContent } from "@/lib/content";

describe("Hero", () => {
  it("renders headline, subheadline and CTA", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(heroContent.headline);
    expect(screen.getByText(heroContent.subheadline)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: heroContent.ctaLabel })).toHaveAttribute(
      "href",
      heroContent.ctaHref
    );
  });
});

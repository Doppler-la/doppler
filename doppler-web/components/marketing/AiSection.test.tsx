import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AiSection from "./AiSection";
import { aiSection } from "@/lib/content";

describe("AiSection", () => {
  it("renders headline, all capabilities and all methodology steps", () => {
    render(<AiSection />);
    expect(screen.getByText(aiSection.headline)).toBeInTheDocument();
    aiSection.capabilities.forEach((c) => {
      expect(screen.getByText(c.title)).toBeInTheDocument();
    });
    aiSection.methodology.forEach((m) => {
      expect(screen.getByText(m.title)).toBeInTheDocument();
    });
  });
});

import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FAQ from "./FAQ";
import { faqItems } from "@/lib/content";

describe("FAQ", () => {
  it("renders all questions collapsed, and reveals the answer on click", () => {
    render(<FAQ />);
    faqItems.forEach((item) => {
      expect(screen.getByText(item.question)).toBeInTheDocument();
    });
    expect(screen.queryByText(faqItems[0].answer)).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(faqItems[0].question));
    expect(screen.getByText(faqItems[0].answer)).toBeInTheDocument();

    fireEvent.click(screen.getByText(faqItems[0].question));
    expect(screen.queryByText(faqItems[0].answer)).not.toBeInTheDocument();
  });
});

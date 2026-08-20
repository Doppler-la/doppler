import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Testimonials from "./Testimonials";
import { testimonials } from "@/lib/content";

describe("Testimonials", () => {
  it("renders every quote and author", () => {
    render(<Testimonials />);
    testimonials.forEach((t) => {
      // exact: false because the component wraps the quote in curly-quote
      // characters (""…""), so the quote text is a substring of the
      // paragraph's text content, not an exact match.
      expect(screen.getByText(t.quote, { exact: false })).toBeInTheDocument();
      expect(screen.getByText(t.author)).toBeInTheDocument();
    });
  });
});

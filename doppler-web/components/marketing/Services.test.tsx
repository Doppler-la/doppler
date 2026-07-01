import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Services from "./Services";
import { services } from "@/lib/content";

describe("Services", () => {
  it("renders a heading per service with its description", () => {
    render(<Services />);
    services.forEach((service) => {
      expect(screen.getByText(service.title)).toBeInTheDocument();
      expect(screen.getByText(service.description)).toBeInTheDocument();
    });
  });
});

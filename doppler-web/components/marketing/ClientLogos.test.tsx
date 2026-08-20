import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ClientLogos from "./ClientLogos";
import { clientLogos } from "@/lib/content";

describe("ClientLogos", () => {
  it("renders the section title and one logo image per client", () => {
    render(<ClientLogos />);
    expect(screen.getByText("Empresas que confiaron en nosotros")).toBeInTheDocument();
    clientLogos.forEach((logo) => {
      expect(screen.getByAltText(logo.name)).toBeInTheDocument();
    });
  });
});

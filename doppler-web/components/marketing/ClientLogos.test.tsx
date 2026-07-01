import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ClientLogos from "./ClientLogos";
import { clientLogos } from "@/lib/content";

describe("ClientLogos", () => {
  it("renders the section title and one placeholder box per logo", () => {
    render(<ClientLogos />);
    expect(screen.getByText("Empresas que confiaron en nosotros")).toBeInTheDocument();
    expect(screen.getAllByText("Logo")).toHaveLength(clientLogos.length);
  });
});

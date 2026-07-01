import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FinalCTA from "./FinalCTA";

describe("FinalCTA", () => {
  it("renders the closing headline and a link to the contact section", () => {
    render(<FinalCTA />);
    expect(
      screen.getByText("Más que una software factory, un equipo que impulsa tu negocio")
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Empecemos" })).toHaveAttribute("href", "#contacto");
  });
});

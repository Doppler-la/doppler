import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("Header", () => {
  it("renders the Doppler logo text and all nav links", () => {
    render(<Header />);
    expect(screen.getByText("Doppler")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Servicios" })).toHaveAttribute("href", "#servicios");
    expect(screen.getByRole("link", { name: "IA para Empresas" })).toHaveAttribute("href", "#ia");
    expect(screen.getByRole("link", { name: "Clientes" })).toHaveAttribute("href", "#clientes");
    expect(screen.getByRole("link", { name: "Contacto" })).toHaveAttribute("href", "#contacto");
    expect(screen.getByRole("link", { name: "Hablemos" })).toHaveAttribute("href", "#contacto");
  });
});

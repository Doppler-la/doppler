import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PrivacyPage from "./page";

describe("PrivacyPage", () => {
  it("renders the policy heading and the data rights section", () => {
    render(<PrivacyPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Política de privacidad" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Tus derechos" })).toBeInTheDocument();
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "./page";
import MarketingLayout from "./layout";
import { heroContent, faqItems } from "@/lib/content";

describe("Landing page", () => {
  it("renders every section of the landing", () => {
    render(
      <MarketingLayout>
        <Page />
      </MarketingLayout>
    );
    expect(screen.getAllByText("Doppler").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(heroContent.headline);
    expect(screen.getByText("Empresas que confiaron en nosotros")).toBeInTheDocument();
    expect(screen.getByText("Qué hacemos")).toBeInTheDocument();
    expect(screen.getByText("Lo que dicen de nosotros")).toBeInTheDocument();
    expect(screen.getByText(faqItems[0].question)).toBeInTheDocument();
    expect(screen.getByText("Hablemos de tu proyecto")).toBeInTheDocument();
  });
});

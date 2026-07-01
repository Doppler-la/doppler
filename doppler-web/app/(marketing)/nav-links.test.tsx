import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Page from "./page";
import MarketingLayout from "./layout";
import { navLinks } from "@/lib/content";

describe("Nav links", () => {
  it("every nav link href points to an existing section id", () => {
    const { container } = render(
      <MarketingLayout>
        <Page />
      </MarketingLayout>
    );

    navLinks.forEach((link) => {
      const id = link.href.replace("#", "");
      const target = container.querySelector(`#${id}`);
      expect(target, `Expected an element with id="${id}" for nav link "${link.label}" (${link.href})`).not.toBeNull();
    });
  });
});

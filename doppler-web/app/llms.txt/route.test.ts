import { describe, it, expect } from "vitest";
import { GET } from "./route";
import { servicePages } from "@/lib/servicePages";

describe("llms.txt", () => {
  it("is plain text, starts with the site name and links every service page", async () => {
    const res = GET();
    expect(res.headers.get("Content-Type")).toContain("text/plain");
    const body = await res.text();
    expect(body.startsWith("# Doppler")).toBe(true);
    servicePages.forEach((page) => expect(body).toContain(`https://www.doppler.la/servicios/${page.slug}`));
  });
});

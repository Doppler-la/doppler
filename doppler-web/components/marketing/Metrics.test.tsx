import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Metrics from "./Metrics";
import { metrics } from "@/lib/content";

describe("Metrics", () => {
  it("renders every metric value and label", () => {
    render(<Metrics />);
    metrics.forEach((metric) => {
      expect(screen.getByText(metric.value)).toBeInTheDocument();
      expect(screen.getByText(metric.label)).toBeInTheDocument();
    });
  });
});

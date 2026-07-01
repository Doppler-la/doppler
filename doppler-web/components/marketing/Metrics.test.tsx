import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Metrics from "./Metrics";
import { metrics } from "@/lib/content";

describe("Metrics", () => {
  it("renders every metric value and label", () => {
    render(<Metrics />);
    expect(screen.getAllByText(metrics[0].value)).toHaveLength(metrics.length);
    metrics.forEach((metric) => {
      expect(screen.getByText(metric.label)).toBeInTheDocument();
    });
  });
});

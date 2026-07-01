import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactForm from "./ContactForm";

afterEach(() => {
  vi.unstubAllGlobals();
});

function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Ignacio" } });
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "ignacio@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Mensaje"), {
    target: { value: "Quiero más info" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Enviar" }));
}

describe("ContactForm", () => {
  it("shows a success message when the submission succeeds", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) })
    );
    render(<ContactForm />);

    fillAndSubmit();

    await waitFor(() =>
      expect(screen.getByText("¡Gracias! Te vamos a contactar pronto.")).toBeInTheDocument()
    );
  });

  it("shows an error message when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network error")));
    render(<ContactForm />);

    fillAndSubmit();

    await waitFor(() =>
      expect(
        screen.getByText("No pudimos enviar tu mensaje. Probá de nuevo en unos minutos.")
      ).toBeInTheDocument()
    );
    expect(screen.getByLabelText("Nombre")).toHaveValue("Ignacio");
  });
});

import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import Content from "../../../routes/login/-components/Content";

describe("Content component", () => {
  test("renders all features correctly", () => {
    render(<Content />);

    expect(screen.getByText(/desempenho adaptável/i)).toBeInTheDocument();
    expect(screen.getByText(/construído para durar/i)).toBeInTheDocument();
    expect(
      screen.getByText(/excelente experiência de uso/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/funcionalidade inovadora/i)).toBeInTheDocument();

    expect(
      screen.getByText(
        /nosso produto se ajusta facilmente às suas necessidades/i
      )
    ).toBeInTheDocument();
  });

  test("renders logo image on larger screens", () => {
    render(<Content />);
    const logoImage = screen.getByRole("img");

    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute("src");
  });
});

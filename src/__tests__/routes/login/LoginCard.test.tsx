import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { useSignIn } from "../../../hooks/useAuth/useSignIn";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../../context/auth";
import LoginCard from "../../../routes/login/-components/LoginCard";

vi.mock("../../../hooks/useAuth/useSignIn");
vi.mock("@tanstack/react-router");
vi.mock("../../../context/auth");
vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn().mockResolvedValue({}),
}));

describe("LoginCard", () => {
  const mockSignIn = vi.fn();
  const mockNavigate = vi.fn();
  const mockLogin = vi.fn();

  beforeEach(() => {
    (useSignIn as any).mockReturnValue({ mutate: mockSignIn });
    (useNavigate as any).mockReturnValue(mockNavigate);
    (useAuth as any).mockReturnValue({ login: mockLogin });
  });

  test("renders login form correctly", () => {
    render(<LoginCard />);

    expect(
      screen.getByRole("heading", { name: /entrar/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
    expect(screen.getByText(/não tem uma conta\?/i)).toBeInTheDocument();
  });

  test("shows validation errors when submitting empty form", async () => {
    render(<LoginCard />);

    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address\./i)
      ).toBeInTheDocument();
      expect(screen.getByText(/password is required\./i)).toBeInTheDocument();
    });
  });

});

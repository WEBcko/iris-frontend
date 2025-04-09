import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SendMessageForm from "../../../routes/_auth.chat/-components/SendMessageForm";

const mockMutate = vi.fn();

vi.mock("@tanstack/react-query", () => {
  return {
    useMutation: (opts: any) => {
      return {
        ...opts,

        mutate: (vars: any, options: any) => {
          if (vars.text === "error") {
            opts.onError(new Error("Fake error"), vars, options);
          } else {
            opts.onSuccess();
          }
        },
        isPending: false,
      };
    },
  };
});

describe("SendMessageForm", () => {
  beforeEach(() => {
    mockMutate.mockReset();
  });

  it("renders correctly", () => {
    render(<SendMessageForm chatId="chat1" currentUserId="user1" />);
    expect(
      screen.getByPlaceholderText(/Digite sua mensagem/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls mutation.mutate on submit and clears the input on success", async () => {
    render(<SendMessageForm chatId="chat1" currentUserId="user1" />);
    const input = screen.getByPlaceholderText(/Digite sua mensagem/i);
    fireEvent.change(input, { target: { value: "Hello" } });
    expect(input).toHaveValue("Hello");

    fireEvent.submit(input.closest("form")!);

    await waitFor(() => {
      expect(input).toHaveValue("");
    });
  });

  it("displays error message on mutation error", async () => {
    render(<SendMessageForm chatId="chat1" currentUserId="user1" />);
    const input = screen.getByPlaceholderText(/Digite sua mensagem/i);
    fireEvent.change(input, { target: { value: "error" } });
    fireEvent.submit(input.closest("form")!);

    await waitFor(() => {
      expect(screen.getByText(/Fake error/i)).toBeInTheDocument();
    });
  });

  it("disables send button when input is empty", () => {
    render(<SendMessageForm chatId="chat1" currentUserId="user1" />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});

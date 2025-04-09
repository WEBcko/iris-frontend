import React from "react";
import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useChatMessages } from "../../../hooks/useChat/useChatMessages";
import ChatRoom from "../../../routes/_auth.chat/-components/ChatRoom";

vi.mock("../../../hooks/useChat/useChatMessages");

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("ChatRoom", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders empty state when there are no messages", () => {
    (useChatMessages as any).mockReturnValue([]);
    renderWithProviders(<ChatRoom chatId="chat1" currentUserId="user1" />);
    expect(
      screen.getByText(/Nenhuma mensagem ainda. Envie a primeira!/i)
    ).toBeInTheDocument();
  });

  it("renders messages when provided", () => {
    const messages = [
      { id: "1", text: "Hello", senderId: "user1", senderUserName: "Alice" },
      { id: "2", text: "Hi there", senderId: "user2", senderUserName: "Bob" },
    ];
    (useChatMessages as any).mockReturnValue(messages);
    renderWithProviders(<ChatRoom chatId="chat1" currentUserId="user1" />);

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Hi there")).toBeInTheDocument();

    expect(screen.getByText("AL")).toBeInTheDocument();
    expect(screen.getByText("BO")).toBeInTheDocument();
  });

  it("renders SendMessageForm component", () => {
    (useChatMessages as any).mockReturnValue([]);
    renderWithProviders(<ChatRoom chatId="chat1" currentUserId="user1" />);

    expect(
      screen.getByPlaceholderText(/Digite sua mensagem/i)
    ).toBeInTheDocument();
  });
});

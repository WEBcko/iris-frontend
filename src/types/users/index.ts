import { ReactNode } from "react";

export type SearchUsersByNameResponse = {
  email: ReactNode;
  id: number;
  username: string;
  user_image: string | null;
  followers_number: number;
};

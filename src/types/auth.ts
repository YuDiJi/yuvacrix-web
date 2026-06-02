import type { User } from "./user";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

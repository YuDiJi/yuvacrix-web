export interface User {
  id: string;
  mobile: string;
  username: string;
  roles: string[];
  status: string;
  isMobileVerified: boolean;
  isProfileCompleted: boolean;
  fullName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MeResponse {
  success: boolean;
  user: User;
}

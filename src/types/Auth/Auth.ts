export interface User {
  email: string;
  phone: string;
  userEmail: string;
  userId: string;
  clientId: string;
  role: string;
  specialToken?: string;
  name?: string;
  accessToken?: string;
  refreshToken?: string;
  profileImage?: string;
  status?: string;
  id?: string;
}

export interface Role {
  VIEWER: "viewer-panel";
  EMPLOYEE: "employee";
  SUPPORTER: "supporter";
  MANAGER: "staff-manager-panel";
  ADMIN: "admin";
  CLIENT: "client-panel";
  SUPERADMIN: "superadmin";
}

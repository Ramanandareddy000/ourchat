// API service for user registration
import { User } from "../types";
import authService from "../services/authService";

export interface CreateUserDto {
  username: string;
  password: string;
  displayName: string;
  avatarUrl?: string;
}

export const registerUser = async (userData: CreateUserDto): Promise<User> => {
  try {
    // Use the authService to register a new user
    const registerData = {
      username: userData.username,
      password: userData.password,
      displayName: userData.displayName,
    };

    const response = await authService.register(registerData);

    if (response.success && response.user) {
      return {
        id: parseInt(response.user.id.toString(), 10),
        username: userData.username,
        display_name: response.user.display_name,
        avatar_url: userData.avatarUrl || "",
        image: undefined,
        online: true,
        last_seen: "Online",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } else {
      throw new Error(response.message || "Registration failed");
    }
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

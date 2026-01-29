import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../../types";
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { sessionService, SessionEventHandlers } from "../../services/sessionService";
import { JWTUtils } from "../../utils/jwt";
import { SessionWarning, SessionExpiredDialog } from "../../ui";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: {
    username: string;
    password: string;
    displayName: string;
    avatarUrl?: string;
  }) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // Session management
  sessionStatus: {
    timeRemaining: number;
    isExpiringSoon: boolean;
    formattedTimeRemaining: string;
  } | null;
  extendSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionWarningOpen, setSessionWarningOpen] = useState(false);
  const [sessionExpiredOpen, setSessionExpiredOpen] = useState(false);
  const [sessionExpiredReason, setSessionExpiredReason] = useState<'expired' | 'invalid' | 'server_error'>('expired');
  const [warningTimeRemaining, setWarningTimeRemaining] = useState(0);
  const [sessionStatus, setSessionStatus] = useState<{
    timeRemaining: number;
    isExpiringSoon: boolean;
    formattedTimeRemaining: string;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = async () => {
      const storedToken = localStorage.getItem("authToken");

      if (storedToken) {
        // Validate token format and expiry
        if (!JWTUtils.isValidFormat(storedToken)) {
          console.log('Invalid token format, clearing auth');
          authService.logout();
          setIsLoading(false);
          return;
        }

        if (JWTUtils.isExpired(storedToken)) {
          console.log('Token expired, clearing auth');
          authService.logout();
          setSessionExpiredReason('expired');
          setSessionExpiredOpen(true);
          setIsLoading(false);
          return;
        }

        setToken(storedToken);
        try {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            // Start session monitoring
            startSessionMonitoring(storedToken);
          } else {
            // Token might be invalid, clear it
            authService.logout();
            setToken(null);
            setSessionExpiredReason('invalid');
            setSessionExpiredOpen(true);
          }
        } catch (err) {
          console.error("Failed to get current user", err);
          authService.logout();
          setToken(null);
          setSessionExpiredReason('server_error');
          setSessionExpiredOpen(true);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Session management functions
  const startSessionMonitoring = (authToken: string) => {
    const handlers: SessionEventHandlers = {
      onSessionWarning: (timeRemaining: number) => {
        setWarningTimeRemaining(timeRemaining);
        setSessionWarningOpen(true);
      },
      onSessionExpired: () => {
        handleSessionExpired('expired');
      },
      onSessionExtended: () => {
        setSessionWarningOpen(false);
      },
    };

    sessionService.startMonitoring(authToken, handlers);

    // Update session status periodically
    const statusInterval = setInterval(() => {
      if (authToken) {
        const status = sessionService.getSessionStatus(authToken);
        setSessionStatus({
          timeRemaining: status.timeRemaining,
          isExpiringSoon: status.needsWarning,
          formattedTimeRemaining: status.formattedTimeRemaining,
        });
      }
    }, 10000); // Update every 10 seconds

    // Cleanup on unmount
    return () => {
      clearInterval(statusInterval);
    };
  };

  const handleSessionExpired = (reason: 'expired' | 'invalid' | 'server_error') => {
    sessionService.stopMonitoring();
    setUser(null);
    setToken(null);
    setSessionStatus(null);
    authService.logout();
    setSessionExpiredReason(reason);
    setSessionExpiredOpen(true);
    setSessionWarningOpen(false);
  };

  const extendSession = async () => {
    // In a real app, this would refresh the token
    // For now, we'll just close the warning
    console.log('Session extension requested - implement token refresh here');
    setSessionWarningOpen(false);
    // TODO: Implement actual token refresh logic
  };

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    setSessionExpiredOpen(false);
    try {
      const result = await authService.login({ username, password });
      if (result.success && result.user && result.token) {
        setUser(result.user);
        setToken(result.token);
        // Start session monitoring
        startSessionMonitoring(result.token);
        // Use setTimeout to ensure state is updated before navigation
        setTimeout(() => {
          navigate("/");
        }, 0);
      } else {
        setError(result.message || "Login failed");
        throw new Error(result.message || "Login failed");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    sessionService.stopMonitoring();
    setUser(null);
    setToken(null);
    setSessionStatus(null);
    setSessionWarningOpen(false);
    setSessionExpiredOpen(false);
    authService.logout();
    // Redirect to login page after logout
    navigate("/login");
  };

  const register = async (userData: {
    username: string;
    password: string;
    displayName: string;
    avatarUrl?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      // Register the user
      const result = await authService.register(userData);
      if (result.success && result.user && result.token) {
        setUser(result.user);
        setToken(result.token);
        // Start session monitoring
        startSessionMonitoring(result.token);
        // Use setTimeout to ensure state is updated before navigation
        setTimeout(() => {
          navigate("/");
        }, 0);
      } else {
        setError(result.message || "Registration failed");
        throw new Error(result.message || "Registration failed");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    isLoading,
    error,
    sessionStatus,
    extendSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}

      {/* Session Warning Dialog */}
      <SessionWarning
        open={sessionWarningOpen}
        timeRemaining={warningTimeRemaining}
        onExtendSession={extendSession}
        onLogout={logout}
      />

      {/* Session Expired Dialog */}
      <SessionExpiredDialog
        open={sessionExpiredOpen}
        onLogin={() => {
          setSessionExpiredOpen(false);
          navigate('/login');
        }}
        reason={sessionExpiredReason}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

import { JWTUtils } from '../utils/jwt';

export interface SessionConfig {
  // Warning time in minutes before expiry
  warningTime: number;
  // Check interval in milliseconds
  checkInterval: number;
  // Auto-logout time in minutes before expiry
  autoLogoutTime: number;
}

export interface SessionEventHandlers {
  onSessionWarning: (timeRemaining: number) => void;
  onSessionExpired: () => void;
  onSessionExtended: () => void;
}

export class SessionService {
  private config: SessionConfig = {
    warningTime: 5, // 5 minutes warning
    checkInterval: 30000, // Check every 30 seconds
    autoLogoutTime: 1, // Auto-logout 1 minute before expiry
  };

  private handlers: Partial<SessionEventHandlers> = {};
  private intervalId: NodeJS.Timeout | null = null;
  private warningShown: boolean = false;
  private isMonitoring: boolean = false;

  constructor(config?: Partial<SessionConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  /**
   * Start monitoring session expiry
   */
  startMonitoring(token: string, handlers: Partial<SessionEventHandlers>) {
    if (this.isMonitoring) {
      this.stopMonitoring();
    }

    if (!token || !JWTUtils.isValidFormat(token)) {
      console.warn('Invalid token provided to session monitoring');
      return;
    }

    this.handlers = handlers;
    this.isMonitoring = true;
    this.warningShown = false;

    this.intervalId = setInterval(() => {
      this.checkSession(token);
    }, this.config.checkInterval);

    // Initial check
    this.checkSession(token);

    console.log('Session monitoring started');
  }

  /**
   * Stop monitoring session expiry
   */
  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isMonitoring = false;
    this.warningShown = false;
    this.handlers = {};

    console.log('Session monitoring stopped');
  }

  /**
   * Check current session status
   */
  private checkSession(token: string) {
    if (JWTUtils.isExpired(token)) {
      console.log('Session expired, triggering logout');
      this.handleSessionExpired();
      return;
    }

    const timeUntilExpiry = JWTUtils.getTimeUntilExpiry(token);
    const minutesRemaining = timeUntilExpiry / (60 * 1000);

    // Auto-logout before expiry
    if (minutesRemaining <= this.config.autoLogoutTime) {
      console.log(`Auto-logout triggered: ${minutesRemaining.toFixed(1)} minutes remaining`);
      this.handleSessionExpired();
      return;
    }

    // Show warning if approaching expiry
    if (minutesRemaining <= this.config.warningTime && !this.warningShown) {
      console.log(`Session warning: ${minutesRemaining.toFixed(1)} minutes remaining`);
      this.warningShown = true;
      this.handleSessionWarning(timeUntilExpiry);
    }

    // Reset warning if time extends (e.g., token refreshed)
    if (minutesRemaining > this.config.warningTime && this.warningShown) {
      this.warningShown = false;
      this.handleSessionExtended();
    }
  }

  /**
   * Handle session warning
   */
  private handleSessionWarning(timeRemaining: number) {
    if (this.handlers.onSessionWarning) {
      this.handlers.onSessionWarning(timeRemaining);
    }
  }

  /**
   * Handle session expiry
   */
  private handleSessionExpired() {
    this.stopMonitoring();
    if (this.handlers.onSessionExpired) {
      this.handlers.onSessionExpired();
    }
  }

  /**
   * Handle session extension
   */
  private handleSessionExtended() {
    if (this.handlers.onSessionExtended) {
      this.handlers.onSessionExtended();
    }
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<SessionConfig>) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current session status
   */
  getSessionStatus(token: string): {
    isValid: boolean;
    isExpired: boolean;
    timeRemaining: number;
    formattedTimeRemaining: string;
    needsWarning: boolean;
  } {
    if (!token || !JWTUtils.isValidFormat(token)) {
      return {
        isValid: false,
        isExpired: true,
        timeRemaining: 0,
        formattedTimeRemaining: 'Invalid',
        needsWarning: false,
      };
    }

    const isExpired = JWTUtils.isExpired(token);
    const timeRemaining = JWTUtils.getTimeUntilExpiry(token);
    const minutesRemaining = timeRemaining / (60 * 1000);

    return {
      isValid: true,
      isExpired,
      timeRemaining,
      formattedTimeRemaining: JWTUtils.getFormattedTimeRemaining(token),
      needsWarning: minutesRemaining <= this.config.warningTime && minutesRemaining > 0,
    };
  }

  /**
   * Check if monitoring is active
   */
  isMonitoringActive(): boolean {
    return this.isMonitoring;
  }
}

// Export singleton instance
export const sessionService = new SessionService();
export default sessionService;
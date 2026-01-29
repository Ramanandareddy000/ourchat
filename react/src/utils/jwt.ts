import { jwtDecode } from 'jwt-decode';

export interface JWTPayload {
  exp: number;
  iat: number;
  sub: string;
  [key: string]: any;
}

export class JWTUtils {
  /**
   * Decode JWT token and return payload
   */
  static decode(token: string): JWTPayload | null {
    try {
      return jwtDecode<JWTPayload>(token);
    } catch (error) {
      console.error('Invalid JWT token:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static isExpired(token: string): boolean {
    const payload = this.decode(token);
    if (!payload || !payload.exp) {
      return true;
    }

    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  }

  /**
   * Get time remaining until token expires (in milliseconds)
   */
  static getTimeUntilExpiry(token: string): number {
    const payload = this.decode(token);
    if (!payload || !payload.exp) {
      return 0;
    }

    const currentTime = Date.now() / 1000;
    const timeRemaining = (payload.exp - currentTime) * 1000;
    return Math.max(0, timeRemaining);
  }

  /**
   * Check if token expires within specified minutes
   */
  static expiresWithin(token: string, minutes: number): boolean {
    const timeRemaining = this.getTimeUntilExpiry(token);
    const minutesInMs = minutes * 60 * 1000;
    return timeRemaining <= minutesInMs && timeRemaining > 0;
  }

  /**
   * Get formatted time remaining string
   */
  static getFormattedTimeRemaining(token: string): string {
    const timeRemaining = this.getTimeUntilExpiry(token);

    if (timeRemaining <= 0) {
      return 'Expired';
    }

    const minutes = Math.floor(timeRemaining / (60 * 1000));
    const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }

  /**
   * Validate token format and structure
   */
  static isValidFormat(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }

    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    return parts.length === 3;
  }
}
/**
 * Application Configuration
 * Centralized config for environment-specific settings
 */

export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const HEDERA_NETWORK = import.meta.env.VITE_HEDERA_NETWORK || 'testnet';

export const PLATFORM_ACCOUNT_ID = import.meta.env.VITE_MY_ACCOUNT_ID;

export const ADMIN_ACCOUNTS = import.meta.env.VITE_ADMIN_ACCOUNTS?.split(',').map((a: string) => a.trim()) || [];

export const isProduction = import.meta.env.PROD;
export const isDevelopment = import.meta.env.DEV;

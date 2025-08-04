// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'safedeal_access_token',
  REFRESH_TOKEN: 'safedeal_refresh_token',
  USER: 'safedeal_user',
  THEME: 'safedeal_theme',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/login',
  REGISTER: '/register',
  ACTIVATE: '/activate',
  REFRESH_TOKEN: '/refresh-token',
  LOGOUT: '/api/logout',
  PROFILE: '/api/profile',
  
  // Escrow endpoints
  ESCROWS: '/api/escrows',
  ESCROW_BY_ID: (id: number) => `/api/escrows/${id}`,
  RELEASE_ESCROW: (id: number) => `/api/escrows/${id}/release`,
  
  // Payment endpoints
  PAYMENTS: '/api/payments',
  INITIATE_PAYMENT: '/api/payments/initiate',
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: 'SafeDeal',
  DESCRIPTION: 'Secure Escrow Platform',
  VERSION: '1.0.0',
  
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  
  // Validation
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  
  // Currency
  DEFAULT_CURRENCY: 'ETB',
  SUPPORTED_CURRENCIES: ['ETB', 'USD'],
  
  // Escrow
  MIN_ESCROW_AMOUNT: 10,
  MAX_ESCROW_AMOUNT: 1000000,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  REGISTER_SUCCESS: 'Account created successfully! Please check your email to activate your account.',
  LOGOUT_SUCCESS: 'Successfully logged out!',
  ESCROW_CREATED: 'Escrow created successfully!',
  ESCROW_RELEASED: 'Escrow released successfully!',
  PAYMENT_INITIATED: 'Payment initiated successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
} as const;
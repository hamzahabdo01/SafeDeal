// User types
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  activated: boolean;
  version: number;
  CreatedAt?: string;
  UpdatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

// Escrow types
export type EscrowStatus = 'Pending' | 'Funded' | 'Released' | 'Disputed';

export interface Escrow {
  ID?: number;
  buyer_id: number;
  seller_id: number;
  amount: number;
  status: EscrowStatus;
  conditions?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
  DeletedAt?: string | null;
}

export interface CreateEscrowRequest {
  seller_id: number;
  amount: number;
  conditions?: string;
}

// Payment types
export type TransactionStatus = 'Pending' | 'Completed' | 'Failed' | 'Refunded';

export interface EscrowPayment {
  ID?: number;
  escrow_id: number;
  buyer_id: number;
  transaction_ref: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  payment_url?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
  DeletedAt?: string | null;
}

export interface InitiatePaymentRequest {
  escrow_id: number;
  amount: number;
  currency: string;
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  error: string;
  message?: string;
}

// UI types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system';

// Route types
export interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Form types
export interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

// Modal types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';

// Lazy load other pages for better performance
const EscrowsPage = React.lazy(() => import('./pages/escrow/Escrows'));
const CreateEscrowPage = React.lazy(() => import('./pages/escrow/CreateEscrow'));
const EscrowDetailPage = React.lazy(() => import('./pages/escrow/EscrowDetail'));
const PaymentsPage = React.lazy(() => import('./pages/payment/Payments'));
const ProfilePage = React.lazy(() => import('./pages/Profile'));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Public routes */}
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              
              {/* Protected routes */}
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="profile" element={
                <ProtectedRoute>
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <ProfilePage />
                  </React.Suspense>
                </ProtectedRoute>
              } />
              
              {/* Escrow routes */}
              <Route path="escrows" element={
                <ProtectedRoute>
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <EscrowsPage />
                  </React.Suspense>
                </ProtectedRoute>
              } />
              
              <Route path="escrows/create" element={
                <ProtectedRoute>
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <CreateEscrowPage />
                  </React.Suspense>
                </ProtectedRoute>
              } />
              
              <Route path="escrows/:id" element={
                <ProtectedRoute>
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <EscrowDetailPage />
                  </React.Suspense>
                </ProtectedRoute>
              } />
              
              {/* Payment routes */}
              <Route path="payments" element={
                <ProtectedRoute>
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <PaymentsPage />
                  </React.Suspense>
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

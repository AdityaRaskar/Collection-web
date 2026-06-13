import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CarDetails from './pages/CarDetails'
import Login from './pages/Login'
import AddCar from './pages/Admin/AddCar'
import EditCar from './pages/Admin/EditCar'
import Header from './components/Header'
import { ToastProvider } from './contexts/ToastContext'
import ErrorBoundary from './components/ErrorBoundary'
import { ImageDisplayProvider } from './contexts/ImageDisplayContext'
import { AuthProvider } from './contexts/AuthContext'

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ImageDisplayProvider>
          <ErrorBoundary>
            {/* Root div picks up body background + text via CSS vars set on :root / .dark */}
            <div className="min-h-screen" style={{ color: 'var(--text-primary)' }}>
              <Header />
              <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 safe-flex">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/car/:id" element={<CarDetails />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin/add-car" element={<AddCar />} />
                  <Route path="/admin/edit-car/:id" element={<EditCar />} />
                </Routes>
              </main>
            </div>
          </ErrorBoundary>
        </ImageDisplayProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
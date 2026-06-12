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
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
              <Header />
              <main className="container mx-auto p-4">
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

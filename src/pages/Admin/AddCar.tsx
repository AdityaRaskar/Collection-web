import React from 'react'
import AdminCarForm from '../../components/AdminCarForm'

export default function AddCar() {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add New Car</h2>
      <div className="bg-white dark:bg-gray-800 rounded p-4 shadow">
        <AdminCarForm />
      </div>
    </div>
  )
}

import { Header } from '@/Components/Header'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import React from 'react'

const Sales = () => {
  return (
    <AuthenticatedLayout>
        <Header title="Sales" />
    </AuthenticatedLayout>
  )
}

export default Sales
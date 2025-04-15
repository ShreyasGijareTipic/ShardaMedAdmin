import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CContainer
} from '@coreui/react'

function CustomerTable() {
  const [customers, setCustomers] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch('https://run.mocky.io/v3/8193e788-fe29-49c8-9241-3eed1ae25ff1')
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data)
      })
      .catch((err) => console.error('Error fetching data:', err))
  }, [])

  const handleView = (id) => {
    navigate(`/customerOrder/${id}`)
  }

  return (
    <CContainer fluid className="min-h-screen bg-gray-50 ">
      <CCard className="shadow-sm">
        <CCardHeader className="bg-primary text-white text-lg font-semibold">
          Customer List
        </CCardHeader>
        <CCardBody>
          <CTable striped hover responsive bordered align="middle">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                <CTableHeaderCell scope="col">Address</CTableHeaderCell>
                <CTableHeaderCell scope="col">Contact</CTableHeaderCell>
                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {customers.map((customer) => (
                <CTableRow key={customer.id}>
                  <CTableDataCell>{customer.id}</CTableDataCell>
                  <CTableDataCell>{customer.name}</CTableDataCell>
                  <CTableDataCell>{customer.email}</CTableDataCell>
                  <CTableDataCell>
                    {customer.address?.street}, {customer.address?.city}
                  </CTableDataCell>
                  <CTableDataCell>{customer.phone}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="primary"
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(customer.id)}
                    >
                      View
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default CustomerTable

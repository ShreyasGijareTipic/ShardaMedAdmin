/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { Table, Button, Pagination } from 'react-bootstrap'
import { getAPICall, deleteAPICall } from '../../../util/api.js'
import DoctorModal from './DoctorModal'

const DoctorTable = () => {
  const [doctors, setDoctors] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchDoctors = async (page = 1) => {
    try {
      const response = await getAPICall(`/api/doctors?page=${page}`)

      if (response && response.doctors && Array.isArray(response.doctors.data)) {
        setDoctors(response.doctors.data)
        setCurrentPage(response.doctors.current_page)
        setTotalPages(response.doctors.last_page)
      } else {
        console.error('Invalid response structure:', response)
        setDoctors([])
      }
    } catch (error) {
      console.error('Error fetching doctors:', error)
      setDoctors([])
    }
  }

  useEffect(() => {
    fetchDoctors(currentPage)
  }, [currentPage])

  const handleUpdateClick = (doctor) => {
    setSelectedDoctor(doctor)
  }

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await deleteAPICall(`/api/doctors/${id}`)
        fetchDoctors(currentPage)
      } catch (error) {
        console.error('Error deleting doctor:', error)
      }
    }
  }

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
      fetchDoctors(pageNumber)
    }
  }

  const renderPagination = () => {
    let items = []
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
          {number}
        </Pagination.Item>
      )
    }

    return (
      <Pagination className="justify-content-center">
        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
        {items}
        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
      </Pagination>
    )
  }

  return (
    <div>
      <h2 className="mb-4">Doctor List</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Mobile</th>
            <th>Address</th>
            <th>Clinic Name</th>
            <th>Specialization</th>
            <th>Education</th>
            <th>Morning Time</th>
            <th>Evening Time</th>
            <th>Profile Picture</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <tr key={doctor.id}>
                <td>{doctor.id}</td>
                <td>{doctor.name}</td>
                <td>{doctor.mobile}</td>
                <td>{doctor.address}</td>
                <td>{doctor.clinic_name}</td>
                <td>{doctor.speciality}</td>
                <td>{doctor.education}</td>
                <td>{doctor.morning_time}</td>
                <td>{doctor.evening_time}</td>
                <td>
                    {doctor.thumbnail ? (
                        <img src={doctor.thumbnail} alt="Profile" width="50" />
                    ) : (
                        'No Image'
                    )}
                    </td>

                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleUpdateClick(doctor)}>
                    Update
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteClick(doctor.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center">
                No doctors found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {renderPagination()}

      <DoctorModal
        show={selectedDoctor !== null}
        doctor={selectedDoctor}
        onHide={() => setSelectedDoctor(null)}
        fetchDoctors={fetchDoctors}
        currentPage={currentPage}
      />
    </div>
  )
}

export default DoctorTable

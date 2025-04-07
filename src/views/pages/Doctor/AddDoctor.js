/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { CForm, CFormLabel, CFormInput, CButton, CRow, CCol } from '@coreui/react'
import { postFormData } from '../../../util/api'

const AddDoctorForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    clinic_name: '',
    speciality: '',
    education: '',
    morning_time: '',
    evening_time: '',
    thumbnail: null, // Renamed from profile_picture
  })

  const handleChange = (e) => {
    const { name, value, type, files } = e.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? (files.length > 0 ? files[0] : null) : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData()

    // Append fields to FormData properly
    Object.keys(formData).forEach((key) => {
      if (key === 'thumbnail' && formData[key] instanceof File) {
        data.append(key, formData[key]) // Append file correctly
      } else if (formData[key]) {
        data.append(key, formData[key]) // Append only non-null values
      }
    })

    try {
      const response = await postFormData('/api/doctors', data)
      console.log('Response:', response)

      if (response?.doctor?.thumbnail) {
        alert('Doctor added successfully!')
      } else {
        alert('Doctor added but thumbnail is missing!')
      }

      setFormData({
        name: '',
        mobile: '',
        address: '',
        clinic_name: '',
        speciality: '',
        education: '',
        morning_time: '',
        evening_time: '',
        thumbnail: null, // Reset after submission
      })
    } catch (error) {
      alert('Failed to add doctor.')
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f4',
      }}
    >
      <CForm
        onSubmit={handleSubmit}
        style={{
          maxWidth: '500px',
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add Doctor</h2>
        <CFormLabel>Name</CFormLabel>
        <CFormInput
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <CFormLabel>Mobile</CFormLabel>
        <CFormInput
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          required
        />

        <CFormLabel>Address</CFormLabel>
        <CFormInput
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <CFormLabel>Clinic Name</CFormLabel>
        <CFormInput
          type="text"
          name="clinic_name"
          value={formData.clinic_name}
          onChange={handleChange}
          required
        />

        <CFormLabel>Speciality</CFormLabel>
        <CFormInput
          type="text"
          name="speciality"
          value={formData.speciality}
          onChange={handleChange}
          required
        />

        <CFormLabel>Education</CFormLabel>
        <CFormInput
          type="text"
          name="education"
          value={formData.education}
          onChange={handleChange}
          required
        />

        <CRow>
          <CCol md={6}>
            <CFormLabel>Morning Time</CFormLabel>
            <CFormInput
              type="text"
              name="morning_time"
              placeholder="e.g., 10 AM - 1 PM"
              value={formData.morning_time}
              onChange={handleChange}
              required
            />
          </CCol>
          <CCol md={6}>
            <CFormLabel>Evening Time</CFormLabel>
            <CFormInput
              type="text"
              name="evening_time"
              placeholder="e.g., 6 PM - 10 PM"
              value={formData.evening_time}
              onChange={handleChange}
              required
            />
          </CCol>
        </CRow>

        <CFormLabel>Thumbnail</CFormLabel>
        <CFormInput
          type="file"
          name="thumbnail"
          onChange={handleChange}
          accept="image/*"
        />

        <CButton
          type="submit"
          style={{ width: '100%', marginTop: '10px', backgroundColor: '#007bff', color: '#fff' }}
        >
          Add Doctor
        </CButton>
      </CForm>
    </div>
  )
}

export default AddDoctorForm

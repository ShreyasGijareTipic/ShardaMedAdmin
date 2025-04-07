import React, { useState } from 'react'
import { CForm, CFormLabel, CFormInput, CFormSelect, CButton, CRow, CCol } from '@coreui/react'
import { postFormData } from '../../../util/api'

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discount_percentage: '',
    cutting_status: 'cut',
    manufacturer: '',
    schedule_h: '0',
    available: '1',
    weight: '',
    weight_type: 'gm',
    qty: '',
    mg: '',
    thumbnail: null,
    product_images: [],
  })

  const handleChange = (e) => {
    const { name, value, type, files } = e.target

    if (type === 'file') {
      if (name === 'product_images') {
        // Handle multiple image uploads
        setFormData((prevData) => ({
          ...prevData,
          product_images: [...files], // Store all selected images
        }))
      } else {
        // Handle single file (thumbnail)
        setFormData((prevData) => ({
          ...prevData,
          [name]: files[0],
        }))
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Create FormData for the product details
    const data = new FormData()
    Object.keys(formData).forEach((key) => {
      if (key !== 'product_images') {
        data.append(key, formData[key])
      }
    })

    try {
      // Upload product details
      const response = await postFormData('/api/products', data)
      console.log(response)
      const productId = response.product.id

      if (formData.product_images.length > 0) {
        const imageData = new FormData()
        formData.product_images.forEach((file) => {
          imageData.append('file[]', file)
        })
        imageData.append('dest', 'products')
        imageData.append('product_id', productId)

        // Upload images
        await postFormData('/api/productImageUpload', imageData)
      }

      alert('Product and images uploaded successfully!')

      setFormData({
        title: '',
        description: '',
        price: '',
        discount_percentage: '',
        cutting_status: 'cut',
        manufacturer: '',
        schedule_h: '0',
        available: '1',
        weight: '',
        weight_type: 'gm',
        qty: '',
        mg: '',
        thumbnail: null,
        product_images: [],
      })
    } catch (error) {
      alert('Failed to add product or upload images.')
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
          maxWidth: '600px',
          margin: 'auto',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          backgroundColor: '#fff',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add New Product</h2>

        <CRow>
          <CCol md={6}>
            <CFormLabel>Title</CFormLabel>
            <CFormInput
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </CCol>
          <CCol md={6}>
            <CFormLabel>Manufacturer</CFormLabel>
            <CFormInput
              type="text"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              required
            />
          </CCol>
        </CRow>

        <CFormLabel>Description</CFormLabel>
        <CFormInput
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <CRow>
          <CCol md={4}>
            <CFormLabel>Price</CFormLabel>
            <CFormInput
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </CCol>
          <CCol md={4}>
            <CFormLabel>Discount (%)</CFormLabel>
            <CFormInput
              type="number"
              name="discount_percentage"
              value={formData.discount_percentage}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={4}>
            <CFormLabel>Quantity</CFormLabel>
            <CFormInput
              type="number"
              name="qty"
              value={formData.qty}
              onChange={handleChange}
              required
            />
          </CCol>
        </CRow>

        <CRow>
          <CCol md={6}>
            <CFormLabel>Weight</CFormLabel>
            <CFormInput
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
            />
          </CCol>
          <CCol md={6}>
            <CFormLabel>Weight Type</CFormLabel>
            <CFormSelect name="weight_type" value={formData.weight_type} onChange={handleChange}>
              <option value="gm">gm</option>
              <option value="ml">ml</option>
            </CFormSelect>
          </CCol>
        </CRow>

        <CRow>
          <CCol md={6}>
            <CFormLabel>Cutting Status</CFormLabel>
            <CFormSelect
              name="cutting_status"
              value={formData.cutting_status}
              onChange={handleChange}
            >
              <option value="cut">Cut</option>
              <option value="uncut">Uncut</option>
            </CFormSelect>
          </CCol>
          <CCol md={6}>
            <CFormLabel>Schedule H</CFormLabel>
            <CFormSelect name="schedule_h" value={formData.schedule_h} onChange={handleChange}>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </CFormSelect>
          </CCol>
        </CRow>

        <CRow>
          <CCol md={6}>
            <CFormLabel>MG</CFormLabel>
            <CFormInput
              type="number"
              name="mg"
              value={formData.mg}
              onChange={handleChange}
              required
            />
          </CCol>
          <CCol md={6}>
            <CFormLabel>Thumbnail</CFormLabel>
            <CFormInput type="file" name="thumbnail" onChange={handleChange} accept="image/*" />
          </CCol>
        </CRow>

        <CFormLabel>Product Images</CFormLabel>
        <CFormInput
          type="file"
          name="product_images"
          multiple
          onChange={handleChange}
          accept="image/*"
        />

        <CButton
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '10px',
          }}
        >
          Add Product
        </CButton>
      </CForm>
    </div>
  )
}

export default AddProductForm

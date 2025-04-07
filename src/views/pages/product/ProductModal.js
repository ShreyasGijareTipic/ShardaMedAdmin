/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { putFormData } from '../../../util/api';

const UpdateProductModal = ({ show, handleClose, product, refreshProducts }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discount_percentage: '',
    cutting_status: 'cut',
    manufacturer: '',
    schedule_h: false,
    available: false,
    weight: '',
    weight_type: 'gm',
    qty: '',
    mg: '',
    thumbnail: null,
    previewThumbnail: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        ...formData,
        title: product.title || '',
        description: product.description || '',
        price: product.price || '',
        discount_percentage: product.discount_percentage || '',
        cutting_status: product.cutting_status || 'cut',
        manufacturer: product.manufacturer || '',
        schedule_h: product.schedule_h || false,
        available: product.available || false,
        weight: product.weight || '',
        weight_type: product.weight_type || 'gm',
        qty: product.qty || '',
        mg: product.mg || '',
        previewThumbnail: product.thumbnail || '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        thumbnail: file,
        previewThumbnail: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.price) {
      alert('Title and Price are required!');
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== 'previewThumbnail' && formData[key] !== null && formData[key] !== '') {
        if (['price', 'discount_percentage', 'weight'].includes(key)) {
          formDataToSend.append(key, parseFloat(formData[key]) || 0);
        } else if (['qty', 'mg'].includes(key)) {
          formDataToSend.append(key, parseInt(formData[key]) || 0);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
    });

    try {
      const response = await putFormData(`/api/products/${product.id}`, formDataToSend);
      console.log('✅ API Response:', response);

      refreshProducts(); // Refresh product list
      handleClose(); // Close modal
    } catch (error) {
      console.error('❌ Error updating product:', error.response?.data || error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="discount_percentage">
            <Form.Label>Discount Percentage</Form.Label>
            <Form.Control
              type="number"
              name="discount_percentage"
              value={formData.discount_percentage}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="cutting_status">
            <Form.Label>Cutting Status</Form.Label>
            <Form.Control
              as="select"
              name="cutting_status"
              value={formData.cutting_status}
              onChange={handleChange}
            >
              <option value="cut">Cut</option>
              <option value="uncut">Uncut</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="manufacturer">
            <Form.Label>Manufacturer</Form.Label>
            <Form.Control
              type="text"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="schedule_h">
            <Form.Check
              type="checkbox"
              label="Schedule H"
              name="schedule_h"
              checked={formData.schedule_h}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="available">
            <Form.Check
              type="checkbox"
              label="Available"
              name="available"
              checked={formData.available}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="weight">
            <Form.Label>Weight</Form.Label>
            <Form.Control
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="weight_type">
            <Form.Label>Weight Type</Form.Label>
            <Form.Control
              as="select"
              name="weight_type"
              value={formData.weight_type}
              onChange={handleChange}
            >
              <option value="gm">gm</option>
              <option value="ml">ml</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="qty">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              name="qty"
              value={formData.qty}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="mg">
            <Form.Label>MG</Form.Label>
            <Form.Control
              type="number"
              name="mg"
              value={formData.mg}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="thumbnail">
            <Form.Label>Thumbnail</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
            />
            {formData.previewThumbnail && (
              <div className="mt-2">
                <img
                  src={formData.previewThumbnail}
                  alt="Preview"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
              </div>
            )}
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3">
            Update Product
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateProductModal;

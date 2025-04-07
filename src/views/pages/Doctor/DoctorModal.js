/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Image } from 'react-bootstrap';
import { putFormData } from '../../../util/api';

const DoctorModal = ({ show, doctor, onHide, fetchDoctors, currentPage }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    clinic_name: '',
    speciality: '',
    education: '',
    morning_time: '',
    evening_time: '',
    thumbnail: null,
  });

  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || '',
        mobile: doctor.mobile || '',
        address: doctor.address || '',
        clinic_name: doctor.clinic_name || '',
        speciality: doctor.speciality || '',
        education: doctor.education || '',
        morning_time: doctor.morning_time || '',
        evening_time: doctor.evening_time || '',
        thumbnail: null,
      });

      setPreviewImage(doctor.thumbnail || null);
    }
  }, [doctor]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    });

    try {
      await putFormData(`/api/doctors/${doctor.id}`, data);
      fetchDoctors(currentPage);
      onHide();
    } catch (error) {
      console.error('Error updating doctor:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Doctor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Mobile</Form.Label>
            <Form.Control type="text" name="mobile" value={formData.mobile} onChange={handleChange} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Clinic Name</Form.Label>
            <Form.Control type="text" name="clinic_name" value={formData.clinic_name} onChange={handleChange} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Specialization</Form.Label>
            <Form.Control type="text" name="speciality" value={formData.speciality} onChange={handleChange} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Education</Form.Label>
            <Form.Control type="text" name="education" value={formData.education} onChange={handleChange} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Morning Time</Form.Label>
            <Form.Control type="text" name="morning_time" value={formData.morning_time} onChange={handleChange} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Evening Time</Form.Label>
            <Form.Control type="text" name="evening_time" value={formData.evening_time} onChange={handleChange} required />
          </Form.Group>

          <Form.Group>
            <Form.Label>Profile Picture</Form.Label>
            <Form.Control
              type="file"
              name="thumbnail"
              onChange={handleChange}
              accept="image/*"
            />
          </Form.Group>

          {previewImage && (
            <div className="mt-3 text-center">
              <p className="mb-1">Current/Preview Thumbnail:</p>
              <Image
                src={previewImage}
                alt="Doctor thumbnail"
                fluid
                rounded
                style={{ maxHeight: '200px', objectFit: 'cover' }}
              />
            </div>
          )}

          <Button type="submit" variant="primary" className="mt-3">
            Update Doctor
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DoctorModal;

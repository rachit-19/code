import React, { useState } from 'react'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const NewUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    role: '',
    address: '',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    try {
      const response = await axios.post(
        'http://localhost:4000/users',
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          age: formData.age,
          mobile: formData.mobile,
          role: formData.role,
          address: formData.address,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )
      if (response.status === 201) {
        setError('')
        toast.success('User created successfully')
        setFormData({
          name: '',
          mobile: '',
          email: '',
          password: '',
          confirmPassword: '',
          age: '',
          role: '',
          address: '',
        })
      } else {
        toast.error('Failed to create user')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      toast.error('Failed to create user')
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>User Information</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              {error && <p className="text-danger">{error}</p>}
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="name">Name</CFormLabel>
                  <CFormInput
                    type="text"
                    id="name"
                    placeholder="Enter name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </CCol>
                {/* <CCol md={6}>
                  <CFormLabel htmlFor="mobile">Mobile</CFormLabel>
                  <CFormInput
                    type="number"
                    id="mobile"
                    placeholder="Enter number"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                </CCol> */}
              </CRow>
              <div className="mb-3">
                <CFormLabel htmlFor="email">Email</CFormLabel>
                <CFormInput
                  type="email"
                  id="email"
                  placeholder="Enter email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="password">Password</CFormLabel>
                  <CFormInput
                    type="password"
                    id="password"
                    placeholder="Enter password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="confirmPassword">Confirm Password</CFormLabel>
                  <CFormInput
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </CCol>
              </CRow>
              {/* <div className="mb-3">
                <CFormLabel htmlFor="age">Age</CFormLabel>
                <CFormInput
                  type="number"
                  id="age"
                  placeholder="Enter age"
                  required
                  value={formData.age}
                  onChange={handleChange}
                />
              </div> */}
              <div className="mb-3">
                <CFormLabel htmlFor="role">Role</CFormLabel>
                <CFormSelect id="role" required value={formData.role} onChange={handleChange}>
                  <option value="">Choose...</option>
                  <option value="user">User</option>
                  <option value="supervisor">Supervisor</option>
                </CFormSelect>
              </div>
              {/* <div className="mb-3">
                <CFormLabel htmlFor="address">Address</CFormLabel>
                <CFormTextarea
                  id="address"
                  placeholder="Enter address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                ></CFormTextarea>
              </div> */}
              <CButton type="submit" color="primary">
                Submit
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
      <ToastContainer />
    </CRow>
  )
}

export default NewUser

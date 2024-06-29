import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Select from 'react-select'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSelector } from 'react-redux'

const RaiseDefect = () => {
  const user = useSelector((state) => state.auth.user)
  const [defects, setDefects] = useState([])
  const [actions, setActions] = useState([])
  const [formData, setFormData] = useState({
    engineSerialNumber: '',
    defect: [],
    actionTaken: [],
  })

  useEffect(() => {
    async function fetchDefects() {
      try {
        const response = await axios.get('http://localhost:4000/defects', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        if (response.data) {
          setDefects(response.data)
        } else {
          toast.error('Failed to fetch defects')
        }
      } catch (error) {
        console.error('Error fetching defects:', error)
        toast.error('Failed to fetch defects')
      }
    }

    async function fetchActions() {
      try {
        const response = await axios.get('http://localhost:4000/actions', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        if (response.data) {
          setActions(response.data)
        } else {
          toast.error('Failed to fetch actions')
        }
      } catch (error) {
        console.error('Error fetching actions:', error)
        toast.error('Failed to fetch actions')
      }
    }

    fetchDefects()
    fetchActions()
  }, [])

  const handleChange = (selectedOptions, { name }) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: selectedOptions,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:4000/raise_defects', {...formData, user: user.email}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (response.status === 201) {
        toast.success('Defect raised successfully')
        setFormData({
          engineSerialNumber: '',
          defect: [],
          actionTaken: [],
        })
      } else {
        toast.error('Failed to raise defects')
      }
    } catch (error) {
      console.error('Error raising defects:', error)
      toast.error('Failed to raise defects')
    }
  }

  const formatOptions = (items) =>
    items.map((item) => ({ value: item.id, label: item.defect_name || item.action_name }))

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Raise Defect</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <div className="mb-3">
                <CFormLabel htmlFor="engineSerialNumber">Engine Serial Number</CFormLabel>
                <CFormInput
                  type="text"
                  id="engineSerialNumber"
                  placeholder="Enter engine serial number"
                  required
                  value={formData.engineSerialNumber}
                  onChange={(e) =>
                    setFormData((prevState) => ({
                      ...prevState,
                      engineSerialNumber: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="defect">Defect</CFormLabel>
                <Select
                  isMulti
                  name="defect"
                  options={formatOptions(defects)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={formData.defect}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="actionTaken">Action Taken</CFormLabel>
                <Select
                  isMulti
                  name="actionTaken"
                  options={formatOptions(actions)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={formData.actionTaken}
                  onChange={handleChange}
                />
              </div>
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

export default RaiseDefect

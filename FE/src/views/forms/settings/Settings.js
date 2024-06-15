import React, { useRef, useState } from 'react'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormFeedback,
  CRow,
} from '@coreui/react'
import * as XLSX from 'xlsx'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSelector } from 'react-redux'

const Settings = () => {
  const [data, setData] = useState([])
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)
  const operatorFileInputRef = useRef(null)
  const actionFileInputRef = useRef(null)
  const user = useSelector((state) => state.auth.user)

  const [defectsData, setDefectsData] = useState([])
  const [operatorsData, setOperatorsData] = useState([])
  const [actionsData, setActionsData] = useState([])
  const handleDefectsChange = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = async (e) => {
      const binaryStr = e.target.result
      const workbook = XLSX.read(binaryStr, { type: 'binary' })

      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const json = XLSX.utils.sheet_to_json(sheet)

      const requiredColumns = ['defect_name', 'screen_no', 'station_id']
      const columns = Object.keys(json[0])

      const hasRequiredColumns = requiredColumns.every((col) => columns.includes(col))

      if (!hasRequiredColumns) {
        setError('The Excel file (Defects) does not have the required columns.')
        setData([])
        fileInputRef.current.value = '' // Clear the file input
        return
      }

      const formattedData = json.map((row) => ({
        defect_name: row['defect_name'],
        screen_no: row['screen_no'],
        station_id: row['station_id'],
      }))

      setError('')
      setDefectsData(formattedData)


    }

    reader.onerror = () => {
      setError('Error reading the file.')
      fileInputRef.current.value = '' // Clear the file input in case of read error
    }

    reader.readAsBinaryString(file)
  }

  const handleOperatorChange = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = async (e) => {
      const binaryStr = e.target.result
      const workbook = XLSX.read(binaryStr, { type: 'binary' })

      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const json = XLSX.utils.sheet_to_json(sheet)

      const requiredColumns = ['station_id', 'operator_name']
      const columns = Object.keys(json[0])
      console.log(requiredColumns, columns, "Columns")

      const hasRequiredColumns = requiredColumns.every((col) => columns.includes(col))

      if (!hasRequiredColumns) {
        setError('The Excel file (Operators) does not have the required columns.')
        setData([])
        operatorFileInputRef.current.value = '' // Clear the file input
        return
      }

      const formattedData = json.map((row) => ({
        station_id: row['station_id'],
        operator_name: row['operator_name'],
      }))

      setError('')
      setOperatorsData(formattedData)
      console.log(formattedData)


    }

    reader.onerror = () => {
      setError('Error reading the file.')
      operatorFileInputRef.current.value = '' // Clear the file input in case of read error
    }

    reader.readAsBinaryString(file)
  }

  const handleActionChange = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = async (e) => {
      const binaryStr = e.target.result
      const workbook = XLSX.read(binaryStr, { type: 'binary' })

      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const json = XLSX.utils.sheet_to_json(sheet)

      const requiredColumns = ['action_name']
      const columns = Object.keys(json[0])
      console.log(requiredColumns, columns, 'Columns')

      const hasRequiredColumns = requiredColumns.every((col) => columns.includes(col))

      if (!hasRequiredColumns) {
        setError('The Excel file (Actions) does not have the required columns.')
        setData([])
        actionFileInputRef.current.value = '' // Clear the file input
        return
      }

      const formattedData = json.map((row) => ({
        action_name: row['action_name'],
      }))

      setError('')
      setActionsData(formattedData)


    }

    reader.onerror = () => {
      setError('Error reading the file.')
      actionFileInputRef.current.value = '' // Clear the file input in case of read error
    }

    reader.readAsBinaryString(file)
  }

  const generateSampleExcel = (fieldName) => {
    const ws = XLSX.utils.aoa_to_sheet([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    XLSX.writeFile(wb, `${fieldName}_sample.xlsx`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log(defectsData, operatorsData, actionsData)
      if(defectsData.length>0){
          try {
          const response = await axios.post(
            'http://localhost:4000/defects/bulk_defects',
            defectsData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            },
          )
          if (response.status === 201) {
            setError('')
            toast.success('Bulk Defects added successfully')
          } else {
            toast.error('Failed to upload defects')
          }
        } catch (error) {
          console.error('Error creating bulk defects:', error)
          toast.error('Failed to upload defects')
        }
      }
      if (operatorsData.length > 0) {
        try {
          const response = await axios.post(
            'http://localhost:4000/operators/bulk_operators',
            operatorsData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            },
          )
          if (response.status === 201) {
            setError('')
            toast.success('Bulk Operators added successfully')
          } else {
            toast.error('Failed to upload operators')
          }
        } catch (error) {
          console.error('Error creating bulk operators:', error)
          toast.error('Failed to upload operators')
        }
      }
      if (actionsData.length > 0) {
        try {
          const response = await axios.post(
            'http://localhost:4000/actions/bulk_actions',
            actionsData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            },
          )
          if (response.status === 201) {
            setError('')
            toast.success('Bulk Actions added successfully')
          } else {
            toast.error('Failed to upload defects')
          }
        } catch (error) {
          console.error('Error creating bulk actions:', error)
          toast.error('Failed to upload actions')
        }
      }
    } catch (error) {
      console.error('Error updating settings:', error)
      toast.error('Failed to upload settings')
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Settings</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              {error && <p className="text-danger">{error}</p>}
              {user.role === 'admin' && (
                <div className="mb-3">
                  <label htmlFor="field1">Defects </label>
                  <br />
                  <input
                    type="file"
                    id="field1"
                    accept=".xlsx"
                    onChange={handleDefectsChange}
                    ref={fileInputRef}
                  />
                  <CFormFeedback invalid>Please upload an Excel file (.xlsx)</CFormFeedback>
                  <CButton color="info" onClick={() => generateSampleExcel('field1')}>
                    Sample Excel
                  </CButton>
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="field2">Operators </label>
                <br />
                <input
                  type="file"
                  id="field2"
                  accept=".xlsx"
                  onChange={handleOperatorChange}
                  ref={operatorFileInputRef}
                />
                <CFormFeedback invalid>Please upload an Excel file (.xlsx)</CFormFeedback>
                <CButton color="info" onClick={() => generateSampleExcel('field2')}>
                  Sample Excel
                </CButton>
              </div>
              {user.role === "admin" &&
              <div className="mb-3">
                <label htmlFor="field3">Action Taken </label>
                <br />
                <input
                  type="file"
                  id="field3"
                  accept=".xlsx"
                  onChange={handleActionChange}
                  ref={actionFileInputRef}
                />
                <CFormFeedback invalid>Please upload an Excel file (.xlsx)</CFormFeedback>
                <CButton color="info" onClick={() => generateSampleExcel('field3')}>
                  Sample Excel
                </CButton>
              </div>}
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

export default Settings

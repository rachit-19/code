import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Link, useNavigate } from 'react-router-dom'
import ApiService from '../../../ApiService'

const DefectsTable = () => {
  const [defects, setDefects] = useState([])
  const [filteredDefects, setFilteredDefects] = useState([])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [defectIdToDelete, setDefectIdToDelete] = useState(null)
  const [sortBy, setSortBy] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    // if (defects.length > 0) {
      applyFilters()
    // }
  }, [defects, sortBy, sortOrder, currentPage, searchTerm])

  const fetchData = async () => {
    try {
      const response = await ApiService.request('get', '/raise_defects', null, {}, navigate)
      setDefects(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch defects')
    }
  }

  // Apply sorting and pagination
  const applyFilters = () => {
    let filteredData = [...defects]

    // Apply search filter
    if (searchTerm.trim() !== '') {
      filteredData = filteredData.filter(
        (defect) =>
          defect.engine_serial_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
          defect.defects.toLowerCase().includes(searchTerm.toLowerCase()) ||
          defect.actions.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply sorting
    if (sortBy) {
      filteredData.sort((a, b) => {
        const aValue = typeof a[sortBy] === 'string' ? a[sortBy].toLowerCase() : a[sortBy]
        const bValue = typeof b[sortBy] === 'string' ? b[sortBy].toLowerCase() : b[sortBy]
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
    }

    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    filteredData = filteredData.slice(startIndex, endIndex)

    setFilteredDefects(filteredData)
  }

  // Sorting function
  const handleSort = (field) => {
    if (field === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  // Pagination logic
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Delete defect
  const deleteDefect = (defectId) => {
    const updatedDefects = defects.filter((defect) => defect.id !== defectId)
    setDefects(updatedDefects)
    toast.success('Defect deleted successfully')
    setShowConfirmModal(false)
  }

  // Toggle delete confirmation modal
  const toggleConfirmModal = (defectId) => {
    setShowConfirmModal(!showConfirmModal)
    setDefectIdToDelete(defectId)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Defects</strong>
            <Link to="/raiseDefects">
              <CButton color="primary">Add New +</CButton>
            </Link>
          </CCardHeader>
          <CCardBody>
            <div className="d-flex justify-content-between mb-3">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('engine_serial_no')}>
                    Engine Serial No{' '}
                    {sortBy === 'engine_serial_no' && (
                      <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('defects')}>
                    Defects {sortBy === 'defects' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('actions')}>
                    Actions {sortBy === 'actions' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                  </CTableHeaderCell>
                  {localStorage.getItem('role') === 'admin' && (
                    <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                  )}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredDefects.length > 0 &&
                  filteredDefects.map((defect, index) => (
                    <CTableRow key={defect.id}>
                      <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                      <CTableDataCell>{defect.engine_serial_no}</CTableDataCell>
                      <CTableDataCell>{defect.defects}</CTableDataCell>
                      <CTableDataCell>{defect.actions}</CTableDataCell>
                      {localStorage.getItem('role') === "admin" &&
                      <CTableDataCell>
                        <CButton
                          color="danger"
                          size="sm"
                          onClick={() => toggleConfirmModal(defect.id)}
                        >
                          Delete
                        </CButton>
                      </CTableDataCell>}
                    </CTableRow>
                  ))}
              </CTableBody>
            </CTable>
            <nav>
              <ul className="pagination">
                {Array.from({ length: Math.ceil(defects.length / itemsPerPage) }).map(
                  (_, index) => (
                    <li key={index} className="page-item">
                      <button onClick={() => paginate(index + 1)} className="page-link">
                        {index + 1}
                      </button>
                    </li>
                  ),
                )}
              </ul>
            </nav>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Delete Confirmation Modal */}
      <CModal visible={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete this defect?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={() => deleteDefect(defectIdToDelete)}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Toast Container for Notifications */}
      <ToastContainer />
    </CRow>
  )
}

export default DefectsTable

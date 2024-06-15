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
import { Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Tables = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [userIdToDelete, setUserIdToDelete] = useState(null)
  const [sortBy, setSortBy] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if(users.length > 0){
      applyFilters()
    }
  }, [users, sortBy, sortOrder, currentPage, searchTerm])

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'http://localhost:4000/users',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )
      setUsers(response.data.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch user')
    }
  }

  // Apply sorting and pagination
  const applyFilters = () => {
    console.log(users, "users")
    let filteredData = [...users]

    // Apply search filter
    if (searchTerm.trim() !== '') {
      filteredData = filteredData.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase()),
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

    setFilteredUsers(filteredData)
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

  // Delete user
  const deleteUser = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId)
    setUsers(updatedUsers)
    toast.success('User deleted successfully')
    setShowConfirmModal(false)
  }

  // Toggle delete confirmation modal
  const toggleConfirmModal = (userId) => {
    setShowConfirmModal(!showConfirmModal)
    setUserIdToDelete(userId)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Users</strong>
            <Link to="/addNewUser">
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
                  <CTableHeaderCell scope="col" onClick={() => handleSort('name')}>
                    Name {sortBy === 'name' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('email')}>
                    Email {sortBy === 'email' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('role')}>
                    Role {sortBy === 'role' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredUsers.length>0 && filteredUsers.map((user, index) => (
                  <CTableRow key={user.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{user.name}</CTableDataCell>
                    <CTableDataCell>{user.email}</CTableDataCell>
                    <CTableDataCell>{user.role}</CTableDataCell>
                    <CTableDataCell>
                      <CButton color="danger" size="sm" onClick={() => toggleConfirmModal(user.id)}>
                        Delete
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <nav>
              <ul className="pagination">
                {Array.from({ length: Math.ceil(users.length / itemsPerPage) }).map((_, index) => (
                  <li key={index} className="page-item">
                    <button onClick={() => paginate(index + 1)} className="page-link">
                      {index + 1}
                    </button>
                  </li>
                ))}
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
        <CModalBody>Are you sure you want to delete this user?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={() => deleteUser(userIdToDelete)}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Toast Container for Notifications */}
      <ToastContainer />
    </CRow>
  )
}

export default Tables

import React, { useEffect, useState } from 'react'
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
import ApiService from '../../ApiService'

const ReportsTable = () => {
  const [reports, setReports] = useState([])
  const [filteredReports, setFilteredReports] = useState([])
  const [sortBy, setSortBy] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    applyFilters()
    console.log(reports, 'Report response')
  }, [reports, sortBy, sortOrder, currentPage, searchTerm])

  const fetchData = async () => {
    try {
      const response = await ApiService.request(
        'get',
        '/raise_defects/defectsReport',
        null,
        {},
        navigate,
      )
      setReports(
        response.data.map((report) => ({
          ...report,
          raisedBy: report.user,
          raisedAt: report.updated_at,
        })),
      )
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch reports')
    }
  }

  // Apply sorting and pagination
  const applyFilters = () => {
    let filteredData = [...reports]

    // Apply search filter
    if (searchTerm.trim() !== '') {
      filteredData = filteredData.filter((report) => {
        // Convert each field to lowercase for case-insensitive search
        const engineSerialNo = report?.engine_serial_no?.toLowerCase() || ''
        const defects = report?.defects?.toLowerCase() || ''
        const actions = report?.actions?.toLowerCase() || ''
        const operatorName = report?.operator_name?.toLowerCase() || ''
        const stationId = report?.station_id?.toString()?.toLowerCase() || ''
        const screenNo = report?.screen_no?.toString()?.toLowerCase() || ''
        const raisedBy = report?.raisedBy?.toLowerCase() || ''
        const raisedAt = report?.raisedAt?.toLowerCase() || ''

        // Check if any field includes the searchTerm
        return (
          engineSerialNo.includes(searchTerm.toLowerCase()) ||
          defects.includes(searchTerm.toLowerCase()) ||
          actions.includes(searchTerm.toLowerCase()) ||
          operatorName.includes(searchTerm.toLowerCase()) ||
          stationId.includes(searchTerm.toLowerCase()) ||
          screenNo.includes(searchTerm.toLowerCase()) ||
          raisedBy.includes(searchTerm.toLowerCase()) ||
          raisedAt.includes(searchTerm.toLowerCase())
        )
      })
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

    setFilteredReports(filteredData)
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

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Reports</strong>
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
                    Defect {sortBy === 'defects' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('actions')}>
                    Actions {sortBy === 'actions' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('operator_name')}>
                    Operator Name{' '}
                    {sortBy === 'operator_name' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('station_id')}>
                    Station ID{' '}
                    {sortBy === 'station_id' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('screen_id')}>
                    Screen No{' '}
                    {sortBy === 'screen_id' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('raisedBy')}>
                    Raised By{' '}
                    {sortBy === 'raisedBy' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('raisedAt')}>
                    Raised At{' '}
                    {sortBy === 'raisedAt' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredReports.length > 0 &&
                  filteredReports.map((report, index) => (
                    <CTableRow key={report.id}>
                      <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                      <CTableDataCell>{report.engine_serial_no}</CTableDataCell>
                      <CTableDataCell>{report.defect_name}</CTableDataCell>
                      <CTableDataCell>{report.actions}</CTableDataCell>
                      <CTableDataCell>{report.operator_name}</CTableDataCell>
                      <CTableDataCell>{report.station_id}</CTableDataCell>
                      <CTableDataCell>{report.screen_no}</CTableDataCell>
                      <CTableDataCell>{report.raisedBy}</CTableDataCell>
                      <CTableDataCell>{report.raisedAt}</CTableDataCell>
                    </CTableRow>
                  ))}
              </CTableBody>
            </CTable>
            <nav>
              <ul className="pagination">
                {Array.from({ length: Math.ceil(reports.length / itemsPerPage) }).map(
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

      {/* Toast Container for Notifications */}
      <ToastContainer />
    </CRow>
  )
}

export default ReportsTable

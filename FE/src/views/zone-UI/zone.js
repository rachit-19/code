import React, { useEffect, useRef, useMemo } from 'react'
import { CCard, CCardBody, CCardSubtitle, CCardText, CCardTitle, CCol, CRow, CTable, CTableBody, CTableDataCell, CTableHeaderCell, CTableRow } from '@coreui/react'
import useWebSocket from 'react-use-websocket'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearDefects, selectDefectsByScreenNo, setDefects } from '../../redux/DefectsSlice'
import './style.css' // Import your CSS file for Zone component styling

const Zone = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const defects = useSelector((state) => selectDefectsByScreenNo(state, id))
  const prevDefectsRef = useRef(defects)

  const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:1111', {
    onOpen: () => console.log('WebSocket connection established'),
    onClose: () => console.log('WebSocket connection closed'),
    onError: (error) => console.error('WebSocket error:', error),
    shouldReconnect: (closeEvent) => true,
  })

  useEffect(() => {
    if (id) {
      console.log('Zone ID:', id)
    }

  }, [id])

  useEffect(() => {
    if (lastMessage !== null) {
      console.log('Received message:', lastMessage.data)
      try {
        const message = JSON.parse(lastMessage.data)
        console.log('Parsed message:', message)

        if (message.defect) {
          const operatorMap = new Map()
          message.operators.forEach((operator) => {
            operatorMap.set(operator.station_id, operator.operator_name)
          })

          // Add operator_name to each defect based on station_id
          const updatedDefects1 = message.defects.map((defect) => ({
            ...defect,
            operator_name: operatorMap.get(defect.station_id) || 'Unknown Operator',
            updated_at: message.updated_at, // Include updated_at for consistency
          }))

          console.log(updatedDefects1, 'updated defect 1', defects, [
            ...defects,
            ...updatedDefects1,
          ])

          localStorage.setItem('active_clients', message.active_clients || 0)
          const updatedDefects = [...defects, ...updatedDefects1]
          dispatch(setDefects(updatedDefects))

        }
      } catch (error) {
        console.error('Error parsing message:', error)
      }
    }
  }, [lastMessage])

  const defectsArr = useMemo(() => {
    const defectMap = new Map()

    // Collect all defects into the map, marking is_updated
    defects.forEach((defect) => {
      const prevDefect = prevDefectsRef.current.find((el) => el.id === defect.id)
      const isUpdated = prevDefect ? prevDefect.count !== defect.count : true
      defectMap.set(defect.id, { ...defect, is_updated: isUpdated })
    })

    console.log(Array.from(defectMap.values()))
    // Convert Map values to an array and sort by updated_at descending
    const sortedDefects = Array.from(defectMap.values()).sort((a, b) => {
      const dateA = new Date(a.updated_at)
      const dateB = new Date(b.updated_at)
      return dateB - dateA // Sort in descending order
    })

    return sortedDefects
  }, [defects, prevDefectsRef])



  useEffect(() => {
    prevDefectsRef.current = defects // Update previous defects reference
  }, [defects])


  useEffect(() => {
    defectsArr.forEach((defect) => {
      if (defect.is_updated) {
        const timer = setTimeout(() => {
          dispatch(
            setDefects(defects.map((d) => (d.id === defect.id ? { ...d, is_updated: false } : d))),
          )
        }, 5000)

        return () => clearTimeout(timer)
      }
    })
  }, [defectsArr, dispatch])


  return (
    <div>
      <CRow className="g-4">
        {defectsArr.length > 0 &&
          defectsArr.map((defect, index) => (
            <CCol xs={12} sm={6} md={4} key={index}>
              <CCard className={`defect-card ${defect.is_updated ? 'updated' : ''}`}>
                <CCardBody>
                  <CTable>
                    <CTableBody>
                      <CTableRow>
                        <CTableHeaderCell scope="row">Defect Name</CTableHeaderCell>
                        <CTableHeaderCell scope="row">Operator Name</CTableHeaderCell>
                        <CTableHeaderCell scope="row">Count</CTableHeaderCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell>{defect.defect_name}</CTableDataCell>
                        <CTableDataCell>{defect.operator_name}</CTableDataCell>
                        <CTableDataCell>{defect.count || 1}</CTableDataCell>
                      </CTableRow>

                      <CTableRow>
                        <CTableDataCell>{defect.defect_name}</CTableDataCell>
                        <CTableDataCell>{defect.operator_name}</CTableDataCell>
                        <CTableDataCell>{defect.count || 1}</CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
      </CRow>
    </div>
  )
}

export default Zone

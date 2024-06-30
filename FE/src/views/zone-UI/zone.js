import React, { useEffect, useRef, useMemo, useState } from 'react'
import { CCard, CCardBody, CCardSubtitle, CCardText, CCardTitle, CCol, CRow, CTable, CTableBody, CTableDataCell, CTableHeaderCell, CTableRow } from '@coreui/react'
import useWebSocket from 'react-use-websocket'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearDefects, selectDefectsByScreenNo, setDefects } from '../../redux/DefectsSlice'
import './style.css' // Import your CSS file for Zone component styling
import axios from 'axios'

const Zone = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const defects = useSelector((state) => selectDefectsByScreenNo(state, id))
  const prevDefectsRef = useRef(defects)
  const [alertTimer, setAlertTimer] = useState(5)

  const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:1111', {
    onOpen: () => console.log('WebSocket connection established'),
    onClose: () => console.log('WebSocket connection closed'),
    onError: (error) => console.error('WebSocket error:', error),
    shouldReconnect: (closeEvent) => true,
  })

  useEffect(()=>{
      async function fetchZoneData() {
        try {
          const response = await axios.get('http://localhost:4000/api/zone-records', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          if (response.data) {
            console.log(response.data, "ZONE DATA")
            const aggregatedData = response.data.data.reduce((acc, curr) => {
              // Check if the entry already exists in the accumulator
              const existingEntry = acc.find(
                (entry) =>
                  entry.defect_name === curr.defect_name &&
                  entry.station_id === curr.station_id &&
                  entry.screen_no === curr.screen_no,
              )

              if (existingEntry) {
                // Increment count if the entry already exists
                existingEntry.count = (existingEntry.count || 1) + 1
              } else {
                // Otherwise, create a new entry
                acc.push({
                  id: curr.id,
                  defect_name: curr.defect_name,
                  station_id: curr.station_id,
                  screen_no: curr.screen_no,
                  operator_name: curr.operator_name,
                  updated_at: curr.updated_at,
                  count: 1,
                  is_updated: false, // default value for is_updated
                })
              }

              return acc
            }, [])
            console.log(aggregatedData, 'FORMATTED DATA')
            dispatch(setDefects(aggregatedData));
          } else {
            toast.error('Failed to fetch zone records')
          }
        } catch (error) {
          console.error('Error fetching zone records:', error)
          toast.error('Failed to fetch zone records')
        }
      }

    fetchZoneData();
  },[])

  useEffect(() => {
    if (id) {
      console.log('Zone ID:', id)
    }
  }, [id])

  useEffect(() => {
    // Fetch alert_timer value from backend on component mount
    const fetchAlertTimer = async () => {
      try {
        const response = await axios.get('http://localhost:4000/settings/alert_timer', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        if (response.status === 200) {
          sessionStorage.setItem('alert_timer', response.data.alert_timer)
          setAlertTimer(response.data.alert_timer)
        } else {
          toast.error('Failed to fetch alert timer value')
        }
      } catch (error) {
        console.error('Error fetching alert timer:', error)
        toast.error('Failed to fetch alert timer value')
      }
    }

    fetchAlertTimer()
  }, [])

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
          console.log(updatedDefects, 'SOCKET DATA')
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
        }, parseInt(alertTimer)*1000 || 5000)

        return () => clearTimeout(timer)
      }
    })
  }, [defectsArr, dispatch])

 return (
   <div>
     <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
       Engine Assembly Line Defect Monitoring System - Zone {id || '-'}
     </h2>
     <CRow className="g-4">
       {defectsArr.length > 0 &&
         defectsArr.map((defect, index) => (
           <CCol xs={12} sm={6} md={4} key={index}>
             <CCard
               className={`defect-card ${defect.is_updated ? 'updated' : ''}`}
               style={defect.is_updated ? { animationDuration: `${alertTimer}s` } : {}}
             >
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

                     {/* Assuming you want another row with the same data */}
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

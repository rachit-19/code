import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardLink, CCardSubtitle, CCardText, CCardTitle, CCol, CRow } from '@coreui/react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearDefects, selectDefectsByScreenNo, setDefects } from '../../redux/DefectsSlice'

const Zone = () => {
  const { id } = useParams();
   const dispatch = useDispatch()
  const defects = useSelector((state) => selectDefectsByScreenNo(state, id))
  useEffect(() => {
    if (id) {
      console.log('Zone ID:', id)
    }

    // Cleanup function to clear defects on component unmount
    // return () => {
    //   console.log("daended")
    //   dispatch(clearDefects())
    // }
  }, [id])

  const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:1111', {
    onOpen: () => console.log('WebSocket connection established'),
    onClose: () => console.log('WebSocket connection closed'),
    onError: (error) => console.error('WebSocket error:', error),
    shouldReconnect: (closeEvent) => true,
  })

  useEffect(() => {
    console.log('Current ready state:', readyState)
  }, [readyState])

  useEffect(() => {
    if (lastMessage !== null) {
      console.log('Received message:', lastMessage.data)
      try {
        const message = JSON.parse(lastMessage.data)
        console.log('Parsed message:', message)

        if (message.defects) {
          const up_at = message.updated_at;
          const def = [...defects, ...message.defects];
          dispatch(setDefects( { def, up_at }))
        }
      } catch (error) {
        console.error('Error parsing message:', error)
      }
    }
  }, [lastMessage])

  useEffect(()=>{
    console.log(defects)
  },[defects])

  return (
    <div>
      <CRow className="g-4">
        {defects.length > 0 &&
          defects.reverse().map((defect, index) => (
            <CCol xs={12} sm={6} md={4} key={index}>
              <CCard style={{ width: '100%' }}>
                <CCardBody>
                  <CCardTitle>{defect.defect_name}</CCardTitle>
                  <CCardSubtitle className="mb-2 text-muted">{defect.count}</CCardSubtitle>
                  <CCardText>{defect.description}</CCardText>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
      </CRow>
    </div>
  )
}

export default Zone

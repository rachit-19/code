import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardLink, CCardSubtitle, CCardText, CCardTitle, CCol, CRow } from '@coreui/react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectDefectsByScreenNo, setDefects } from '../../redux/DefectsSlice'

const Zone = () => {
  const { id } = useParams();
   const dispatch = useDispatch()
  const defects = useSelector((state) => selectDefectsByScreenNo(state, id))
  useEffect(() => {
    if (id) {
      console.log('Zone ID:', id)
    }
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

        if (message.defect) {
          dispatch(setDefects([...defects, ...message.defects]))
        }
      } catch (error) {
        console.error('Error parsing message:', error)
      }
    }
  }, [lastMessage])

  return (
    <div>
      <CRow className="g-4">
        {defects.length > 0 &&
          defects.map((defect, index) => (
            <CCol xs={12} sm={6} md={4} key={index}>
              <CCard style={{ width: '100%' }}>
                <CCardBody>
                  <CCardTitle>{defect.defect_name}</CCardTitle>
                  <CCardSubtitle className="mb-2 text-muted">{defect.subtitle}</CCardSubtitle>
                  <CCardText>{defect.description}</CCardText>
                  <CCardLink href="#">Card link</CCardLink>
                  <CCardLink href="#">Another link</CCardLink>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
      </CRow>
    </div>
  )
}

export default Zone

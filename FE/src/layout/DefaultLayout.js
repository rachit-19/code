import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useMatch } from 'react-router-dom'

const DefaultLayout = () => {

  const match1 = useMatch('/zoneUI/:id')
  const match2 = useMatch('/zoneUI')
  if(match1 || match2){
    return (
      <div>
        <div className="wrapper d-flex flex-column min-vh-100">
          <div className="body flex-grow-1">
            <AppContent />
          </div>
        </div>
      </div>
    )
  }
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout

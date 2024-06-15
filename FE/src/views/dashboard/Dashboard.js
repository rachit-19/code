import { useEffect } from 'react'
import DefectsTable from '../base/tables/DefectsTable'
import Tables from '../base/tables/Tables'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user)
  const state = useSelector((state) => state)
  useEffect(() => {
    console.log(state)
  }, [state])
  return (
    <>
      {user && user.role==="admin" && <Tables />}
      <DefectsTable />
    </>
  )
}

export default Dashboard

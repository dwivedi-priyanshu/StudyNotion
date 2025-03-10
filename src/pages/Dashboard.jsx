import React, { useState } from 'react'
import Sidebar from "../components/core/Dashboard/Sidebar"
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Dashboard = () => {
    const {loading:authLoading}=useSelector(state=>state.auth)
    const {loading:profileLoading}=useSelector(state=>state.profile)

    if(authLoading || profileLoading ){
        return(
            <div className='mt-16'>Loading....</div>
        )
    }

  return (
    <div className='realative  flex min-h-[calc(100vh-3.5rem)]'>
        <Sidebar/>
        {/* niche wali line me w-full rakhna original code mai nhi hai  */}
        <div className='h-[calc(100vh-3.5rem)] w-full overflow-auto'>
            <div className='mx-auto w-11/12 max-w-[1000px] py-10'>
                <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default Dashboard
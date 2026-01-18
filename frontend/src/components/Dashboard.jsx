import React from 'react'
import { Appbar } from './Appbar'
import { Balance } from './Balance'
import { Users } from './Users'

const Dashboard = () => {
  return (
    <div className='p-20 flex flex-col gap-1'>
        <Appbar/>
        <Balance />
        <Users/>
    </div>
  )
}

export default Dashboard
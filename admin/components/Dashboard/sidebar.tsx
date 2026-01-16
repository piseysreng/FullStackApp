import React from 'react'
import UserItem from './userItem'

export default function DashboardSidebar() {
  return (
    <div className='flex flex-col w-75 min-w-75 border-r min-h-screen p-4'>
        <div>
          <UserItem/>
        </div>
        <div className='grow'>Menu Part</div>
        <div>Notifications Part</div>
    </div>
  )
}

import React from 'react'

export default function UserItem() {
    return (
        <div className='flex justify-items-start items-center gap-2 border rounded-[10px] p-3'>
            <div className='avatar rounded-full h-8 w-8 bg-blue-500 text-white font-bold flex justify-center items-center'>
                <p>PS</p>
            </div>
            <div>
                <p className='text-[14px] font-bold'>First Name</p>
                <p className='text-[12px]'>pisey.sreng@gmail.com</p>
            </div>

        </div>
    )
}

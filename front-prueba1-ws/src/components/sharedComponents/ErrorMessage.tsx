import React, { ReactNode } from 'react'

export default function ErrorMessage({children}: {children: ReactNode}) {
  return (
    <div className='text-center bg-red-100 text-red-600 font-bold p-3 uppercasetext-sm'>
      {children}
    </div>
  )
}

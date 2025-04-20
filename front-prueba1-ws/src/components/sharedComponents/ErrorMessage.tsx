import { ReactNode } from 'react'

// por si lo quiero usar para personalizar los forms en algún momento
export default function ErrorMessage({children}: {children: ReactNode}) {
  return (
    <div className='text-center bg-red-100 text-red-600 font-bold p-3 uppercasetext-sm'>
      {children}
    </div>
  )
}

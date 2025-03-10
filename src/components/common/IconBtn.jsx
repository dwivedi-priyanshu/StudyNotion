import React from 'react'

const IconBtn = ({ text, onClick, children, disabled, outline = false, customClasses, type }) => {
  return (
    <button className={`flex items-center ${outline ? "border border-yellow-50 bg-transparent" : "bg-yellow-50"
      } cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 ${customClasses}`} disabled={disabled} onClick={onClick} type={type}>
      {
        children ? (<><span>{text}</span>{children}</>) : <span>{text}</span>
      }


    </button>
  )
}

export default IconBtn
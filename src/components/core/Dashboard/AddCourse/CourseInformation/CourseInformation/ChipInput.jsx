// Importing React hook for managing component state
import { useEffect, useState } from "react"
// Importing React icon component
import { MdClose } from "react-icons/md"
import { useSelector } from "react-redux"

export default function ({ label,
    name,
    placeholder,
    register,
    errors,
    setValue,
    getValues
    }){
        const {editCourse,course}=useSelector(state=>state.course)

        //setting up state for managing chips array
        const [chips,setChips]=useState([])
        //if the course is in edit mode then fill the chip array with predefined tags
        useEffect(()=>{
            if(editCourse){
                console.log(course)
                setChips(course.tag)
            }
            register(name,{required:true,validate:(value=>value.length >0)})
        },[])

        // Whenever chips changes, it updates the form field using setValue(name, chips).
        useEffect(()=>{
            setValue(name,chips)
        },[chips])

        const handleKeyDown=(event)=>{
            //check if the user press enter or ,
            if(event.key==="Enter" ||  event.key ===","){
                event.preventDefault()
                //get the input value and remove and white spaces
                const chipValue=event.target.value.trim()
                if(chipValue && !chips.includes(chipValue)){
                    const newChips=[...chips,chipValue]
                    setChips(newChips)
                    event.target.value=""
                }
            }
        }
        //function to handle deletion of a chip
        const handleDeleteChip=(chipIndex)=>{
            const newChips=chips.filter((_,index)=>index !==chipIndex)
            setChips(newChips)

        }
        return(
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5"htmlFor={name} >
                    {label}  <sup className="text-pink-200">*</sup>
                </label>
                {/* Render the chips and input  */}
                <div className="flex w-full flex-wrap gap-y-2">
                    {
                        chips.map((chip,index)=>(
                            <div key={index} className="m-1 flex items-center rounded-full bg-yellow-100 px-2 py-1 text-sm text-richblack-5">
                                {chip}
                                {/* Redering button to delete chip  */}
                                <button type="button" 
                                className="ml-2 focus:outline-none"
                                onClick={()=>handleDeleteChip(index)}>
                                    <MdClose className="text-sm"/>
                                </button>
                            </div>
                        ))
                    }
                    <input 
                     id={name}
                     name={name}
                     type="text"
                     placeholder={placeholder}
                     onKeyDown={handleKeyDown}
                     className="form-style w-full"
                    />

                </div>
                {
                    errors[name] && (
                        <span className="ml-2 text-xs tracking-wide text-pink-200">
                            {label} is required
                        </span>
                    )
                }

            </div>
        )

    }
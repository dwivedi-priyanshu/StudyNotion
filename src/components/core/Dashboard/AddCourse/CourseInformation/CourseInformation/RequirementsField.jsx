import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export default function RequirementsField({
    name,
    label,
    register,
    setValue,
    errors,
    getValues,
}) {
    const { editCourse, course } = useSelector(state => state.course)

    const [requirement, setRequirement] = useState("")
    const [requirementsList, setRequirementsList] = useState([])

    useEffect(() => {
        if (editCourse) {
            console.log("Course instructions", course?.instructions)
            setRequirementsList(course?.instructions); // Ensuring it's always an array
        }
        register(name, { required: true, validate: (value) => value.length > 0 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        setValue(name, requirementsList)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requirementsList])


    const handleAdd = () => {
        if (requirement) {
            setRequirementsList([...requirementsList, requirement])
            setRequirement("")
        }
    }
    const handleRemove = (index) => {
        const updatedRequirements = [...requirementsList]
        updatedRequirements.splice(index, 1)
        setRequirementsList(updatedRequirements)
    }
    return (
        <div className="flex flex-col space-y-2" >
            <label className="text-sm text-richblack-5" htmlFor={name}>
                {label}  <sup className="text-pink-200">*</sup>
            </label>
            <div className="flex flex-col items-start space-y-2">
                <input
                    type="text"
                    id={name}
                    value={requirement}
                    onChange={e => setRequirement(e.target.value)}
                    className="form-style w-full"
                />
                <button
                    type="button"
                    onClick={handleAdd}
                    className="font-semibold text-yellow-50"
                >
                    Add
                </button>
            </div>
            {
                requirementsList.length > 0 && (
                    <ul className="mt-2 list-inside list-disc">
                        {
                            requirementsList.map((list, index) => (
                                <li key={index} className="flex items-center text-richblack-5">
                                    {list}
                                    <button
                                        type="button"
                                        className="ml-2 text-xs text-pure-greys-300 "
                                        onClick={() => handleRemove(index)}
                                    >
                                        clear
                                    </button>
                                </li>
                            ))
                        }
                    </ul>
                )
            }
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
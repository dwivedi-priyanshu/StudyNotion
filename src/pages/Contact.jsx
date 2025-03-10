import React from 'react'
import ContactForm from '../components/core/AboutPage/ContactForm'
import ContactDetails from "../components/core/ContactDetails/ContactDetails"
import Footer from '../components/common/Footer'
import ContactUsForm from '../components/ContactPage/ContactUsForm'

const Contact = () => {
    return (
        <div>
            <div className='mx-auto mt-20 flex w-10/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row'>
                {/*contact details*/}
                <div className='lg:w-[40%]"'>
                    <ContactDetails />
                </div>
                <div className='lg:w-[60%]'>
                    <h1 className="text-left text-4xl font-semibold">
                        Got an Idea? We've got the skills. Let's team up
                    </h1>

                    <p className="text-center text-richblack-300 mt-3">
                        Tell us more about yourself and what you'he got in your mind.
                    </p>
                    <ContactUsForm />
                </div>
            </div>

           <div className='mt-5'>
           <Footer />
           </div>
        </div>
    )
}

export default Contact
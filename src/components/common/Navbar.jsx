import { useEffect, useState } from "react"
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"
import { useSelector } from "react-redux"
import { Link, useLocation, useNavigate } from "react-router-dom"

import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiconnector"
import { categories } from "../../services/apis"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropdown from "../core/Auth/ProfileDropdown"

function Navbar() {
    const { token } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.profile)
    const { totalItems } = useSelector((state) => state.cart)
    const location = useLocation()
    const navigate = useNavigate()

    const [subLinks, setSubLinks] = useState([])
    const [loading, setLoading] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false) // Mobile menu state
    const [isCatalogOpen, setIsCatalogOpen] = useState(false) // Catalog dropdown state

    useEffect(() => {
        (async () => {
            setLoading(true)
            try {
                const res = await apiConnector("GET", categories.CATEGORIES_API)
                setSubLinks(res.data.data || [])
            } catch (error) {
                console.log("Could not fetch Categories.", error)
            }
            setLoading(false)
        })()
    }, [])

    return (
        <div className={`flex h-14 items-center justify-center border-b-[2px] border-b-richblack-700 ${location.pathname !== "/" ? "bg-richblack-800" : ""} transition-all duration-200`}>
            <div className="flex w-11/12 max-w-maxContent items-center justify-between">
                {/* Logo */}
                <Link to="/">
                    <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:block">
                    <ul className="flex gap-x-6 text-richblack-25">
                        {NavbarLinks.map((link, index) => (
                            <li key={index} className="relative">
                                {link.title === "Catalog" ? (
                                    <div className="relative cursor-pointer flex items-center gap-1" onClick={() => setIsCatalogOpen(!isCatalogOpen)}>
                                        <p>{link.title}</p>
                                        <BsChevronDown />
                                        {/* Dropdown Menu */}
                                        {isCatalogOpen && (
                                            <div className="absolute left-0 top-full mt-2 z-[10] w-48 rounded-lg bg-richblack-900 shadow-lg">
                                                {subLinks.length > 0 ? (
                                                    subLinks.map((subLink, i) => (
                                                        <div
                                                            key={i}
                                                            onClick={() => {
                                                                navigate(`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`)
                                                                setIsCatalogOpen(false) // Close dropdown
                                                            }}
                                                            className="px-4 py-3 text-richblack-25 hover:bg-richblack-700 cursor-pointer"
                                                        >
                                                            {subLink.name}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="px-4 py-3 text-center">No Courses Found</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link to={link?.path}>
                                        <p>{link.title}</p>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Login / Signup / Dashboard */}
                <div className="hidden md:flex items-center gap-x-4">
                    {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                        <Link to="/dashboard/cart" className="relative">
                            <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                            {totalItems > 0 && (
                                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100 animate-bounce">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    )}
                    {token === null ? (
                        <>
                            <Link to="/login">
                                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">Log in</button>
                            </Link>
                            <Link to="/signup">
                                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">Sign up</button>
                            </Link>
                        </>
                    ) : (
                        <ProfileDropdown />
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button className="mr-4 md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
                </button>

                {/* Mobile Menu */}
                <div className={`fixed top-0 left-0 w-full h-full bg-richblack-900/90 z-[1000] transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <div className="flex flex-col items-center p-6">
                        <button onClick={() => setIsMenuOpen(false)} className="self-end text-3xl text-white mb-4">✖</button>
                        
                        {/* Navigation Links */}
                        {NavbarLinks.map((link, index) => (
                            <div key={index} className="w-full text-center">
                                {link.title === "Catalog" ? (
                                    <>
                                        <button className="py-3 text-white text-xl w-full hover:bg-richblack-700" onClick={() => setIsCatalogOpen(!isCatalogOpen)}>
                                            {link.title} <BsChevronDown className="absolute right-[30%] top-[22%]" />
                                        </button>
                                        {isCatalogOpen && (
                                            <div className="w-full bg-richblack-800 rounded-lg">
                                                {subLinks.map((subLink, i) => (
                                                    <div key={i} onClick={() => {
                                                        navigate(`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`)
                                                        setIsMenuOpen(false)
                                                        setIsCatalogOpen(false)
                                                    }} className="py-3 text-white hover:bg-richblack-700 cursor-pointer">
                                                        {subLink.name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link to={link.path} className="py-3 text-white text-xl w-full block hover:bg-richblack-700" onClick={() => setIsMenuOpen(false)}>
                                        {link.title}
                                    </Link>
                                )}
                            </div>
                        ))}

                        {token === null ? (
                            <>
                                <Link to="/login" className="py-3 text-white text-xl w-full text-center hover:bg-richblack-700" onClick={() => setIsMenuOpen(false)}>Log in</Link>
                                <Link to="/signup" className="py-3 text-white text-xl w-full text-center hover:bg-richblack-700" onClick={() => setIsMenuOpen(false)}>Sign up</Link>
                            </>
                        ) : (
                            <ProfileDropdown />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar

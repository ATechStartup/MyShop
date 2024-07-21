'use client'

// ** Components
import Link from "next/link"
import Container from "../../Container"
import SearchBar from "../SearchBar"
import CartCount from "../CartCount"
import FavoriteCount from '../FavoriteCount'
import UserMenu from "../UserMenu"
import SubNavbar from "../../subNav/(page)/SubNavbar"


const Navbar = () => {

    return (
        <div className="fixed top-0 w-full bg-slate-200 z-30 shadow-sm py-4 pb-0">
            <div className="pb-4">
                <Container>
                    <div
                        className="flex items-center justify-between gap-3 md:gap-0"
                    >

                        <Link href={'/'} className={`text-3xl`}>My~Shop</Link>

                        <div className="hidden md:block">
                            <SearchBar />
                        </div>

                        <div className="flex items-center gap-4 md:gap-8">
                            <CartCount />

                            <FavoriteCount />

                            <UserMenu />
                        </div>

                    </div>
                </Container>
            </div>

            <SubNavbar />
        </div>
    )
}

export default Navbar
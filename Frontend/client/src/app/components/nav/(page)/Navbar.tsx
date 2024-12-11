'use client'

// ** Next
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

// ** Icons
import { RiMenu3Fill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";

// ** Components
import SearchBar from "../SearchBar/SearchBar";
import CartCount from "../CartCount";
import UserMenu from "../UserMenu";
import Container from "../../Container";
import CategoryList from "../../category/CategoryList";
import CategoryListMobile from "../../category/CategoryListMobile";
import BackDrop from "../BackDrop";

// ** MUI
import { Box, Drawer, IconButton, Typography } from "@mui/material";



const Navbar = () => {

    const [isAtTop, setIsAtTop] = useState<boolean>(true);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const handleScroll = () => {
        const scrollPosition = window.scrollY;
        setIsAtTop(scrollPosition < 50);
    };


    const toggleMenu = useCallback(() => {
        setIsMenuOpen(prev => !prev)
    }, []);


    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <>
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    width: "100%",
                    background: "#e2e8f0",
                    zIndex: 40,
                    boxShadow: isAtTop ? "none" : "0 4px 12px rgba(0, 0, 0, 0.1)",
                    py: isAtTop ? 4 : 2,
                    pt: isAtTop ? 3 : 2,
                    pb: isAtTop ? { xs: 3, lg: 0 } : 2,
                    transition: "padding 0.5s",
                }}
            >
                <Box>
                    <Container>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '0.5rem'
                            }}
                        >

                            <IconButton
                                onClick={toggleMenu}
                                sx={{
                                    display: { xs: 'block', lg: 'none' },
                                }}

                            >
                                <RiMenu3Fill size={28} />
                            </IconButton>

                            <Link
                                href="/"
                            >
                                <Typography sx={{ fontSize: { xs: '1.5rem', sm: '1.87rem' }, color: '#000000', fontWeight: 'bolder' }}>Daily~Shop</Typography>
                            </Link>

                            <Box
                                sx={{
                                    display: { xs: 'none', lg: 'block' }
                                }}
                            >
                                <SearchBar />
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: { xs: '0.4rem', sm: '1.5rem', md: '2rem' }
                                }}
                            >
                                <CartCount />
                                <UserMenu />
                            </Box>
                        </Box>
                    </Container>

                    <Box
                        sx={{
                            display: { xs: 'none', lg: 'block' }
                        }}
                    >
                        <CategoryList />
                    </Box>

                    <Drawer
                        anchor="right"
                        open={isMenuOpen}
                        onClose={toggleMenu}
                        sx={{
                            "& .MuiDrawer-paper": {
                                width: 320, // 72px * 4 = 288px width
                            },
                        }}
                    >
                        <Box py={2} px={3}>
                            <IconButton
                                onClick={toggleMenu}
                            >
                                <IoMdClose size={32} />
                            </IconButton>

                            <CategoryListMobile toggleMenu={toggleMenu} />
                        </Box>
                    </Drawer>
                </Box>
            </Box>
            {isMenuOpen ? <BackDrop onClick={toggleMenu} /> : null}
        </>
    );
};

export default Navbar;

'use client'

// ** Next
import Link from "next/link";

// ** apiSlice - RTK-Q
import { useGetAllCategoriesQuery } from "@/store/apiSlice";

// ** Types
import CategoryType from "@/types/category";

// ** Icons
import { FaInstagram } from "react-icons/fa";
import { SiTelegram } from "react-icons/si";
import { IoLogoWhatsapp } from "react-icons/io5";

// ** Components
import CatSearchBar from "./CatSearchBar";
import CategoryItem from "./CategoryItem";

// ** MUI
import { Box, Divider, Typography } from "@mui/material";


interface CategoryListMobileProps {
    toggleMenu: () => void;
}



const CategoryListMobile: React.FC<CategoryListMobileProps> = ({ toggleMenu }) => {

    const { data: categories } = useGetAllCategoriesQuery();

    return (
        <Box component="div">
            <Box
                component="div"
                sx={{
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >

                <Box
                    component="div"
                    sx={{
                        mt: '0.75rem'
                    }}
                >
                    <CatSearchBar toggleMenu={toggleMenu} />
                </Box>

                <Box
                    component="div"
                    sx={{
                        width: '100%',
                        height: '3rem',
                        background: '#e5e7eb',
                        borderBottom: '2px',
                        borderColor: '#334155',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Typography variant="body1">منو</Typography>
                </Box>

                <Box
                    component="div"
                    sx={{
                        mt: '0.75rem',
                    }}
                >

                    <Link href={'/'} onClick={toggleMenu}>
                        <CategoryItem
                            label="دیلی شاپ"
                            centerParent="!justify-start"
                            centerChild="!font-bold !text-[1rem]"
                        />
                    </Link>

                    <Divider sx={{
                        width: '100%',
                        height: '1px',
                        my: '0.5rem'
                    }} />

                    <Link href={'/products'} onClick={toggleMenu}>
                        <CategoryItem
                            label="همه محصولات"
                            centerParent="!justify-start"
                            centerChild="!font-bold !text-[1rem]"
                        />
                    </Link>

                    <Divider sx={{
                        width: '100%',
                        height: '1px',
                        my: '0.5rem'
                    }} />

                    {categories?.map((category: CategoryType) => (
                        <Box component="div" key={category._id}>
                            <Link
                                href={`/category/${category._id}`}
                                onClick={toggleMenu}
                            >
                                <CategoryItem
                                    label={category.name}
                                    centerParent="!justify-start"
                                    centerChild="!font-bold !text-[1rem]"
                                />
                            </Link>
                            <Divider
                                sx={{
                                    width: '100%',
                                    height: '1px',
                                    my: '0.5rem'
                                }}
                            />
                        </Box>
                    ))}

                    <Link href={'/top-sales-products'} onClick={toggleMenu}>
                        <CategoryItem
                            label="فروش ویژه"
                            centerParent="!justify-start"
                            centerChild="!font-bold !text-[1rem]"
                        />
                    </Link>

                    <Divider
                        sx={{
                            width: '100%',
                            height: '1px',
                            my: '0.5rem'
                        }}
                    />

                    <Link href={'#'} onClick={toggleMenu}>
                        <CategoryItem
                            label="وبلاگ"
                            centerParent="!justify-start"
                            centerChild="!font-bold !text-[1rem]"
                        />
                    </Link>

                    <Divider
                        sx={{
                            width: '100%',
                            height: '1px',
                            my: '0.5rem'
                        }}
                    />

                    <Link href={'#'} onClick={toggleMenu}>
                        <CategoryItem
                            label="درباره ما"
                            centerParent="!justify-start"
                            centerChild="!font-bold !text-[1rem]"
                        />
                    </Link>

                    <Divider
                        sx={{
                            width: '100%',
                            height: '1px',
                            my: '0.5rem'
                        }}
                    />

                    <Box
                        component="div"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1rem',
                            py: '1.25rem'
                        }}
                    >

                        <Link href={'#'}>
                            <FaInstagram size={30} className="text-slate-600" />
                        </Link>

                        <Link href={'#'}>
                            <SiTelegram size={30} className="text-slate-600" />
                        </Link>

                        <Link href={'#'}>
                            <IoLogoWhatsapp size={32} className="text-slate-600" />
                        </Link>

                    </Box>

                </Box>

            </Box>
        </Box>
    )
}

export default CategoryListMobile
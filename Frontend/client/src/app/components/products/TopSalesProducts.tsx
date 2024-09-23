'use client'

import { AuthContext } from "@/context/AuthContext";
import { Box, Pagination, Stack, Typography } from "@mui/material"
import { useContext, useEffect, useState } from "react";
import Spinner from "../Spinner";
import NullData from "../NullData";
import ProductBox from "./ProductBox";

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetAllProductsQuery } from "@/store/apiSlice";


const TopSalesProducts = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('all');


    // Number of products per page
    const itemsPerPage = 16;


    // React Router hooks for navigation and search params
    const router = useRouter();
    const searchParams = useSearchParams();


    const { data: products = [], isLoading, error } = useGetAllProductsQuery();


    useEffect(() => {

        // Get the page number from the URL query parameters
        const pageFromURL = searchParams.get('page');
        if (pageFromURL) {
            setCurrentPage(Number(pageFromURL));
        }


    }, [searchParams]);


    // Apply filtering to only show products with an offer greater than zero
    const productsWithOffers = products.filter((product) => product.offer > 0);



    // Apply filtering and sorting based on selected option
    const filteredProducts = productsWithOffers
        .filter(product => {
            if (filter === 'isStatus') {
                return product.isStatus === true;
            }
            return true;  // No filter, include all products
        })
        .sort((a, b) => {
            const priceA = a.offer && a.offer < a.price ? a.offer : a.price;
            const priceB = b.offer && b.offer < b.price ? b.offer : b.price;

            if (filter === 'priceDesc') {
                return priceB - priceA;  // Sort by effective price descending
            } else if (filter === 'priceAsc') {
                return priceA - priceB;  // Sort by effective price ascending
            }
            return 0;  // No sorting for other options
        });


    // Calculate the products to display based on the current page
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );



    // Handle pagination change
    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
        // Update the URL with the current page number
        router.push(`?page=${page}`);
    };

    // This useEffect will trigger whenever currentPage changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]); // Dependency array with currentPage



    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("AuthContext must be used within an AuthProvider");
    }

    const { user } = authContext;



    if (isLoading) return (
        <div className='flex items-center justify-center translate-y-[150%] xl:translate-y-[50%]'>
            <Spinner size={35} />
        </div>
    );


    if (!products || products.length === 0) {
        return (
            <div>
                <NullData title='محصولی وجود ندارد' />
            </div>
        )
    }



    return (
        <Box>

            {/* Heading */}
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        textAlign: 'center',
                        width: 'fit-content'
                    }}
                >
                    <Typography variant="h2">فروش ویژه</Typography>
                    <Typography sx={{ width: '100%', height: '2px', background: '#94a3b8', position: 'absolute', left: 0, bottom: '-0.5rem' }} />
                </Box>
            </Box>


            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', '2sm': 'row' },
                        alignItems: { xs: 'stretch', '2sm': 'center' },
                        justifyContent: 'space-between',
                        mt: '2.5rem',
                        gap: { xs: '1rem', '2sm': 0 }
                    }}
                >

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Typography variant="h3">نمایش : </Typography>
                        <Box
                            sx={{
                                maxWidth: '20rem'
                            }}
                        >
                            <FormControl fullWidth>
                                <Select
                                    id="demo-simple-select"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    sx={{
                                        fontFamily: 'Vazir',
                                        width: "10rem",
                                        height: "2.5rem",
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: "#252525", // Outline border color
                                        },
                                    }}
                                >
                                    <MenuItem value={'all'} sx={{ fontFamily: 'Vazir' }}>
                                        <Typography variant="body1">جدیدترین ها</Typography>
                                    </MenuItem>
                                    <MenuItem value={'priceDesc'} sx={{ fontFamily: 'Vazir' }}>
                                        <Typography variant="body1">گران ترین</Typography>
                                    </MenuItem>
                                    <MenuItem value={'priceAsc'} sx={{ fontFamily: 'Vazir' }}>
                                        <Typography variant="body1">ارزان ترین</Typography>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                    </Box>

                    <Box>
                        <Stack spacing={2} sx={{ direction: 'ltr' }}>
                            <Pagination
                                count={Math.ceil(filteredProducts.length / itemsPerPage)}
                                page={currentPage}
                                onChange={handlePageChange}
                                variant="outlined"
                                color="primary"
                                sx={{
                                    "& .MuiPagination-ul": {
                                        justifyContent: "start", // Center the pagination
                                    },
                                }}
                            />
                        </Stack>
                    </Box>

                </Box>


                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', '2xs': 'repeat(2, 1fr)', '2sm': 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
                        gap: { xs: '0.5rem', '2sm': '1rem', lg: '2rem' },
                        my: '2rem'
                    }}
                >
                    {paginatedProducts && paginatedProducts.map((product) => (
                        <Box key={product._id}>
                            <ProductBox product={product} user={user} />
                        </Box>
                    ))}
                </Box>


                <Box>
                    <Stack spacing={2} sx={{ direction: 'ltr' }}>
                        <Pagination
                            count={Math.ceil(filteredProducts.length / itemsPerPage)}
                            page={currentPage}
                            onChange={handlePageChange}
                            variant="outlined"
                            color="primary"
                            sx={{
                                "& .MuiPagination-ul": {
                                    justifyContent: "center", // Center the pagination
                                },
                            }}
                        />
                    </Stack>
                </Box>

            </Box>

        </Box>
    )
}

export default TopSalesProducts
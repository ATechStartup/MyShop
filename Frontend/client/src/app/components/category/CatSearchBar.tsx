"use client"

// ** React
import { useEffect, useRef, useState } from "react";

// ** apiSlice - RTK-Q
import { useSearchProductsQuery } from "@/store/apiSlice";

// ** Icons
import { CiSearch } from "react-icons/ci";

// ** Components
import SearchBarItem from "../nav/SearchBar/SearchBarItem";

// ** MUI
import { Box, Divider, Typography } from "@mui/material";


interface CategoryListMobileProps {
    toggleMenu: () => void;
}


const CatSearchBar: React.FC<CategoryListMobileProps> = ({ toggleMenu }) => {

    const [query, setQuery] = useState<string>('');
    const [noResults, setNoResults] = useState<boolean>(false);
    const [showResults, setShowResults] = useState<boolean>(false);
    const searchBarRef = useRef<HTMLDivElement>(null);


    const { data: results = [], isFetching, isError } = useSearchProductsQuery(query, {
        skip: query.length < 2, // Skip query if the length is less than 2
    });


    useEffect(() => {
        if (!isFetching && results.length === 0 && query.length >= 2) {
            setNoResults(true);
            setShowResults(false);
        } else {
            setNoResults(false);
            setShowResults(true);
        };
    }, [results, isFetching, query]);



    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
                setNoResults(false);
                setShowResults(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);


    const handleClearProductClick = () => {
        // Clear the input and results
        setQuery('');
        setShowResults(false);
        setNoResults(false);
    };


    return (
        <Box component="div" ref={searchBarRef}
            sx={{
                position: 'relative',
                width: '100%'
            }}
        >
            <Box
                component="div"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <Box
                    component="input"
                    type="search"
                    placeholder="جستجوی محصولات"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoComplete="off"
                    sx={{
                        width: '100%',
                        p: '0.5rem',
                        py: '1rem',
                        outline: 'none',
                        color: '#000000',
                        fontWeight: 700,
                    }}

                />
                <CiSearch size={25} style={{ color: '#6e6e6e' }} />
            </Box>
            {noResults && (
                <Box
                    component="div"
                    fontWeight={700}
                    sx={{
                        position: 'absolute',
                        zIndex: 10,
                        background: '#fff',
                        border: '1px solid',
                        borderColor: '#d1d5db',
                        borderRadius: '0.37rem',
                        mt: '0.25rem',
                        maxWidth: '24rem',
                        width: '100%',
                        p: '0.5rem',
                        fontWeight: 700
                    }}
                >
                    <Typography fontWeight={700}>
                    هیچ محصولی یافت نشد
                    </Typography>
                </Box>
            )}
            {showResults && results.length > 0 && (
                <Box
                    component="div"
                    sx={{
                        position: 'absolute',
                        zIndex: 10,
                        background: '#fff',
                        border: '1px solid',
                        borderColor: '#d1d5db',
                        borderRadius: '0.37rem',
                        mt: 0,
                        p: '0.25rem',
                        py: '0.5rem',
                        maxWidth: '24rem',
                        maxHeight: '20rem',
                        overflow: 'auto',
                        width: '100%'
                    }}
                >
                    {results.map((product) => (
                        <>
                            <SearchBarItem key={product._id} product={product} onClick={handleClearProductClick} toggleMenu={toggleMenu} />
                            <Divider
                                sx={{
                                    border: '1px solid',
                                    borderColor: '#e2e8f0',
                                    my: '0.5rem',
                                }}
                            />
                        </>
                    ))}
                </Box>
            )}
        </Box>
    )
}

export default CatSearchBar
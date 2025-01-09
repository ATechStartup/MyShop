'use client'

// ** React
import { useEffect, useRef, useState } from "react"

// ** apiSlice - RTK-Q
import { useSearchProductsQuery } from "@/store/apiSlice";

// ** Components
import SearchBarItem from "./SearchBarItem";

// ** MUI
import { Box, Divider, InputBase, Typography } from "@mui/material";


const SearchBar = () => {

    const searchBarRef = useRef<HTMLDivElement>(null);

    const [query, setQuery] = useState<string>('');
    const [noResults, setNoResults] = useState<boolean>(false);
    const [showResults, setShowResults] = useState<boolean>(false);


    // Get Products by Searching
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
        <Box
            component="div"
            ref={searchBarRef}
            sx={{
                position: 'relative',
                width: '100%'
            }}
        >
            <Box component="div" sx={{ width: '100%', fontWeight: 700 }}>
                <Box
                    component="input"
                    type="search"
                    placeholder="جستجو"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoComplete="off"
                    sx={{
                        width: '22rem',
                        border: '1px solid',
                        borderColor: '#adadad',
                        borderRadius: '6px',
                        p: '0.5rem',
                        pl: '1.25rem',
                        color: '#000000',
                        fontWeight: '700',
                        background: '#f7f7f7',
                        outline: 'none'
                    }}
                />
            </Box>
            {noResults && (
                <Typography fontWeight={700} sx={{
                    position: 'absolute',
                    zIndex: 10,
                    background: '#fcfcfc',
                    border: '1px solid',
                    borderColor: '#d1d5db',
                    borderRadius: '0.37rem',
                    mt: '0.20rem',
                    maxWidth: '24rem',
                    width: '100%',
                    p: '0.5rem',
                }}
                >
                    هیچ محصولی یافت نشد
                </Typography>
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
                        mt: '0.25rem',
                        p: '0.25rem',
                        py: '0.5rem',
                        maxWidth: '24rem',
                        maxHeight: '20rem',
                        overflow: 'auto',
                        width: '100%'
                    }}
                >
                    {results.map((product, index) => (
                        <>
                            <SearchBarItem key={product._id} product={product} onClick={handleClearProductClick} />
                            {index < results.length - 1 && (
                                <Divider
                                    sx={{
                                        border: '1px solid',
                                        borderColor: '#e2e8f0',
                                        my: '0.5rem',
                                    }}
                                />
                            )}
                        </>
                    ))}
                </Box>
            )}
        </Box>
    )
}

export default SearchBar
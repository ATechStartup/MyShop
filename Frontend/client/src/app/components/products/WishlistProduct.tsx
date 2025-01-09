'use client'


// ** Next
import Image from "next/image"
import { useEffect, useState } from "react";

// ** Types
import ProductType from "@/types/product";
import CommentType from "@/types/comment";

// ** Components
import Button from "../Button";

// ** Icons
import { MdDeleteOutline } from "react-icons/md";

// ** Utils
import { formatPriceToFarsi } from "@/utils/formatPriceToFarsi";

// ** MUI
import { Box, Divider, Link, Rating, Typography } from "@mui/material";

// ** Store - RTK-Q
import { useGetCommentsQuery } from "@/store/apiSlice";



interface WishlistProductProps {
    product: ProductType;
    userId: string | null;
    onRemove: (productId: string) => void;
}


const WishlistProduct: React.FC<WishlistProductProps> = ({ product, userId, onRemove }) => {

    const [averageRating, setAverageRating] = useState<number>(0);
    const [hovered, setHovered] = useState<boolean>(false);

    const firstImage = product.images[0];
    const secondImage = product.images[1];


    const { data: commentsData } = useGetCommentsQuery(product._id);


    useEffect(() => {
        if (commentsData && commentsData.length > 0) {
            calculateAverageRating(commentsData);
        } else {
            setAverageRating(0);
        }
    }, [commentsData]);


    const calculateAverageRating = (comments: CommentType[]) => {
        if (comments.length === 0) {
            setAverageRating(0);
            return;
        }
        const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
        const average = totalRating / comments.length;
        setAverageRating(average);
    };




    return (
        <Box
            component="div"
            sx={{
                width: '100%',
                borderRadius: '0.37rem',
                overflow: 'hidden',
                boxShadow: '2px 10px 9px -2px rgba(0,0,0,0.05);'
            }}
        >
            <Link href={`/product/${product._id}`} sx={{ position: 'relative', textDecoration: 'none' }}>

                <Box
                    component="div"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    sx={{
                        position: 'relative',
                        width: '100%',
                        height: '20rem',
                        overflow: 'hidden'
                    }}
                >
                    {firstImage && (
                        <Image
                            src={firstImage}
                            alt={product.title}
                            style={{
                                objectFit: 'cover',
                                borderTopLeftRadius: '0.37rem',
                                borderTopRightRadius: '0.37rem',
                                transition: 'opacity 0.5s ease-in-out',
                                opacity: hovered ? 0 : 1
                            }}
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                        />
                    )}

                    {secondImage && (
                        <Image
                            src={secondImage}
                            alt={product.title}
                            style={{
                                objectFit: 'cover',
                                transition: 'opacity 0.5s ease-in-out',
                                opacity: hovered ? 1 : 0,
                                position: 'absolute',
                                inset: 0,
                            }}
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                        />
                    )}

                </Box>

                <Box
                    component="div"
                    sx={{
                        p: '1rem',
                        background: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                    }}
                >
                    <Typography variant="h3" sx={{ color: '#4b5563', textAlign: 'center' }}>{product.title}</Typography>
                    <Box
                        component="div"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Rating
                            readOnly
                            value={averageRating || 0} // Set the calculated average rating
                            precision={0.5} // Optional: set precision for half-star ratings
                            sx={{ direction: 'ltr' }}
                        />
                    </Box>
                    <Divider />
                    <Box
                        component="div"
                        sx={{
                            textAlign: 'center',
                            color: '#334155',
                            fontSize: '1.12rem',
                            lineHeight: '1.75rem',
                            mt: '0.5rem',
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        {product.isStatus ? (
                            <Box
                                component="div"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.25rem'
                                }}
                            >
                                {product.offer ? (
                                    <Box
                                        component="div"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ color: '#64748b' }} className="text-offer">
                                            {formatPriceToFarsi(product.price)}
                                        </Typography>

                                        <Typography variant="h3" sx={{ color: '#64748b' }}>
                                            {formatPriceToFarsi(product.offer)}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Typography variant="h3" sx={{ color: '#64748b' }}>
                                        {formatPriceToFarsi(product.price)}
                                    </Typography>
                                )}
                                <Typography variant="body2" sx={{ color: '#64748b' }}>تومان</Typography>
                            </Box>
                        ) : (
                            <Box
                                component="div"
                                sx={{
                                    width: '100%',
                                    background: '#f43f5e',
                                    borderRadius: '0.37rem',
                                    borderColor: '#334155',
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: '#fff',
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        px: '0.75rem',
                                        py: '0.05rem'
                                    }}
                                >
                                    ناموجود
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Link>

            <Box
                component="div"
                sx={{
                    background: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Button
                    label="حذف"
                    // icon={MdDeleteOutline}
                    custom="!py-1 !text-[0.9rem] !gap-1 !text-center"
                    onClick={() => onRemove(product._id)}
                />
            </Box>
        </Box>
    )
}

export default WishlistProduct
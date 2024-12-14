'use client';


// ** Next
import Image from "next/image";
import Link from "next/link";

// ** Hooks
import { useCart } from "@/hooks/useCart";

// ** Utils
import { truncateText } from "@/utils/truncateText";
import { formatPriceToFarsi } from "@/utils/formatPriceToFarsi";

// ** Types
import ProductType from "@/types/product";

// ** Components
import SetQuantity from "../products/SetQuantity";

// ** MUI
import { Box, Button, Typography } from "@mui/material";


interface ItemContentProps {
    item: ProductType;
}

const CartItem: React.FC<ItemContentProps> = ({ item }) => {

    const { handleRemoveProductFromCart, handleCartQtyIncrease, handleCartQtyDecrease } = useCart();

    return (
        <Box
            component="div"
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                fontSize: { xs: '0.75rem', md: '0.87rem' },
                lineHeight: { xs: '1rem', md: '1.25rem' },
                gap: '1rem',
                borderTop: '1.5px',
                color: '#e2e8f0',
                py: '1rem',
                alignItems: 'center'
            }}
        >
            <Box
                component="div"
                sx={{
                    gridColumn: 'span 2',
                    justifySelf: 'start',
                    display: 'flex',
                    gap: { xs: '0.5rem', md: '1rem' },
                    flexDirection: { xs: 'column', '2sm': 'row' },
                }}
            >
                <Link href={`/product/${item._id}`}>
                    <Box
                        component="div"
                        sx={{
                            position: 'relative',
                            width: '6.4rem',
                            aspectRatio: '1 / 1'
                        }}
                    >
                        <Image
                            src={item.images[0]}
                            alt={item.title}
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                            style={{
                                objectFit: 'contain'
                            }}
                        />
                    </Box>
                </Link>

                <Box
                    component="div"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '0.25rem',
                        pr: { xs: '0.7rem', sm: 0 }
                    }}
                >
                    <Link href={`/product/${item._id}`}>
                        <Typography variant="body1">{truncateText(item.title)}</Typography>
                    </Link>

                    <Box
                        component="div"
                        sx={{
                            color: '#64748b',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'start',
                            gap: '0.25rem'
                        }}
                    >
                        <Typography variant="body2">رنگ: {item.selectedColor}</Typography>
                        <Typography variant="body2">سایز: {formatPriceToFarsi(item.selectedSize)}</Typography>
                    </Box>

                    <Box
                        component="div"
                        sx={{
                            width: '4.4rem'
                        }}
                    >
                        <Button sx={{ '& .MuiButton-label': { padding: 0 }, padding: 0, minWidth: 'auto' }} onClick={() => { handleRemoveProductFromCart(item) }}>
                            <Typography variant="body1" sx={{ color: '#64748b', textDecoration: 'underline' }}>حذف</Typography>
                        </Button>
                    </Box>
                </Box>
            </Box>
            {item?.offer ? (
                <Box component={'div'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.1rem' }} style={{ flexDirection: 'column' }}>
                    <Typography variant="body2" sx={{ justifySelf: 'center' }}>
                        {formatPriceToFarsi(item?.offer)}
                    </Typography>

                    <Typography variant="body2" sx={{ justifySelf: 'center' }}>
                        تومان
                    </Typography>
                </Box>
            ) : (
                <Box component={'div'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.1rem', }} style={{ flexDirection: 'column' }}>
                    <Typography variant="body2" sx={{ justifySelf: 'center' }}>
                        {formatPriceToFarsi(item?.price)}
                    </Typography>

                    <Typography variant="body2" sx={{ justifySelf: 'center' }}>
                        تومان
                    </Typography>
                </Box>
            )}
            <Box
                component="div"
                sx={{
                    justifySelf: 'center'
                }}
            >
                <SetQuantity
                    cardCounter={true}
                    productType={item}
                    handleQtyIncrease={() => { handleCartQtyIncrease(item) }}
                    handleQtyDecrease={() => { handleCartQtyDecrease(item) }}
                />
            </Box>
            <Box component={'div'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.1rem' }}>
                <Typography variant="body1">
                    {formatPriceToFarsi(item.price * item.quantity)}
                </Typography>

                <Typography variant="body2">
                    تومان
                </Typography>
            </Box>
        </Box>
    );
};

export default CartItem;

'use client'

// ** Types
import ProductType from "@/types/product";

// ** Utils
import { formatPriceToFarsi } from "@/utils/formatPriceToFarsi";

// ** MUI
import { Box, Button, Typography } from "@mui/material";


interface SetQtyProps {
    cardCounter?: boolean,
    productType: ProductType,
    handleQtyIncrease: () => void,
    handleQtyDecrease: () => void,
    custom?: React.CSSProperties;
}


const SetQuantity: React.FC<SetQtyProps> = ({
    cardCounter,
    productType,
    handleQtyIncrease,
    handleQtyDecrease,
    custom
}) => {
    return (
        <Box
            component="div"
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                my: '0.5rem'
            }}
        >

            {cardCounter ? null : <Typography variant="body1">تعداد :</Typography>}

            <Box
                component="div"
                sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column', '2sm': 'row'},
                    alignItems: 'center',
                    gap: {xs: '0.5rem', '2sm': '1rem'},
                    fontSize: '1rem',
                    lineHeight: '1.5rem',
                }}
            >
                <Button
                    onClick={handleQtyIncrease}
                    sx={{
                        border: '1.2px solid',
                        borderColor: '#cbd5e1',
                        color: '#000000',
                        fontSize: '1.2rem',
                        fontWeight: 900,
                        borderRadius: '0.37rem',
                        minWidth: 'unset',
                        minHeight: 0,
                        height: 0,
                        px: '0.7rem',
                        py: '0.9rem',
                    }}
                >
                    +
                </Button>

                <Typography variant="body1">{formatPriceToFarsi(productType?.quantity)}</Typography>

                <Button
                    onClick={handleQtyDecrease}
                    sx={{
                        border: '1.2px solid',
                        borderColor: '#cbd5e1',
                        color: '#000000',
                        fontSize: '1.2rem',
                        fontWeight: 900,
                        borderRadius: '0.37rem',
                        minWidth: 'unset',
                        minHeight: 0,
                        height: 0,
                        px: '0.8rem',
                        py: '0.95rem',
                    }}
                >
                    -
                </Button>
            </Box>

        </Box>
    )
}

export default SetQuantity
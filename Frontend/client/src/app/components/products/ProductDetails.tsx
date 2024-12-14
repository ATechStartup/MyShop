'use client';


// ** Next
import { useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// ** Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/thumbs';

// ** Hooks
import { useCart } from "@/hooks/useCart";

// ** Utils
import { formatPriceToFarsi } from "@/utils/formatPriceToFarsi";

// ** Store - RTK-Q
import { useAddToWishlistMutation, useGetCommentsQuery, useGetProductByIdQuery } from "@/store/apiSlice";

// ** Components
import Button from "../Button";
import SetQuantity from "./SetQuantity";
import Spinner from "../Spinner";
import CommentForm from "../comments/CommentForm";
import CommentList from "../comments/CommentList";

// ** Auth Context
import { AuthContext } from "@/context/AuthContext";

// ** Toast
import toast from "react-hot-toast";

// ** MUI
import { Box, Divider, FormControl, MenuItem, Rating, Select, Typography } from "@mui/material";

// ** Icons
import { MdCheckCircle } from "react-icons/md";



const ProductDetails: React.FC = () => {
    const authContext = useContext(AuthContext);
    const user = authContext?.user;

    const pathname = usePathname();
    const productId = pathname.split('/').pop();

    const { handleAddProductToCart, cartProducts } = useCart();
    const [isProductInCart, setIsProductInCart] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [showWishlistMessage, setShowWishlistMessage] = useState(false);
    const [thumbsSwiper, setThumbsSwiper] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [commentsUpdated, setCommentsUpdated] = useState<boolean>(false);
    const [averageRating, setAverageRating] = useState<number | null>(null);

    const router = useRouter();

    const { data: product, error: productError, isLoading: isProductLoading } = useGetProductByIdQuery(productId as string);

    const { data: comments = [], refetch: refetchComments } = useGetCommentsQuery(productId as string, {
        skip: !productId, // Skip query if no productId
    });

    const [addToWishlist] = useAddToWishlistMutation();


    useEffect(() => {
        if (cartProducts && product) {
            const isProductInCart = cartProducts.some(item => item._id === product._id);
            setIsProductInCart(isProductInCart);
        }
    }, [cartProducts, product]);

    useEffect(() => {
        if (user) {
            const storedWishlistMessage = localStorage.getItem(`showWishlistMessage_${user._id}_${productId}`);
            if (storedWishlistMessage === "true") {
                setShowWishlistMessage(true);
            }
        }
    }, [user, productId]);

    const handleAddToWishlist = async (productId: string) => {
        try {
            if (!user?._id) {
                toast.error('ابتدا در سایت عضو شوید');
                return;
            }

            const { data: updatedWishlist } = await addToWishlist({
                userId: user._id,
                productId,
            }).unwrap();

            // Update the local wishlist state after adding the item
            setWishlist(updatedWishlist);

            // Show success message
            setShowWishlistMessage(true);
            localStorage.setItem(`showWishlistMessage_${user._id}_${productId}`, "true");
            toast.success('به علاقه مندی ها اضافه شد');
        } catch (error) {
            console.error('Error while adding to wishlist', error);
        }
    };

    const handleCommentsUpdate = useCallback(() => {
        setCommentsUpdated(prev => !prev);
        refetchComments();
    }, []);

    const handleImageClick = (image: string) => {
        setSelectedImage(image);
    };

    const handleMainImageClick = () => {
        setIsModalOpen(true); // Open the modal when the main image is clicked
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    const handleQtyIncrease = () => {
        if (quantity < Math.min(product?.stock || 0)) {
            setQuantity(quantity + 1);
        } else {
            toast.error('نمی‌توانید بیش از تعداد موجودی افزایش دهید');
        }
    };

    const handleQtyDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        } else if (quantity === 1) {
            toast.error('می توانید حداقل یک محصول را انتخاب کنید');
        }
    };

    const handleAddToCart = () => {
        if (!user) {
            toast.error('ابتدا در سایت عضو شوید');
            return;
        }
        if (product && selectedSize && selectedColor) {
            handleAddProductToCart({
                ...product,
                quantity,
                selectedColor,  // Store the selected color
                selectedSize
            });
            setIsProductInCart(true);
        } else {
            toast.error('سایز و رنگ محصول را انتخاب کنید');
        }
    };


    useEffect(() => {
        if (comments.length > 0) {
            const totalRating = comments.reduce((sum, comment) => sum + (comment.rating || 0), 0);
            const average = totalRating / comments.length;
            setAverageRating(average);
        } else {
            setAverageRating(null);
        }
    }, [comments]);


    return (
        <Box>
            {isProductLoading ? (
                <Box
                    sx={{
                        mt: '8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Spinner size={40} />
                </Box>
            ) : (
                <Box
                    sx={{
                        mt: { xs: '1.25rem', lg: '5rem' },
                        width: '100%',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'start',
                                flexDirection: { xs: 'column', lg: 'row' }
                            }}
                        >
                            <Box
                                sx={{
                                    width: { xs: '100%', lg: '30rem' },
                                    display: { xs: 'flex', lg: 'block' },
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Box
                                    sx={{
                                        width: { xs: '100%', lg: '30rem' },
                                        height: 'full',
                                        display: { xs: 'flex', lg: 'block' },
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Swiper
                                        modules={[Thumbs]}
                                        slidesPerView={1}
                                        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }} // Check if thumbsSwiper is initialized
                                        style={{
                                            width: '30rem',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        onSlideChange={(swiper) => setSelectedImage(product?.images[swiper.activeIndex] || null)}
                                    >

                                        {product?.images.map((image, index) => (
                                            <SwiperSlide key={index}>
                                                <Box
                                                    component='img'
                                                    src={image}
                                                    alt={`${product.title} ${index + 1}`}
                                                    width={450}
                                                    height={450}
                                                    onClick={handleMainImageClick}
                                                    sx={{
                                                        objectFit: 'cover',
                                                        borderRadius: '0.37rem',
                                                        height: '35rem',
                                                        cursor: 'pointer',
                                                    }}
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </Box>

                                <Box
                                    sx={{
                                        maxWidth: '28rem',
                                        width: '100%',
                                        mt: '1rem',
                                        p: '0.25rem',
                                        borderRadius: '0.37rem',
                                        border: '1px solid',
                                        borderColor: '#cbd5e1'
                                    }}
                                >
                                    <Swiper
                                        modules={[Thumbs]}
                                        onSwiper={setThumbsSwiper}
                                        slidesPerView={3}
                                        spaceBetween={3}
                                        breakpoints={{
                                            450: {
                                                slidesPerView: 4,
                                            },
                                            600: {
                                                slidesPerView: 5,
                                            },
                                        }}
                                        className="mySwiper"
                                    >

                                        {product?.images.map((image, index) => (
                                            <SwiperSlide key={index}>
                                                <Box
                                                    style={{
                                                        width: '5rem',
                                                        height: '5rem',
                                                        borderRadius: '0.37rem',
                                                        overflow: 'hidden',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => handleImageClick(image)}
                                                >
                                                    <Box
                                                        component="img"
                                                        src={image}
                                                        alt={`${product.title} ${index + 1}`}
                                                        width={100}
                                                        height={100}
                                                        sx={{
                                                            objectFit: 'cover',
                                                            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                                            '&:hover': {
                                                                transform: 'scale(1.05)',
                                                                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)'
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </Box>

                                <Box component="div">
                                    {isModalOpen && (
                                        <Box
                                            component="div"
                                            sx={{
                                                position: 'fixed',
                                                inset: 0,
                                                background: '#000000',
                                                opacity: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                zIndex: '50'
                                            }}
                                            onClick={closeModal}>

                                            <Box sx={{ position: 'relative' }} component="div">
                                                <Box
                                                    component="img"
                                                    src={selectedImage || ""}
                                                    alt="تصویر"
                                                    width={700}
                                                    height={600}
                                                    loading="lazy"
                                                    sx={{
                                                        objectFit: 'cover',
                                                        borderRadius: '0.37rem',
                                                        width: { xs: '20rem', sm: '26rem', '2sm': '32rem' }
                                                    }}
                                                />
                                            </Box>

                                        </Box>
                                    )}
                                </Box>

                            </Box>

                            <Box
                                component="div"
                                sx={{
                                    mt: '1.75rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1.25rem',
                                    flexGrow: '1'
                                }}
                            >
                                <Box
                                    component="div"
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1rem'
                                    }}
                                >
                                    <Typography variant="h1">{product?.title}</Typography>

                                    <Box sx={{ position: 'relative', width: 'fit-content' }} component="div">
                                        {/* Display average rating */}
                                        <Rating
                                            value={averageRating || 0}
                                            precision={0.5}
                                            readOnly
                                            sx={{ direction: 'ltr', fontSize: '1.7rem' }}
                                        />
                                        <Box component="div" sx={{ position: 'absolute', left: '-1.5rem', bottom: '-0.75rem' }}>
                                            {averageRating !== null && (
                                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginLeft: '0.5rem' }}>
                                                    ({averageRating.toFixed(1)})
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                                <Typography sx={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    {product?.offer ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }} component="div">
                                            <Typography sx={{ fontSize: '1.4rem', fontWeight: 700, color: '#94a3b8' }} className="text-offer">
                                                {formatPriceToFarsi(product?.price)}
                                            </Typography>

                                            <Divider sx={{ width: '1px', height: '1.6rem', background: '#94a3b8', position: 'relative', top: '-0.25rem' }} />

                                            <Typography sx={{ fontSize: '1.6rem', fontWeight: 700, color: '#64748b' }}>
                                                {formatPriceToFarsi(product?.offer)}

                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Typography sx={{ fontSize: '1.6rem', fontWeight: 700, color: '#64748b' }}>{formatPriceToFarsi(product?.price)}</Typography>
                                    )}
                                    <Typography variant="body1">تومان</Typography>
                                </Typography>

                                <Box
                                    component="div"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1.5rem'
                                    }}
                                >
                                    {product?.isStatus && (
                                        <>
                                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Typography variant="body1">تعداد : </Typography>
                                                <Typography variant="body1">{formatPriceToFarsi(product?.stock)}</Typography>
                                            </Typography>
                                            <Divider sx={{ width: '1px', height: '1.1rem', background: '#cbd5e1' }} />
                                        </>
                                    )}
                                    <Box
                                        component="div"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                        }}
                                    >
                                        <Typography variant="body1">وضعیت : </Typography>
                                        <Typography variant="body1" sx={{ color: product?.isStatus ? '#2dd4bf' : '#fb7185' }}>
                                            {product?.isStatus ? 'موجود' : 'ناموجود'}
                                        </Typography>
                                    </Box>
                                </Box>

                                {isProductInCart ? (
                                    <>
                                        <Typography
                                            sx={{
                                                mb: '0.5rem',
                                                color: '#64748b',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.25rem'
                                            }}
                                        >
                                            <MdCheckCircle size={20} style={{ color: '#2dd4bf' }} />
                                            <Typography variant="body1"> کالا به سبد خرید شما اضافه شد</Typography>
                                        </Typography>

                                        <Box
                                            component="div"
                                            sx={{
                                                maxWidth: '18.75rem'
                                            }}
                                        >
                                            <Button label="مشاهده سبد خرید" outline onClick={() => { router.push('/cart') }} />
                                        </Box>
                                    </>
                                ) : (
                                    <>
                                        {product?.isStatus ? (
                                            <>
                                                <Box
                                                    component="div"
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        maxWidth: { xs: '100%', lg: '30rem' },
                                                        gap: { xs: '0.25rem', lg: '1rem' }
                                                    }}
                                                >
                                                    <Box
                                                        component="div"
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            flexDirection: 'column',
                                                            gap: '0.25rem',
                                                            width: '100%'
                                                        }}
                                                    >
                                                        <FormControl fullWidth>
                                                            <Typography variant="body1" sx={{ display: { xs: 'none', lg: 'block' } }}>سایز</Typography>

                                                            <Select
                                                                labelId="size-label"
                                                                name="size"
                                                                value={selectedSize ?? ""}
                                                                onChange={(e) => setSelectedSize(e.target.value)}
                                                                displayEmpty
                                                                sx={{
                                                                    p: '0.5rem',
                                                                    border: '1px solid',
                                                                    borderColor: '#cbd5e1',
                                                                    borderRadius: '0.37rem',
                                                                    outline: 'none',
                                                                    height: '2.6rem',
                                                                    '& .MuiOutlinedInput-root': {
                                                                        boxSizing: 'border-box', // Apply to input root too
                                                                        height: '100%',
                                                                    },
                                                                    '&:focus': {
                                                                        borderColor: 'primary.main',
                                                                    }
                                                                }}
                                                            >
                                                                <MenuItem value="" disabled hidden sx={{ fontWeight: '700', fontFamily: 'Vazir' }}>
                                                                    <Typography variant="body1">انتخاب سایز</Typography>
                                                                </MenuItem>

                                                                {product?.sizes.map((size, index) => (
                                                                    <MenuItem key={index} value={size} sx={{ fontWeight: '700', fontFamily: 'Vazir' }}>
                                                                        <Typography variant="body1">{formatPriceToFarsi(size)}</Typography>
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </Box>

                                                    <Box
                                                        component="div"
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: '0.25rem',
                                                            width: '100%'
                                                        }}
                                                    >
                                                        <Typography variant="body1" sx={{ display: { xs: 'none', lg: 'block' } }}>رنگ</Typography>

                                                        <Select
                                                            labelId="color-label"
                                                            name="color"
                                                            value={selectedColor ?? ""}
                                                            onChange={(e) => setSelectedColor(e.target.value)}
                                                            displayEmpty
                                                            sx={{
                                                                p: '0.5rem',
                                                                border: '1px solid',
                                                                borderColor: '#cbd5e1',
                                                                borderRadius: '0.37rem',
                                                                outline: 'none',
                                                                height: '2.6rem',
                                                                '&:focus': {
                                                                    borderColor: 'primary.main',
                                                                }
                                                            }}
                                                        >
                                                            <MenuItem value="" disabled hidden sx={{ fontWeight: '700', fontFamily: 'Vazir' }}>
                                                                <Typography variant="body1">انتخاب رنگ</Typography>
                                                            </MenuItem>

                                                            {product?.colors.map((color, index) => (
                                                                <MenuItem key={index} value={color}>
                                                                    <Typography variant="body1">{color}</Typography>
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </Box>
                                                </Box>

                                                <SetQuantity
                                                    productType={{ ...product, quantity }}
                                                    handleQtyIncrease={handleQtyIncrease}
                                                    handleQtyDecrease={handleQtyDecrease}
                                                />

                                                <Box
                                                    component="div"
                                                    sx={{
                                                        maxWidth: '18.75rem'
                                                    }}
                                                >
                                                    <Button
                                                        label="افزودن به سبد"
                                                        onClick={handleAddToCart}
                                                    />
                                                </Box>
                                            </>
                                        ) : (
                                            <>
                                                <Box
                                                    component="div"
                                                    sx={{
                                                        maxWidth: '18.75rem'
                                                    }}
                                                >
                                                    <Box
                                                        component="div"
                                                        sx={{
                                                            borderRadius: '0.37rem',
                                                            background: '#f43f5e',
                                                            color: '#fff',
                                                            px: '0.5rem',
                                                            py: '0.75rem',
                                                            fontSize: '1.1rem',
                                                            width: '100%',
                                                            borderColor: '#334155',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '0.5rem'
                                                        }}
                                                    >
                                                        ناموجود
                                                    </Box>
                                                </Box>
                                            </>
                                        )}
                                    </>
                                )}

                                <Box component="div">
                                    {showWishlistMessage ? (
                                        <>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    mb: '0.5rem',
                                                    color: '#64748b',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem'
                                                }}
                                            >
                                                <MdCheckCircle size={20} style={{ color: '#22c55e' }} />
                                                <Typography variant="body1">کالا به لیست علاقه‌مندی‌ها اضافه شد</Typography>
                                            </Typography>

                                            <Box
                                                component="div"
                                                sx={{
                                                    maxWidth: '18.75rem'
                                                }}
                                            >
                                                <Button label="مشاهده لیست علاقه‌مندی‌ها" outline onClick={() => { router.push('/wishlist') }} />
                                            </Box>
                                        </>
                                    ) : (
                                        <Box
                                            component="div"
                                            sx={{
                                                maxWidth: '18.75rem'
                                            }}
                                        >
                                            <Button
                                                label="افزودن به لیست علاقه‌مندی‌ها"
                                                backgroundColor="#f43f5e"
                                                borderColor="#f43f5e"
                                                onClick={() => {
                                                    if (productId) {
                                                        handleAddToWishlist(productId);
                                                    } else {
                                                        console.error("Product ID is undefined");
                                                    }
                                                }}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Box>

                        <Box
                            component="div"
                            sx={{
                                mt: '4rem',
                                width: '100%',
                                maxWidth: '60rem',
                                lineHeight: '1.9rem',
                                textAlign: 'justify'
                            }}
                        >
                            <Typography variant="body1">{formatPriceToFarsi(product?.description)}</Typography>
                        </Box>


                        <Box
                            component="div"
                            sx={{
                                mt: '2.5rem'
                            }}
                        >
                            <Box
                                component="div"
                                sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', '2sm': 'row' },
                                    width: '100%',
                                    gap: { xs: '1.25rem', '2sm': '2.5rem' }
                                }}
                            >
                                <Box
                                    component="div"
                                    sx={{
                                        width: { xs: '100%', '2sm': '24rem' }
                                    }}
                                >
                                    <CommentForm productId={productId} onCommentAdded={handleCommentsUpdate} />
                                </Box>

                                <Box
                                    component="div"
                                    sx={{
                                        width: '100%',
                                        mt: '3.6rem'
                                    }}
                                >
                                    <CommentList productId={productId} commentsUpdated={commentsUpdated} />
                                </Box>
                            </Box>
                        </Box>

                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default ProductDetails;

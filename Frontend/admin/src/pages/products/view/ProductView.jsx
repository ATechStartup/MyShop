import { useQuery } from "@tanstack/react-query"
import { getProduct } from "../../../services/apiUrls"
import { Link, useParams } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";
import { useState } from "react";
import Modal from '@mui/joy/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { IoCloseSharp } from "react-icons/io5";
import Loader from "../../../components/modules/Loader";
import { getContrastTools } from "../../../utils/getContrastTools";
import { formatPriceWithSlashes } from "../../../utils/formatPrice"



const ProductView = () => {

    const { id } = useParams();

    const [open, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: product, error, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: getProduct,
        enabled: !!id
    });

    console.log(product)

    const handleImageClick = (img) => {
        setSelectedImage(img);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
    };


    if (isLoading) return <Loader />


    return (
        <div className="pb-24">
            {product && (
                <div className="flex flex-col w-full">

                    <div className="flex justify-between items-center pb-3">

                        <h1 className="font-[700] text-[1.4rem] relative top-2">مشخصات محصول</h1>

                        <Link to={'/products'}>
                            <div
                                className="w-10 h-10 border-[1px] border-slate-200 flex items-center justify-center rounded-full bg-slate-200 shadow-md"
                            >
                                <FiChevronLeft size={27} className="relative right-[0.1rem] text-blue-600" />
                            </div>
                        </Link>

                    </div>

                    <hr />

                    <div className="mt-10">

                        <div className="flex items-center justify-center">
                            <div className="flex items-center justify-center gap-1 mb-14 relative w-fit">
                                <span className="text-slate-500 2xs:text-[0.9rem]">وضعیت محصول : </span>
                                <span className="text-slate-700 2xs:text-[0.9rem]">{product?.isStatus ? <span className="text-green-500 font-bold">موجود</span> : <span className="text-rose-500">ناموجود</span>}</span>
                                <div className="w-full h-[1px] bg-slate-500 absolute left-0 -bottom-1" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 justify-center items-center text-center gap-1 xl:grid-cols-2">

                            <div className="flex items-center justify-center gap-1 mb-14">
                                <span className="text-slate-500 2xs:text-[0.9rem]">نام محصول : </span>
                                <span className="text-slate-700 2xs:text-[0.9rem]">{product?.title}</span>
                            </div>

                            <div className="flex items-center justify-center gap-1 mb-14">
                                <span className="text-slate-500 2xs:text-[0.9rem]">دسته بندی : </span>
                                <span className="text-slate-700 2xs:text-[0.9rem]">{product?.category?.name}</span>
                            </div>

                            <div className="flex items-center justify-center gap-1 mb-14">
                                <span className="text-slate-500 2xs:text-[0.9rem]">جنسیت : </span>
                                <span className="text-slate-700 2xs:text-[0.9rem]">{product?.gender ? 'زنانه' : 'مردانه'}</span>
                            </div>

                            <div className="flex items-center justify-center gap-1 mb-14">
                                <span className="text-slate-500 2xs:text-[0.9rem]">تعداد : </span>
                                <span className="text-slate-700 2xs:text-[0.9rem]">{product?.stock}</span>
                            </div>

                            <div className="flex items-center justify-center gap-1 mb-14">
                                <span className="text-slate-500 2xs:text-[0.9rem]">قیمت : </span>
                                <span className="text-slate-700 2xs:text-[0.9rem]">{formatPriceWithSlashes(product?.price)}</span>
                            </div>

                            {product.offer && product.offer > 0 && (
                                <div className="flex items-center justify-center gap-1 mb-14">
                                    <span className="text-slate-500 2xs:text-[0.9rem]">قیمت نهایی با تخفیف : </span>
                                    <span className="text-slate-700 2xs:text-[0.9rem]">{formatPriceWithSlashes(product?.offer)}</span>
                                </div>
                            )}


                            <div className="flex items-center justify-center gap-3 mb-14">
                                <span className="text-slate-500">سایز : </span>
                                <div className="flex flex-wrap gap-2">
                                    {product?.sizes?.map((size, index) => (
                                        <div
                                            key={index}
                                            className="px-4 py-2 2xs:px-2 2xs:py-1 rounded-full bg-slate-500 text-white font-semibold"
                                            style={{ backgroundColor: size, color: getContrastTools(size) }}
                                        >
                                            {size}
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        <hr />

                        <div className="flex flex-col items-start justify-start gap-3 mt-16">
                            <span className="text-slate-500">رنگ ها : </span>
                            <div className="flex items-center gap-2">
                                {product?.colors?.map((color, index) => (
                                    <div
                                        key={index}
                                        className="px-4 py-2 rounded-full bg-slate-500 text-white font-semibold text-center"
                                        style={{ backgroundColor: color, color: getContrastTools(color) }}
                                    >
                                        {color}
                                    </div>
                                ))}
                            </div>
                        </div>


                        <div className="flex flex-col items-start justify-start mt-16 max-w-[43rem] w-full leading-10">
                            <span className="text-slate-500">توضیحات : </span>
                            <span>{product?.description}</span>
                        </div>

                        <hr className="my-16" />


                        <div className="flex flex-col items-start justify-start gap-3">
                            <span className="text-slate-500">تصاویر : </span>
                            <div className="flex items-center flex-wrap gap-3">
                                {product?.images && product?.images.map((img, index) => (
                                    <div key={index} className="w-[9rem] h-full" onClick={() => handleImageClick(img)}>
                                        <img src={img} alt="تصویر محصول" className="rounded-xl w-full h-full cursor-pointer" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {isModalOpen && (
                            <div
                                className="fixed inset-0 w-screen h-screen bg-black bg-opacity-75 flex items-center justify-center z-[10000]"
                                onClick={closeModal}
                            >
                                <div>
                                    <img
                                        src={selectedImage || ""}
                                        alt="Enlarged Image"
                                        className="object-cover rounded-md w-[32rem] s:w-[26rem] m:w-[20rem]"
                                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
                                    />
                                </div>
                            </div>
                        )}

                    </div>

                </div>
            )}
        </div>
    )
}

export default ProductView
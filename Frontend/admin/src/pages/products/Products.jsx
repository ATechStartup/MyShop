import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../../services/apiUrls";
import Loader from "../../components/modules/Loader";


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import { Box, TablePagination, Typography } from "@mui/material";
import { MdOutlineEditNote } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { formatPriceWithSlashes } from "../../utils/formatPrice";
import { CiSearch } from "react-icons/ci";


const ProductPage = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };



    const { data, error, isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: getAllProducts,
    });

    const filteredData = data ? data.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    if (isLoading) return (
        <Loader size={40} />
    );

    if (error) return <div>Error...</div>

    return (
        <div className="s:pb-20 s:pt-3">
            <div className="flex items-center justify-between gap-2">

                <div>
                    <Link
                        to={'/products/add'}
                        className="btn-primary"
                    >
                        ایجاد
                    </Link>
                </div>

                <div className="max-w-[18rem] w-full flex items-center border-[1px] border-slate-300 rounded-lg px-2">
                    <input
                        type="search"
                        placeholder="جستجو نام محصول"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="text-sm max-w-[18rem] w-full border-none outline-none mb-0"
                    />
                    <div>
                        <CiSearch size={20} />
                    </div>
                </div>

            </div>

            <TableContainer component={Paper} sx={{ marginTop: '1rem' }}>
                <Table sx={{ width: '100%' }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontFamily: 'Vazir', fontWeight: 'bold' }}>نام</TableCell>
                            <TableCell sx={{ fontFamily: 'Vazir', fontWeight: 'bold' }}>قیمت&nbsp;(تومان)</TableCell>
                            <TableCell sx={{ fontFamily: 'Vazir', fontWeight: 'bold' }}>دسته بندی</TableCell>
                            <TableCell sx={{ fontFamily: 'Vazir', fontWeight: 'bold' }} align="center">عملیات</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((product) => {
                            const price = formatPriceWithSlashes(product.price);
                            const offerPrice = product.offer ? formatPriceWithSlashes(product.offer) : price;


                            return (
                                <TableRow
                                    key={product._id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row" sx={{ fontFamily: 'Vazir', fontWeight: 700 }}>
                                        {product.title}
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: 'Vazir', fontWeight: 700 }}>{offerPrice}</TableCell>
                                    <TableCell sx={{ fontFamily: 'Vazir', fontWeight: 700 }}>{product.category ? product.category.name : "حذف شده"}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                                            <Tooltip title="حذف" sx={{ fontFamily: 'Vazir' }}>
                                                <Link to={`/products/delete/${product._id}?page=${page}&rowsPerPage=${rowsPerPage}`} className="flex items-center gap-1 btn-default">
                                                    <MdDeleteOutline size={24} />
                                                    <Typography sx={{ fontFamily: 'Vazir', fontSize: '0.8rem', fontWeight: 700 }}>حذف</Typography>
                                                </Link>
                                            </Tooltip>

                                            <Tooltip title="ویرایش" sx={{ fontFamily: 'Vazir' }}>
                                                <Link to={'/products/edit/' + product._id} className="flex items-center gap-1 btn-default">
                                                    <MdOutlineEditNote size={24} />
                                                    <Typography sx={{ fontFamily: 'Vazir', fontSize: '0.8rem', fontWeight: 700 }}>ویرایش</Typography>
                                                </Link>
                                            </Tooltip>

                                            <Tooltip title="نمایش" sx={{ fontFamily: 'Vazir' }}>
                                                <Link to={'/products/view/' + product._id} className="flex items-center gap-1 btn-default">
                                                    <RemoveRedEyeOutlinedIcon sx={{ width: '1.7rem' }} />
                                                    <Typography sx={{ fontFamily: 'Vazir', fontSize: '0.8rem', fontWeight: 700 }}>نمایش</Typography>
                                                </Link>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>

                <TablePagination
                    rowsPerPageOptions={[4, 5, 8]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="تعداد نمایش :"
                    labelDisplayedRows={({ from, to, count }) => `صفحه ${page + 1}: ${from}-${to} از ${count}`}
                    sx={{
                        "& .MuiTablePagination-toolbar": {
                            fontFamily: 'Vazir', // Apply custom font to toolbar
                            fontWeight: 700
                        },
                        "& .MuiTablePagination-selectLabel": {
                            fontFamily: 'Vazir', // Apply custom font to select label
                            fontWeight: 700  // Apply bold font weight to select label
                        },
                        "& .MuiTablePagination-displayedRows": {
                            fontFamily: 'Vazir', // Apply custom font to displayed rows text
                            fontWeight: 700
                        }
                    }}
                />
            </TableContainer>
        </div>
    )
}

export default ProductPage
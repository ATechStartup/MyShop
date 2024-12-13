import { useQuery } from "@tanstack/react-query"
import { getAllCategories } from "../../../services/apiUrls"
import Loader from "../../modules/Loader";


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TablePagination, Typography } from "@mui/material";
import { useState } from "react";
import { TbChevronsUpRight } from "react-icons/tb";


const CategoryDashboard = () => {

    // pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const { data, isError, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: getAllCategories
    });

    const paginatedData = (data || []).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    if (isLoading) return <Loader />;

    if (isError) return <div>Error...</div>;

    return (
        <TableContainer component={Paper}>
            <Typography sx={{ fontFamily: 'Vazir', fontWeight: 'bold', padding: '10px', display: "flex", alignItems: "center", gap: "5px" }}>
                <span><TbChevronsUpRight /></span>
                <span>دسته بندی ها</span>
            </Typography>
            <Table sx={{ width: '100%' }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontFamily: 'Vazir', fontWeight: 'bolder' }}>نام</TableCell>
                        <TableCell sx={{ fontFamily: 'Vazir', fontWeight: 'bolder' }}>گروه</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paginatedData.map((category) => {
                        const parentCategory = data.find(cat => cat._id === category.parent);
                        return (
                            <TableRow key={category._id}>
                                <TableCell sx={{ fontFamily: 'Vazir', fontWeight: 700 }}>
                                    {category.name}
                                </TableCell>
                                <TableCell sx={{ fontFamily: 'Vazir', fontWeight: 700 }}>
                                    {parentCategory ? parentCategory.name : '_'}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>

            <TablePagination
                rowsPerPageOptions={[3, 6]}
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
                        fontWeight: 'bold'  // Apply bold font weight to select label
                    },
                    "& .MuiTablePagination-displayedRows": {
                        fontFamily: 'Vazir', // Apply custom font to displayed rows text
                        fontWeight: 700
                    }
                }}
            />
        </TableContainer>
    )
}

export default CategoryDashboard
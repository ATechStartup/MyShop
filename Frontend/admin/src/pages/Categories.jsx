import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { withSwal } from 'react-sweetalert2';
import IconButton from '@mui/material/IconButton';
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
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../services/apiUrls';
import Loader from "../components/modules/Loader";
import toast from "react-hot-toast";

const CategoryPage = ({ swal }) => {
    const queryClient = useQueryClient();

    // States
    const [name, setName] = useState('');
    const [parent, setParent] = useState('');
    const [editedCategory, setEditedCategory] = useState(null);
    // const [properties, setProperties] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);

    const handleChangePage = (event, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const { data: categories = [], isLoading, error } = useQuery({
        queryKey: ['categories'],
        queryFn: getAllCategories,
    });

    const createCategoryMutation = useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            toast.success('دسته بندی اضافه شد');
        },
        onError: (error) => {
            console.error('Error creating category:', error.response || error);
            toast.error('خطایی رخ داده');
        }
    });

    const updateCategoryMutation = useMutation({
        mutationFn: updateCategory,
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            toast.success('به روز رسانی شد');
        },
        onError: (error) => {
            console.error('Error updating category:', error.response || error);
            toast.error('خطایی رخ داده');
        }
    });

    const deleteCategoryMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            toast.success('دسته بندی حذف شد');
        },
        onError: (error) => {
            console.error('Error deleting category:', error.response || error);
            toast.error('خطایی رخ داده');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            name,
            parent
        };

        if (editedCategory) {
            updateCategoryMutation.mutate({ id: editedCategory._id, updatedCategory: data });
            setEditedCategory(null);
        } else {
            createCategoryMutation.mutate(data);
        }

        setName('');
        setParent('');
    };


    const editCategory = (category) => {
        setEditedCategory(category);
        setName(category.name);
        setParent(category.parent ? category.parent._id : '');
    };

    const handleDeleteCategory = (category) => {
        swal.fire({
            title: 'مطمئن هستید؟',
            text: `دسته بندی ${category.name} پاک شود؟`,
            showCancelButton: true,
            cancelButtonText: 'انصراف',
            confirmButtonText: 'حذف',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(result => {
            if (result.isConfirmed) {
                deleteCategoryMutation.mutate(category._id);
            }
        });
    };

    const paginatedData = (categories || []).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    if (isLoading) return <Loader />;
    if (error) return <div>Error loading categories</div>;

    return (
        <div className="s:pb-24">
            <h1 className="font-[400] text-[1.4rem]">دسته بندی ها</h1>
            <label>
                {editedCategory
                    ? `ویرایش دسته بندی ${editedCategory.name}`
                    : 'ایجاد دسته بندی جدید'}
            </label>

            <form onSubmit={handleSubmit}>
                <div className="flex gap-5 l:flex-col l:gap-3">
                    <div className="flex-grow">
                        <label htmlFor="name">نام دسته :</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex-grow">
                        <label htmlFor="parent">نام گروه ( اختیاری ) :</label>
                        <select
                            id="parent"
                            value={parent}
                            onChange={(e) => setParent(e.target.value)}
                        >
                            <option value="" style={{ fontWeight: 700 }}>هیچ دسته بندی انتخاب نشده</option>
                            {categories.map(category => (
                                <option key={category._id} value={category._id} style={{ fontWeight: 700 }}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex gap-1 mb-4">
                    {editedCategory && (
                        <button
                            type="button"
                            className="btn-default"
                            onClick={() => {
                                setEditedCategory(null);
                                setName('');
                                setParent('');
                                setProperties([])
                            }}
                        >
                            انصراف
                        </button>
                    )}

                    <button type="submit" className="btn-primary">ایجاد</button>
                </div>
            </form>

            {!editedCategory && (
                <TableContainer component={Paper}>
                    <Table sx={{ width: '100%' }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontFamily: 'Vazir', fontWeight: 'bold' }}>نام</TableCell>
                                <TableCell sx={{ fontFamily: 'Vazir', fontWeight: 'bold' }}>گروه</TableCell>
                                <TableCell sx={{ fontFamily: 'Vazir', fontWeight: 'bold' }} align="center">عملیات</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData.length > 0 && paginatedData.map((category) => {
                                if (!category || !category._id) {
                                    console.error('Invalid category or category ID is undefined:', category);
                                    return null;
                                }
                                const parentCategory = categories.find(cat => cat._id === category.parent);
                                return (
                                    <TableRow
                                        key={category._id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" sx={{ fontFamily: 'Vazir', fontWeight: 700 }}>
                                            {category.name}
                                        </TableCell>
                                        <TableCell sx={{ fontFamily: 'Vazir', fontWeight: 700 }}>
                                            {parentCategory ? parentCategory.name : '_'}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                                                <Tooltip
                                                    title="ویرایش"
                                                    sx={{
                                                        fontFamily: 'Vazir',
                                                        paddingY: '0.25rem',
                                                        paddingX: '1rem',
                                                        borderRadius: '0.375rem',
                                                        backgroundColor: '#4b5563',
                                                        color: '#fff',
                                                        "&.MuiButtonBase-root:hover": {
                                                            backgroundColor: "#4b5563"
                                                        }
                                                    }}
                                                >
                                                    <IconButton onClick={() => editCategory(category)}>
                                                        <MdOutlineEditNote size={24} />
                                                        <Typography sx={{ fontFamily: 'Vazir', fontSize: '0.8rem', fontWeight: 700 }}>ویرایش</Typography>
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip
                                                    title="حذف"
                                                    sx={{
                                                        fontFamily: 'Vazir',
                                                        paddingY: '0.25rem',
                                                        paddingX: '1rem',
                                                        borderRadius: '0.375rem',
                                                        backgroundColor: '#4b5563',
                                                        color: '#fff',
                                                        "&.MuiButtonBase-root:hover": {
                                                            backgroundColor: "#4b5563"
                                                        }
                                                    }}
                                                >
                                                    <IconButton onClick={() => handleDeleteCategory(category)}>
                                                        <MdDeleteOutline size={24} />
                                                        <Typography sx={{ fontFamily: 'Vazir', fontSize: '0.8rem', fontWeight: 700 }}>حذف</Typography>
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>

                    <TablePagination
                        rowsPerPageOptions={[3, 4, 6]}
                        component="div"
                        count={categories.length}
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
            )}
        </div>
    );
};

export default withSwal(({ swal }, ref) => (
    <CategoryPage swal={swal} />
));

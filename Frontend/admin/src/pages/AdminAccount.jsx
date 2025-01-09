import { useContext, useEffect, useState } from "react";
import { useMutation } from '@tanstack/react-query';
import { AuthContext } from "../context/AuthContext";
import { updateUser } from "../services/apiUrls";
import { validateEmail } from "../utils/emailVal";
import toast from "react-hot-toast";

const AdminAccount = () => {
    const { admin, updateAdminInContext } = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        adminId: '',
        name: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        phoneNumber: '+98',
    });

    const [errors, setErrors] = useState({
        username: '',
        name: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
    });

    useEffect(() => {
        if (admin) {
            setFormData({
                adminId: admin._id || '',
                username: admin.username || '',
                email: admin.email || '',
                password: '' || '',
                name: admin.name || '',
                lastName: admin.lastName || '',
                phoneNumber: admin.phoneNumber ? `+98${String(admin.phoneNumber).slice(2)}` : '+98',
            });
        }
    }, [admin]);



    const validateForm = () => {
        let valid = true;
        const newErrors = {
            username: '',
            name: '',
            lastName: '',
            email: '',
            password: '',
            phoneNumber: ''
        };

        if (formData.username.length < 5) {
            newErrors.username = 'حداقل 5 حرف وارد شود';
            valid = false;
        };

        if (formData.name.length < 3) {
            newErrors.name = 'حداقل 3 حرف وارد شود';
            valid = false;
        };

        if (formData.lastName.length < 3) {
            newErrors.lastName = 'حداقل 3 حرف وارد شود';
            valid = false;
        };

        const emailError = validateEmail(formData.email);
        if (emailError) {
            newErrors.email = emailError;
            valid = false;
        };

        if (formData.password && formData.password.length < 4) {
            newErrors.password = 'حداقل 4 حرف یا عدد وارد شود';
            valid = false;
        };

        if (!/^\+98\d{10}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'شماره همراه باید 10 رقمی باشد';
            valid = false;
        };

        setErrors(newErrors);
        return valid;
    };



    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phoneNumber") {
            // If the value starts with +98, allow it; otherwise, ignore the input
            if (!value.startsWith('+98')) {
                return;
            }

            // Remove the +98 prefix before validation
            const phoneNumberWithoutPrefix = value.slice(3);

            // Allow only numbers after +98
            if (!/^\d*$/.test(phoneNumberWithoutPrefix)) {
                return;
            }

            // Update the formData with the valid phone number
            setFormData({ ...formData, phoneNumber: value });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };


    const updateAdminMutation = useMutation({
        mutationFn: updateUser,
        onSuccess: (data) => {
            // Update the user in context
            updateAdminInContext(data.admin);
            toast.success('پروفایل به روزرسانی شد');
        },
        onError: (error) => {
            console.error('Error updating user information.', error);
            toast.success('خطایی رخ داده');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // setIsLoading(true);

        if (!validateForm()) {
            setIsLoading(false);
            return;
        }

        updateAdminMutation.mutate(formData);
    };

    return (
        <div className="w-full xs:pb-16">
            <h1 className="font-[700] text-[1.4rem]">حساب کاربری</h1>
            <div className="pt-5 w-full">
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="flex flex-col justify-between">

                        {/* Inputs */}
                        <div className="flex flex-col gap-4 w-full">

                            <div className="flex items-center justify-between gap-8 xs:flex-col xs:gap-4">

                                <div className="flex flex-col gap-1 w-full">
                                    <label htmlFor="name">نام</label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                </div>

                                <div className="flex flex-col gap-1 w-full">
                                    <label htmlFor="lastName">نام خانوادگی</label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                                </div>

                            </div>

                            <div className="flex items-center justify-between gap-8 xs:flex-col xs:gap-4">

                                <div className="flex flex-col gap-1 w-full">
                                    <label htmlFor="username">نام کاربری</label>
                                    <input
                                        id="username"
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                    {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                                </div>

                                <div className="flex flex-col gap-1 w-full">
                                    <label htmlFor="email">ایمیل</label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                </div>

                            </div>

                            <div className="flex items-center justify-between gap-8 xs:flex-col xs:gap-4">

                                <div className="flex flex-col gap-1 w-full">
                                    <label htmlFor="phoneNumber" className="text-slate-500">شماره همراه</label>
                                    <input
                                        id="phoneNumber"
                                        type="text"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        placeholder="+98"
                                        dir="ltr"
                                        className="border-[1px] border-slate-300 py-2 px-2 outline-slate-500 rounded-md"
                                    />
                                    {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
                                </div>

                                <div className="flex flex-col gap-1 w-full">
                                    <label htmlFor="password">رمز عبور</label>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                                </div>

                            </div>

                        </div>

                        {/* Submit BTN */}
                        <div className="mt-8 flex items-end justify-start">
                            {isLoading ? (
                                <Spinner size={30} />
                            ) : (
                                <button
                                    type="submit"
                                    className="disabled:opacity-70 bg-blue-500 text-white py-2 px-6 disabled:cursor-not-allowed rounded-md hover:opacity-80 transition border-slate-700 flex items-center justify-center gap-2"
                                    disabled={isLoading}
                                >
                                    ویرایش
                                </button>
                            )}

                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminAccount;

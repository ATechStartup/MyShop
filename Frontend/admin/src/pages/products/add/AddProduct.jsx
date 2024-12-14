import { Link } from "react-router-dom"
import ProductForm from "../../../components/templates/ProductForm"
import { FiChevronLeft } from "react-icons/fi"

const AddProductPage = () => {
    return (
        <div className="s:pb-20 pt-3">

            <div className="flex items-center justify-between pb-4">
                <h1 className="font-[900] text-[1.4rem] relative top-2">ایجاد محصول</h1>
                <Link to={'/products'}>
                    <div
                        className="w-10 h-10 border-[1px] border-slate-200 flex items-center justify-center rounded-full bg-slate-200 shadow-md"
                    >
                        <FiChevronLeft size={27} className="relative right-[0.1rem] text-blue-600" />
                    </div>
                </Link>
            </div>

            <ProductForm />
        </div>
    )
}

export default AddProductPage
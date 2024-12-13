import { useContext } from 'react';
import avatar from '../../../assets/images/admin-pic.webp'
import { AuthContext } from '../../../context/AuthContext';


const Header = () => {

    const { admin } = useContext(AuthContext);

    return (
        <div>
            {admin && (
                <div className='flex items-center justify-between gap-2'>
                    <div className='w-20 relative -right-3'>
                        <img src={avatar} alt="avatar" className='w-full h-full' />
                    </div>

                    <div className='relative left-3 text-slate-600'>{admin.name && (<span className='font-bold'>{admin.name} عزیز</span>)} خوش اومدی 👋</div>
                </div>
            )}
        </div>
    )
}

export default Header
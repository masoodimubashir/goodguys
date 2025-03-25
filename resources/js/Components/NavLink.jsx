import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link {...props} className={'' + (active ? 'text-danger active' : '') + className} >
            {children}
        </Link>
    );
}





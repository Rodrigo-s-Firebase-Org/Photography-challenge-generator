import { usePathname, redirect } from 'next/navigation';
import { routes } from '../routes/index.routes';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/Auth.context';

interface IUseRoutes {
    (): void
}

export const useRoutes: IUseRoutes = () => {
    const pathname = usePathname();
    const { client, isLoadingAuth } = useContext(AuthContext);

    const validateAuthInRoute = () => {
        const needsAuth = routes[pathname];
        if (needsAuth && client === null) {
            redirect('/');
        }
        if (needsAuth === false && client !== null) {
            redirect('/profile');
        }
    };

    useEffect(() => {
        if (isLoadingAuth) return;
        validateAuthInRoute();
    }, [client, isLoadingAuth]);
}
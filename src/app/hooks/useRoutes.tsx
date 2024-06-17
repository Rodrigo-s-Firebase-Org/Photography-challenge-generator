import { useEffect, useContext } from 'react';
import { AuthContext } from '../context/Auth.context';
import { usePathname, redirect } from 'next/navigation';
import {routes} from '../routes/index.routes';

interface IUseRoutes {
    (): void
}

export const useRoutes: IUseRoutes = () => {
    const { client, isLoadingAuth } = useContext(AuthContext);
    const pathname = usePathname()

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
import { useEffect, useContext, useRef } from 'react';
import firebase from 'firebase/compat/app';
import Client from '../firebase/models/client.model';
import { AuthContext } from '../context/Auth.context';
import { getClientIdCache, setClientIdCache, clearClientIdCache } from '../cache/client.cache';
import { IClient } from '../shared/client.interfaces';

interface IUseAuth {
    (): {
        fetchClient: (user: firebase.User) => void
    }
}

export const useAuth: IUseAuth = () => {
    const { setClient, setIsLoadingAuth, client } = useContext(AuthContext);
    const isFetching = useRef<boolean>(false);

    const fetchClient = (user: firebase.User) => {
        const userId = getClientIdCache();
        if (userId === null) return;
        if (isFetching.current) return;
        isFetching.current = true;

        const doFetch = async (): Promise<void> => {
            const attemptedUser = await Client.getById(userId);

            if (attemptedUser !== null) {
                // Already exists
                setClient(attemptedUser);
                setIsLoadingAuth(false);
                isFetching.current = false;
                return;
            }

            // Not in db
            if (
                user.email === null ||
                user.displayName === null ||
                user.providerId === null
            ) {
                clearWhenNoUserFound();
                isFetching.current = false;
                return;
            }

            const typedUser: IClient = {
                email: user.email,
                name: user.displayName,
                profilePhoto: user.photoURL || '',
                id: user.uid,
                doc_id: ''
            }
            const newUser: Client = new Client(typedUser);
            await newUser.save();
            setClient(newUser);
            setIsLoadingAuth(false);
            isFetching.current = false;
        };
        void doFetch();
    };

    const clearWhenNoUserFound = () => {
        setIsLoadingAuth(false);
        setClient(null);
        clearClientIdCache();
    }

    useEffect(() => {
        firebase.auth().onAuthStateChanged(async (user: firebase.User | null) => {
            if (user === null) {
                clearWhenNoUserFound();
                return;
            };

            if (client !== null) {
                // This can only happens in rerender... So cancel actions
                return;
            }

            setClientIdCache(user.uid);
            fetchClient(user);
        });
        // eslint-disable-next-line
    }, []);

    return {
        fetchClient
    }
}
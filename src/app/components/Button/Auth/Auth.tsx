import { useEffect, useContext } from 'react';
import firebase from 'firebase/compat/app';
import styles from './Auth.module.css';

import { auth, provider } from '../../../config/firebase.config';
import { AuthContext } from '../../../context/Auth.context';
import { getClientIdCache, setClientIdCache, clearClientIdCache } from '../../../cache/client.cache';

type TAction = 'log-in' | 'log-out';

const TextMapper = new Map<TAction, string>();
TextMapper.set('log-in', 'Sign in with Google');
TextMapper.set('log-out', 'Log out');

interface Props {
    action: TAction
}
 
export default function AuthButton({
    action
}: Props) {
    const { setClient, setIsLoadingAuth } = useContext(AuthContext);
    const signIn = () => auth.signInWithPopup(provider);
    const signOut = () => auth.signOut();

    const fetchClient = () => {
        const userId = getClientIdCache();
        if (userId === null) return;
        setClient(null); // TODO: do actual fetch to firebase
        setIsLoadingAuth(false);
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
            setClientIdCache(user.uid);
            fetchClient();
        });
    }, []);

    const actionDiscovery = () => {
        if (action === 'log-in') {
            signIn();
        }
        if (action === 'log-out') {
            signOut();
        }
    }

    return (
        <button
            onClick={actionDiscovery}
            className={`${styles.btn}`}
        >
            {TextMapper.get(action)}
        </button>
    );
}
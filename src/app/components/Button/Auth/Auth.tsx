import { useEffect, useState, useContext } from 'react';
import firebase from 'firebase/compat/app';

import { auth, provider } from '../../../config/firebase.config';
import { AuthContext } from '../../../context/Auth.context';
import { getClientIdCache } from '../../../cache/client.cache';

export default function AuthButton() {
    const { setClient } = useContext(AuthContext);

    const signIn = () => auth.signInWithPopup(provider);
    const signOut = () => auth.signOut();

    useEffect(() => {
        firebase.auth().onAuthStateChanged(async (user) => {
            console.log(user);
        });
    }, []);

    return (
        <button
            onClick={signIn}
        >
            Sign in with Google
        </button>
    );
}
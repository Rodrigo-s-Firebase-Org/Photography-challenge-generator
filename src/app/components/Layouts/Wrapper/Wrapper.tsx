'use client';

import { AuthContext } from '../../../context/Auth.context';
import { Fragment, useContext } from 'react';
import PageLoader from "../../../components/Loader/PageLoader/PageLoader";
import Nav from "../../../components/Nav/Nav";
import { AnimatePresence } from "framer-motion";

interface Props {
    children: any
}

export default function Wrapper({
    children
}: Props) {
    const { isLoadingAuth } = useContext(AuthContext);

    return (
        <AnimatePresence mode="wait">
            {isLoadingAuth ? (
                <PageLoader />
            ) : (
                <Fragment>
                    <Nav />
                    {children}
                </Fragment>
            )}
        </AnimatePresence>
    );
}

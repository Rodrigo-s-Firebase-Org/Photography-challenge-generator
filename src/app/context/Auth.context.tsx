"use client";

import { createContext, Dispatch, SetStateAction, useState } from "react";
import { IClient } from "../shared/client.interfaces";

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

interface IAuthContext {
    isLoadingAuth: boolean;
    client: IClient | null;


    setIsLoadingAuth: Dispatch<SetStateAction<boolean>>;
    setClient: Dispatch<SetStateAction<IClient | null>>;
}

interface Props {
    children: any
}

export default function PropertiesLayoutContext({
    children
}: Props) {

    const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
    const [client, setClient] = useState<IClient | null>(null);

    return (
        <AuthContext.Provider value={{
            isLoadingAuth,
            client,

            setIsLoadingAuth,
            setClient
        }}>
            {children}
        </AuthContext.Provider>
    )
}

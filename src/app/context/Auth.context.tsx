"use client";

import { createContext, Dispatch, SetStateAction, useState } from "react";
import { IClient } from "../shared/client.interfaces";
import { IPrompt } from "../shared/prompt.interfaces";

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

interface IAuthContext {
    isLoadingAuth: boolean;
    client: IClient | null;
    currPrompt: IPrompt | null;

    setIsLoadingAuth: Dispatch<SetStateAction<boolean>>;
    setClient: Dispatch<SetStateAction<IClient | null>>;
    setCurrPrompt: Dispatch<SetStateAction<IPrompt | null>>
}

interface Props {
    children: any
}

export default function PropertiesLayoutContext({
    children
}: Props) {

    const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
    const [client, setClient] = useState<IClient | null>(null);
    const [currPrompt, setCurrPrompt] = useState<IPrompt | null>(null);

    return (
        <AuthContext.Provider value={{
            isLoadingAuth,
            client,
            currPrompt,

            setIsLoadingAuth,
            setClient,
            setCurrPrompt
        }}>
            {children}
        </AuthContext.Provider>
    )
}

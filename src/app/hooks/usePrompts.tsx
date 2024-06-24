import { useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/Auth.context';
import Prompt from '../firebase/models/prompt.model';
import { getCurrDay } from '../utils';

interface IUsePrompts {
    (): void
}

export const usePrompts: IUsePrompts = () => {
    const { setCurrPrompt } = useContext(AuthContext);
    const isFetching = useRef<boolean>(false);

    const fetchPrompt = () => {
        if (isFetching.current) return;
        isFetching.current = true;

        const doFetch = async (): Promise<void> => {
            setCurrPrompt(await Prompt.getByDay(getCurrDay()));
            isFetching.current = false;
        };
        void doFetch();
    };

    useEffect(fetchPrompt, []);
}
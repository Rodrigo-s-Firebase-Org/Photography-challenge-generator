import { useEffect, useRef, useState } from 'react';
import UploadButton from '../../Button/Upload/Upload';
import styles from './PhotosHome.module.css';
import { IPhoto } from '../../../shared/photo.interfaces';
import Photo from '../../../firebase/models/photos.model';
import Prompt from '../../../firebase/models/prompt.model';
import { IPrompt } from '../../../shared/prompt.interfaces';
import Loader from './Loader';
import { getCurrDay } from '../../../utils';
import { IClient } from '../../../shared/client.interfaces';
import Client from '../../../firebase/models/client.model';

interface IPost {
    prompt: IPrompt,
    photos: IPhoto[],
    client: IClient | null
}

interface IPosts {
    [promptId: string]: IPost
}

export default function PhotosHome() {
    const [posts, setPosts] = useState<IPosts>({});
    const [currPrompt, setCurrPrompt] = useState<IPrompt | null>(null);
    const isFetching = useRef(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getAllPhotos = (): void => {
        if (isFetching.current) return;
        isFetching.current = true;

        const doFetch = async (): Promise<void> => {
            setIsLoading(true);
            const possibleCurrPrompt = await Prompt.getByDay(getCurrDay());
            const allPrompts = await Prompt.getAll();

            if (possibleCurrPrompt !== null) {
                setCurrPrompt(possibleCurrPrompt);
            }

            for (let i = 0; i < allPrompts.length; i++) {
                const allPhotosFromPrompt = await Photo.getByPrompt(allPrompts[i].id);
                let thisClient = null;
                if (allPhotosFromPrompt.length > 0) {
                    const possibleClient = allPhotosFromPrompt[0].client;
                    if (possibleClient !== null) {
                        thisClient = await Client.getByDocId(possibleClient.id);
                    }
                }

                const newPost: IPost = {
                    prompt: allPrompts[i],
                    photos: allPhotosFromPrompt,
                    client: thisClient
                };
                setPosts(prev => {
                    return {
                        ...prev,
                        [allPrompts[i].id]: newPost
                    };
                });

                if (i === allPrompts.length - 1) {
                    setIsLoading(false);
                }
            }
        };
        void doFetch();
    };

    useEffect(getAllPhotos, []);

    return (
        <div className={`${styles.container_for_photos}`}>
            {isLoading && <Loader />}
            {!isLoading && currPrompt !== null && (
                <h1 className={styles.curr_prompt}>
                    "{currPrompt.challenge}"
                </h1>
            )}
            {!isLoading && Object.keys(posts).map((promptId: string, index: number) => {
                const currPrompt: IPrompt = posts[promptId].prompt;
                const currPhotos: IPhoto[] = posts[promptId].photos;
                const currClient: IClient | null = posts[promptId].client;
                return (
                    <div key={index} className={styles.layout_posts}>
                        <div className={styles.prompt}>
                            <span>
                                "{currPrompt.challenge}"
                            </span>
                        </div>
                        <div className={styles.container_cards}>
                            {currPhotos.map((element: IPhoto, jIndex: number) => {
                                return (
                                    <div className={styles.card} key={jIndex}>
                                        <div className={styles.profile_user}>
                                            <img className={styles.profilePhoto} src={currClient?.profilePhoto} alt={currClient?.name} />
                                            {currClient?.name}
                                        </div>
                                        <img src={element.url} alt={currPrompt.challenge} />
                                    </div>
                                )
                            })}
                        </div>

                    </div>
                )
            })}

            <div className={styles.upload_btn}>
                <UploadButton />
            </div>
        </div>
    )
}
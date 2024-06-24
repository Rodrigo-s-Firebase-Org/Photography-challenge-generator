import { useEffect, useRef, useState, useContext } from 'react';
import UploadButton from '../../Button/Upload/Upload';
import {AuthContext} from '../../../context/Auth.context';
import styles from './PhotosHome.module.css';
import { IPhoto } from '../../../shared/photo.interfaces';
import Photo from '../../../firebase/models/photos.model';
import Prompt from '../../../firebase/models/prompt.model';
import { IPrompt } from '../../../shared/prompt.interfaces';
import Loader from './Loader';
import { IClient } from '../../../shared/client.interfaces';
import Client from '../../../firebase/models/client.model';

interface IPost {
    photo: IPhoto,
    client: IClient | null
}

interface IPosts {
    [promptId: string]: {
        prompt: IPrompt,
        posts: IPost[],
    }
}

export default function PhotosHome() {
    const {
        currPrompt
    } = useContext(AuthContext);
    const [posts, setPosts] = useState<IPosts>({});
    const isFetching = useRef(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getAllPhotos = (): void => {
        if (isFetching.current) return;
        isFetching.current = true;

        const doFetch = async (): Promise<void> => {
            setIsLoading(true);
            const buildingPosts: IPosts = {};

            const allPrompts = await Prompt.getAll();

            for (let i = 0; i < allPrompts.length; i++) {
                const allPhotosFromPrompt = await Photo.getByPrompt(allPrompts[i].doc_id);
                const photosByThisPrompt: IPost[] = [];

                for (let j = 0; j < allPhotosFromPrompt.length; j++) {
                    // Each post
                    let thisClient = null;
                    const possibleClient = allPhotosFromPrompt[j].client;
                    if (possibleClient !== null) {
                        thisClient = await Client.getByDocId(possibleClient.id);
                    }
    
                    const newPost: IPost = {
                        photo: allPhotosFromPrompt[j],
                        client: thisClient
                    };
                    photosByThisPrompt.push(newPost);
                }

                buildingPosts[allPrompts[i].doc_id] = {
                    prompt: allPrompts[i],
                    posts: photosByThisPrompt
                }

                if (i === allPrompts.length - 1) {
                    setIsLoading(false);
                }
            }

            setPosts(buildingPosts);
        };
        void doFetch();
    };

    const sortPosts = (a: IPost, b: IPost): number => {
        if (a.photo.createdAt > b.photo.createdAt) return -1;
        if (a.photo.createdAt < b.photo.createdAt) return 1;
        return 0;
    }

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
                const currPromptInMap: IPrompt = posts[promptId].prompt;
                const currPostsInMap: IPost[] = posts[promptId].posts;

                return (
                    <div key={index} className={styles.layout_posts}>
                        <div className={styles.prompt}>
                            <span>
                                {currPromptInMap.challenge}
                            </span>
                        </div>
                        <div className={styles.container_cards}>
                            {currPostsInMap.length === 0 && (
                                <div>
                                    {currPrompt !== null && (
                                        <>
                                            {currPrompt.day > currPromptInMap.day ?
                                                "There weren't any photos :/" :
                                                'There are still not photos... Be the first one :)' }  
                                        </>
                                    )}
                                </div>
                            )}
                            {currPostsInMap.sort(sortPosts).map((element: IPost, jIndex: number) => {
                                const currPhoto: IPhoto = element.photo;
                                const currClient: IClient | null = element.client;

                                return (
                                    <div className={styles.card} key={jIndex}>
                                        <div className={styles.profile_user}>
                                            <img className={styles.profilePhoto} src={currClient?.profilePhoto} alt={currClient?.name} />
                                            {currClient?.name}
                                        </div>
                                        <img src={currPhoto.url} alt={currPromptInMap.challenge} />
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
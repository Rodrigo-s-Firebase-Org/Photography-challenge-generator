import { useEffect, useRef, useState, useContext, Fragment } from 'react';
import UploadButton from '../../Button/Upload/Upload';
import { AuthContext } from '../../../context/Auth.context';
import styles from './PhotosHome.module.css';
import { IPhoto } from '../../../shared/photo.interfaces';
import Photo from '../../../firebase/models/photos.model';
import Prompt from '../../../firebase/models/prompt.model';
import { IPrompt } from '../../../shared/prompt.interfaces';
import Loader from './Loader';
import { IClient } from '../../../shared/client.interfaces';
import Client from '../../../firebase/models/client.model';
import Button from '../../Button/Spinner/Spinner';

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

interface Props {
    withEdit?: boolean
}

export default function PhotosHome({
    withEdit = false
}: Props) {
    const {
        currPrompt,
        client
    } = useContext(AuthContext);
    const [posts, setPosts] = useState<IPosts>({});
    const isFetching = useRef(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAskingDelete, setIsAskingDelete] = useState<string>('');

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

                    if (
                        withEdit &&
                        client?.id === thisClient?.id
                    ) {
                        const newPost: IPost = {
                            photo: allPhotosFromPrompt[j],
                            client: thisClient
                        };
                        photosByThisPrompt.push(newPost);
                    }
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

    const deletePost = (
        promptDayToDelete: number,
        postPhotoId: string
    ) => {
        const newPosts: IPosts = {};

        for (let i = 0; i < Object.keys(posts).length; i++) {
            const currPostKeyInLoop = Object.keys(posts)[i];
            const currPostsInLoop = posts[currPostKeyInLoop];
            
            if (currPostsInLoop.prompt.day !== promptDayToDelete) {
                newPosts[currPostKeyInLoop] = currPostsInLoop;
                continue;
            }

            // Delete photoId
            const newArrayOfPosts: IPost[] = []

            for (let j = 0; j < currPostsInLoop.posts.length; j++) {
                const currPhotoInLoop: IPost = currPostsInLoop.posts[j];

                if (currPhotoInLoop.photo.doc_id !== postPhotoId) {
                    newArrayOfPosts.push(currPhotoInLoop);
                }
            }
        }

        setPosts(newPosts);
    }

    useEffect(getAllPhotos, []);

    return (
        <div className={`${styles.container_for_photos}`}>
            {isLoading && <Loader />}
            {!isLoading && currPrompt !== null && (
                <h1 className={styles.curr_prompt}>
                    {currPrompt.challenge}
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
                                                'There are still not photos... Be the first one :)'}
                                        </>
                                    )}
                                </div>
                            )}
                            {currPostsInMap.map((element: IPost, jIndex: number) => {
                                const currPhoto: IPhoto = element.photo;
                                const currClient: IClient | null = element.client;
                                const cardId = `${currPhoto.doc_id}`;

                                return (
                                    <div className={`${styles.card} ${isAskingDelete === cardId && styles.asking}`} key={jIndex}>
                                        {isAskingDelete === cardId ? (
                                            <>
                                                <div className={styles.card_rotated}>
                                                    <img src="./assets/gopher.jpeg" alt="Are you sure?" />
                                                    <div className={styles.container_btns_rotated}>
                                                        <Button
                                                            btnType='slate'
                                                            action={() => {
                                                                setIsAskingDelete('');
                                                            }}
                                                        >
                                                            Lol just kidding
                                                        </Button>
                                                        <Button
                                                            btnType='indigo'
                                                            action={() => {
                                                                deletePost(currPromptInMap.day, currPhoto.doc_id);
                                                            }}
                                                        >
                                                            I'm sure
                                                        </Button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                               <div className={styles.profile_user}>
                                                    {/* eslint-disable-next-line */}
                                                    <img className={styles.profilePhoto} src={currClient?.profilePhoto} alt={currClient?.name} />
                                                    <div className='flex w-full justify-between'>
                                                        {currClient?.name}
                                                        {withEdit && currPrompt !== null && currPrompt.day === currPromptInMap.day && (
                                                            <svg onClick={() => {
                                                                setIsAskingDelete(cardId);
                                                            }} width={15} hanging={15} className='cursor-pointer fill-slate-500 hover:fill-slate-400 transition-colors' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                                <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* eslint-disable-next-line */}
                                                <img src={currPhoto.url} alt={currPromptInMap.challenge} />
                                            </>
                                        )}
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
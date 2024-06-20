import { useEffect, useRef, useState } from 'react';
import UploadButton from '../../Button/Upload/Upload';
import styles from './PhotosHome.module.css';
import { IPhoto } from '../../../shared/photo.interfaces';
import Photo from '../../../firebase/models/photos.model';
import Prompt from '../../../firebase/models/prompt.model';
import { IPrompt } from '../../../shared/prompt.interfaces';

interface IPost {
    prompt: IPrompt,
    photos: IPhoto[]
}

interface IPosts {
    [promptId: string]: IPost 
}

export default function PhotosHome() {
    const [posts, setPosts] = useState<IPosts>({});
    const isFetching = useRef(false);

    const getAllPhotos = (): void => {
        if (isFetching.current) return;
        isFetching.current = true;

        const doFetch = async (): Promise<void> => {
            const allPrompts = await Prompt.getAll();
            console.log(allPrompts);
            for (let i = 0; i < allPrompts.length; i++) {
                const allPhotosFromPrompt = await Photo.getByPrompt(allPrompts[i].id);
                const newPost: IPost = {
                    prompt: allPrompts[i],
                    photos: allPhotosFromPrompt
                };
                setPosts(prev => {
                    return {
                        ...prev,
                        [allPrompts[i].id]: newPost
                    };
                });
            }
        };
        void doFetch();
    };

    useEffect(getAllPhotos, []);

    return (
        <div className={`${styles.container_for_photos}`}>
            {Object.keys(posts).map((promptId: string, index: number) => {
                const currPrompt: IPrompt = posts[promptId].prompt;
                const currPhotos: IPhoto[] = posts[promptId].photos;
                return (
                    <div key={index} className={styles.layout_posts}>
                        <div className={styles.prompt}>
                            "{currPrompt.challenge}"
                        </div>
                        <div className={styles.container_cards}>
                            {currPhotos.map((element: IPhoto, jIndex: number) => {
                                return (
                                    <div className={styles.card} key={jIndex}>
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
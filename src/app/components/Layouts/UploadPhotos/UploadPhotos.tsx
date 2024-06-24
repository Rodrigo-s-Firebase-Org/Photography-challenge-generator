import { Fragment, useCallback, useState, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import {AuthContext} from '../../../context/Auth.context';
import { IImage } from './UploadPhotos.types';
import styles from './UploadPhotos.module.css';
import Card from './Card/Card';
import { useRouter } from 'next/navigation';
import ReturnAction from '../../Button/ReturnAction/ReturnAction';
import SpinnerBtn from '../../Button/Spinner/Spinner';
import Photo from '../../../firebase/models/photos.model';
import {
    doc
  } from 'firebase/firestore';
import { db } from '../../../config/firebase.config';
import { COLLECTION_NAME as COLLECTION_CLIENT_NAME } from '../../../firebase/models/client.model';
import { COLLECTION_NAME as COLLECTION_PROMPT_NAME } from '../../../firebase/models/prompt.model';
import { IPhoto } from '../../../shared/photo.interfaces';

const IMAGE_LIMIT = 9;

export default function UploadPhotos() {
    const {client, currPrompt} = useContext(AuthContext);
    const [images, setImages] = useState<IImage[]>([]);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const addImage = (fileToUpload: File, index: number | null) => {
        try {
            const urlImage: string = URL.createObjectURL(fileToUpload);
            const file: File = fileToUpload;
            if (file === undefined || file === null) return;
            setImages(prev => {
                const aux = [...prev];

                if (aux.length === IMAGE_LIMIT) {
                    console.error("We are sorry, the limit is 9 images");
                    return aux;
                }

                if (index === null) {
                    // its append
                    aux.push({
                        file,
                        src: urlImage
                    });
                } else {
                    // update in that index
                    aux[index] = {
                        file,
                        src: urlImage
                    };
                }

                return aux;
            });
        } catch (error) {
            console.error(error);
        }
    };

    const onDrop = useCallback((acceptedFiles: Array<File>) => {
        try {
            let allowedExtensions = /(.jpg|.jpeg|.png)$/i;
            for (let i = 0; i < acceptedFiles.length; i++) {
                if (!allowedExtensions.exec(acceptedFiles[i].type)) {
                    console.error("The image doesn't have an extension of .png .jpeg o .jpg");
                    continue;
                }

                addImage(acceptedFiles[i], null);
            }
        } catch (error) {
            console.error(error);
        }
        // eslint-disable-next-line
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const canUploadMore = (): boolean => {
        return images.length < IMAGE_LIMIT && images.length !== 0;
    }

    const submitImages = (): void => {
        if (client === null) return;
        if (currPrompt === null) return;

        const createPromiseToUpload = (imageToUpload: IImage) => {
            return new Promise<boolean>((resolve) => {
                const doFetch = async (): Promise<void> => {
                    try {
                        const clientRef = doc(db, COLLECTION_CLIENT_NAME, client.doc_id);
                        const promptRef = doc(db, COLLECTION_PROMPT_NAME, currPrompt.doc_id);
                        const newPhoto = new Photo({
                            client: clientRef,
                            prompt: promptRef,
                            file: imageToUpload.file,
                            url: ''
                        } as IPhoto);
                        await newPhoto.save();
                        resolve(true);
                    } catch (error) {
                        console.log(error);
                        resolve(false);
                    }
                }
                void doFetch();
            });
        };
        const arr: Promise<boolean>[] = [];

        for (let i = 0; i < images.length; i++) {
            arr.push(createPromiseToUpload(images[i]));
        };

        const uploadAll = async (): Promise<void> => {
            setIsLoading(true);
            await Promise.all(arr);
            setIsLoading(false);
            router.push('/photos');
        }
        void uploadAll();
    }

    return (
        <div className='flex items-center flex-col pt-14'>
            <div className={`flex relative justify-center ${styles.wrapper_title}`}>
                <div className='absolute left-0 mt-1'>
                    <ReturnAction action={() => {
                        router.push('/photos');
                    }} />
                </div>
                <h1 className='text-2xl font-bold mb-10'>
                    Drag and Drop
                </h1>
            </div>
            <div className='flex gap-5 mb-10'>
                <div className={`${styles.container_for_upload} ${images.length === IMAGE_LIMIT && styles.reached_limit} ${canUploadMore() && styles.container_for_upload_resizing}`}  {...getRootProps()}>
                    <input {...getInputProps()} />
                    {images.length === 0 && (
                        <img className={styles.upload_image} src='./icons/upload.svg' alt="Upload" />
                    )}
                    {canUploadMore() && (
                        <SpinnerBtn btnType='slate'>
                            Upload more
                        </SpinnerBtn>
                    )}
                </div>
                {images.length > 0 && (
                    <div>
                        <SpinnerBtn isLoading={isLoading} btnType='indigo' action={submitImages}>
                            Submit photos
                        </SpinnerBtn>
                    </div>
                )}
            </div>
            <div className={styles.container_images}>
                {images.map((element: IImage, index: number) => {
                    return (
                        <Fragment key={index}>
                            <Card remove={() => {
                                setImages(prev => {
                                    const aux = [
                                        ...prev.slice(0, index),
                                        ...prev.slice(index + 1, prev.length),
                                    ];
                                    return aux;
                                })
                            }} src={element.src} />
                        </Fragment>
                    )
                })}
            </div>
        </div>
    )
}
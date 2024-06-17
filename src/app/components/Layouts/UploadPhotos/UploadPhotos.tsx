import { Fragment, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { IImage } from './UploadPhotos.types';
import styles from './UploadPhotos.module.css';
import Card from './Card/Card';
import {useRouter} from 'next/navigation';
import ReturnAction from '../../Button/ReturnAction/ReturnAction';
import SpinnerBtn from '../../Button/Spinner/Spinner';

const IMAGE_LIMIT = 9;

export default function UploadPhotos() {
    const [images, setImages] = useState<IImage[]>([]);
    const router = useRouter();

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

    const canUploadMore = () : boolean => {
        return images.length < IMAGE_LIMIT && images.length !== 0;
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
                        <SpinnerBtn btnType='indigo' action={() => {
                            // TODO: submit
                        }}>
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
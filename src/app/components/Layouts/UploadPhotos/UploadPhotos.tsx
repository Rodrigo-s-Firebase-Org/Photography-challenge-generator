import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { IImage } from './UploadPhotos.types';
import styles from './UploadPhotos.module.css';

const IMAGE_LIMIT = 9;

export default function UploadPhotos() {
    const [images, setImages] = useState<IImage[]>([]);

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

    return (
        <>
            <h1>
                Drag and Drop
            </h1>

            <div className={`${styles.block_picture} ${styles.block_picture_upload}`}  {...getRootProps()}>
                <input {...getInputProps()} />
                +
                <div>
                    dropea
                </div>
            </div>
        </>
    )
}
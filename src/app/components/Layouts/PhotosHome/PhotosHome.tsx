import UploadButton from '../../Button/Upload/Upload';
import styles from './PhotosHome.module.css';

export default function PhotosHome() {
    return (
        <>
            <h1>
                Photos
            </h1>

            <div className={styles.upload_btn}>
                <UploadButton />
            </div>
        </>
    )
}
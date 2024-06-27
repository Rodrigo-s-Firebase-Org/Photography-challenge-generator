import styles from './Card.module.css';

interface Props {
    src: string;
    remove: () => void
}

export default function Card({
    src,
    remove
}: Props) {
    return (
        <div className={`${styles.card}`}>
            {/* eslint-disable-next-line */}
            <img src={src} alt='Image to upload' />
            <button onClick={remove} className={styles.remove_btn}>x</button>
        </div>
    )
}
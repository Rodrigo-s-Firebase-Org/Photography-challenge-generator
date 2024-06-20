import styles from './Nav.module.css';
import { AuthContext } from '../../context/Auth.context';
import { useContext } from 'react';
import AuthButton from '../Button/Auth/Auth';
import Link from 'next/link';

export default function Nav() {
  const { client } = useContext(AuthContext);

  return (
    <nav className={styles.nav}>
      <div className={styles.nav_title}>
        <Link href={client === null ? '/' : '/photos'}>
          PHOTOS
        </Link>
      </div>
      <div className={styles.tools}>
        {client !== null && (
          <>
            <AuthButton action='log-out' />
            <Link href='/profile'>
              <img className={styles.profilePhoto} src={client.profilePhoto} alt={client.name} />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
import styles from './Nav.module.css';
import {AuthContext} from '../../context/Auth.context';
import {useContext} from 'react';
import AuthButton from '../Button/Auth/Auth';
import Link from 'next/link';

export default function Nav() {
  const {client} = useContext(AuthContext);

    return (
      <nav className={styles.nav}>
        <div className={styles.nav_title}>PHOTOS</div>
        <div className={styles.tools}>
          {client !== null && (
            <>
              <AuthButton action='log-out' />
              <Link href='/profile'>
                Profile
              </Link>
            </>
          )}
        </div>
      </nav>
    );
  }
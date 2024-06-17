import styles from './Auth.module.css';
import { auth, provider } from '../../../config/firebase.config';

type TAction = 'log-in' | 'log-out';

const TextMapper = new Map<TAction, string>();
TextMapper.set('log-in', 'Sign in with Google');
TextMapper.set('log-out', 'Log out');

interface Props {
    action: TAction
}
 
export default function AuthButton({
    action
}: Props) {
    const signIn = () => auth.signInWithPopup(provider);
    const signOut = () => auth.signOut();

    const actionDiscovery = () => {
        if (action === 'log-in') {
            signIn();
        }
        if (action === 'log-out') {
            signOut();
        }
    }

    return (
        <button
            onClick={actionDiscovery}
            className={`${styles.btn}`}
        >
            {TextMapper.get(action)}
        </button>
    );
}
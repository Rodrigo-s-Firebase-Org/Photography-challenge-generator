import styles from './Spinner.module.css';

interface Props {
    action?: () => void;
    isLoading?: boolean;
    children: any;
    btnType: 'slate' | 'indigo'
}

export default function Spinner({
    action = () => { },
    children,
    btnType,
    isLoading = false
}: Props) {

    const getColors = (): string => {
        if (btnType === 'indigo') {
            return 'bg-indigo-500 hover:bg-indigo-400';
        }
        if (btnType === 'slate') {
            return 'bg-slate-500 hover:bg-slate-400';
        }
        return '';
    }

    return (
        <button onClick={() => {
            if (isLoading) return;
            action();
        }} className={`${getColors()} text-white relative overflow-hidden py-2 px-4 rounded-md transition-colors`}>

            {isLoading && (
                <div className={`absolute top-0 left-0 w-full h-full z-10 flex justify-center items-center transition-colors ${getColors()}`}>
                    <svg className={`${styles.loading} h-5 w-5 ${styles.rotate}`} viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
                        <path d="M28 14C28 12.1615 27.6379 10.341 26.9343 8.64243C26.2307 6.94387 25.1995 5.40053 23.8995 4.1005C22.5995 2.80048 21.0561 1.76925 19.3576 1.06569C17.659 0.362121 15.8385 -8.03637e-08 14 0L14 3.542C15.3734 3.542 16.7333 3.8125 18.0021 4.33807C19.2709 4.86363 20.4238 5.63396 21.3949 6.60508C22.366 7.57619 23.1364 8.72907 23.6619 9.9979C24.1875 11.2667 24.458 12.6266 24.458 14H28Z" />
                        <path d="M0 14C0 15.8385 0.362122 17.659 1.06569 19.3576C1.76925 21.0561 2.80049 22.5995 4.10051 23.8995C5.40053 25.1995 6.94387 26.2307 8.64243 26.9343C10.341 27.6379 12.1615 28 14 28L14 24.458C12.6266 24.458 11.2667 24.1875 9.9979 23.6619C8.72907 23.1364 7.57619 22.366 6.60508 21.3949C5.63396 20.4238 4.86363 19.2709 4.33807 18.0021C3.8125 16.7333 3.542 15.3734 3.542 14L0 14Z" />
                    </svg>
                </div>
            )}
            <div className='w-full h-full'>
                {children}
            </div>
        </button>
    )
}
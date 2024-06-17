interface Props {
    action?: () => void;
    isLoading?: boolean;
    children: any;
    btnType: 'slate' | 'indigo'
}

export default function Spinner({
    action = () => {},
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
        }} className={`${getColors()} text-white py-2 px-4 rounded-md transition-colors`}>
            {children}
        </button>
    )
}
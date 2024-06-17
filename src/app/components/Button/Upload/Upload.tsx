import Link from 'next/link';

export default function UploadButton() {
    return (
        <Link href='/upload' className='text-lg text-white font-bold bg-indigo-500 w-10 h-10 flex justify-center items-center rounded-full transition-colors hover:bg-indigo-400'>
            +
        </Link>
    )
}
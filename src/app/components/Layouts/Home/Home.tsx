import AuthButton from '../../Button/Auth/Auth';

export default function Home() {
    return (
        <>
            <h1 className='text-2xl font-bold'>
                Welcome
            </h1>
            <AuthButton action='log-in' />
        </>
    )
}
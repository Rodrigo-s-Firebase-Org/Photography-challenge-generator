"use client";

import AuthButton from './components/Button/Auth/Auth';

export default function Home() {
  return (
    <main className='w-screen h-screen bg-slate-50 pt-20 flex justify-center items-center flex-col'>
      <h1 className='text-2xl font-bold'>
        Welcome
      </h1>
      <AuthButton action={'log-in'} />
    </main>
  );
}
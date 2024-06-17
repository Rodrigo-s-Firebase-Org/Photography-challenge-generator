"use client";

import AuthButton from './components/Button/Auth/Auth';

export default function Home() {
  return (
    <main>
      <h1>
        Welcome
      </h1>
      <AuthButton action={'log-in'} />
    </main>
  );
}
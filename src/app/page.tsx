"use client";

import AuthButton from './components/Button/Auth/Auth';
import {AuthContext} from './context/Auth.context';
import {useContext} from 'react';

export default function Home() {
  const {client} = useContext(AuthContext);

  return (
    <main>
      <h1>
        Welcome {client?.name}
      </h1>
      <AuthButton action={client === null ? 'log-in' : 'log-out'} />
    </main>
  );
}
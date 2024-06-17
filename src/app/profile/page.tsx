'use client';

import AuthButton from './../components/Button/Auth/Auth';

export default function Profile() {
    return (
      <main>
        <h1>
          Profile
        </h1>
        <AuthButton action={'log-out'} />
      </main>
    );
  }
'use client';

import PhotosLayout from "../components/Layouts/PhotosHome/PhotosHome";

export default function Profile() {
    return (
      <main className='page_css !pb-0 justify-center items-center'>
        <PhotosLayout withEdit />
      </main>
    );
  }
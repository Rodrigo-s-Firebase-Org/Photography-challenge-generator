import React from 'react';
import styles from './SkeletonBlock.module.css';

interface Props {
  className: string;
}

export default function SkeletonBlock({
  className
}: Props) {
  return (
    <div className={`relative overflow-hidden rounded ${styles.skeleton} ${className}`}></div>
  );
};

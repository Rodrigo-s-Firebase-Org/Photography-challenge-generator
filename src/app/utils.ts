import { DocumentData, QuerySnapshot, QueryDocumentSnapshot } from 'firebase/firestore';

export function SnapshotFormater<T>(snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>): T {  
  const obj = {
    ...snapshot.data(),
    doc_id: snapshot.id,
  } as T;
  return obj;
};

export function CollectionFormater<T>(collectionSnapshot: QuerySnapshot<DocumentData, DocumentData>): T[] {
  return collectionSnapshot.docs.map(SnapshotFormater<T>);
}

export const getCurrDay = (): number => {
  const now: Date = new Date();
  const start: Date = new Date(now.getFullYear(), 0, 0);
  const diff: number = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}
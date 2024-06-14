import { DocumentData, QuerySnapshot, QueryDocumentSnapshot } from 'firebase/firestore';

export function SnapshotFormater<T>(snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>): T {  
  const obj = {
    ...snapshot.data(),
    id: snapshot.id,
  } as T;
  return obj;
};

export function CollectionFormater<T>(collectionSnapshot: QuerySnapshot<DocumentData, DocumentData>): T[] {
  return collectionSnapshot.docs.map(SnapshotFormater<T>);
}

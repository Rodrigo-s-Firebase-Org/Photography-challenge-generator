import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import { CollectionFormater } from '../../utils';
import { IClient } from '../../shared/client.interfaces';

const COLLECTION_NAME = 'clients';
const COLLECTION_REF = collection(db, COLLECTION_NAME);

export default class Client implements IClient {
  email: string;
  profilePhoto: string;
  name: string;
  id: string;

  constructor(client: IClient | null) {
    if (client === null) throw new Error('No user was provided');

    this.email = client.email;
    this.profilePhoto = client.profilePhoto;
    this.name = client.name;
    this.id = client.id;
  }

  async save(): Promise<IClient | null> {
    let document: IClient | null = null;
    try {
      const addedDocRef = await addDoc(COLLECTION_REF, {
        email: this.email,
        name: this.name,
        profilePhoto: this.profilePhoto,
        id: this.id,
      });
      document = await Client.getById(addedDocRef.id);
    } catch (err) {
      console.log(err);
      return null;
    }
    
    return document;
  }

  static async getAll(): Promise<IClient[]> {
    let docs: IClient[] = [];
    try {
      docs = CollectionFormater<IClient>(await getDocs(COLLECTION_REF));
    } catch (err) {
      console.log(err);
      return [];
    }
    return docs;
  }

  static async update(docId: string, key: keyof IClient, newValue: string): Promise<IClient | null> {
    const docRef = doc(db, COLLECTION_NAME, docId);
    let document: IClient | null = null;
    try {
      await updateDoc(docRef, {
        [key]: newValue
      });
      document = await Client.getById(docId);
    } catch (err) {
      console.log(err);
      return null;
    }
    return document;
  }

  static async getById(id: string): Promise<IClient | null> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('id', '==', id)
      );
      const docSnaps: IClient[] = CollectionFormater<IClient>(await getDocs(q));
      if (docSnaps.length > 0) { // It can only be 0 or 1
        return docSnaps[0];
      }
      throw new Error('User not found');
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  static async delete(docId: string): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, docId);
      await deleteDoc(docRef);
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }
}
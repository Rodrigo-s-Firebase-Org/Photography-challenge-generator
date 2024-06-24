import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import { CollectionFormater, getCurrDay } from '../../utils';
import { IPrompt } from '../../shared/prompt.interfaces';

export const COLLECTION_NAME = 'prompts';
const COLLECTION_REF = collection(db, COLLECTION_NAME);

export default class Prompt implements IPrompt {
  challenge: string;
  day: number;
  doc_id: string;

  constructor(prompt: IPrompt | null) {
    if (prompt === null) throw new Error('No prompt was provided');
    this.challenge = prompt.challenge;
    this.day = 0;
    this.doc_id = '';
  }

  async save(): Promise<IPrompt | null> {
    let document: IPrompt | null = null;
    try {
      await addDoc(COLLECTION_REF, {
        challenge: this.challenge,
      });
    } catch (err) {
      console.log(err);
      return null;
    }

    return document;
  }

  static async getAdll(): Promise<IPrompt[]> {
    let docs: IPrompt[] = [];
    try {
      docs = CollectionFormater<IPrompt>(await getDocs(COLLECTION_REF));
    } catch (err) {
      console.log(err);
      return [];
    }
    return docs;
  }

  static async getAll(): Promise<IPrompt[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('day', '<=', getCurrDay()),
        orderBy('day', 'desc')
      );
      const docSnaps: IPrompt[] = CollectionFormater<IPrompt>(await getDocs(q));
      return docSnaps;
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  static async getByDay(day: number): Promise<IPrompt | null> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('day', '==', day)
      );
      const docSnaps: IPrompt[] = CollectionFormater<IPrompt>(await getDocs(q));
      if (docSnaps.length > 0) { // It can only be 0 or 1
        return docSnaps[0];
      }
      throw new Error('Prompt not found');
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
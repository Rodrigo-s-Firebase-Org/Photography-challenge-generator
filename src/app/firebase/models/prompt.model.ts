import {
    collection,
    addDoc,
    getDocs,
    query,
    where
} from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import { CollectionFormater } from '../../utils';
import { IPrompt } from '../../shared/prompt.interfaces';

export const COLLECTION_NAME = 'prompts';
const COLLECTION_REF = collection(db, COLLECTION_NAME);

export default class Prompt implements IPrompt {
    challenge: string;
    id: string;
    day: number;

    constructor(prompt: IPrompt | null) {
        if (prompt === null) throw new Error('No prompt was provided');
        this.challenge = prompt.challenge;
        this.day = 0;
        this.id = '';   
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

      static async getAll(): Promise<IPrompt[]> {
        let docs: IPrompt[] = [];
        try {
          docs = CollectionFormater<IPrompt>(await getDocs(COLLECTION_REF));
        } catch (err) {
          console.log(err);
          return [];
        }
        return docs;
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
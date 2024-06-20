import {
    collection,
    addDoc,
    getDocs
} from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import { CollectionFormater } from '../../utils';
import { IPrompt } from '../../shared/prompt.interfaces';

const COLLECTION_NAME = 'prompts';
const COLLECTION_REF = collection(db, COLLECTION_NAME);

export default class Prompt implements IPrompt {
    challenge: string;
    id: string;

    constructor(prompt: IPrompt | null) {
        if (prompt === null) throw new Error('No prompt was provided');
        this.challenge = prompt.challenge;
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
}
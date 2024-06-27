import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    DocumentReference,
    Timestamp,
    orderBy
} from 'firebase/firestore';
import {
    getDownloadURL,
    ref as storageRef,
    uploadBytes,
  } from "firebase/storage";
import { db, storage } from '../../config/firebase.config';
import { CollectionFormater } from '../../utils';
import { IPhoto } from '../../shared/photo.interfaces';
import {v4} from 'uuid';


const COLLECTION_NAME = 'photos';
const COLLECTION_REF = collection(db, COLLECTION_NAME);

export default class Photo implements IPhoto {
    client: DocumentReference | null;
    prompt: DocumentReference | null;
    url: string;
    file: File | null;
    doc_id: string;
    createdAt: Date;

    constructor(photo: IPhoto | null) {
        if (photo === null) throw new Error('No photo was provided');
        if (photo.file === null) throw new Error('No photo was provided');

        this.client = photo.client;
        this.prompt = photo.prompt;
        this.file = photo.file;
        this.url = '';
        this.doc_id = '';
        this.createdAt = new Date();
    }

    async save(): Promise<IPhoto | null> {
        let document: IPhoto | null = null;
        try {
            if (this.file === null) throw new Error('No photo was provided');

            const imagesRef = storageRef(storage, `photos/${v4()}.${this.file.type}`);
            await uploadBytes(imagesRef, this.file);
            this.url = await getDownloadURL(imagesRef);
            const addedDocRef = await addDoc(COLLECTION_REF, {
                client: this.client,
                prompt: this.prompt,
                url: this.url,
                createdAt: Timestamp.now().toDate().getTime()
            });
            document = await Photo.getById(addedDocRef.id);
        } catch (err) {
            console.log(err);
            return null;
        }

        return document;
    }

    static async getByPrompt(promptId: string): Promise<IPhoto[]> {
        try {
            const promptDocRef = doc(db, "prompts", promptId);
            const q = query(
                collection(db, COLLECTION_NAME),
                orderBy('createdAt', 'desc'),
                where('prompt', '==', promptDocRef)
            );
            const docSnaps: IPhoto[] = CollectionFormater<IPhoto>(await getDocs(q));
            return docSnaps;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    static async update(docId: string, key: keyof IPhoto, newValue: string): Promise<IPhoto | null> {
        const docRef = doc(db, COLLECTION_NAME, docId);
        let document: IPhoto | null = null;
        try {
            await updateDoc(docRef, {
                [key]: newValue
            });
            document = await Photo.getById(docId);
        } catch (err) {
            console.log(err);
            return null;
        }
        return document;
    }

    static async getById(id: string): Promise<IPhoto | null> {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where('id', '==', id)
            );
            const docSnaps: IPhoto[] = CollectionFormater<IPhoto>(await getDocs(q));
            if (docSnaps.length > 0) { // It can only be 0 or 1
                return docSnaps[0];
            }
            throw new Error('Photo not found');
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    static async delete(docId: string, fileUrl: string): Promise<boolean> {
        try {
            const fileRef = storage.refFromURL(fileUrl); 

            // Delete the file using the delete() method 
            fileRef.delete().then(async function () { 
                const docRef = doc(db, COLLECTION_NAME, docId);
                await deleteDoc(docRef); 
            }).catch(function (err) { 
                console.log(err);
                return false; 
            });
        } catch (err) {
            console.log(err);
            return false;
        }
        return true;
    }
}
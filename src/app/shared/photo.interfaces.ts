import { DocumentReference } from "firebase/firestore";

export interface IPhoto {
    client: DocumentReference | null;
    prompt: DocumentReference | null;
    url: string;
    file: File | null;
}
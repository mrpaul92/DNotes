import { ethers } from "ethers";
import { contractAbi, contractAddress } from "../constants";
import { File, Note, User } from "../interfaces";

const provider = new ethers.providers.Web3Provider((window as any).ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, contractAbi, signer);

export const DNotesApi = {
  getUser: async (): Promise<User> => {
    let data = await contract.getUser();
    return data;
  },
  createUser: async (name: string) => {
    let txn = await contract.createUser(name);
    await txn.wait();
    return txn;
  },
  addNote: async (title: string, body: string, files: File[]) => {
    let txn = await contract.addNote(title, body, files);
    await txn.wait();
    return txn;
  },
  updateNote: async (id: number, title: string, body: string) => {
    let txn = await contract.updateNote(id, title, body);
    await txn.wait();
    return txn;
  },
  deleteNote: async (id: number) => {
    let txn = await contract.deleteNote(id);
    await txn.wait();
    return txn;
  },
  getNotes: async (): Promise<Note[]> => {
    let data = await contract.getNotes();
    return data;
  },
  getNoteFiles: async (id: number): Promise<File[]> => {
    let data = await contract.getNoteFiles(id);
    return data;
  },
};

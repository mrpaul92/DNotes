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
  createUser: async (name: string): Promise<boolean> => {
    let data = await contract.createUser(name);
    return data;
  },
  addNote: async (title: string, body: string, files: File[]) => {
    let data = await contract.addNote(title, body, files);
    return data;
  },
  getNotes: async (): Promise<Note[]> => {
    let data = await contract.getNotes();
    return data;
  },
};

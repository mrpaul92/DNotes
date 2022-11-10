import { ethers } from "ethers";
import { contractAbi, contractAddress } from "../constants";
import { File, Note, User } from "../interfaces";

const getEthereumObject = () => (window as any).ethereum;

export const DNotesApi = {
  getUser: async (): Promise<User> => {
    const ethereum = getEthereumObject();
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    let data = await contract.getUser();
    return data;
  },
  createUser: async (name: string) => {
    const ethereum = getEthereumObject();
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    let txn = await contract.createUser(name);
    await txn.wait();
    return txn;
  },
  addNote: async (title: string, body: string, files: File[]) => {
    const ethereum = getEthereumObject();
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    let txn = await contract.addNote(title, body, files);
    await txn.wait();
    return txn;
  },
  updateNote: async (id: number, title: string, body: string) => {
    const ethereum = getEthereumObject();
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    let txn = await contract.updateNote(id, title, body);
    await txn.wait();
    return txn;
  },
  deleteNote: async (id: number) => {
    const ethereum = getEthereumObject();
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    let txn = await contract.deleteNote(id);
    await txn.wait();
    return txn;
  },
  getNotes: async (): Promise<Note[]> => {
    const ethereum = getEthereumObject();
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    let data = await contract.getNotes();
    return data;
  },
  getNoteFiles: async (id: number): Promise<File[]> => {
    const ethereum = getEthereumObject();
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    let data = await contract.getNoteFiles(id);
    return data;
  },
  addNoteFiles: async (id: number, files: File[]) => {
    const ethereum = getEthereumObject();
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    let txn = await contract.addNoteFiles(id, files);
    await txn.wait();
    return txn;
  },
  getLastNoteId: async () => {
    const ethereum = getEthereumObject();
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    let data = await contract.lastNoteId();
    return data;
  },
};

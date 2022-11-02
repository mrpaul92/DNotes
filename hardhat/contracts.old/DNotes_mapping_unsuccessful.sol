// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;
import "hardhat/console.sol";

contract DNotes_old {

    enum Status {
        Active,
        Inactive
    }

    struct Note {
        uint id;
        string title;
        string body;
        Status status;
        uint timestamp;
        mapping(uint => File) files;
    }

    struct File {
        uint id;
        string name;
        string hash;
        uint size;
        string mime;
        Status status;
        uint timestamp;
    }

    struct User {
        uint id;
        string name;
        address key;
        Status status;
        uint timestamp;
    }

    mapping(address => User) private users;
    mapping(address => Note[]) private notes;
    mapping(address => File[]) private files;
    mapping(uint => File[]) private noteFiles;

    uint private lastUserId;
    uint private lastNoteId;
    uint private lastFileId;

    event userCreated(uint indexed _userId, string _name);
    event noteCreated(uint indexed _noteId, string _title, string _body);
    event noteDeleted(uint indexed _noteId);
    event noteUpdated(uint indexed _noteId, string _title, string _body);
    event noteFileUpdated(uint indexed _noteId);

    modifier createNoteValidator(string memory _title, string memory _body, File[] calldata _files){
        require(bytes(_title).length > 0);
        require(bytes(_body).length > 0);
        require(msg.sender != address(0));

        // files validation
        if(_files.length > 0){
            for(uint i = 0; i < _files.length; i++){
                require(bytes(_files[i].name).length > 0);
                require(bytes(_files[i].hash).length > 0);
                require(_files[i].size > 0);
                require(bytes(_files[i].mime).length > 0);
            }
        }
        _;
    }

    modifier createUserValidator(string memory _name) {
        require(bytes(_name).length > 0);
        require(msg.sender != address(0));
        _;
    }

    constructor(){
        console.log("DNotes contract Deployed by %s", msg.sender);
    }

    function getUser() public view returns(User memory){
        return users[msg.sender];
    }

    function createUser(string memory _name) public createUserValidator(_name) returns (bool){
        lastUserId++;
        users[msg.sender] = User(lastUserId, _name, msg.sender, Status.Active, block.timestamp);
        emit userCreated(lastUserId, _name);
        return true;
    }

    function addNote(string memory _title, string memory _body, File[] calldata _files) public createNoteValidator(_title, _body, _files) returns(bool) {
        Note storage newNote = notes[msg.sender].push();
        lastNoteId++;
        newNote.id = lastNoteId;
        newNote.title = _title;
        newNote.body = _body;
        newNote.status = Status.Active;
        newNote.timestamp = block.timestamp;

        for(uint i = 0; i < _files.length; i++){
            lastFileId++;
            newNote.files[i] = File(lastFileId, _files[i].name, _files[i].hash, _files[i].size, _files[i].mime, Status.Active, block.timestamp);
            
            // map user's files & noteFiles
            files[msg.sender].push(File(lastFileId, _files[i].name, _files[i].hash, _files[i].size, _files[i].mime, Status.Active, block.timestamp));
            noteFiles[lastNoteId].push(File(lastFileId, _files[i].name, _files[i].hash, _files[i].size, _files[i].mime, Status.Active, block.timestamp));

        }

        emit noteCreated(lastNoteId, _title, _body);
        return true;
    }

    function deleteNote(uint _noteId) public returns(bool){
        for(uint i = 0; i < notes[msg.sender].length; i++){
            if(notes[msg.sender][i].id == _noteId){
                notes[msg.sender][i].status = Status.Inactive;
                emit noteDeleted(_noteId);
            }
        }
        return true;
    }

    function updateNote(uint _noteId, string memory _title, string memory _body) public returns(bool){
        for(uint i = 0; i < notes[msg.sender].length; i++){
            if(notes[msg.sender][i].id == _noteId){
                notes[msg.sender][i].title = _title;
                notes[msg.sender][i].body = _body;
            }
        }

        emit noteUpdated(_noteId, _title, _body);
        return true;
    }

    function getNotes() public view {}

    function getNoteFiles(uint _noteId) public view returns (File[] memory){
        return noteFiles[_noteId];
    }

    function deleteNoteFile(uint _noteId, uint _fileId) public returns (bool){
        for(uint i = 0; i < notes[msg.sender].length; i++){
            if(notes[msg.sender][i].id == _noteId){
                notes[msg.sender][i].files[_fileId].status = Status.Inactive;
                emit noteFileUpdated(_noteId);
            }
        }
        return true;
    }

    function addNoteFiles(uint _noteId, File[] calldata _files) public returns (bool){
        for(uint i = 0; i < notes[msg.sender].length; i++){
            if(notes[msg.sender][i].id == _noteId){
                uint nextFileIndex = _files.length;
                for(uint j = 0; j < _files.length; j++){
                    lastFileId++;
                    notes[msg.sender][i].files[nextFileIndex] = File(lastFileId, _files[j].name, _files[j].hash, _files[j].size, _files[j].mime, Status.Active, block.timestamp);
                    nextFileIndex++;
                    emit noteFileUpdated(_noteId);
                }
            }
        }
        return true;
    }
}
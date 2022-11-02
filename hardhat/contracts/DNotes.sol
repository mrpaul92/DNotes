// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;
import "hardhat/console.sol";

contract DNotes {

    struct Note {
        uint id;
        string title;
        string body;
        bool status;
        uint timestamp;
    }

    struct File {
        uint id;
        string name;
        string hash;
        uint size;
        string mime;
        bool status;
        uint timestamp;
    }

    struct User {
        uint id;
        string name;
        address key;
        bool status;
        uint timestamp;
    }

    mapping(address => User) private users;
    mapping(address => Note[]) private notes;
    mapping(uint => File[]) private noteFiles;

    uint private lastUserId;
    uint private lastNoteId;
    uint private lastFileId;

    event userCreated(uint  _userId, string _name);
    event noteCreated(uint  _noteId, string _title, string _body);
    event noteDeleted(uint  _noteId);
    event noteUpdated(uint  _noteId, string _title, string _body);
    event noteFilesUpdated(uint  _noteId);

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

    modifier updateNoteValidator(string memory _title, string memory _body){
        require(bytes(_title).length > 0);
        require(bytes(_body).length > 0);
        require(msg.sender != address(0));
        _;
    }

    modifier addNoteFilesValidator(File[] calldata _files){
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
        users[msg.sender] = User(lastUserId, _name, msg.sender, true, block.timestamp);
        emit userCreated(lastUserId, _name);
        return true;
    }

    function addNote(string memory _title, string memory _body, File[] calldata _files) public createNoteValidator(_title, _body, _files) returns(bool) {
        Note storage newNote = notes[msg.sender].push();
        lastNoteId++;
        newNote.id = lastNoteId;
        newNote.title = _title;
        newNote.body = _body;
        newNote.status = true;
        newNote.timestamp = block.timestamp;

        for(uint i = 0; i < _files.length; i++){
            lastFileId++;
            // map user's files & noteFiles
            noteFiles[lastNoteId].push(File(lastFileId, _files[i].name, _files[i].hash, _files[i].size, _files[i].mime, true, block.timestamp));
        }

        emit noteCreated(lastNoteId, _title, _body);
        return true;
    }

    function deleteNote(uint _noteId) public returns(bool){
        for(uint i = 0; i < notes[msg.sender].length; i++){
            if(notes[msg.sender][i].id == _noteId){
                notes[msg.sender][i].status = false;
                emit noteDeleted(_noteId);
            }
        }
        return true;
    }

    function updateNote(uint _noteId, string memory _title, string memory _body) public updateNoteValidator(_title, _body) returns (bool){
        for(uint i = 0; i < notes[msg.sender].length; i++){
            if(notes[msg.sender][i].id == _noteId){
                notes[msg.sender][i].title = _title;
                notes[msg.sender][i].body = _body;
            }
        }

        emit noteUpdated(_noteId, _title, _body);
        return true;
    }

    function getNotes() public view returns (Note[] memory) {
        return notes[msg.sender];
    }

    function getNoteFiles(uint _noteId) public view returns (File[] memory){
        return noteFiles[_noteId];
    }

    function deleteNoteFile(uint _noteId, uint _fileId) public returns (bool){
        for(uint i = 0; i < noteFiles[_noteId].length; i++){
            if(noteFiles[_noteId][i].id == _fileId){
                noteFiles[_noteId][i].status = false;
                emit noteFilesUpdated(_noteId);
            }
        }
        return true;
    }

    function addNoteFiles(uint _noteId, File[] calldata _files) public addNoteFilesValidator(_files) returns (bool){
        for(uint i = 0; i < _files.length; i++){
            lastFileId++;
            noteFiles[_noteId].push(File(lastFileId, _files[i].name, _files[i].hash, _files[i].size, _files[i].mime, true, block.timestamp));
            emit noteFilesUpdated(_noteId);
        }
        return true;
    }
}
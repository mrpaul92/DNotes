// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;
import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract DNotesV2 is Initializable {
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
        string ipfsHash;
        uint size;
        string mime;
        bool status;
        uint timestamp;
    }
    struct User {
        uint id;
        string name;
        address key;
        string role;
        bool status;
        uint timestamp;
    }

    mapping(address => User) private users;
    mapping(address => Note[]) private notes;
    mapping(uint => File[]) private noteFiles;

    bool private initialized;
    uint public lastUserId;
    uint public lastNoteId;
    uint public lastFileId;
    address public owner;

    // we can't use constructor in case of upgradable contract
    function initialize() external initializer {
        owner = msg.sender;
        console.log("DNotes contract Deployed by %s", owner);
    }

    event userCreated(uint indexed _userId, string _name);
    event noteCreated(uint indexed _noteId, string _title, string _body);
    event noteDeleted(uint indexed _noteId);
    event noteUpdated(uint indexed _noteId, string _title, string _body);
    event noteFilesUpdated(uint indexed _noteId);

    modifier createNoteValidator(
        string calldata _title,
        string calldata _body,
        File[] calldata _files
    ) {
        require(bytes(_title).length > 0);
        require(bytes(_body).length > 0);
        require(msg.sender != address(0));

        // files validation
        if (_files.length > 0) {
            for (uint i = 0; i < _files.length; i++) {
                require(bytes(_files[i].name).length > 0);
                require(bytes(_files[i].ipfsHash).length > 0);
                require(_files[i].size > 0);
                require(bytes(_files[i].mime).length > 0);
            }
        }
        _;
    }

    modifier updateNoteValidator(
        string calldata _title,
        string calldata _body
    ) {
        require(bytes(_title).length > 0);
        require(bytes(_body).length > 0);
        require(msg.sender != address(0));
        _;
    }

    modifier addNoteFilesValidator(File[] calldata _files) {
        require(msg.sender != address(0));

        // files validation
        if (_files.length > 0) {
            for (uint i = 0; i < _files.length; i++) {
                require(bytes(_files[i].name).length > 0);
                require(bytes(_files[i].ipfsHash).length > 0);
                require(_files[i].size > 0);
                require(bytes(_files[i].mime).length > 0);
            }
        }
        _;
    }

    modifier createUserValidator(string calldata _name) {
        require(bytes(_name).length > 0);
        require(msg.sender != address(0));
        _;
    }

    function getUser() external view returns (User memory) {
        return users[msg.sender];
    }

    function createUser(string calldata _name)
        external
        createUserValidator(_name)
        returns (bool)
    {
        string memory role = msg.sender == owner ? "Admin" : "User";
        lastUserId++;
        users[msg.sender] = User(
            lastUserId,
            _name,
            msg.sender,
            role,
            true,
            block.timestamp
        );
        emit userCreated(lastUserId, _name);
        return true;
    }

    function addNote(
        string calldata _title,
        string calldata _body,
        File[] calldata _files
    ) external createNoteValidator(_title, _body, _files) returns (bool) {
        Note storage newNote = notes[msg.sender].push();
        lastNoteId++;
        newNote.id = lastNoteId;
        newNote.title = _title;
        newNote.body = _body;
        newNote.status = true;
        newNote.timestamp = block.timestamp;

        for (uint i = 0; i < _files.length; i++) {
            lastFileId++;
            // map user's files & noteFiles
            noteFiles[lastNoteId].push(
                File(
                    lastFileId,
                    _files[i].name,
                    _files[i].ipfsHash,
                    _files[i].size,
                    _files[i].mime,
                    true,
                    block.timestamp
                )
            );
        }

        emit noteCreated(lastNoteId, _title, _body);
        return true;
    }

    function deleteNote(uint _noteId) external returns (bool) {
        for (uint i = 0; i < notes[msg.sender].length; i++) {
            if (notes[msg.sender][i].id == _noteId) {
                notes[msg.sender][i].status = false;
                emit noteDeleted(_noteId);
            }
        }
        return true;
    }

    function updateNote(
        uint _noteId,
        string calldata _title,
        string calldata _body
    ) external updateNoteValidator(_title, _body) returns (bool) {
        for (uint i = 0; i < notes[msg.sender].length; i++) {
            if (notes[msg.sender][i].id == _noteId) {
                notes[msg.sender][i].title = _title;
                notes[msg.sender][i].body = _body;
            }
        }

        emit noteUpdated(_noteId, _title, _body);
        return true;
    }

    function getNotes() external view returns (Note[] memory) {
        return notes[msg.sender];
    }

    function getNoteFiles(uint _noteId) external view returns (File[] memory) {
        return noteFiles[_noteId];
    }

    function deleteNoteFile(uint _noteId, uint _fileId)
        external
        returns (bool)
    {
        for (uint i = 0; i < noteFiles[_noteId].length; i++) {
            if (noteFiles[_noteId][i].id == _fileId) {
                noteFiles[_noteId][i].status = false;
                emit noteFilesUpdated(_noteId);
            }
        }
        return true;
    }

    function addNoteFiles(uint _noteId, File[] calldata _files)
        external
        addNoteFilesValidator(_files)
        returns (bool)
    {
        for (uint i = 0; i < _files.length; i++) {
            lastFileId++;
            noteFiles[_noteId].push(
                File(
                    lastFileId,
                    _files[i].name,
                    _files[i].ipfsHash,
                    _files[i].size,
                    _files[i].mime,
                    true,
                    block.timestamp
                )
            );
            emit noteFilesUpdated(_noteId);
        }
        return true;
    }
}

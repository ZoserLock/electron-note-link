

var Dropbox = require("dropbox");

// Local Imports
import DataController from "dataSource/dataSource";


export default class DropboxDataController extends DataController
{
    
    // Dropbox Tests
    private _accessToken:string = "YsFlkCHsMjgAAAAAAAAQ5wvm5d9uwKj9fxjG_OTQKG-95gazgB4ZY1RIUT_ddOYM";
    private _dropbox:any;

    constructor()
    {
        super();
        this._dropbox = new Dropbox({ accessToken: this._accessToken });
    }

    protected GetFile()
    {
        
    }

    public listFolderFiles():void
    {
        this._dropbox.filesListFolder({path: ""})
        .then(function(response:any) 
        {
            console.log(response);
        })
        .catch(function(error:any) 
        {
            console.log(error);
        });
    }
}
var Dropbox = require("dropbox");

export default class DataManager
{
    private static sInstance:DataManager;

    // Dropbox Tests
    private _accessToken:string = "YsFlkCHsMjgAAAAAAAAQ5wvm5d9uwKj9fxjG_OTQKG-95gazgB4ZY1RIUT_ddOYM";
    private _dropbox:any;

    // Get/Set
    static get instance(): DataManager 
    {
        return this.sInstance;
    }

    static initialize():void
    {
        this.sInstance = new DataManager();
    }

    private constructor()
    {
        this._dropbox = new Dropbox({ accessToken: this._accessToken });
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
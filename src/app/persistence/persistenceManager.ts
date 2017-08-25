var Dropbox = require('dropbox');

export default class PersistenceManager
{
    private _accessToken:string = 'YsFlkCHsMjgAAAAAAAAQ5wvm5d9uwKj9fxjG_OTQKG-95gazgB4ZY1RIUT_ddOYM';
    private _dropbox:any;

    constructor()
    {
        console.log("Initializing");
        this._dropbox = new Dropbox({ accessToken: this._accessToken });

    }

    public listFolderFiles():void
    {
        console.log("Zoser Lock1");
        this._dropbox.filesListFolder({path: ''})
        .then(function(response:any) 
        {
            console.log(response);
        })
        .catch(function(error:any) 
        {
            console.log(error);
        });
        console.log("Zoser Lock2");
    }

    public listFolderFiles2():void
    {
        console.log("Zoser Lock");
    }
}
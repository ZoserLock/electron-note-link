var Dropbox = require('dropbox');

export default class StorageManager
{
    private static sInstance:StorageManager;

    // Dropbox Tests
    private accessToken:string = 'YsFlkCHsMjgAAAAAAAAQ5wvm5d9uwKj9fxjG_OTQKG-95gazgB4ZY1RIUT_ddOYM';
    private dropbox:any;

    // Get/Set
    static get instance(): StorageManager 
    {
        return this.sInstance;
    }

    static initialize():void
    {
        this.sInstance = new StorageManager();
    }

    private constructor()
    {
        this.dropbox = new Dropbox({ accessToken: this.accessToken });
    }

    public listFolderFiles():void
    {
        this.dropbox.filesListFolder({path: ''})
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
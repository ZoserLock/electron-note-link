

// Core
import Storage from "core/data/storage";
import Notebook from "core/data/notebook";

export default class StorageDataParser
{
    public static createStorageListData(storages:Storage[]):ViewStorageItemData[]
    {


        let storagesData:ViewStorageItemData[] = storages.map((storage:Storage) =>
        {
            storage.sort();
            let notebooks:ViewNotebookItemData[] = storage.notebooks.map((notebook:Notebook) =>
            {
                return{
                    id:notebook.id, 
                    name:notebook.name,
                };
            });

            return {
                id:storage.id, 
                name:storage.name,
                notebooks:notebooks
            };
        });

        return storagesData;
    }
}
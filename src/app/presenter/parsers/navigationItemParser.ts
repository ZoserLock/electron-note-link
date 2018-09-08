

// Core
import Storage from "core/data/storage";
import Notebook from "core/data/notebook";

export default class NavigationPanelParser
{
    public static createNavigationData(storages:Storage[]):NavStorageItemData[]
    {
        let storagesData:NavStorageItemData[] = storages.map((storage:Storage) =>
        {
            let notebooks:NavNotebookItemData[] = storage.notebooks.map((notebook:Notebook) =>
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

    public static parseNavigationData(storages:any[]):NavStorageItemData[]
    {
        return storages as NavStorageItemData[];
    }
}


// Core
import Storage from "core/data/storage";
import Notebook from "core/data/notebook";

export default class NavigationPanelParser
{
    public static createListData(storages:Storage[]):ViewStorageItemData[]
    {
        let storagesData:ViewStorageItemData[] = storages.map((storage:Storage) =>
        {
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
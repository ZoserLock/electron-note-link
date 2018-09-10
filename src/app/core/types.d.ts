
declare const enum NoteListMode 
{
    Notebook = 1,
    Search   = 2,
    Trash    = 3,
    Started  = 4,
    All      = 5,
}

type VoidAction     = () => void | null;
type Action1<T>     = (param:T) => void| null;
type Action2<T,U>   = (param1:T,param2:U) => void| null;
type Action3<T,U,V> = (param1:T,param2:U,param3:V) => void| null;

// Interfaces used to mnodify data of an object 
declare interface NotebookUpdateData
{
    readonly id:string;
    readonly name?:string;
}

declare interface StorageUpdateData
{
    readonly id:string;
    readonly name?:string;
}

declare interface NoteUpdateData
{
    readonly id:string;
    readonly title?:string;
    readonly text?:string;
    readonly started?:boolean;
    readonly trash?:boolean;
}
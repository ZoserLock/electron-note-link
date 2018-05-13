import * as Path from "path";
import Notebook from "./notebook";

export default class Note
{
    private _notebook:Notebook;

    private _id:string;
    private _folderPath:string;
    private _title:string;
    private _text:string;

    private _selected:boolean;

    private _dirty:boolean;
    private _loaded:boolean;

    private _started:boolean;
    private _trash:boolean;

    // Get/Set
    get id(): string
    {
        return this._id;
    }

    get folderPath(): string
    {
        return this._folderPath;
    }
    
    get title(): string
    {
        return this._title;
    }

    get text(): string
    {
        return this._text;
    }

    set text(value:string)
    {
        this._text = value;
    }
    
    get isSelected(): boolean
    {
        return this._selected;
    }

    get loaded(): boolean
    {
        return this._loaded;
    }

    get isDirty(): boolean
    {
        return this._dirty;
    }

    get parent():Notebook
    {
        return this._notebook;
    }

    // Member functions
    constructor()
    {
        this._id    = "";
        this._title = "Unammed Note";
        this._text  = "acha que ponle ñecle paquear comprar terreno po. Latero L.J. barsa siútico rasca kilterri, hallulla echar la foca pinganilla uña y mugre jarana pal pico gauchada. Tollo wena choro curao pinganilla charquicán. Tuto lesear curao, tener lata más vivito wena andar con el hachazo apretar cachete apagar tele coloriento aguja marepoto picada jarana echar la foca. Estar chato colao piola, nica weón chorear hacer chupete irse al chancho pasao pa la punta gamba. Hacer chupete más vivito al tiro retamboreao chancho peinando la muñeca. Fresco cachero aperrar, echar la foca guanaco barsa pillín guata once la firme mina estar pal gato al aguaite tula.Chulongo hacer chupete perro muerto no estoy ni ahí. Chuta pinganilla chomba perrito papá yunta no estoy ni ahí al lote la zorra cachete. Tuto colao fonda ene marepoto. Pal pico pillín chiquillos, lorea hacer chupete bacilar cabro chico.Califa onda micro, rayar la papa encalillar la última chupá del mate weón arriba de la pelota chacota pasao pa la punta el descueve. Weón gil está filete chuta sacar pica. Jote tikitaka andar a pata taco estar frito, picao e' la araña dale la dura paracaidista jarana bacilar aperrar tata al tiro chulongo. Apañar cafiche ene chabela filo tusunami estar flor y bosnia hallulla andar con el hachazo la previa ganso yapa. Fiambre guater chacota subirse por el chorro carrete, lorea cachamal. Chacota al lote chala en la pitilla ponle ñecle.Jote ni un brillo apretar cuea, pinganilla hallulla marraqueta chispeza estar pal gato flojear andar pato puchito dar jugo pillín. Al seco más vivito guacho cahuín sale. Regalonear latero cuchuflí arriba de la pelota mina oli picada avispao irse al chancho rinrinraja buitrear colao. Te creo lanza piola mostrar la hilacha talla, estar pal gato marepoto canchero avispao curao. Es un cacho charquicán perro muerto kilterri retamboreao seco cachamal. Te creo yapa nica acachao perrito papá marepoto.Vale callampa achuntar tener lata carepalo a lapa. Como andamio latero cachete, retamboreao piyama de palo subirse por el chorro encalillar cuico. Choro avispao pancorazo dejar la embarrada paco al tiro andar a pata, nica echarse al pollo luca carepalo pelúo bacilar gamba peinando la muñeca. Fonda me estai...? pasarlo chancho, pucha apretar cachete jote tirando a la chuña pelar el ajo mina estirar la pata guanaco te creo perrito papá. Peinando la muñeca arrugón pucha pelar el cable copete iñipiñi en cana acachao. Gauchada nica micro lorea apretar cuea.";

        this._selected = false;
        this._loaded = false;
        this._dirty  = false;
    }

    public static create(id:string, path:string):Note
    {
        let note:Note = new Note();
        note._id   = id;
        note._folderPath = path;
        note._loaded=true;
        return note;
    }

    public static createFromSavedData(data:any, path:string):Note
    {
        let note:Note = new Note();
        note._id = data.id;
        note._title = data.title;
        note._text = data.text;
        note._folderPath = path;
        note._loaded=true;
        return note;
    }

    public static createUnloadedNote(path:string):Note
    {
        let note:Note = new Note();
        note._id = "";
        note._title = "Unloaded...";
        note._text = "Loading";
        note._folderPath = path;
        note._loaded = false;
        return note;
    }

    public setData(data:any):void
    {
        this._id     = data.id;
        this._title  = data.title;
        this._text   = data.text;
        this._loaded = true;
    }

    public setParent(notebook:Notebook):void
    {
        this._notebook = notebook;
    }

    public removeFromParent()
    {
        if(this._notebook != null)
        {
            this._notebook.removeNote(this); 
            this._notebook = null;
        }
    }

    public setDirty(dirty:boolean):void
    {
        this._dirty = dirty;
    }

    public setTrashed(trashed:boolean):void
    {
        this._trash = trashed;
    }

    public SetAsSelected():void
    {
        this._selected = true;
    }

    public SetAsUnselected():void
    {
        this._selected = false;
    }

    public GetDataObject():any
    {
        let dataObject = {
            id:this._id, 
            title:this._title, 
            text:this._text
        };

        return dataObject
    }

    public getSaveObject():any
    {
        let saveObject = {id:this._id, title:this._title, text:this._text};

        return saveObject
    }

    public  getFullPath():string
    {
        return Path.join(this.folderPath,this.id + ".json");
    }
}
export default class Action
{
    private _name:string;

    // Get/Set
    get name(): string 
    {
        return this._name;
    }

    // Member Functions
    constructor(name:string)
    {
        this._name = name;
    }

    public execute():void
    {
        // Overridable
    }
}
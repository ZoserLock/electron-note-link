// Core
import Presentation from "core/presentation";

// Presenter
import Presenter from "presenter/presenter";

import Platform from "core/platform";
import Core     from "core/core";

export default class MainPresentation implements Presentation
{
    private _presenters:Array<Presenter>;

    constructor(presenters:Array<Presenter>)
    {
        this._presenters = presenters;
    }

    public initialize(core:Core, platform:Platform):void
    {
        for(let a = 0; a < this._presenters.length; ++a)
        {
            this._presenters[a].initialize(this, core, platform);
        }
    }
}
import Platform from "core/platform";
import Core from "core/core";

export default interface Presentation
{
    initialize(core:Core, platform:Platform):void;

}
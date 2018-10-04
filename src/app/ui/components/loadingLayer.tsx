// Node Modules
import * as React from "react";

// Presenter
import MessageChannel from "presenter/messageChannel";

// UI
import UIComponent from "ui/components/generic/uiComponent";

export default class LoadingLayer extends UIComponent<any, any> 
{
    private _hideLoadingEvent: (event: any, data: any) => void;
    private _showLoadingEvent: (event: any, data: any) => void;

    constructor(props: any)
    {
        super(props);

        this.state=
        {
            shown:true
        }

        this._showLoadingEvent = (event:any,data:any)=>this.showLoading();
        this._hideLoadingEvent = (event:any,data:any)=>this.hideLoading();
    }

    public componentDidMount():void
    {
        this.registerMainListener(MessageChannel.showLoading,this._showLoadingEvent);
        this.registerMainListener(MessageChannel.hideLoading,this._hideLoadingEvent);
    }

    public componentWillUnmount():void
    {
        this.unregisterMainListener(MessageChannel.showLoading,this._showLoadingEvent);
        this.unregisterMainListener(MessageChannel.hideLoading,this._hideLoadingEvent);
    }

    private showLoading():void
    {
        this.setState({shown:true});
    }

    private hideLoading():void
    {
        this.setState({shown:false});
    }

    public render() 
    {
        if(this.state.shown)
        {
            return (
                <div className="ui-popup-layer">
                    <div className="ui-popup-modal ui-popup-loading">
                        <header> 
                            <h2>{"Loading"}</h2>
                            <span>{"Loading"}</span>
                        </header>
                        <article> 
                            <div className="ui-popup-modal-text">
                                {"Loading Notes"}
                            </div>
                        </article> 
                        <footer>       
                            <div className="ui-inline-spacer"/>
                        </footer>
                    </div>
                </div>
            );
        }
        return <div> </div>

    }

}
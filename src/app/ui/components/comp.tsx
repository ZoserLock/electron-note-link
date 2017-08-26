import * as React from 'react';

export default class Comp extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
        
        this.state = { name: this.props.defaultName };
    }

    public handleOnChange(event: any) : void 
    {
        this.setState({ name: event.target.value });
    }
    
    public handleOnClick(event: any) : void 
    {
        this.setState({ name: "Charles" + Math.random() });
    }

    public render() 
    {
        return (
            <div>
                <div>
                <input 
                    onChange={ e => this.handleOnChange(e) }
                />
                </div>
                <div>
                Hello {this.state.name}
                <button 
                        name = "Update"
                        onClick = { e => this.handleOnClick(e) }
                    >Update</button>
                </div>
            </div>
        );
    }
}
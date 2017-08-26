import * as React from 'react';

export default class Toolbar extends React.Component<any, any> 
{
    constructor(props: any)
    {
        super(props);
        
        this.state = { name: this.props.defaultName };
    }

    public render() 
    {
        return (
            <nav className="navbar navbar-expand">
                <a className="navbar-brand" href="#">Navbar</a>
                <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                    <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Link</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link disabled" href="#">Disabled</a>
                </li>
                </ul>
                <form className="form-inline my-2 my-lg-0">
                <input className="form-control mr-sm-2" type="text" placeholder="Search"/>
                <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                </form>
            </nav>
        );
    }

}
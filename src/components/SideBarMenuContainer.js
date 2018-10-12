import React from 'react';
import { SideBarMenu } from './SideBarMenu';

export class SideBarMenuContainer extends React.Component {

    constructor(props){
        super(props);

        this.state = {};
    }

    render(){
        return <SideBarMenu 
            query={this.props.query} 
            onChangeFilter={this.props.onChangeFilter} 
            placesExhibited={this.props.placesExhibited} 
            handleKeyPress={this.props.handleKeyPress} 
            listItem={this.props.listItem}
        />
    }
}
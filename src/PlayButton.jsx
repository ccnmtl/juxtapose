import React from 'react';

export default class PlayButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {play: false};
    }
    handleClick(event) {
        var newState = !this.state.play;
        // FIXME -- this probably isn't right. Setting state on
        // this component and its parent?
        this.setState({play: newState});
        if (this.props.callbackParent) {
            this.props.callbackParent(newState);
        }
    }
    render() {
        return <button className="jux-play"
                       onClick={this.handleClick.bind(this)}>
            {this.state.play ?
             String.fromCharCode(9208) :
             String.fromCharCode(9654) }
        </button>;
    }
}

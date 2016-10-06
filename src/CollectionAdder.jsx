import React from 'react';

export default class CollectionAdder extends React.Component {
    constructor() {
        super();
        this.state = {
            value: ''
        }
    }
    onSubmit(e) {
        e.preventDefault();
        this.props.onSubmit(this.state.value, this.props.timestamp);
    }
    onTextChange(e) {
        this.setState({value: e.target.value});
    }
    render() {
        let contents = '';
        if (this.props.showing) {
            contents = <div className="jux-add-item-popup jux-collection-popup">
                <button className="jux-popup-close"
                        onClick={this.props.onCloseClick}
                        title="Close">×</button>
            </div>;
        }
        return <div>{contents}</div>;
    }
}

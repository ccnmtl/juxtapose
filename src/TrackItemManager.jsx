import React from 'react';

export default class TrackItemManager extends React.Component {
    constructor() {
        super();
        this.state = {
            value: ''
        }
    }
    componentWillReceiveProps(newProps) {
        if (newProps.activeItem) {
            this.setState({value: newProps.activeItem.source});
        }
    }
    render() {
        var dom = null;
        let title = '';
        if (this.props.activeItem && this.props.activeItem.type === 'txt') {
            title = '🖹';
        } else if (this.props.activeItem && this.props.activeItem.type === 'img') {
            title = '📷';
        } else if (this.props.activeItem && this.props.activeItem.type === 'vid') {
            title = '📹';
        }
        if (this.props.activeItem) {
            return <div className="jux-track-item-manager">
                <button className="jux-remove-track-item"
                        title="Delete Item"
                        onClick={this.onDeleteClick.bind(this)}>Remove</button>
                <h2>{title}</h2>
                <form onSubmit={this.onSubmit.bind(this)}>
                    <textarea value={this.state.value}
                              onChange={this.onTextChange.bind(this)} />
                    <div>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>;
        } else {
            return <div></div>;
        }
    }
    onSubmit(e) {
        e.preventDefault();
        this.props.onSubmit(this.state.value, this.props.activeItem);
    }
    onTextChange(e) {
        this.setState({value: e.target.value});
    }
    onDeleteClick(e) {
        this.props.callbackParent();
    }
}

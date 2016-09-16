import React from 'react';

export default class TrackItemManager extends React.Component {
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
        let txt = '';
        if (this.props.activeItem) {
            txt = this.props.activeItem.source;
            return <div className="jux-track-item-manager">
                <button className="jux-remove-track-item"
                        title="Delete Item"
                        onClick={this.onDeleteClick.bind(this)}>Remove</button>
                <h2>{title}</h2>
                <textarea value={txt}
                          onChange={this.onChange} />
            </div>;
        } else {
            return <div className="jux-track-item-manager"></div>;
        }
    }
    onChange(e) {
        console.log(e);
        return e.persist();
    }
    onDeleteClick(e) {
        this.props.callbackParent();
    }
}

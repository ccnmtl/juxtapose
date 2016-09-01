import React from 'react';

export default class TrackItemManager extends React.Component {
    render() {
        console.log(this.props.activeItem);
        var dom = null;
        if (this.props.activeItem && this.props.activeItem.type === 'txt') {
            dom = <div className="jux-track-item-manager">
                <h2>Text Item</h2>
                <textarea value={this.props.activeItem.source}
                          onChange={this.onChange} />
            </div>;
        } else if (this.props.activeItem && this.props.activeItem.type === 'img') {
            dom = <div className="jux-track-item-manager">
                <h2>Image Item</h2>
                <textarea value={this.props.activeItem.source}
                          onChange={this.onChange} />
            </div>;
        } else if (this.props.activeItem && this.props.activeItem.type === 'vid') {
            dom = <div className="jux-track-item-manager">
                <h2>Video Item</h2>
                <textarea value={this.props.activeItem.source}
                          onChange={this.onChange} />
            </div>;
        }
        return <div>{dom}</div>;
    }
    onChange(e) {
        console.log(e);
        return e.persist();
    }
}

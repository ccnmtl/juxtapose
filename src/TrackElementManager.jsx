import React from 'react';
import {formatDuration} from './utils.js';

export default class TrackElementManager extends React.Component {
    constructor() {
        super();
        this.state = {
            value: '',
            duration: null
        }
    }
    componentWillReceiveProps(newProps) {
        if (newProps.activeItem) {
            const duration = newProps.activeItem.endTime -
                           newProps.activeItem.startTime;
            this.setState({
                value: newProps.activeItem.source,
                duration: duration
            });
        }
    }
    render() {
        const activeItem = this.props.activeItem;

        let title = '';
        if (activeItem && activeItem.type === 'txt') {
            title = '🖹';
        } else if (activeItem && activeItem.type === 'img') {
            title = '📷';
        } else if (activeItem && activeItem.type === 'vid') {
            title = '📹';
        }

        if (activeItem) {
            return <div className="jux-track-element-manager">
                <button className="jux-remove-track-element"
                        title="Delete Item"
                        onClick={this.onDeleteClick.bind(this)}>Remove</button>
                <h2>{title}</h2>
                <form onSubmit={this.onSubmit.bind(this)}>
                    <div className="form-group">
                        Duration: <strong>{formatDuration(this.state.duration)}</strong>
                        <span className="jux-duration-controls">
                            <button onClick={this.onDurationDecrease.bind(this)}>-</button>
                            <button onClick={this.onDurationIncrease.bind(this)}>+</button>
                        </span>
                    </div>
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
        this.props.onSubmit(this.props.activeItem, {
            value: this.state.value,
            duration: this.state.duration
        });
    }
    onTextChange(e) {
        this.setState({value: e.target.value});
    }
    onDeleteClick(e) {
        this.props.onDeleteClick();
    }
    onDurationIncrease(e) {
        e.preventDefault();
        this.setState({duration: this.state.duration + 1});
    }
    onDurationDecrease(e) {
        e.preventDefault();
        this.setState({duration: Math.max(this.state.duration - 1, 0)});
    }
}

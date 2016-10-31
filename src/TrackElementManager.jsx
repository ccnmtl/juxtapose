import React from 'react';
import {formatTimecode} from './utils.js';

export default class TrackElementManager extends React.Component {
    constructor() {
        super();
        this.state = {
            value: '',
            startTime: null,
            duration: null
        }
    }
    componentWillReceiveProps(newProps) {
        if (newProps.activeItem) {
            const duration = newProps.activeItem.endTime -
                           newProps.activeItem.startTime;
            this.setState({
                value: newProps.activeItem.source,
                startTime: newProps.activeItem.startTime,
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
            let displayTextarea = 'none';
            let maxLength = Infinity;
            if (activeItem.type === 'txt') {
                displayTextarea = 'block';
                maxLength = 140;
            }
            return <div className="jux-track-element-manager">
                <button className="jux-remove-track-element"
                        title="Delete Item"
                        onClick={this.onDeleteClick.bind(this)}>Remove</button>
                <h2>{title}</h2>
                <form onSubmit={this.onSubmit.bind(this)}>
                    <div className="form-group">
                        Start time: <strong>{formatTimecode(this.state.startTime)}</strong>
                        <span className="jux-time-controls">
                            <button onClick={this.onStartTimeDecrease.bind(this)}>-</button>
                            <button onClick={this.onStartTimeIncrease.bind(this)}>+</button>
                        </span>
                    </div>
                    <div className="form-group">
                        Duration: <strong>{formatTimecode(this.state.duration)}</strong>
                        <span className="jux-time-controls">
                            <button onClick={this.onDurationDecrease.bind(this)}>-</button>
                            <button onClick={this.onDurationIncrease.bind(this)}>+</button>
                        </span>
                    </div>
                    <textarea style={{'display': displayTextarea}}
                              value={this.state.value}
                              maxLength={maxLength}
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
            startTime: this.state.startTime,
            duration: this.state.duration
        });
    }
    onTextChange(e) {
        this.setState({value: e.target.value});
    }
    onDeleteClick(e) {
        this.props.onDeleteClick();
    }
    onStartTimeIncrease(e) {
        e.preventDefault();
        this.setState({startTime: this.state.startTime + 1});
    }
    onStartTimeDecrease(e) {
        e.preventDefault();
        this.setState({startTime: Math.max(this.state.startTime - 1, 0)});
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

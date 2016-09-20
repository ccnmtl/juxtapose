import React from 'react';

export default class TrackItemAdder extends React.Component {
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
            contents = <div className="jux-add-item-popup">
                <button className="jux-popup-close"
                        onClick={this.props.onCloseClick}
                        title="Close">×</button>
                <h2>Add item</h2>
                <form onSubmit={this.onSubmit.bind(this)}>
                    <textarea onChange={this.onTextChange.bind(this)}
                              value={this.state.value} />
                    <div>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>;
        }
        return <div>{contents}</div>;
    }
}

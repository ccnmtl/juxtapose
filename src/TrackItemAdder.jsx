import React from 'react';

export default class TrackItemAdder extends React.Component {
    onCloseClick() {
        this.props.callbackParent();
    }
    onSubmit(e) {
        e.preventDefault();
        console.log('TODO');
    }
    render() {
        let contents = '';
        if (this.props.showing) {
            contents = <div className="jux-add-item-popup">
                <button className="jux-popup-close"
                        onClick={this.onCloseClick.bind(this)}
                        title="Close">×</button>
                <h2>Add item</h2>
                <form onSubmit={this.onSubmit}>
                    <textarea></textarea>
                    <div>
                        <button
                            type="submit" >Submit</button>
                    </div>
                </form>
            </div>;
        }
        return <div>{contents}</div>;
    }
}

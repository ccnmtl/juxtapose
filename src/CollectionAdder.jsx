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
    renderList() {
        let list = [];
        for (let i = 0; i < this.props.collectionData.length; i++) {
            const el = this.props.collectionData[i];
            list = list.concat(
                <div key={i} className="jux-collection-item">
                    <h5>{el.title}</h5>
                    <img src={el.thumbnail} />
                </div>
            );
        }
        return list;
    }
    render() {
        let contents = '';
        if (this.props.showing) {
            contents = <div className="jux-add-item-popup jux-collection-popup">
                <button className="jux-popup-close"
                        onClick={this.props.onCloseClick}
                        title="Close">×</button>
                <h2>Collection</h2>
                <div className="jux-collection-scroll-area">
                    {this.renderList()}
                </div>
            </div>;
        }
        return <div>{contents}</div>;
    }
}

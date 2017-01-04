import React from 'react';
import {Modal} from 'react-bootstrap';

export default class TextAnnotationAdder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        }
    }
    onSubmit(e) {
        e.preventDefault();
        this.props.onSubmit(this.state.value, this.props.timestamp);
        this.setState({value: ''});
    }
    onTextChange(e) {
        this.setState({value: e.target.value});
    }
    close() {
        this.props.onCloseClick();
    }
    render() {
        return <Modal show={this.props.showing} onHide={this.close.bind(this)}>
    <Modal.Header closeButton>
        <Modal.Title>Add text annotation</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <form onSubmit={this.onSubmit.bind(this)}>
            <textarea className="form-control"
                      maxLength={140}
                      onChange={this.onTextChange.bind(this)}
                      value={this.state.value} />
            <div className="helptext">140 character limit</div>
            <br />
            <button className="btn btn-primary right" type="submit">
                Submit
            </button>
        </form>
        <div className="clearfix"></div>
    </Modal.Body>
        </Modal>;
    }
}

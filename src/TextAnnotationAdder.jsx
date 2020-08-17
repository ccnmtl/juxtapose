import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';

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
        return <Modal show={this.props.showing} autoFocus={false} onHide={this.close.bind(this)}>
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
    </Modal.Body>
        </Modal>;
    }
}

TextAnnotationAdder.propTypes = {
    onCloseClick: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    showing: PropTypes.bool.isRequired,
    timestamp: PropTypes.number
};

import React from 'react';
import {Modal} from 'react-bootstrap';

export default class DeleteElementModal extends React.Component {
    render() {
        return <Modal show={this.props.showing}
                      onHide={this.props.onCloseClick}>
    <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        Are you sure you want to delete this element?
    </Modal.Body>
    <Modal.Footer>
        <button type="button" className="btn btn-default"
                onClick={this.props.onCloseClick}>
            Cancel
        </button>
        <button type="button" className="btn btn-danger"
                onClick={this.props.onConfirmClick}>
            Delete Element
        </button>
    </Modal.Footer>
        </Modal>;
    }
}

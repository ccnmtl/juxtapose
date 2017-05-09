import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/lib/Modal';

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

DeleteElementModal.propTypes = {
    onCloseClick: PropTypes.func.isRequired,
    onConfirmClick: PropTypes.func.isRequired,
    showing: PropTypes.bool.isRequired
};

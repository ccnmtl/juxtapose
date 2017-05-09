import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/lib/Modal';

export default class OutOfBoundsModal extends React.Component {
    render() {
        return <Modal show={this.props.showing}
                      onHide={this.props.onCloseClick}>
    <Modal.Header closeButton>
        <Modal.Title>Warning</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        Using this selection as the primary video may cause some
        track elements to be removed.
    </Modal.Body>
    <Modal.Footer>
        <button type="button" className="btn btn-default"
                onClick={this.props.onCloseClick}>
            Cancel
        </button>
        <button type="button" className="btn btn-danger"
                onClick={this.props.onConfirmClick}>
            Update sequence
        </button>
    </Modal.Footer>
        </Modal>;
    }
}

OutOfBoundsModal.propTypes = {
    onCloseClick: PropTypes.func.isRequired,
    onConfirmClick: PropTypes.func.isRequired,
    showing: PropTypes.bool.isRequired
};

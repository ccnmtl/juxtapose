import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/lib/Modal';

export default class AddPrimaryMediaModal extends React.Component {
    render() {
        return <Modal show={this.props.showing}
                      onHide={this.props.onCloseClick}>
    <Modal.Header closeButton>
        <Modal.Title>Add Primary Media</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        You must add a primary video before adding secondary elements.
    </Modal.Body>
    <Modal.Footer>
        <button type="button" className="btn btn-primary"
                onClick={this.props.onCloseClick}>
            Close
        </button>
    </Modal.Footer>
        </Modal>;
    }
}

AddPrimaryMediaModal.propTypes = {
    onCloseClick: PropTypes.func.isRequired,
    showing: PropTypes.bool.isRequired
};

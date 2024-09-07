import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';

const SubscriptionItem = ({ subscription }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const toggleDetails = () => {
        setIsOpen(!isOpen);
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div className="subscription-item">
            <div className="subscription-header" onClick={toggleDetails}>
                <img src={subscription.logo} alt={${subscription.name} logo} className="subscription-logo" />
                <div>
                    <h3>{subscription.name}</h3>
                    <p>${subscription.cost}/month</p>
                </div>
                <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
            </div>
            {isOpen && (
                <div className="subscription-details">
                    <p><strong>Next Pay:</strong> {subscription.nextPay}</p>
                    <p><strong>Category:</strong> {subscription.category}</p>
                    <button onClick={openModal}>More Details</button>
                </div>
            )}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Subscription Details"
                className="modal"
                overlayClassName="modal-overlay"
            >
                <h2>{subscription.name}</h2>
                <p><strong>Start Date:</strong> {subscription.startDate}</p>
                <p><strong>End Date:</strong> {subscription.endDate}</p>
                <p><strong>Renewal Frequency:</strong> {subscription.renewalFrequency}</p>
                <p><strong>Cost:</strong> ${subscription.cost}</p>
                <p><strong>Payment Method:</strong> {subscription.paymentMethod}</p>
                <p><strong>Auto Renewal:</strong> {subscription.autoRenewal ? "Yes" : "No"}</p>
                <p><strong>Category:</strong> {subscription.category}</p>
                <button onClick={closeModal}>Close</button>
            </Modal>
        </div>
    );
};

export default SubscriptionItem;
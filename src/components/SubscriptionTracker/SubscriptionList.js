import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import './SubscriptionList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTv, faMusic, faHeart, faToolbox, faBook, faTasks, faChevronDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function SubscriptionList({ userId, updateTrigger, showAddSubscription, handleOpen, handleClose }) {
    const [subscriptions, setSubscriptions] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [dueSoonSubscriptions, setDueSoonSubscriptions] = useState([]); // New state for subscriptions due soon

    useEffect(() => {
        async function fetchSubscriptions() {
            try {
                const q = query(collection(db, "subscriptions"), where("userId", "==", userId));
                const querySnapshot = await getDocs(q);
                const subs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setSubscriptions(subs);
            } catch (e) {
                toast.error("Error fetching subscriptions: " + e.message);
            }
        }

        fetchSubscriptions();
    }, [userId, updateTrigger]);

    // Map category to icons
    const categoryIcons = {
        "Streaming": faTv,
        "Music & Audio": faMusic,
        "Health & Fitness": faHeart,
        "Software Tools": faToolbox,
        "Learning": faBook,
        "Productivity": faTasks,
    };

    // Map category to colors
    const categoryColors = {
        "Streaming": "#FF6B6B",
        "Music & Audio": "#4ECDC4",
        "Health & Fitness": "#FFD93B",
        "Software Tools": "#1A535C",
        "Learning": "#FF9F1C",
        "Productivity": "#2E86AB",
    };

    const openModal = (subscription) => {
        setSelectedSubscription(subscription);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedSubscription(null);
    };

    const handleDelete = async (subscriptionId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this subscription?");
        if (confirmDelete) {
            try {
                await deleteDoc(doc(db, "subscriptions", subscriptionId));
                setSubscriptions(subscriptions.filter(sub => sub.id !== subscriptionId));
                toast.success("Subscription deleted successfully!");
            } catch (e) {
                toast.error("Error deleting subscription: " + e.message);
            }
        }
    };

    const checkSubscriptionsDueSoon = () => {
        const now = new Date();
        const dueSoon = subscriptions.filter(sub => {
            const endDate = new Date(sub.endDate);
            const timeDifference = endDate - now;
            const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
            return daysDifference >= 0 && daysDifference <= 3;
        }).map(sub => {
            const endDate = new Date(sub.endDate);
            const timeDifference = endDate - now;
            const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
            return { ...sub, daysUntilDue: daysDifference }; // Add daysUntilDue to each subscription
        });
        console.log("dues membership ", dueSoon);
        setDueSoonSubscriptions(dueSoon);

    };

    // const sendNotifications = async () => {
    //     const dueSoonSubscriptions = checkSubscriptionsDueSoon();
    //     const receivedToken = localStorage.getItem("fcmToken");
    //     console.log("token local", receivedToken);

    //     if (dueSoonSubscriptions.length > 0) {
    //         console.log('Sending notifications for subscriptions due soon...');

    //         // Iterate over each subscription and send a notification
    //         for (const subscription of dueSoonSubscriptions) {
    //             const notificationMessage = {
    //                 notification: {
    //                     title: `Subscription Reminder: ${subscription.name}`,
    //                     body: `Your ${subscription.name} subscription is due soon on ${subscription.endDate}. Please make sure to renew!`
    //                 }
    //             };

    //             try {
    //                 const response = await fetch("http://localhost:8085/api/notification/send", {
    //                     method: 'POST',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                     },
    //                     body: JSON.stringify(notificationMessage, receivedToken),
    //                 });

    //                 if (response.ok) {
    //                     console.log(`Notification sent for ${subscription.name}`);
    //                 } else {
    //                     console.error(`Failed to send notification for ${subscription.name}`);
    //                 }
    //             } catch (error) {
    //                 console.error(`Error sending notification for ${subscription.name}:`, error);
    //             }
    //         }
    //     } else {
    //         console.log('No subscriptions due soon.');
    //     }
    // };


    useEffect(() => {
        // Check subscriptions and send notifications immediately when component mounts
        checkSubscriptionsDueSoon();

        // Set up the interval to run every minute
        const intervalId = setInterval(() => {
            checkSubscriptionsDueSoon();
        }, 10 * 1000); // 60 seconds in milliseconds

        // Clean up interval on unmount
        return () => clearInterval(intervalId);
    }, [subscriptions]); // Ensure effect runs when subscriptions change

    return (
        <div className="subscription-list">
            {
                dueSoonSubscriptions.map((due) => (
                    <h3 className="due"> Your "{due.name}" membership is due in {due.daysUntilDue} {due.daysUntilDue > 1 ? "days" : "day"} </h3>
                ))
            }

            <button onClick={() => handleOpen()}>Add Subscription</button>
            <h2>Your Subscriptions:</h2>
            {subscriptions.length > 0 ? (
                subscriptions.map((sub) => (
                    <div key={sub.id} className="subscription-card">
                        <div className="subscription-header">
                            <div
                                className="subscription-logo-placeholder"
                                style={{ backgroundColor: categoryColors[sub.category] || '#ccc' }}
                            >
                                <FontAwesomeIcon
                                    icon={categoryIcons[sub.category] || faTasks}
                                    className="subscription-icon"
                                />
                            </div>
                            <div className="subscription-details" onClick={() => openModal(sub)}>
                                <h3>{sub.name}</h3>
                                <p className="subscription-cost">${sub.cost}/month</p>
                                <p><strong>Next Pay:</strong> {sub.endDate}</p>
                                <p><strong>Category:</strong> {sub.category}</p>
                            </div>
                            <div className="subscription-actions">
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    className="delete-icon"
                                    onClick={() => handleDelete(sub.id)}
                                />
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className="toggle-arrow"
                                    onClick={() => openModal(sub)}
                                />
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>No subscriptions found.</p>
            )}

            {selectedSubscription && (
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Subscription Details"
                    className="subscription-modal"
                    overlayClassName="subscription-modal-overlay"
                >
                    <h2>{selectedSubscription.name}</h2>
                    <div
                        className="subscription-logo-placeholder"
                        style={{ backgroundColor: categoryColors[selectedSubscription.category] || '#ccc' }}
                    >
                        <FontAwesomeIcon
                            icon={categoryIcons[selectedSubscription.category] || faTasks}
                            className="subscription-icon"
                        />
                    </div>
                    <p><strong>Cost:</strong> ${selectedSubscription.cost}/month</p>
                    <p><strong>Next Payment Date:</strong> {selectedSubscription.endDate}</p>
                    <p><strong>Start Date:</strong> {selectedSubscription.startDate}</p>
                    <p><strong>Category:</strong> {selectedSubscription.category}</p>
                    <p><strong>Payment Method:</strong> {selectedSubscription.paymentMethod}</p>
                    <p><strong>Auto Renewal:</strong> {selectedSubscription.autoRenewal ? "Yes" : "No"}</p>
                    <button onClick={closeModal} className="close-modal-button">Close</button>
                </Modal>
            )}
        </div>
    );
}

export default SubscriptionList;

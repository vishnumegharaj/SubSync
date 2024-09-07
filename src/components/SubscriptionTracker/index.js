import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";

function SubscriptionForm({ userId, onSubscriptionAdded }) {
    const [name, setName] = useState("");
    const [expirationDate, setExpirationDate] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        if (name === "" || expirationDate === "") {
            toast.error("All fields are mandatory");
            return;
        }

        try {
            const docRef = await addDoc(collection(db, "subscriptions"), {
                name: name,
                expirationDate: expirationDate,
                userId: userId,
                createdAt: new Date(),
            });

            toast.success("Subscription added!");
            setName("");
            setExpirationDate("");
            onSubscriptionAdded();
        } catch (e) {
            toast.error("Error adding subscription: " + e.message);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="add-subscription">
            <h2>Add Subscription</h2>
            <div className="input-wrapper">
                <label>Subscription Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Netflix"
                    className="custom-input"
                />
            </div>
            <div className="input-wrapper">
                <label>Expiration Date</label>
                <input
                    type="date"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className="custom-input"
                />
            </div>
            <button type="submit">Add Subscription</button>
        </form>
    );
}

export default SubscriptionForm;


import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AddSubscription from "../components/SubscriptionTracker/AddSubscription";
import SubscriptionList from "../components/SubscriptionTracker/SubscriptionList";
import Header from "../components/Header";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { messaging } from "../firebase";
import { getToken} from "firebase/messaging";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";



const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [showAddSubscription, setShowAddSubscription] = useState(false);
  

  const handleOpen = () => setShowAddSubscription(true);
  const handleClose = () => setShowAddSubscription(false);

  useEffect(()=>{
    console.log("requesting permissions for notification");
    requestPermission();
  }, []);

  async function requestPermission() {
    Notification.requestPermission().then(async (permission) => {
        if (permission === "granted") {
            // generating token to recognize device
            const token = await getToken(messaging, { validKey: 'BF6WCJxP5ycH2zKIuo6WuLcTkxfkoZ7pkffRaEysHaEv3HVk' });

            if (token) {
                localStorage.setItem("fcmToken", token);
                console.log("token generated and saved", token);
            }
        } else {
            console.log('No permission');
        }
    });
}

  if (!user) {
    toast.error("User not logged in!");
    return null;
  }

  function handleSubscriptionAdded() {
    setUpdateTrigger(!updateTrigger); // Toggle to refetch the subscriptions
  }

  

  async function handleSendNotification() {
    // getUserSubscriptions();
    // console.log( "query", query);
    // const q = query(collection(db, "subscriptions"), where("userId", "==", user.uid));
    // const subscriptionsSnapshot = await getDocs(q);

    // subscriptionsSnapshot.forEach(doc => {
    //   const subscription = doc.data();
    //   const dueDate = new Date(subscription.endDate);

    //   // Calculate the difference in days
    //   const currentDate = new Date(); // Define currentDate
    //   const differenceInTime = dueDate.getTime() - currentDate.getTime();
    //   const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    //   console.log("subscription", subscription);
    //   console.log("duedate", dueDate)
    //   console.log("currentDate", currentDate);
    //   console.log("differenceInTime", differenceInTime );
    //   console.log("differenceInDays", differenceInDays);

    //   // Check if the due date is in 3 days or less
    //   if (differenceInDays <= 3 && differenceInDays > 0) {
    //     console.log("subscription", subscription);
    //     console.log("duedate", dueDate)
    //     console.log("currentDate", currentDate);
    //     console.log("differenceInTime", differenceInTime );
    //     console.log("differenceInDays", differenceInDays);
    //     sendNotifications(subscription);
    //   }
    // });
  }

  return (
    <div>
      <Header />
        <AddSubscription userId={user.uid} onSubscriptionAdded={handleSubscriptionAdded} showAddSubscription={showAddSubscription} handleOpen={handleOpen} handleClose={handleClose} />
        <SubscriptionList userId={user.uid} updateTrigger={updateTrigger} showAddSubscription={showAddSubscription} handleOpen={handleOpen} handleClose={handleClose} />
      
    </div>
  );
};

export default Dashboard;

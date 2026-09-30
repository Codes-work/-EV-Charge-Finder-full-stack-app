import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import TransactionHistory from "./TransactionHistory";
export default function Profile(props) {
    const { user, email, walletBalance} = useContext(AuthContext);
    const [showTransaction, setShowTransaction] = useState(false);
    function handleTransaction(){
        if (props.isLoggedIn){
            setShowTransaction(!showTransaction);
        }
        else{
            setShowTransaction(false);
        }
    }

    return (
        <div className="profile">
             <div className="profile-header">
                <p className="profile-eyebrow">Account</p>
                <h1>My Profile</h1>
            </div>

            <div className="profile-card">
                <p><strong>Name:</strong> {user ? user : "Guest"}</p>
                {email && <p><strong>Email:</strong> {email}</p>}
                <p><strong>Wallet Balance:</strong> ₹{Number(walletBalance).toFixed(2)}</p>
            </div>

            <div className="profile-actions">
                <button onClick={() => props.setActiveView("favorites")}>My Favorites</button>
                <button onClick={props.openWallet}>Wallet</button>
                <button onClick={handleTransaction}>{showTransaction ? "Hide Transaction History" : "Transaction History"}</button>
            </div>
            {showTransaction && 
            <section className="transaction-history-section">
                <TransactionHistory isLoggedIn={props.isLoggedIn}/>
            </section>
            }
            <div className="profile-content">
                <section className="profile-section">
                    <h3>Help & Support</h3>
                    <p>
                        Need help finding or using a charging station? Reach out to us at
                        support@chargefinder.app, or check common questions below.
                    </p>
                    <ul>
                        <li>How do I add money to my wallet? Go to Wallet → Add Money and complete payment via UPI, card, or net banking.</li>
                        <li>Why can't I see stations near me? Make sure location access is enabled for this site in your browser settings.</li>
                        <li>How do I remove a saved favorite? Open the station in your Favorites list and tap the favorite icon again.</li>
                    </ul>
                </section>

                <section>
                    <h3>About ChargeFinder</h3>
                    <p>
                        ChargeFinder helps EV drivers locate nearby charging stations and parking
                        spots in real time, compare pricing and availability, and pay directly
                        through an in-app wallet — all in one place. Built as a demonstration
                        project showcasing full-stack development with React, PHP, and MySQL.
                    </p>
                </section>
            </div>
        </div>
    );
}
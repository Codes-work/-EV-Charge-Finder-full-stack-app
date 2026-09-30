import { useState,useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
export default function StationCard({ station, favorites, addFavorite, removeFavorite, isLoggedIn, requestLogin}) {
  const [ShowCharge, setShowCharge] = useState(false);
  const [error, setError] = useState("");
  const [stage, setStage] = useState("estimating");
  const [kwh, setKwh] = useState("");
  const {updateWalletBalance} = useContext(AuthContext);
  const estimatedAmount =
  kwh !== "" &&
  !isNaN(Number(kwh)) &&
  Number(kwh) > 0
    ? Number(kwh) * Number(station.price_per_kwh)
    : 0;


  function fav(station){
    if(isLoggedIn){
      if(favorites.some((favorite) => favorite.id === station.id)){
      removeFavorite(station);
    }
    else{
       addFavorite(station);
    }
    }
    else{
      requestLogin();
    }
    
  }
  function handleCharge() {
  if (!isLoggedIn) {
    requestLogin();
    return;
  }

  setShowCharge(!ShowCharge);
}

  function handleConfirmPayment(id){
    async function fetchPayment(){
      try{
        setError("");
        setStage("processing");
        const response = await fetch(`http://localhost/EV-charge-finder/backend/api/pay_station.php`,{
        method:"POST",
        credentials:"include",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          "kwh_requested":kwh,
          "id":id,
        })
      });
      const data = await response.json();
      if(!response.ok){
        throw new Error(data.error || "unable to process payment");
      }
      setStage("success");
      updateWalletBalance(-data.amount);
      }
      catch (error){
        setError(error.message)
        setStage("error");
      }

    }
    fetchPayment();
  }

  function handleClosePayment(){
    setStage("estimating");
    setError("");
    setKwh("");
    setShowCharge(false);
  }
  return (
  <>
    <li className="station-card">
      <div className="station-card-header">
        <div className="station-info">
          <h3 className="station-name">{station.name}</h3>
          <p className="station-address">Address: {station.address}</p>
        </div>
        <span className={`station-status station-status-${station.status}`}>
          Status: {station.status}
        </span>
      </div>
       <div className="station-details">
        <div className="station-detail">
          <span className="detail-label">Price: </span>
          <span className="detail-value">
            ₹{station.price_per_kwh}/kWh
          </span>
        </div>
        <div className="station-detail">
        <span className="detail-label">Bays: </span>
        <span className="detail-value">
          {station.num_bays}
        </span>
        </div>
        <div className="station-detail">
        <span className="detail-label">Connector: </span>
        <span className="detail-value">
          {station.charge_type}
        </span>
        </div>
        <div className="station-detail">
        <span className="detail-label">Open hours: </span>
        <span className="detail-value">
          {station.hours}
        </span>
        </div>
        <div className="station-detail">
        <span className="detail-label">Type: </span>
        <span className="detail-value">
          {station.type}
        </span>
        </div>
      </div>
      <div className="station-card-footer">
        <span className="station-distance">
          {Number(station.distance).toFixed(2)} km
        </span>
        <div className="station-actions">
          <button className="payment-button btn-primary" onClick={handleCharge}>Charge</button>
          <a className="directions-button"
          href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          >
          Get Directions
          </a>
          <button className="favorite-button" onClick={()=>{ fav(station)} }>
            {favorites.some((favorite) => favorite.id === station.id)? "Remove Favorites":"Add Favorites"}
          </button>
       </div>
      </div>  
    </li>  
      
    {ShowCharge && (
    <div className="payment-overlay" onClick={handleClosePayment}>
      <div
        className="payment-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="payment-modal-header">
          <div>
            <p className="payment-eyebrow">Charging station</p>
            <h3>{station.name}</h3>
            <p>{station.address}</p>
          </div>

          <button
            className="payment-close-button"
            onClick={handleClosePayment}
            aria-label="Close payment"
          >
            ×
          </button>
        </div>


    {stage === "estimating" && (
      <div className="payment-content">

        <div className="payment-station-summary">
          <div>
            <span>Price</span>
            <strong>₹{station.price_per_kwh}/kWh</strong>
          </div>

          <div>
            <span>Connector</span>
            <strong>{station.charge_type}</strong>
          </div>
        </div>

        <div className="payment-field">
          <label htmlFor={`kwh-${station.id}`}>
            Energy required
          </label>

          <div className="payment-input-wrapper">
            <input
              type="number"
              step="0.01"
              min="1"
              id={`kwh-${station.id}`}
              value={kwh}
              onChange={(e) => setKwh(e.target.value)}
              placeholder="Enter kWh"
            />
            <span>kWh</span>
          </div>
        </div>

        <div className="payment-estimate">
          <span>Estimated cost</span>
          <strong>₹{estimatedAmount.toFixed(2)}</strong>
        </div>

        <button
          className="payment-primary-button"
          disabled={estimatedAmount <= 0}
          onClick={() => setStage("confirming")}
        >
          Review Payment
        </button>

      </div>
    )}

    {stage === "confirming" && (
      <div className="payment-content">

        <div className="payment-confirmation">
          <p className="payment-eyebrow">
            Confirm payment
          </p>
          <h2>₹{estimatedAmount.toFixed(2)}</h2>
          <p>
            You are about to purchase{" "}
            <strong>{kwh} kWh</strong>{" "}
            at {station.name}.
          </p>
        </div>

        <div className="payment-summary">
          <div>
            <span>Energy</span>
            <strong>{kwh} kWh</strong>
          </div>

          <div>
            <span>Price</span>
            <strong>₹{station.price_per_kwh}/kWh</strong>
          </div>

          <div>
            <span>Total</span>
            <strong>₹{estimatedAmount.toFixed(2)}</strong>
          </div>
        </div>

        <div className="payment-modal-actions">
          <button
            className="payment-secondary-button"
            onClick={() => setStage("estimating")}
          >
            Back
          </button>

          <button
            className="payment-primary-button"
            onClick={() => handleConfirmPayment(station.id)}
          >
            Confirm Payment
          </button>
        </div>
      </div>
    )}

    {stage === "processing" && (
      <div className="payment-state">

        <div className="payment-spinner"></div>

        <h3>Processing payment</h3>

        <p>
          Please wait while we process your payment.
        </p>
      </div>
    )}

    {stage === "success" && (
      <div className="payment-state payment-success">

        <div className="payment-state-icon">
          ✓
        </div>

        <h3>Payment successful</h3>

        <p>
          ₹{estimatedAmount.toFixed(2)} has been deducted
          from your wallet.
        </p>

        <button
          className="payment-primary-button"
          onClick={handleClosePayment}
        >
            Done
        </button>

      </div>
    )}

    {stage === "error" && (
      <div className="payment-state payment-error">

        <div className="payment-state-icon">
          !
        </div>

        <h3>Payment failed</h3>

        <p>{error}</p>

        <button
          className="payment-secondary-button"
          onClick={handleClosePayment}
        >
          Close
        </button>

      </div>
    )}

    </div>
  </div>
)}
</>       
    
);
}

import { useState } from "react";
export default function Filter(props){
    const [showFilters, setShowFilters] = useState(false);

    function handleStationType(type){
        props.onStationTypeChange(type);
    }
    function handleChargeType(type){
        props.onChargeTypeChange(type);
    }
    function handleAvailability(type){
        props.onAvailabilityChange(type);
    }

    return(
        <div className="filter-section">
            <button className="filter-toggle" onClick={()=>{setShowFilters(!showFilters)}}>Filter</button>
            {showFilters &&(
                <div className="filter-panel">
                    <div className="filter-group">
                        <p className="filter-label">Station type</p>
                        <div className="filter-options">
                        <button
                        className={props.stationType=== "All" ? "active" : ""} 
                        onClick={()=>{handleStationType("All")}}>All</button>
                        <button
                        className={props.stationType=== "parking" ? "active" : ""} 
                        onClick={()=>{handleStationType("parking")}}>Parking</button>
                        <button
                        className={props.stationType=== "ev_charging" ? "active" : ""} 
                        onClick={()=>{handleStationType("ev_charging")}}>EV charging</button>
                        </div>
                    </div>
                    <div className="filter-group">
                        <p>charge type</p>
                        <button
                        className={props.chargeType=== "All" ? "active" : ""} 
                        onClick={()=>{handleChargeType("All")}}>All</button>
                        <button
                        className={props.chargeType=== "CCS" ? "active" : ""} 
                        onClick={()=>{handleChargeType("CCS")}}>CCS</button>
                        <button
                        className={props.chargeType=== "Type 2" ? "active" : ""} 
                        onClick={()=>{handleChargeType("Type 2")}}>Type 2</button>
                    </div>
                    <div className="filter-group">
                        <p>Availability</p>
                        <button
                        className={props.availability=== "All" ? "active" : ""} 
                        onClick={()=>{handleAvailability("All")}}>All</button>
                        <button
                        className={props.availability=== "available" ? "active" : ""} 
                        onClick={()=>{handleAvailability("available")}}>Available</button>
                    </div>
                </div>

            )}
        </div>
    )
}
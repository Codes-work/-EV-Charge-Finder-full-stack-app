import { useState,useContext, useEffect, useRef} from "react";
import useNearbyStations from "./hooks/useNearbyStations";
import StationList from "./components/StationList";
import Filter from "./components/Filter";
import { AuthContext } from "./Context/AuthContext";
import { Login } from "./components/login";
import Registration from "./components/Registration";
import NavItem from "./components/NavItem";
import Profile from "./components/Profile";
import {Home, Heart, User} from "lucide-react";
import Wallet from "./components/Wallet";
export default function App(){
  const [stationType, setStationType] = useState("All");
  const [chargeType, setChargeType] = useState("All");
  const [availability, setAvailability] = useState("All");  
  const [showLogin, setShowLogin] = useState(false);
  const [showRegistered, setShowRegistered] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [activeView, setActiveView] = useState("home");
  const [showWallet, setShowWallet] = useState(false);
  const {isLoading,stations,error} = useNearbyStations();
  const {user,email,walletBalance, updateWalletBalance, logout, isLoggedIn} = useContext(AuthContext);
  const authSectionRef = useRef(null);
  const walletSectionRef = useRef(null);

  useEffect(()=>{
    const fetchFavorites = async ()=>{
      if(isLoggedIn){
        try{
            const response = await fetch("http://localhost/EV-charge-finder/backend/api/favorites.php",{
            method:"GET",
            credentials:"include",
            headers:{
            "Content-Type":"application/json"
           }
        });
         const data = await response.json();
        if(!response.ok){
          throw new Error(data.error);
        }
        setFavorites(data.favorites || []);
        }
        catch(error){
          console.error("Failed to fetch favorites:", error);
          setFavorites([]);
        }
      }
      else{
        setFavorites([]);
        
      }
    }
    fetchFavorites();
  },[isLoggedIn]);
    
  async function addFavorite(station) {
  try {
    const response = await fetch("http://localhost/EV-charge-finder/backend/api/favorites.php", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: station.id })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    setFavorites((prev)=>[...prev,station]);
  } catch (error) {
    console.error("Failed to add favorite:", error);
  }
  }

  async function removeFavorite(station){
    try{
      const response = await fetch(`http://localhost/EV-charge-finder/backend/api/favorites.php?id=${station.id}`,
        {
          method:"DELETE",
          credentials:"include",
          headers:{
            "Content-Type":"application/json"
          }});
      const data = await response.json();
      if(!response.ok) throw new Error(data.error);
      setFavorites(prev => prev.filter((prevStation)=>prevStation.id !== station.id));
    }
    catch(error){
      console.error("Failed to Remove favorite:", error);
    }
  }

  const filteredStation = stations.filter((station)=>{
            const matchType = stationType === 'All' || stationType === station.type;
            const matchCharge = chargeType === 'All' || chargeType === station.charge_type;
            const matchAvailable = availability === 'All' || availability === station.status;
            return(
                matchType&&
                matchCharge&&
                matchAvailable
            );
        });
  function handleShowLogin(){
    setShowLogin(!showLogin)
    setShowRegistered(false);
  }      
  function handleRegister(){
    setShowRegistered(!showRegistered);
    setShowLogin(false);
  }
  function requestLogin(){
    setShowLogin(true);
    authSectionRef.current?.scrollIntoView({behavior:"smooth"});
  }
  function openWallet() {
  setShowWallet(true);

  setTimeout(() => {
    walletSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 0);
  }

  const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 16) {
    return "Good afternoon";
  }

  return "Good evening";
};

  return(
    <div className="app">
      <header className="app-header">
      <div className="header-content">
        <h1 className="app-title">EV Charge Finder</h1>
        <p className="header-greeting">{getGreeting()}</p>
      </div>
    </header>
      {isLoggedIn ?(
      <div className="user-card">
      <div className="user-info">
        <span className="user-greeting">Welcome </span>
        <span className="user-name">{user}</span>
        <span className="user-walletBalance">Wallet Balance : ₹{walletBalance.toFixed(2)}</span>
        <button onClick={()=>setShowWallet(!showWallet)}>{showWallet?"hide wallet":"Wallet"}</button>
      </div>
      <div className="user-actions">
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </div>
      </div>
      ):(<div className="auth-section" ref={authSectionRef}>
        <div className="auth-actions">
          <button onClick={handleShowLogin}>{showLogin ? "Hide login" : "Login" }</button>
          <button onClick={handleRegister} >{showRegistered ? "Hide Register" : "Register" }</button>
        </div>
         <div className="auth-form-container">  
          {showLogin && <Login />}
          {showRegistered && <Registration />}
        </div>    
        </div>
        
      )}
      <section className="wallet-section" ref={walletSectionRef}>
        {showWallet && <Wallet />}
      </section>

        <nav className="app-nav">
          <NavItem
          icon={Home}
          label="Home"
          isActive={activeView === "home"}
          onClick={()=>setActiveView("home")} />

          <NavItem
          icon={Heart}
          label="favorites"
          isActive={activeView === "favorites"}
          onClick={()=>setActiveView("favorites")} />

          <NavItem
          icon={User}
          label="profile"
          isActive={activeView === "profile"}
          onClick={()=>setActiveView("profile")} />
        </nav>
        {error && <p>{error}</p>}
        {isLoading?(<p>Loading stations...</p>):
        (
        <main className="main-content">
        {activeView === "home" &&
        <section className="home-view"> 
         <section className="filter-section">
          <Filter stationType={stationType} chargeType={chargeType} availability={availability}
                onStationTypeChange={setStationType} onChargeTypeChange={setChargeType} 
                onAvailabilityChange={setAvailability}/>
         </section>
         <section className="stations-section">       
        <StationList stations={filteredStation} requestLogin={requestLogin}
                    favorites={favorites} 
                    addFavorite={addFavorite} removeFavorite={removeFavorite} 
                    isLoggedIn={isLoggedIn}/>
         </section>           
        </section>            
        }
        {activeView === "favorites" &&
        <section className="favorites-view">
          {!isLoggedIn ? (
            <div className="favorites-empty">
              <h2>Login to view favorites</h2>
              <p>You need to be logged in to view and manage your favorite stations.</p>
            </div>
          ) : favorites.length === 0 ? (
            <div className="favorites-empty">
              <h2>No favorite stations yet</h2>
              <p>
                You haven't added any stations to your favorites.
                Add a station from the Home page to see it here.
              </p>
              <button className="btn-primary" onClick={() => setActiveView("home")}>
                Find Stations
              </button>
            </div>
          ) : (
            <StationList
              requestLogin={requestLogin}
              stations={favorites}
              favorites={favorites}
              addFavorite={addFavorite}
              removeFavorite={removeFavorite}
              isLoggedIn={isLoggedIn}
            />
          )}
        </section>
        }
        {activeView === "profile" &&
        <section className="profile-view">
          <Profile isLoggedIn={isLoggedIn} setActiveView={setActiveView} showWallet={showWallet} setShowWallet={setShowWallet} openWallet={openWallet} />
        </section>  
        }  
        </main>
        )}
    </div>
  )
}
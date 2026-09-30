import { useState, useEffect } from "react";
export default function useNearbyStations(){
const [location, setLocation] = useState(null);
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(()=>{navigator.geolocation.getCurrentPosition(
    (position)=>{
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    (error)=>{
      setError("Please enable location access to find nearby EV charging stations."),
        setIsLoading(false)},
      
  );},[]);

  useEffect( ()=>{
    if(location !== null){
      setIsLoading(true);
        const fetchStation = async ()=>{
        try{
          const response = await fetch(`http://localhost/EV-charge-finder/backend/api/stations.php?user_lat=${location.latitude}&user_lng=${location.longitude}`);
          const data = await response.json();
          setStations(data);
        }
        catch(error){
          setError(error.message);
        }
        finally{
          setIsLoading(false);
        }  
        
      };
      fetchStation();
    }
  },[location])
  return{
    location,
    stations,
    isLoading,
    error
  }

}
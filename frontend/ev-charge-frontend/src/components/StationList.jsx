import StationCard from "./StationCard";
export default function StationList({stations, favorites, addFavorite, removeFavorite, isLoggedIn, requestLogin}){
        if(stations.length === 0){
            return <p>No stations found nearby.</p>;
        }
        return(
            <div className="station-list">
                {stations.map((station)=>(
                    <StationCard key={station.id} station={station}
                    favorites={favorites} 
                    addFavorite={addFavorite} removeFavorite={removeFavorite} 
                    isLoggedIn={isLoggedIn} 
                    requestLogin={requestLogin}/>
                ))}
            </div>
        )

}
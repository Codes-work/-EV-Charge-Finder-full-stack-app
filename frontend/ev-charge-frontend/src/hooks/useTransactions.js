import { useState,useEffect } from "react";
export default function useTransactions(isLoggedIn, page =1, limit=20, type=null, status=null){
    const[history, setHistory] = useState([]);
    const[isLoading, setIsLoading] = useState(true);
    const[error, setError] = useState("");
    const[pagination,setPagination] = useState(null);
    useEffect( ()=>{
        if(!isLoggedIn){
            setHistory([]);
            setIsLoading(false);
            setError("login to access transaction history");
            return;
        }
        const params =new URLSearchParams();
        params.append("page",page);
        params.append("limit",limit);
        if(type !== null) {
            params.append("type",type);
        }
        if(status !== null){
            params.append("status",status);
        }
        const fetchTransactions = async ()=>{
            setIsLoading(true);
        setError("");
        try{
            const response = await fetch(`http://localhost/EV-charge-finder/backend/api/get_transactions.php?${params.toString()}`,
                {credentials:"include"});
             if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }
            const data = await response.json();
            setHistory(data.transactions);
            setPagination(data.pagination);
        }catch(error){
            setError("failed to fetch history");
        }
        finally{
             setIsLoading(false);
        }
        }
        fetchTransactions();
    },[page, limit, isLoggedIn, type, status]);
    return{
        history,
        isLoading,
        error,
        pagination
    }
}
import useTransactions from "../hooks/useTransactions";
import { useState } from "react";
export default function TransactionHistory(props){
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({type:null, status:null});
    const [showFilters, setShowFilters] = useState(false);
    const {history, isLoading, error, pagination} = useTransactions(props.isLoggedIn, page, 20, filters.type, filters.status);

    const transactionList = history.map((transaction) => (
      <li
        key={transaction.transaction_id}
        className="transaction-card"
      >
        <div className="transaction-main">

          <div className="transaction-icon">
            {transaction.type === "payment" ? "−" : "+"}
          </div>

          <div className="transaction-info">

            <h4>
              {transaction.type === "payment"
                ? "Charging payment"
                : "Wallet top-up"}
            </h4>

            <p>
              {transaction.type === "payment"
                ? transaction.station_name
                : "Added money to wallet"}
            </p>

            <span className="transaction-date">
              {new Date(transaction.created_at).toLocaleString()}
            </span>

          </div>

        </div>

        <div className="transaction-right">

          <strong
            className={
              transaction.type === "topup"
                ? "transaction-amount transaction-credit"
                : "transaction-amount transaction-debit"
            }
          >
            {transaction.type === "topup" ? "+" : "-"}
            ₹{Number(transaction.amount).toFixed(2)}
          </strong>

          <span
            className={`transaction-status transaction-status-${transaction.status}`}
          >
            {transaction.status}
          </span>

        </div>
      </li>
    ));

    function handleTypeFilter(newType){
        setFilters(prev=>({...prev, type: newType === 'all' ? null : newType}));
        setPage(1);
    }
    function handleStatusFilter(newStatus){
        setFilters(prev=>({...prev, status: newStatus==='all' ? null : newStatus}));
        setPage(1);
    }
    return(
        <div>
            <div className="filter-section">
                 <button className="filter-toggle" onClick={()=>{setShowFilters(!showFilters)}}>Filter</button>
                 {showFilters &&(
                 <div className="filter-panel">
                    <div className="filter-group">
                        <p className="filter-label">Transaction type</p>
                        {
                            ['all','topup','payment'].map((t)=>(
                            <button className={filters.type===t || (t==='all' && !filters.type) ? "active" : ""}
                                onClick={()=>handleTypeFilter(t)}
                            >
                            {t}
                            </button>
                            ))
                        }
                    </div>
                    <div className="filter-group">
                        <p className="filter-label">Status type</p>    
                        {
                            ['all','success','failed','pending'].map((s)=>(
                                <button className={filters.status===s || (s==='all' && !filters.status) ? "active" : ""}
                                    onClick={()=>handleStatusFilter(s)}
                                >
                                {s}    
                                </button>
                            ))
                        }
                    </div>
                </div>
                )}
            </div>
            {isLoading ? <p>Loading...</p> : error ? <p>{error}</p> :<div className="transaction-history-list"> <ul>{transactionList}</ul> </div>}
            <button disabled={page === 1}
            onClick={()=>setPage(p=> p -1)}
            >
            Prev
            </button>
            <span>Page {page} of {pagination?.total_pages}</span>
            <button disabled={pagination && page === pagination.total_pages}
            onClick={()=>setPage(p=> p + 1)}>
            Next   
            </button>
        </div>
    )
}
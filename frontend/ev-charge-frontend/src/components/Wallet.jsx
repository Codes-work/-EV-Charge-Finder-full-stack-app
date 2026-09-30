import { useContext,useState } from "react";
import { AuthContext } from "../Context/AuthContext";
export default function Wallet(){
    const [error,setError] = useState("");
    const [success, setSuccess] = useState("")
    const {email, walletBalance,setWalletBalance, updateWalletBalance, isLoggedIn} = useContext(AuthContext);
    async function handleSubmit(formData){
        async function markOrderFailed(orderId){
            try{
                const response = await fetch(
                `http://localhost/EV-charge-finder/backend/api/mark_failed.php`,{
                    method:"POST",
                    credentials:"include",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        'razorpay_order_id':orderId
                    })}
                );
                const data = await response.json();
                setError(data.message);
            }
            catch(error){
                setError(error.message);
            }
            
        }
        if(!isLoggedIn){
            setError("login required");
        }
        else{
            setError("");
            setSuccess("");
            const amount = formData.get('money');
            try{
                const response = await fetch(
                    `http://localhost/EV-charge-finder/backend/api/create_order.php`,{
                        method:"POST",
                        credentials:"include",
                        headers:{
                            'Content-Type':'application/json'
                        },
                        body: JSON.stringify({
                            'amount':amount
                        })},
                );
                const data = await response.json();
                if(!response.ok){
                    throw new Error(data.error || "unable to add money");
                }
                const options = {
                    key: data.RAZORPAY_KEY,
                    amount: data.amount,
                    currency: "INR",
                    order_id: data.razorpay_order_id,
                    handler: async function(razor_data){
                        try{  
                            const response = await fetch(
                                `http://localhost/EV-charge-finder/backend/api/verify_payment.php`,{
                                    method:"POST",
                                    credentials:"include",
                                    headers:{
                                        "Content-Type":"application/json"
                                    },
                                    body:JSON.stringify({
                                        "razorpay_signature":razor_data.razorpay_signature,
                                        "razorpay_order_id":razor_data.razorpay_order_id,
                                        "razorpay_payment_id":razor_data.razorpay_payment_id
                                    })},
                            );
                            const data = await response.json();
                            if(!response.ok){
                                throw new Error(data.error || "verifiction failed");
                            }
                            setSuccess("amount credited to wallet");
                            updateWalletBalance(data.amount);   
                    }catch(error){
                        setError(error.message);
                    }},
                    prefill:{
                         email: email,
                    },
                    modal: {
                        ondismiss: function(){
                            markOrderFailed(data.razorpay_order_id);
                        }
                    }
                }
                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', function(response) {
                    markOrderFailed(response.error.metadata.order_id);
                });
                rzp.open();
            }
            catch(error ){
                setError(error.message);
            }
        }
    }
    return(
        <div className="wallet-card">
            <div className="wallet-actions">
            <form action={handleSubmit}>
                <input type="number" step="0.01" name="money" id="money" placeholder="amount"/>
                <button className="btn-primary" type="submit">Add Money</button>
            </form>
            {error &&<p>{error}</p>}
            {success && <p>{success}</p>}
            </div>
        </div>
    )
}
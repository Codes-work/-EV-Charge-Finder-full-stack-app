import { useContext,useState } from "react";
import { AuthContext } from "../Context/AuthContext";
export function Login(){
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const { login } = useContext(AuthContext);
    async function handleSubmit(formData){
        setIsLoading(true);
        setError("");
        setSuccess("");
        const email = formData.get('email');
        const password = formData.get('pass');
            try{
                const response = await fetch(
                `http://localhost/EV-charge-finder/backend/api/login.php`,
                {method:"POST",
                credentials:"include",   
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'email': email,
                    'password':password
                })},
                )
                const data = await response.json();
                if(!response.ok){
                    throw new Error(data.error || "login failed");
                }
                login(data.name, data.email, data.wallet_balance);
                setSuccess("Login successful");
                console.log("Login successful:", data);   
            }
            catch(error){
                 setError(error.message);
                console.error("login error",error);
            }
            finally{
                setIsLoading(false);
            } 
    }
    return(
        <div>
            <div className="form-header">
                <p className="form-eyebrow">Welcome back</p>
                <h2>Login</h2>
            </div>
            <form className="auth-form" action={handleSubmit}>
                <div className="form-field">
                    <label htmlFor="email">EMAIL :</label>
                    <input type="email" id="email" name="email" placeholder="name123@gmail.com"/>
                </div>
                <div className="form-field">    
                    <label htmlFor="pass">PASSWORD :</label>
                    <input type="password" id="pass" name="pass"/>
                </div>    
                <button className="primary-button btn-primary" type="submit" disabled={isLoading}>
                    {isLoading ? "Logging in...":"Login"}
                </button>    
            </form>
            {error &&<p>{error}</p>}
            {success && <p>{success}</p>}
        </div>
    )
}
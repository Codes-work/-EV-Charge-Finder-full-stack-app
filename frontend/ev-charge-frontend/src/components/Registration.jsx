import { useState } from "react";

export default function Registration(){
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    async function handleSubmit(formData){
        setError("");
        setIsLoading(true);
        setSuccess("");
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        try{
            const response = await fetch(
                `http://localhost/EV-charge-finder/backend/api/registration.php`,
                {
                    method:"POST",
                    credentials:"include",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({
                        'name':name,
                        'email':email,
                        'password':password,    
                    })
                });
            const data  = await response.json();
            if(!response.ok){
                throw new Error(data.error || 'Registration failed');
            }
            setSuccess("Registration success, Login to use pro features");
        }
        catch(error){
            setError(error.message);
        }
        finally{
            setIsLoading(false);
        }

    }

    return(
        <div>
            <form action={handleSubmit}>
                <label htmlFor="name">NAME :</label>
                    <input type="text" id="name" name="name" required placeholder="john doe"/>
                <label htmlFor="email">EMAIL :</label>
                    <input type="email" id="email" name="email" required placeholder="name123@gmail.com"/>
                <label htmlFor="pass">PASSWORD :</label>
                    <input type="password" required id="pass" name="password"/>
                <button className="primary-button btn-primary" type="submit" disabled={isLoading}>
                    {isLoading ? "Registering...":"Register"}
                </button>    
            </form>
            {error && <p>{error}</p>}
            {success && <p>{success}</p>}
        </div>
    )
}
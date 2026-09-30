import { useState, createContext } from "react";
export const AuthContext = createContext();
export function AuthProvider({children}){
    const [user,setUser] = useState("");
    const [email, setEmail] = useState("");
    const [walletBalance, setWalletBalance] = useState(0);
    const [isLoggedIn , setIsLoggedIn] = useState(false);

    function login(name, email, walletBalance){
        setUser(name);
        setEmail(email);
        setWalletBalance(Number(walletBalance));
        setIsLoggedIn(true);        
    }
    function logout(){
        setUser("");
        setEmail("");
        setWalletBalance(0);
        setIsLoggedIn(false);
    }
    function updateWalletBalance(delta){
        setWalletBalance(prev => Number(prev) + Number(delta));
    }
    return(
        <AuthContext.Provider value={{user, email,setWalletBalance, walletBalance, updateWalletBalance, login, isLoggedIn, logout}}>
            {children}
        </AuthContext.Provider>
    )
}
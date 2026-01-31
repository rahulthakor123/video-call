import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

const withAuth=(wrappedComponent)=>{
    const AuthComponent=(props)=>{
        const router =useNavigate();

        const isAuthenticated=()=>{
            if(localStorage.getItem("Token")){
                return true;

            }
            return false;
        }

        useEffect(()=>{
         if(!isAuthenticated()){
            router("/auth");
         }
        },[])

        return  AuthComponent;
    }
}

export default withAuth;
import axios from "axios"
import { useEffect, useState } from "react"

export const Balance = ({ value }) => {
    const [balance, setbalance]=useState(0)
    useEffect(()=>{
        axios.get("http://localhost:3000/api/v1/account/balance", {headers:{token:localStorage.getItem("token")}})
            .then(response=>setbalance(response.data.balance.toFixed(2)))
        
    },[])



    return <div className="flex p-5">
        <div className="font-bold text-lg">
            Your balance
        </div>
        <div className="font-semibold ml-4 text-lg">
            Rs {balance}
        </div>
    </div>
}
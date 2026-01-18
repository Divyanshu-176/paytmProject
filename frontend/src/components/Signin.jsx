import React from 'react'
import { Heading } from './Heading'
import SubHeading from './SubHeading'
import { Input } from './Input'
import { Button } from './Button'
import { Bottomwarning } from './Bottomwarning'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Signin = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")

  const navigate=useNavigate()


  const signin =async()=>{
    const response = await axios.post("http://localhost:3000/api/v1/user/signin", {firstName, lastName, userName, password})
    localStorage.setItem("token", response.data.token)
    if(response.status==200){
      navigate("/Dashboard")
    }
    
  }

  return (
    <div className='bg-gray-400 h-screen flex justify-center items-center '>
        <div className='bg-white p-10 rounded-2xl flex flex-col w-100 '>
            <Heading label={"Sign In"}/>
            <SubHeading label={"Enter your information to Login"}/>
            <Input label={"First Name"} placeholder={"John"} onChange={e=>{setFirstName(e.target.value)}}/>
            <Input label={"Last Name"} placeholder={"Doe"} onChange={e=>{setLastName(e.target.value)}}/>
            <Input label={"Email"} placeholder={"johndoe@gmail.com"} onChange={e=>{setUserName(e.target.value)}}/>
            <Input label={"Password"} placeholder={"*******"} onChange={e=>{setPassword(e.target.value)}}/>          
            <Button label={"Signin"} onClick={()=>signin()}/>          
            <Bottomwarning label={"Don't have an account?"} to={"/signup"} buttonText={"Signup"}/>
        </div>
    </div>
  )
}

export default Signin
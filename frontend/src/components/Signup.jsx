import React, { useState } from 'react'
import { Heading } from './Heading'
import SubHeading from './SubHeading'
import { Input } from './Input'
import { Button } from './Button'
import { Bottomwarning } from './Bottomwarning'

import axios from "axios"
import { useNavigate } from 'react-router-dom'

const Signup = () => {

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")

  const navigate=useNavigate()

  const signup =async ()=>{
    const response = await axios.post("http://localhost:3000/api/v1/user/signup", {firstName, lastName, userName, password})
    console.log(response)
    if(response.status==200){
      navigate("/signin ")
    }
  }

  return (
    <div className='bg-gray-400 h-screen flex justify-center items-center '>
        <div className='bg-white p-10 rounded-2xl flex flex-col w-100 '>
            <Heading label={"Sign Up"}/>
            <SubHeading label={"Enter your information to create an account"}/>
            <Input label={"First Name"} placeholder={"John"} onChange={e=>{setFirstName(e.target.value)}}/>
            <Input label={"Last Name"} placeholder={"Doe"} onChange={e=>{setLastName(e.target.value)}}/>
            <Input label={"Email"} placeholder={"johndoe@gmail.com"} onChange={e=>{setUserName(e.target.value)}}/>
            <Input label={"Password"} placeholder={"*******"} onChange={e=>{setPassword(e.target.value)}}/>          
            <Button label={"Signup"} onClick={()=>signup()}/>
            <Bottomwarning label={"Already have an account?"} to={"/signin"} buttonText={"Signin"}/>
        </div>
    </div>
  )
}

export default Signup
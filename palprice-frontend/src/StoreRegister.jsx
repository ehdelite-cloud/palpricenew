import { useState } from "react";

function StoreRegister(){

  const [name,setName] = useState("");
  const [city,setCity] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const register = () => {

    fetch("http://localhost:3000/stores/register",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        name,
        city,
        email,
        password
      })
    })
    .then(res=>res.json())
    .then(data=>{
      alert("Store Registered Successfully");
      console.log(data);
    });

  };

  return(

    <div style={{padding:"40px"}}>

      <h1>Store Register</h1>

      <input
        placeholder="Store Name"
        onChange={(e)=>setName(e.target.value)}
      />

      <br/><br/>

      <input
        placeholder="City"
        onChange={(e)=>setCity(e.target.value)}
      />

      <br/><br/>

      <input
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <br/><br/>

      <input
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <br/><br/>

      <button onClick={register}>
        Register Store
      </button>

    </div>

  );

}

export default StoreRegister;
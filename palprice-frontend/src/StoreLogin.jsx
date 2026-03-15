import { useState } from "react";

function StoreLogin(){

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const login = () => {

    fetch("http://localhost:3000/stores/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        email,
        password
      })
    })
    .then(res=>res.json())
    .then(data=>{
  alert("Login successful");

  localStorage.setItem("store", data.store);
localStorage.setItem("token", data.token);

  window.location.href = "/store/dashboard";
});

  };

  return(

    <div style={{padding:"40px"}}>

      <h1>Store Login</h1>

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

      <button onClick={login}>
        Login
      </button>

    </div>

  );

}

export default StoreLogin;
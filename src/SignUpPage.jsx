import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';

function SignUpPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/about');
    } catch (error) {
      console.error("Error creating account:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Create Account 🚀</h2>
        <div style={styles.inputGroup}>
          <label htmlFor="fullName">Full Name</label>
          <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={styles.input} />
        </div>
        <button type="submit" style={styles.button}>Sign Up</button>
        <div style={styles.signIn}>
          <p>Already have an account? <span onClick={() => navigate('/login')} style={styles.link}>Sign In</span></p>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container:{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",fontFamily:"Arial, sans-serif",backgroundColor:"#f4f4f4"},
  form:{padding:"40px",borderRadius:"8px",boxShadow:"0 4px 8px rgba(0, 0, 0, 0.1)",backgroundColor:"#ffffff",display:"flex",flexDirection:"column",width:"320px"},
  inputGroup:{marginBottom:"15px",display:"flex",flexDirection:"column",gap:"5px"},
  input:{padding:"10px",borderRadius:"4px",border:"1px solid #ccc",fontSize:"1em"},
  button:{padding:"12px 15px",border:"none",borderRadius:"4px",backgroundColor:"#007bff",color:"white",fontSize:"1em",cursor:"pointer",fontWeight:"bold"},
  signIn:{textAlign:"center",marginTop:"20px",fontSize:"0.9em",color:"#666"},
  link:{color:"#007bff",cursor:"pointer",textDecoration:"underline"}
};

export default SignUpPage;
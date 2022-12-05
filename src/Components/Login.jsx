import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../Config/Config'

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const navigate = useNavigate()


    const handleLogin = (e) => {
        e.preventDefault();
        // console.log(email, password)
        auth.signInWithEmailAndPassword(email, password).then((res) => {
            setSuccessMsg("Login successfully. You will now automatically get redirected to Home page")
            setEmail('')
            setPassword('')
            setErrorMsg('')
            setTimeout(() => {
                setSuccessMsg('');
                navigate('/')
            }, 2000);
        }).catch((error) => {
            setErrorMsg(error.message.slice(10))
            console.log(errorMsg);
        })
    }
    return (
        <div className='container'>
            <br />
            <br />
            <h1>Login</h1>
            <hr />
            {
                successMsg && <div className="success-msg">{successMsg}</div>
            }
            <form className='form-group' autoComplete='off' onSubmit={handleLogin}>
                <label htmlFor="email">Email</label>
                <input type="email" className='form-control' value={email} onChange={(e) => setEmail(e.target.value)} required />
                <br />
                <label htmlFor="password">Password</label>
                <input type="password" className='form-control' value={password} onChange={(e) => setPassword(e.target.value)} required />
                <br />
                <div className="btn-box">
                    <span>Don't have an account? Sign Up <Link to='/signup' className='link'>Here</Link></span>
                    <button type='submit' className="btn btn-success btn-md">LOGIN</button>
                </div>
            </form>
            {
                errorMsg && <div className="error-msg">{errorMsg}</div>
            }
        </div>
    )
}

export default Login
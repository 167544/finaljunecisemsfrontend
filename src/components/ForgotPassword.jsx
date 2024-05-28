import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Label, Input, FormGroup } from 'reactstrap';
import { Link } from 'react-router-dom';
import logos from '../Assets/logo.jpg';
import axios from 'axios';


function ForgotPassword(props) {
    const [emailId, setEmailId] = useState("");
    const [otp, setOtp] = useState("")
    const [hashValue, setHashValue] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [repeatPassword, setRepeatPassword] = useState("")

    const [pwdResetOtpSent, setPwdResetOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    const navigate = useNavigate();   
    
    const sendResetPasswordOtp = async (e) => {
        e.preventDefault();

        console.log("sending otp to ", emailId)
        let response = await axios.post("http://localhost:3004/user/reset-password-otp", { emailId });
        if (response.data?.result == "success") {
            setPwdResetOtpSent(true)
            setHashValue(response.data.hash)
        }
    }

    const verifyOtp = async (e) => {
        e.preventDefault();

        console.log("verifying otp ", otp)
        const body = {
            otp,
            hashValue,
            emailId
        }
        let response = await axios.post("http://localhost:3004/user/verify-otp", body);

        if (response.data?.result !== "success") {            
            setOtpVerified(false)
            alert("Invalid OTP")
            return
        }
        alert("OTP Successfully verified. Create a new password")
        setOtpVerified(true)
    }

    const resetPassword = async () => {
        if (newPassword != repeatPassword) {
            alert("New Password and Repeat Password should be same")
            return
        }

        const body = {
            newPassword,
            emailId
        }

        let response = await axios.post("http://localhost:3004/user/reset-password", body);

        if (response.data?.result !== "success") {    
            alert("Password reset failed. Try again")
            navigate('/reset-password');
            return
        }
        alert("Password successfully reset. Proceed to login")
        navigate('/');

    }

    return (
        <div style={{ display: 'flex', flexDirection:"column" ,justifyContent: 'space-between', alignItems: 'center', height: '100vh', width: '100vw', color: 'white', backgroundColor: '#0A6E7C',}}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100vw', color: 'white', backgroundColor: '#0A6E7C',padding:"12px",paddingLeft:"26px" }}>
                <img src={logos} alt="logo" width={"50px"} height={"50px"} />
                <h2 style={{color:"white",fontWeight:"bold"}}>CIS Employee Skill Portal</h2>
                <img src={logos} alt="logo" width={"50px"} height={"50px"} style={{visibility: 'hidden'}}/>            
            </div>

            <div style={{ border: '1px solid white', height: '500px', width: '450px', borderRadius: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='my-auto'>
    
                <div style={{ width: '80%', textAlign: 'center' }}>
                <h3>Reset Password</h3>

                <div className="input-group my-3 mt-5 mx-auto" >
                    <Input 
                        disabled={otpVerified}
                        type="text" 
                        class="form-control" 
                        placeholder="Enter Email" 
                        onChange={(e) => setEmailId(e.target.value)}
                    />
                    <Button disabled={otpVerified} onClick={sendResetPasswordOtp} style={{width: "105px"}} className="btn" type="button">Send OTP</Button>
                </div>

               <div className="input-group mx-auto">
                    <Input
                        disabled={!pwdResetOtpSent || otpVerified}
                        type="text"
                        class="form-control"
                        placeholder="Enter OTP"
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <Button  onClick={verifyOtp} disabled={!pwdResetOtpSent || otpVerified} style={{width: "105px"}} className="btn" type="button">Verify OTP</Button>
                </div>

                <FormGroup style={{marginTop: "4rem"}}>
                    <Form>
                        <Input
                            disabled={!pwdResetOtpSent || !otpVerified}
                            id="newPassword"
                            name="newPassword"
                            placeholder="Enter New Password"
                            type="password"
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </Form>
                    <Form>
                        <Input
                            disabled={!pwdResetOtpSent || !otpVerified}
                            className='mt-3'
                            id="repeatPassword"
                            name="repeatPassword"
                            placeholder="Repeat Password"
                            type="password"
                            onChange={(e) => setRepeatPassword(e.target.value)}
                        />
                    </Form>
                    <Button 
                        style={{ width: "150px" }} 
                        disabled={!pwdResetOtpSent || !otpVerified} 
                        onClick={resetPassword} 
                        className='mt-3 mb-4'>Reset Password</Button>
                </FormGroup>
                    





                </div>                
            </div>

            


        </div>
    )
}

export default ForgotPassword;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Label, Input, FormGroup } from 'reactstrap';
import axios from 'axios';
import logos from '../Assets/logo.jpg';

function Register(props) {
    const [userData, setUserData] = useState({    
        name: "",
        Username: "",
        password: "",
        repeatPassword: "",
        userRole: "" 
    });
    const [errors, setErrors] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));

    };

    const handleUserRoleChange = (e) => {
        const { value } = e.target;
        setIsAdmin(value === "Admin");
        handleChange(e);
    };

    const handleSendOtp = async () => {
        try {
            const response = await axios.post("http://localhost:3004/sendotp", {
                email: userData.Username, // Predefined email address where OTP will be sent
                employeeId: userData.name,
                isAdmin
            });
            console.log("OTP sent successfully:", response.data);
            alert(response?.data?.message)
            setOtpSent(true);
        } catch (error) {
            alert(`OTP sending failed ${ (error?.response?.data?.message) ? error?.response?.data?.message : "" }`)
            console.error("Error sending OTP:", error);
            // Handle error - Display error message to the user
        }
    };
    
    const handleVerifyOtp = async () => {
        try {
            const response = await axios.post("http://localhost:3004/sendotp/verifyotp", {
                email: userData.Username,
                otp: otp // Entered OTP
            });
            console.log("OTP verified successfully:", response.data);
            setOtpVerified(true);
        } catch (error) {
            console.error("Error verifying OTP:", error);
            // Handle error - Display error message to the user
            setOtpVerified(false); // Set otpVerified to false upon verification failure
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let validationErrors = validateForm(userData);
        if (Object.keys(validationErrors).length > 0 || (isAdmin && !otpVerified)) {
            setErrors(validationErrors);
            return;
        }

        try {
            if (!isAdmin) {
                   userData.userRole='User';
                 }
            // console.log(userData);
            let  response = await axios.post("http://localhost:3004/registerdata", userData);
            console.log("Registration successful:", response.data);
            alert(response.data.message)
            navigate("/"); // Redirect to login page
        } catch (error) {
            console.error("Error registering user:", error);

            if (error?.response?.data?.message) {
                alert(error?.response?.data?.message);
                return;
            }
       
            if (error.response) {
                const { status } = error.response;
                if (status === 400) {
                    alert("User already exists or passwords do not match");
                } else if (status === 500) {
                    alert("An error occurred during registration. Please try again later.");
                } else {
                    alert("An unexpected error occurred. Please try again later.");
                }
            } else {
                alert("An unexpected error occurred. Please try again later.");
            }
        }
         
        
    };

    const validateForm = (data) => {
        let errors = {};
        if (!data.name.trim()) {
            errors.name = "Name is required";
        }
        if (!data.Username.trim()) {
            errors.Username = "Username is required";
        }
        if (!data.password.trim()) {
            errors.password = "Password is required";
        }
        if (data.password !== data.repeatPassword) {
            errors.repeatPassword = "Passwords do not match";
        }
        return errors;
    };

    return (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: 'space-between', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0A6E7C', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: "12px", backgroundColor: '#0A6E7C' }}>
                <img src={logos} alt="logo" width={"50px"} height={"50px"} />
                <h2 style={{ color: "white", fontWeight: "bold", marginLeft: "10px" }}>CIS Employee Skill Portal</h2>
            </div>
            <div style={{ border: '1px solid white', width: '90%', maxWidth: '500px', padding: '20px', textAlign: 'center', borderRadius: '10px', margin: '20px auto' }}>
                <h1>Registration Form</h1>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="name">Employee ID</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Employee ID"
                            type="text"
                            value={userData.name}
                            onChange={handleChange}
                            invalid={errors.name ? true : false}
                        />
                        {errors.name && <span className="text-danger">{errors.name}</span>}
                    </FormGroup>
                    <FormGroup>
                        <Label for="username">Email</Label>
                        <Input
                            id="username"
                            name="Username"
                            placeholder="Username"
                            type="text"
                            value={userData.Username}
                            onChange={handleChange}
                            invalid={errors.Username ? true : false}
                        />
                        {errors.Username && <span className="text-danger">{errors.Username}</span>}
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            placeholder="Password"
                            type="password"
                            value={userData.password}
                            onChange={handleChange}
                            invalid={errors.password ? true : false}
                        />
                        {errors.password && <span className="text-danger">{errors.password}</span>}
                    </FormGroup>
                    <FormGroup>
                        <Label for="repeatPassword">Repeat Password</Label>
                        <Input
                            id="repeatPassword"
                            name="repeatPassword"
                            placeholder="Repeat Password"
                            type="password"
                            value={userData.repeatPassword}
                            onChange={handleChange}
                            invalid={errors.repeatPassword ? true : false}
                        />
                        {errors.repeatPassword && <span className="text-danger">{errors.repeatPassword}</span>}
                    </FormGroup>
                    <FormGroup tag="fieldset">
                        <legend>User Role</legend>
                        <FormGroup check>
                            <Label check>
                                <Input
                                    type="radio"
                                    name="userRole"
                                    value="User"
                                    checked={!isAdmin}
                                    onChange={handleUserRoleChange}
                                />
                                User
                            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Input
                                    type="radio"
                                    name="userRole"
                                    value="Admin"
                                    checked={isAdmin}
                                    onChange={handleUserRoleChange}
                                />
                                Admin
                            </Label>
                        </FormGroup>
                    </FormGroup>
                    {isAdmin && (
                        <div>
                            <FormGroup  style ={{display:"flex" ,flexDirection:"column",justifyContent:"center",alignItems:'center'}}>
                                <Label for="otp">OTP</Label>
                                <Input
                                    id="otp"
                                    name="otp"
                                    placeholder="Enter OTP"
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
									style={{width:"150px",textAlign:"center"}}
                                />
                            </FormGroup>
                            {!otpSent && (
                                <Button style={{width:"200px",textAlign:"center"}} type="button" onClick={handleSendOtp}>Send OTP</Button>
                            )}
                            {otpSent && !otpVerified && (
                                <div>
                                    <Button style={{width:"200px",textAlign:"center"}} type="button" onClick={handleVerifyOtp}>Verify OTP</Button>
                                </div>
                            )}
                            {otpVerified && (
                                <p>OTP verified successfully!</p>
                            )}
                        </div>
                    )}
                    <Button
                        className='mt-1'
                        style={{width:"200px",textAlign:"center"}}
                        type='submit' disabled={(isAdmin && !otpVerified) || ( userData.password != userData.repeatPassword )}>Register</Button>
                </Form>
            </div>
            
            
        </div>
    );
}

export default Register;
import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import swal from 'sweetalert';
import './Signin.scss';
import jwt from 'jwt-decode'
import axios from 'axios';

async function loginUser(credentials) {
    return fetch(`${process.env.REACT_APP_API_URL}account/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
}

export default function Signin() {
    useEffect(() => {
        document.title = "UFA - Login"
        document.body.style.margin = "0";
    }, []);

    const [phone, setPhone] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        const response = await loginUser({
            phone,
            password
        });
        if (response.success) {
            swal("Success", "Login Successful!", "success", {
                buttons: false,
                timer: 2000,
            })
                .then((value) => {
                    const token = response['token'];
                    const user = jwt(token);
                    localStorage.setItem('token', response['token']);
                    localStorage.setItem('currentId', user.id);
                    localStorage.setItem('currentRole', user.role);
                    switch (user.role) {
                        case "Admin":
                            window.location.href = "/";
                            break;
                        case "Manufacturer Department":
                            window.location.href = "/manufacturer/requestComponent";
                            break;
                        case "Order Department":
                            window.location.href = "/orders";
                            break;
                        case "Section Department":
                            axios.get(`${process.env.REACT_APP_API_URL}getSectionBySectionLeadId/${user.id}`)
                                .then((res) => {
                                    localStorage.setItem('currentSectionInfo', JSON.stringify(res.data));
                                    window.location.href = "/section/processDetail";
                                }).catch((err) => {
                                    //Trường hợp xảy ra lỗi
                                    console.log(err);
                                    alert("Xảy ra lỗi");
                                });
                            break;
                        default:
                            axios.get(`${process.env.REACT_APP_API_URL}getAccountById/` + user.id)
                            .then((res)=>{
                                localStorage.setItem('choiceUser', JSON.stringify(res.data))
                                window.location.href = "/dashboard/attendance";
                            })
                            break;
                    }
                });
        } else {
            swal("Failed", "User or Password is not correct", "error");
        }

    }

    return (
        <div style={{ margin: '0' }}>
            <script src='https://kit.fontawesome.com/a076d05399.js' crossOrigin='anonymous'></script>
            <div className="dashboard_login">
                <div className="title-container">
                    <div className="login-container">
                        <span className='login-form-title'>UFA Management of Gas Stove Production</span>
                        <form className="login-form" noValidate onSubmit={handleSubmit}>
                            <div className='logo-container'><img className='logo' src='http://uyenphat.com.vn/wp-content/themes/ufa/imgs/logo.png' alt='Bếp Gas Uyên Phát'></img></div>
                            <div className='wrap-input'>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="phone"
                                    name="phone"
                                    label="Phone Number"
                                    onChange={e => {
                                        setPhone(e.target.value);
                                    }}
                                />
                            </div>
                            <div className='wrap-password'>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth

                                    id="password"
                                    name="password"
                                    label="Password"
                                    type="password"
                                    onChange={e => {
                                        setPassword(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="container-login-form-btn">
                                <button className='login-form-btn' type='submit'>Login</button>
                            </div>
                            <div className='forgot-password'><button className='btn-forgot-pasword' type='button'>Forgotten password?</button></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
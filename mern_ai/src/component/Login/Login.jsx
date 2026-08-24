import React, { useContext } from 'react';
import styles from './Login.module.css';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import GoogleIcon from '@mui/icons-material/Google';

import { auth, provider } from '../../utils/firebase';
import { signInWithPopup } from 'firebase/auth';
import { AuthContext } from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';

const Login = () => {

    const { setLogin, setUserInfo } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {

            // Google login
            const result = await signInWithPopup(auth, provider);

            const user = result.user;

            console.log("Google user:", user);

            // Data to send to backend
            const userData = {
                name: user.displayName,
                email: user.email,
                photoUrl: user.photoURL
            };

            // Send user to MongoDB backend
            const response = await axios.post('/api/user', userData);

            console.log("Backend response:", response.data);

            // MongoDB user
            const mongoUser = response.data.user;

            // Save login state
            setLogin(true);
            setUserInfo(mongoUser);

            localStorage.setItem('isLogin', 'true');
            localStorage.setItem(
                'userInfo',
                JSON.stringify(mongoUser)
            );

            // Go to dashboard
            navigate('/dashboard');

        } catch (error) {

            console.error("Login error:", error);

            alert("Login failed. Check the browser console.");

        }
    };

    return (
        <div className={styles.Login}>

            <div className={styles.loginCard}>

                <div className={styles.loginCardTitle}>
                    <h1>Login</h1>
                    <VpnKeyIcon />
                </div>

                <div
                    className={styles.googleBtn}
                    onClick={handleLogin}
                >
                    <GoogleIcon
                        sx={{
                            fontSize: 20,
                            color: "red"
                        }}
                    />

                    Sign in with Google
                </div>

            </div>

        </div>
    );
};

export default Login;
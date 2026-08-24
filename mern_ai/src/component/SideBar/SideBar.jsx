import React, { useContext } from 'react';
import styles from './SideBar.module.css';

import ArticleIcon from '@mui/icons-material/Article';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthContext';

const SideBar = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const {
        setLogin,
        userInfo,
        setUserInfo
    } = useContext(AuthContext);

    const handleLogout = () => {
        localStorage.clear();
        setLogin(false);
        setUserInfo(null);
        navigate('/');
    };

    return (
        <aside className={styles.sideBar}>

            {/* Logo / Brand */}
            <div className={styles.brand}>

                <div className={styles.logoBox}>
                    <ArticleIcon />
                </div>

                <div className={styles.brandText}>
                    <div className={styles.brandName}>
                        SmartResume
                    </div>

                    <div className={styles.brandSubtitle}>
                        AI Resume Screener
                    </div>
                </div>

            </div>


            {/* Navigation */}
            <nav className={styles.navigation}>

                <div className={styles.sectionTitle}>
                    MAIN
                </div>

                <Link
                    to="/dashboard"
                    className={`${styles.sideBarOption} ${
                        location.pathname === '/dashboard'
                            ? styles.selectedOption
                            : ''
                    }`}
                >
                    <DashboardIcon />
                    <span>Dashboard</span>
                </Link>


                <Link
                    to="/history"
                    className={`${styles.sideBarOption} ${
                        location.pathname === '/history'
                            ? styles.selectedOption
                            : ''
                    }`}
                >
                    <ManageSearchIcon />
                    <span>History</span>
                </Link>


                <div className={styles.sectionTitle}>
                    MANAGEMENT
                </div>


                <Link
                    to="/admin"
                    className={`${styles.sideBarOption} ${
                        location.pathname === '/admin'
                            ? styles.selectedOption
                            : ''
                    }`}
                >
                    <AdminPanelSettingsIcon />
                    <span>Admin</span>
                </Link>

            </nav>


            {/* Bottom section */}
            <div className={styles.bottomSection}>

                {userInfo && (
                    <div className={styles.userCard}>

                        <div className={styles.avatar}>
                            {userInfo.name
                                ? userInfo.name.charAt(0).toUpperCase()
                                : 'U'}
                        </div>

                        <div className={styles.userDetails}>
                            <div className={styles.userName}>
                                {userInfo.name || 'User'}
                            </div>

                            <div className={styles.userEmail}>
                                {userInfo.email || 'Account'}
                            </div>
                        </div>

                    </div>
                )}


                <div
                    onClick={handleLogout}
                    className={styles.logoutButton}
                >
                    <LogoutIcon />
                    <span>Logout</span>
                </div>

            </div>

        </aside>
    );
};

export default SideBar;
import React, { useState, useEffect } from "react";
import { SideBarAdminData, SideBarData, SideBarManuData, SideBarOrderData, SideBarSectionAssembleData, SideBarSectionData } from "./SideBarData";
import "../SideBarComponents/SideBarCss.css";
import { Link } from "react-router-dom";
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { IconContext } from "react-icons";
import logo from '../../logo512.png'
import { Typography, typography } from '@material-ui/core'
import Toolbar from '@mui/material/Toolbar';
import { makeStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@mui/material/Avatar';
import axios from "axios";

const styles = makeStyles({
    bar: {
        paddingTop: "0.5rem",
        paddingBottom: "0.5rem",
        backgroundColor: "#fff",
        ['@media (max-width:780px)']: {
            flexDirection: "column"
        }
    },
    menuItem: {
        paddingLeft: "4%",
        textAlign: "left",
        fontFamily: "Muli",
        cursor: "pointer",
        flexGrow: 1,
        color: '#333C83',
        // "&:hover": {
        //     color: "#bd162c"
        // },
        ['@media (max-width:780px)']: {
            paddingBottom: "2rem"
        }
    },
    logo: {
        cursor: "pointer",
        width: "5%",
        ['@media (max-width:780px)']: {
            display: "inline-block"
        }
    },
    logoNavbar: {
        cursor: "pointer",
        width: "25%",
    }
})

function CustomSideBar() {
    const [sidebar, setSidebar] = useState(false);
    const classes = styles();
    const showSidebar = () => setSidebar(!sidebar);
    const handleLogout = () => {
        // localStorage.removeItem("token");
        localStorage.clear();
        setCurrentUser({ id: '', role: '' });
        // localStorage.removeItem("user");
        window.location.href = "/login";
    };

    const [currentUserBar, setCurrentUserBar] = useState(null);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}getAccountById/` + currentUser.id)
            .then((res) => {
                localStorage.setItem('currUser', JSON.stringify(res.data))
                setCurrentUserBar(res.data);
            });
    }, []);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}getRoles`)
            .then((res) => {
                setRoles(res.data);
            });
    }, [])

    var currentLink = "";

    function linkClick() {
        window.location.href = "http://localhost:3000/" + currentLink;
    }

    function handleOpenProfile() {
        console.log('Check : ' + currentUser.id + " " + currentUser.role)
        window.location.href = "http://localhost:3000/profile/";
    }

    const [currentUser, setCurrentUser] = useState({ id: localStorage.getItem('currentId'), role: localStorage.getItem('currentRole') });

    let role = [];

    switch (currentUser.role) {
        case 'Admin':
            role = SideBarAdminData.map(obj => ({ ...obj }));
            currentLink = "";
            break;
        case 'Order Department':
            role = SideBarOrderData.map(obj => ({ ...obj }));
            currentLink = "orders";
            break;
        case 'Section Department':
            let isAssemble = JSON.parse(localStorage['currentSectionInfo']).isAssemble
            if (isAssemble) {
                role = SideBarSectionAssembleData.map(obj => ({ ...obj }));
            }
            else {
                role = SideBarSectionData.map(obj => ({ ...obj }));
            } currentLink = "section/processDetail";
            break;
        case 'Manufacturer Department':
            role = SideBarManuData.map(obj => ({ ...obj }));
            currentLink = "manufacturer/requestComponent";
            break;
        default:
            break;
    }

    return (
        <>
            <IconContext.Provider value={{ color: '#bd162c' }}>
                <Toolbar position="sticky" color="rgba(0, 0, 0, 0.87)" className={classes.bar}>
                    <div className="navbar">
                        <Link to='#' className='menu-bars'>
                            <FaIcons.FaBars onClick={showSidebar} />
                        </Link>
                    </div>
                    <img src={logo} className={classes.logo} onClick={linkClick} />
                    <Typography variant="h5" className={classes.menuItem} onClick={linkClick}>
                        UFA Management of Gas Stove Production
                    </Typography>
                    {currentUserBar && <MenuItem onClick={handleOpenProfile}>
                        <Avatar src={"https://firebasestorage.googleapis.com/v0/b/gspspring2022.appspot.com/o/Images%2F" + currentUserBar.avatarUrl} sx={{ width: 36, height: 36 }} />
                        &emsp;
                        {currentUserBar.name}&emsp;<div style={{ fontSize: '26px' }}>|</div>&emsp;
                        {
                            roles.map((item) => {
                                if (item.roleId == currentUserBar.roleId) {
                                    return item.name
                                }
                            })
                        }
                    </MenuItem>}
                    <div style={{
                        fontSize: '26px',
                        textAlign: "left",
                        fontFamily: "Muli",
                        cursor: "pointer",
                    }}>|</div>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Toolbar>

                <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                    <ul className='nav-menu-items' onClick={showSidebar}>
                        <li className="navbar-toggle">
                            <Link to="#" className='menu-bars'>
                                <AiIcons.AiOutlineClose />
                            </Link>
                            <img src={logo} className={classes.logoNavbar} onClick={linkClick} />
                        </li>
                        <div className="side">
                            <ul className="sidebarList">
                                {role.map((val, key) => {
                                    return <li
                                        key={key}
                                        className={val.cName}
                                        id={window.location.pathname == val.path ? "active2" : ""}
                                        onClick={() => {
                                            window.location.pathname = val.path;
                                        }}
                                    >
                                        <Link
                                            id={window.location.pathname == val.path ? "active1" : ""}
                                            className="link" to={val.path}>{val.title}</Link>
                                    </li>
                                })}
                            </ul>
                        </div>
                    </ul>
                </nav>
            </IconContext.Provider>
        </>
    )
}

export default CustomSideBar
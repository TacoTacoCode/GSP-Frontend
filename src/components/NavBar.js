import React from 'react';
import logo from '../logo512.png'
import { Typography, typography } from '@material-ui/core'
import Toolbar from '@mui/material/Toolbar';
import { makeStyles } from '@material-ui/core/styles'

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
        "&:hover": {
            color: "#bd162c"
        },
        ['@media (max-width:780px)']: {
            paddingBottom: "2rem"
        }
    },
    logo: {
        width: "5%",
        ['@media (max-width:780px)']: {
            display: "inline-block"
        }
    }
})
function NavBar() {
    const classes = styles()
    return (
        <Toolbar position="sticky" color="rgba(0, 0, 0, 0.87)" className={classes.bar}>
            <img src={logo} className={classes.logo} />
            <Typography variant="h5" className={classes.menuItem}>
                UFA Company Managing System
            </Typography>
            {/* <Typography variant="h6" className={classes.menuItem}>
                Blog
            </Typography>
            <Typography variant="h6" className={classes.menuItem}>
                Careers
            </Typography>
            <Typography variant="h6" className={classes.menuItem}>
                Demos
            </Typography>
            <Typography variant="h6" className={classes.menuItem}>
                Contact Us
            </Typography> */}
            {/* <CustomBtn txt="Trial Our Product" /> */}
        </Toolbar>
    )
}

export default NavBar
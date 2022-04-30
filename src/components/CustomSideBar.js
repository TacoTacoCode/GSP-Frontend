import React from "react";
import { makeStyles } from '@material-ui/core/styles'

const StyledSideBar = makeStyles({
    side: {
        height: "calc(100vh - 87px)",
        width: "23%",
        // paddingTop: "1.5rem",
        backgroundColor: "#fff",
        // ['@media (max-width:780px)']: {
        //     flexDirection: "column"
        // }
    },
})
function CustomSideBar() {
    const classess = StyledSideBar()
    return (
        <div className={classess.side}>
            đây là side bar
        </div>
    )
}

export default CustomSideBar
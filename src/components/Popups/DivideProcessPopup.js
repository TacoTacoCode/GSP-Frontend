import React, { useState, useEffect } from "react";
import "../../styles/Popup.scss";
import CloseIcon from "@mui/icons-material/Close";
import {
    Button,
    MenuItem,
    TextField,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import axios from "axios";
import { ImportExcelButton } from "../button/ImportExcelButton";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

const CssTextField = styled(TextField)({
    "& label.Mui-focused": {
        color: "black",
    },
    "& .MuiInput-underline:after": {
        borderBottomColor: "#bd162c",
    },
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            borderColor: "black",
        },
        "&:hover fieldset": {
            borderColor: "#bd162c",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#bd162c",
        },
    },
});


function DivideProcessPopup(props) {
    const [numberOfProcess, setNumberOfProcess] = useState('');
    const navigate = useNavigate();

    const handleClick = () => {
        var orderDetail = JSON.parse(localStorage['orderDetail'])
        let count = 0
        var splitArray = numberOfProcess.split(',')
            .map((e) => {
                let tmp = parseInt(e.trim());
                count += tmp;
                return tmp;
            })
        if (count == orderDetail.neededAmount) {
            navigate('/divideProcessTabs', { state: splitArray })
        } else {
            swal("Warning", `Sum of numbers must be ${orderDetail.neededAmount}`, "info", {
                button: false,
                timer: 2000,
            });
        }
    }


    return props.trigger ? (
        <div className="componentpopup">
            <div className="popup-inner1">
                <div>
                    <button className="close-btn" onClick={() => props.setTrigger(false)}>
                        <CloseIcon style={{ color: "white" }} />
                    </button>
                </div>
                {props.children}
                <div className="popup-body">
                    <div className="formDivide">
                        <form className="form1">
                            <CssTextField className="divideField" label="Number of sub-process(s)"
                                onChange={(e) => setNumberOfProcess(e.target.value)} />
                            <ImportExcelButton type="button" className="btnDivide"
                                onClick={handleClick}>Submit</ImportExcelButton>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    ) : (
        ""
    );
}

export default DivideProcessPopup;

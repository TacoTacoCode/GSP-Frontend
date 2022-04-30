import React, { useState, useEffect } from "react";
import "../../styles/Popup.scss";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MaterialTable from "material-table";
import {
  Button,
  MenuItem,
  TextField,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import axios from "axios";
import swal from "sweetalert";

const states = [
  {
    value: true,
    label: "Assembling",
  },
  {
    value: false,
    label: "Non Assembling",
  },
];

const statuses = [
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Inactive",
    label: "Inactive",
  },
];

const CssTextField = styled(TextField)({
  width: "100%",
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

function SectionPopup(props) {
  const [listComponentActive, setComponentList] = useState([]);
  const [listAccountActive, setAccountList] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}getCompoNoSection`).then((res) => {
      setComponentList(res.data);
    });
    axios.get(`${process.env.REACT_APP_API_URL}getSecAccountsNoCompo`).then((res) => {
      setAccountList(res.data);
    });
  }, []);

  const [sectionLeaderId, setSectionLeaderId] = useState("");
  const [componentId, setComponentId] = useState("");
  const [isAssemble, setIsAssemble] = useState(true);
  const [status, setStatus] = useState("Active");


  const postData = (e) => {
    e.preventDefault();
    const jsonObj = {
      sectionLeadId: sectionLeaderId,
      componentId,
      workerAmount: 0,
      isAssemble,
      status
    };
    axios
      .post(`${process.env.REACT_APP_API_URL}addSection`, jsonObj)
      .then(res => {
        swal("Success", "New section added successfully", "success", {
          buttons: false,
          timer: 2000,
        })
        //reset data
        handleCancelClick();
      }).catch(err => {
        swal("Error", "New section adding failed", "error", {
          buttons: false,
          timer: 2000,
        })
        console.log(err)
      }).finally(() => {
        handleDelay();
      });
  };

  const handleCancelClick = () => {
    setSectionLeaderId("");
    setComponentId("");
    setIsAssemble(true);
    props.setTrigger(false);
  };

  var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();

  const handleDelay = () => {
    delay(function () { window.location.reload(); }, 1000);
  };

  return props.trigger ? (
    <div className="popup-inner">
      {/* <div className="container-close-btn">
          <button style={{background: 'none', border: 'none', outline: 'none'}} onClick={() => props.setTrigger(false)}>
            <CloseRoundedIcon style={{ color: "white", background: 'none' }} />
          </button>
        </div> */}
      {props.children}
      <div className="popup-body">
        <form>
          <div className="idname_section">
            <div className="textfield">
              <CssTextField
                label="Section Leader"
                select
                id="fullWidth"
                required
                value={sectionLeaderId}
                onChange={(e) => setSectionLeaderId(e.target.value)}
              >
                {listAccountActive.map((leader) => (
                  <MenuItem key={leader.accountId} value={leader.accountId}>
                    {leader.name}
                  </MenuItem>
                ))}
              </CssTextField>
            </div>
            <div className="textfield">
              <CssTextField
                label="State"
                select
                id="fullWidth"
                required
                value={isAssemble}
                onChange={(e) => setIsAssemble(e.target.value)}
              >
                {states.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </CssTextField>
            </div>
            <div className="textfield">
              <CssTextField
                label="Component"
                select
                id="fullWidth"
                disabled={isAssemble}
                required={!isAssemble}
                value={componentId}
                onChange={(e) => setComponentId(e.target.value)}
              >
                {listComponentActive.map((component) => (
                  <MenuItem key={component.componentId} value={component.componentId}>
                    {component.componentName}
                  </MenuItem>
                ))}
              </CssTextField>
            </div>
            <div className="textfield">
              <CssTextField
                label="Status"
                select
                id="fullWidth"
                required
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {statuses.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </CssTextField>
            </div>
          </div>

          <div className="idname">
            <div className="btngr">
              <Button
                type="submit"
                variant="contained"
                style={{
                  fontFamily: "Muli",
                  borderRadius: 10,
                  backgroundColor: "#bd162c",
                  marginRight: "0.5rem",
                }}
                size="large"
                onClick={postData}
              >
                Add Section
              </Button>
              <Button
                variant="contained"
                style={{
                  fontFamily: "Muli",
                  borderRadius: 10,
                  backgroundColor: "#bd162c",
                }}
                size="large"
                onClick={() => props.setTrigger(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  ) : (
    ""
  );
}

export default SectionPopup;

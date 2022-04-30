import React, { useState, useEffect } from "react";
import "../../styles/Popup.scss";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  InputAdornment,
  makeStyles,
  MenuItem,
  TextField,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import axios from "axios";
import swal from "sweetalert";

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

function MaterialPopup(props) {
  const [imageUrl, setMaterialImage] = useState("");
  const [materialID, setMaterialID] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [unit, setMaterialUnit] = useState("");
  const [amount, setMaterialAmount] = useState("");
  const [status, setStatus] = useState("Active");
  const [description, setDescription] = useState("");

  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");

  const handlePreviewAvatar = (e) => {
    console.log(e.target.value)
    const file = e.target.files[0];
    console.log(file);
    file.preview = URL.createObjectURL(file);
    setMaterialImage(file);
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  //đổi ảnh khác thì clean bộ nhớ
  useEffect(() => {
    //clean up function for avatarUrl
    return () => {
      return imageUrl && URL.revokeObjectURL(imageUrl.preview);
    };
  }, [imageUrl]);

  const postData = (e) => {
    e.preventDefault()
    const formData = new FormData();
    formData.append("materialId", materialID);
    formData.append("materialName", materialName);
    formData.append("amount", amount);
    formData.append("unit", unit);
    formData.append("status", status);
    formData.append("description", description == undefined ? '' : description);
    formData.append("file", file);
    axios.post(`${process.env.REACT_APP_API_URL}addMaterial`, formData)
      .then(res => {
        swal("Success", "Add new material successfully", "success", {
          buttons: false,
          timer: 1500,
        }).then(() => {
          handleCancelClick()
          window.location.href = "http://localhost:3000/dashboard/materials";
        })
      }).catch(err => {
        swal("Error", "Add new material failed", "error", {
          buttons: false,
          timer: 2000,
        })
      })
  }

  const resetData = () => {
    //reset data
    setMaterialImage("");
    setMaterialID("");
    setMaterialName("");
    setMaterialUnit("");
    setMaterialAmount("");
    setStatus("Active");
    setDescription("");
  };

  const handleCancelClick = () => {
    //reset data
    resetData();
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
    delay(function () { window.location.href = "http://localhost:3000/dashboard/materials"; }, 500);
  };

  return props.trigger ? (
    <div className="componentpopup">
      <div className="popup-inner">
        {props.children}
        <div className="popup-body" style={{ height: '72vh', overflow: 'auto', overflowY: 'hidden', overflowX: 'hidden' }}>
          <form>
            <div className="account-popup">
              <div style={{ fontFamily: 'Muli', fontSize: '18px' }} className='account-imagefield'>
                <div style={{ display: 'inline' }}>
                  <div style={{ display: 'inline-block' }}>
                    <p style={{ marginBottom: '5%' }}>Material Picture</p>
                    <input style={{ fontFamily: 'Muli', fontSize: '18px', width: '100%', display: 'inline-block' }} type="file" onChange={handlePreviewAvatar} />
                  </div>
                  <div style={{ display: 'inline-block', paddingLeft: '2%' }}>{imageUrl ? <img src={imageUrl.preview} alt='avatar' width="120px" /> : null}</div>
                </div>
              </div>
              <div className="material-row-1">
                <div className="material-id">
                  <CssTextField
                    label="Material ID"
                    id="fullWidth"
                    value={materialID}
                    required
                    onChange={(e) => setMaterialID(e.target.value)}
                  />
                </div>
                <div className="material-name">
                  <CssTextField
                    label="Material Name"
                    id="fullWidth"
                    value={materialName}
                    required
                    onChange={(e) => setMaterialName(e.target.value)}
                  />
                </div>
              </div>
              <div className="material-row-2">
                <div className="material-2nd">
                  <CssTextField
                    label="Unit"
                    id="fullWidth"
                    value={unit}
                    required
                    onChange={(e) => setMaterialUnit(e.target.value)}
                  />
                </div>
                <div className="material-2nd">
                  <CssTextField
                    label="Amount"
                    id="fullWidth"
                    value={amount}
                    required
                    type={"number"}
                    InputProps={{
                      inputProps: { min: 0, pattern: "[0-9]*" },
                    }}
                    onChange={(e) => setMaterialAmount(e.target.value)}
                  />
                </div>
                <div className="material-2nd">
                  <CssTextField
                    label="Status"
                    select
                    id="fullWidth"
                    value={status}
                    required
                    onChange={(e) => setStatus(e.target.value)}
                    helperText="Choose material status"
                  >
                    {statuses.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </CssTextField>
                </div>
              </div>
              <div className="material-description">
                <CssTextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
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
                  Add Material
                </Button>
                <Button
                  variant="contained"
                  style={{
                    fontFamily: "Muli",
                    borderRadius: 10,
                    backgroundColor: "#bd162c",
                  }}
                  size="large"
                  onClick={handleCancelClick}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}

export default MaterialPopup;

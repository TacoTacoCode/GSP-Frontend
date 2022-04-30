import React, { useEffect, useState } from "react";
import "../../styles/Popup.scss";
import CloseIcon from "@mui/icons-material/Close";
import MaterialTable from "material-table";
import { Button, MenuItem, TextField } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import axios from "axios";
import swal from "sweetalert";
import { ImportExcelButton } from "../button/ImportExcelButton";

function createData(materialId, materialName, amount) {
  return { materialId, materialName, amount };
}

const columns = [
  {
    title: "ID",
    field: "materialId",
    cellStyle: { fontFamily: "Muli" },
  },
  {
    title: "Material Name",
    field: "materialName",
    cellStyle: { fontFamily: "Muli" },
  },
  {
    title: "Amount",
    field: "amount",
    cellStyle: { fontFamily: "Muli"},
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

function ComponentPopup(props) {
  //set a map from combobox then add them to the table
  const [componentMaterial, setListComponentMaterial] = useState([]);
  const [listMaterialActive, setMaterialList] = useState([]);
  const [materialActive, setMaterialChoose] = useState('');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}getMaterials/Active`).then((res) => {
      setMaterialList(res.data);
    });
  }, []);

  // const [importExportDetail, setimportExportDetailTest] = useState(null);
  // const [productComponent, setProductComponent] = useState(null);
  // const [section, setSection] = useState(null);
  const [imageUrl, setComponentImage] = useState("");
  const [componentID, setComponentID] = useState("");
  const [componentName, setComponentName] = useState("");
  const [size, setComponentSize] = useState("");
  const [amount, setComponentAmount] = useState("");
  const [materialAmount, setMaterialComponentAmount] = useState(null);
  const [substance, setComponentSubstance] = useState("");
  const [weight, setComponentWeight] = useState("");
  const [color, setComponentColor] = useState("");
  const [status, setStatus] = useState("Active");
  const [description, setDescription] = useState("");

  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");

  const handlePreviewAvatar = (e) => {
    const file = e.target.files[0];
    file.preview = URL.createObjectURL(file);
    setComponentImage(file);
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

  const saveFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const createMD = () => {
    let compMate = []
    componentMaterial.map((item) =>
      compMate.push({
        "componentId": componentID,
        "materialId": item.materialId,
        "amount": +item.amount,
      })
    )
    return compMate;
  }
  const postData = (e) => {
    e.preventDefault();
    const jsonObj = createMD();
    const formData = new FormData();
    formData.append("componentId", componentID);
    formData.append("componentName", componentName);
    formData.append("amount", amount);
    formData.append("status", status);
    formData.append("substance", substance);
    formData.append("size", size);
    formData.append("color", color);
    formData.append("weight", weight);
    formData.append("description", description == undefined ? '' : description);
    if (jsonObj.length != 0) {
      formData.append("componentMaterial", JSON.stringify(jsonObj));
    }
    if (file != null) {
      formData.append("file", file);
    }
    axios
      .post(`${process.env.REACT_APP_API_URL}addComponent`, formData)
      .then(res => {
        swal("Success", "Add new component successfully", "success", {
          buttons: false,
          timer: 1500,
        }).then(() => {
          handleCancelClick();
          window.location.reload();
        })
        //reset data
      }).catch(err => {
        swal("Error", "Add new component failed", "error", {
          buttons: false,
          timer: 1500,
        })
        console.log(err)
      })
  };

  const handleCancelClick = () => {
    setComponentID("");
    setComponentName("");
    setComponentAmount("");
    setComponentImage("");
    setComponentSize("");
    setComponentSubstance("");
    setComponentWeight("");
    setComponentColor("");
    setStatus("Active");
    setDescription("");
    setComponentImage("");
    setFile("");
    setFileName("");

    setMaterialChoose(null);
    setListComponentMaterial([]);

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
    <div className="popup">
      <div className="popup-inner">
        {props.children}
        <div className="popup-body" style={{ height: '600px', overflow: 'auto', overflowY: 'scroll', overflowX: 'hidden' }}>
          <form id="Form1">
            <div className="account-popup">
              <div style={{ fontFamily: 'Muli', fontSize: '18px' }} className='account-imagefield'>
                <div style={{ display: 'inline' }}>
                  <div style={{ display: 'inline-block' }}>
                    <p style={{ marginBottom: '5%' }}>Component Picture</p>
                    <input style={{ fontFamily: 'Muli', fontSize: '18px', width: '100%', display: 'inline-block' }} type="file" onChange={handlePreviewAvatar} />
                  </div>
                  <div style={{ display: 'inline-block', paddingLeft: '2%' }}>{imageUrl ? <img src={imageUrl.preview} alt='avatar' width="120px" /> : null}</div>
                </div>
              </div>
              <div className="idname">
                <div className="idfield">
                  <CssTextField
                    label="Component ID"
                    id="fullWidth"
                    value={componentID}
                    required
                    onChange={(e) => setComponentID(e.target.value)}
                  />
                </div>
                <div className="namefield">
                  <CssTextField
                    label="Component Name"
                    id="fullWidth"
                    value={componentName}
                    required
                    onChange={(e) => setComponentName(e.target.value)}
                  />
                </div>
                <div className="idfield">
                  <CssTextField
                    label="Amount"
                    id="fullWidth"
                    required
                    value={amount}
                    type={"number"}
                    InputProps={{
                      inputProps: { min: 0, pattern: "[0-9]*" },
                    }}
                    onChange={(e) => setComponentAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="idname">
                <div className="txtfield">
                  <CssTextField
                    label="Size"
                    id="fullWidth"
                    required
                    onChange={(e) => setComponentSize(e.target.value)}
                  />
                </div>
                <div className="txtfield">
                  <CssTextField
                    label="Weight"
                    id="fullWidth"
                    required
                    value={weight}
                    type={"number"}
                    InputProps={{
                      inputProps: { min: 0, pattern: "[0-9]*" },
                    }}
                    onChange={(e) => setComponentWeight(e.target.value)}
                  />
                </div>
                <div className="txtfield">
                  <CssTextField
                    label="Color"
                    value={color}
                    onChange={(e) => setComponentColor(e.target.value)}
                  />
                </div>
                <div className="txtfield">
                  <CssTextField
                    label="Substance"
                    value={substance}
                    onChange={(e) => setComponentSubstance(e.target.value)}
                  />
                </div>
              </div>

              <div className="idname">
                <div className="txtfield">
                  <CssTextField
                    label="Status"
                    select
                    id="fullWidth"
                    required
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    helperText="Choose component status"
                  >
                    {statuses.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </CssTextField>
                </div>
                <div className="component-description">
                  <CssTextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <hr style={{ borderTop: "1px solid #EEE2DC", marginLeft: '3%', marginRight: '5%', marginTop: '5%' }} />
              <text style={{ fontFamily: 'Muli', fontSize: '18px', width: '100%', display: 'inline-block', paddingTop: '2%' }} className="content_choose">Component Detail</text>
              <div className="product-detail-choose">
                <div className="txtfield_Choose">
                  <CssTextField
                    label="Material"
                    select
                    id="fullWidth"
                    required
                    value={materialActive}
                    onChange={(e) => setMaterialChoose(e.target.value)}
                    helperText="Choose Active Material"
                  >
                    {listMaterialActive
                      .filter((item) => {
                        return !componentMaterial.find(
                          (item2) => item2.materialId === item.materialId
                        );
                      })
                      .map((material) => (
                        <MenuItem key={material.materialId} value={material}>
                          {material.materialName}
                        </MenuItem>
                      ))}
                  </CssTextField>
                </div>
                <div className="numfield_choose">
                  <CssTextField
                    label="Amount"
                    id="fullWidth"
                    required
                    value={materialAmount}
                    type={"number"}
                    InputProps={{
                      inputProps: { min: 0, pattern: "[0-9]*" },
                    }}
                    onChange={(e) => setMaterialComponentAmount(e.target.value)}
                  />
                </div>

                {materialActive != '' && materialAmount != 0 ? (
                  <ImportExcelButton
                    onClick={() => {
                      setListComponentMaterial((componentMaterial) => [
                        ...componentMaterial,
                        createData(
                          materialActive.materialId,
                          materialActive.materialName,
                          materialAmount
                        ),
                      ]);
                      setMaterialComponentAmount(0);
                      setMaterialChoose('');
                      //console log here won print the new state, you have to wait for new lifecycle
                      //console.log(componentMaterial);
                    }}
                  >
                    Add
                  </ImportExcelButton>
                ) : <ImportExcelButton
                  disable={true}
                  style={{ backgroundColor: '#909090' }}
                >
                  Add
                </ImportExcelButton>}

              </div>
              <div className="product-detail-table">
                <MaterialTable
                  data={componentMaterial}
                  columns={columns}
                  editable={{
                    onRowDelete: (oldData) =>
                      new Promise((resolve, reject) => {
                        setTimeout(() => {
                          const dataDelete = [...componentMaterial];
                          const index = oldData.tableData.id;
                          dataDelete.splice(index, 1);
                          setListComponentMaterial([...dataDelete]);
                          resolve();
                        }, 1);
                      }),
                  }}
                  options={{
                    toolbar: false,
                    maxBodyHeight: 200,
                    search: false,
                    paging: false,
                    showTitle: false,
                    addRowPosition: "first",
                    actionsColumnIndex: -1,
                    exportButton: false,
                    headerStyle: { backgroundColor: "#bd162c", color: "#fff" },
                  }}
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
                  Add Component
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  style={{
                    fontFamily: "Muli",
                    borderRadius: 10,
                    backgroundColor: "#bd162c",
                    marginRight: "0.5rem",
                  }}
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

export default ComponentPopup;

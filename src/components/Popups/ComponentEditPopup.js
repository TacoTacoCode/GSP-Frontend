import { Button, MenuItem, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import "../../styles/Popup.scss";
import { ImportExcelButton } from "../button/ImportExcelButton";

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

const columns = [
  {
    title: "ID",
    field: "materialId",
    cellStyle: { fontFamily: "Muli"},
  },
  {
    title: "Material Name",
    field: "materialName",
    cellStyle: { fontFamily: "Muli"},
    render: rowdata => rowdata.material.materialName,
  },
  {
    title: "Amount",
    field: "amount",
    cellStyle: { fontFamily: "Muli"},
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

function createData(materialId, materialName, amount) {
  return { materialId, 'material': { materialName }, amount };
}

function ComponentEditPopup(props) {
  const [imageUrl, setComponentImage] = useState(props.data.imageUrl);
  const [componentID, setComponentID] = useState(props.data.componentId);
  const [componentName, setComponentName] = useState(props.data.componentName);
  const [size, setComponentSize] = useState(props.data.size);
  const [amount, setComponentAmount] = useState(props.data.amount);
  const [substance, setComponentSubstance] = useState(props.data.substance);
  const [weight, setComponentWeight] = useState(props.data.weight);
  const [color, setComponentColor] = useState(props.data.color);
  const [status, setStatus] = useState(props.data.status);
  const [description, setDescription] = useState(props.data.description);

  const [componentMaterial, setListComponentMaterial] = useState({ ...props.compoMates });
  const [listMaterialActive, setMaterialList] = useState([]);
  const [materialActive, setMaterialChoose] = useState('');
  const [materialAmount, setMaterialComponentAmount] = useState(0);
  const [curImg, setCurImg] = useState('');

  useEffect(() => {
    setCurImg("https://firebasestorage.googleapis.com/v0/b/gspspring2022.appspot.com/o/Images%2F" + props.data.imageUrl);
  }, [props.data.imageUrl])

  useEffect(() => {
    setComponentImage(props.data.imageUrl);
  }, [props.data.imageUrl])

  useEffect(() => {
    setComponentID(props.data.componentId);
  }, [props.data.componentId])

  useEffect(() => {
    setComponentName(props.data.componentName);
  }, [props.data.componentName])

  useEffect(() => {
    setComponentSize(props.data.size);
  }, [props.data.size])

  useEffect(() => {
    setComponentAmount(props.data.amount);
  }, [props.data.amount])

  useEffect(() => {
    setComponentSubstance(props.data.substance);
  }, [props.data.substance])

  useEffect(() => {
    setComponentWeight(props.data.weight);
  }, [props.data.weight])

  useEffect(() => {
    setComponentColor(props.data.color);
  }, [props.data.color])

  useEffect(() => {
    setStatus(props.data.status);
  }, [props.data.status])

  useEffect(() => {
    setDescription(props.data.description);
  }, [props.data.description])

  useEffect(() => {
    setListComponentMaterial(props.compoMates);
  }, [props.compoMates])

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}getMaterials/Active`).then((res) => {
      setMaterialList(res.data);
    });
  }, []);

  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");

  const handlePreviewAvatar = (e) => {
    const file = e.target.files[0];
    file.preview = URL.createObjectURL(file);
    setCurImg(file.preview);
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
  const changeData = (e) => {
    e.preventDefault();
    const jsonObj = createMD();
    const formData = new FormData();
    formData.append("componentId", componentID);
    formData.append("imageUrl", imageUrl);
    formData.append("componentName", componentName);
    formData.append("amount", amount);
    formData.append("status", status);
    formData.append("substance", substance);
    formData.append("size", size);
    formData.append("color", color);
    formData.append("weight", weight);
    formData.append("description", description == undefined ? '' : description);
    formData.append("componentMaterial", JSON.stringify(jsonObj));
    formData.append("file", file);
    axios
      .put(`${process.env.REACT_APP_API_URL}updateComponent`, formData)
      .then((res) => {
        swal("Success", "Update component successfully", "success", {
          button: false,
          timer: 2000,
        });
      })
      .catch((err) => {
        swal("Error", "Update component failed", "error", {
          button: false,
          timer: 2000,
        })
      }).finally(() => {
        handleCancelClick();
        handleClose();
      })
  };

  var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();

  const handleClose = () => {
    delay(function () { window.location.reload(); }, 1000);
  };

  const handleCancelClick = () => {
    setComponentImage('');
    setComponentID(props.data.componentId);
    setComponentName(props.data.componentName);
    setComponentSize(props.data.size);
    setComponentAmount(props.data.amount);
    setComponentSubstance(props.data.substance);
    setComponentWeight(props.data.weight);
    setComponentColor(props.data.color);
    setStatus(props.data.status);
    setListComponentMaterial(props.compoMates);
    setDescription(props.data.description);
    props.setOpen(false);
    //handleClose();
  };

  return props.IsOpen ? (
    <div className="popup">
      <div className="popup-inner">
        {props.children}
        <div className="popup-body" style={{ height: '600px', overflow: 'auto', overflowY: 'scroll', overflowX: 'hidden' }}>
          <form>
            <div className="account-popup">
              <div style={{ fontFamily: 'Muli'}} className='account-imagefield'>
                <div style={{ display: 'inline' }}>
                  <div style={{ display: 'inline-block' }}>
                    <p style={{ marginBottom: '5%' }}>Component Picture</p>
                    <input style={{ fontFamily: 'Muli', width: '100%', display: 'inline-block' }} type="file" onChange={handlePreviewAvatar} />
                  </div>
                  <div style={{ display: 'inline-block', paddingLeft: '2%' }}><img src={curImg} alt='avatar' width="120px" /></div>
                </div>
              </div>
              <div className="idname">
                <div className="idfield">
                  <CssTextField
                    label="Component ID"
                    id="fullWidth"
                    value={componentID}
                    disabled
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
                    value={size}
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
                    value={description == undefined ? '' : description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <hr style={{ borderTop: "1px solid #EEE2DC", marginLeft: '3%', marginRight: '5%', marginTop: '5%' }} />
              <text style={{ fontFamily: 'Muli', fontSize: '18px', width: '100%', display: 'inline-block', paddingTop: '2%' }} className="content_choose">Component Detail</text>
              <div className="product-detail-choose">
                <div className="txtfield_Choose">
                  <CssTextField
                    label="Material Active List"
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
                    onRowUpdate: (newData, oldData) =>
                      new Promise((resolve, reject) => {
                        setTimeout(() => {
                          const dataUpdate = [...componentMaterial];
                          const index = oldData.tableData.id;
                          dataUpdate[index] = newData;
                          setListComponentMaterial([...dataUpdate]);
                          resolve();
                        }, 1)
                      }),
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
                  onClick={changeData}
                >
                  Edit Component
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
      </div >
    </div >
  ) : (
    ""
  );
}

export default ComponentEditPopup;
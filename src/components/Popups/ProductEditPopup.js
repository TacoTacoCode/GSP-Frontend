import React, { useState, useEffect, useRef, useReducer, useCallback } from "react";
import "../../styles/Popup.scss";
import CloseIcon from "@mui/icons-material/Close";
import MaterialTable from "material-table";
import { Button, InputAdornment, makeStyles, MenuItem, TextField, } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import axios from "axios";
import swal from "sweetalert";
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
    field: "componentId",
    cellStyle: { fontFamily: "Muli" },
  },
  {
    title: "Name",
    field: "componentName",
    cellStyle: { fontFamily: "Arial" },
    render: rowdata => rowdata.component.componentName,
  },
  {
    title: "Amount",
    field: "amount",
    cellStyle: { fontFamily: "Muli" },
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

function createData(componentId, componentName, amount) {
  return { componentId, 'component': { componentName }, amount };
}

function ProductEditPopup(props) {
  const [imageUrl, setProductImage] = useState(props.data.imageUrl);
  const [productID, setProductID] = useState(props.data.productId);
  const [productName, setProductName] = useState(props.data.productName);
  const [price, setProductPrice] = useState(props.data.price);
  const [amount, setProductAmount] = useState(props.data.amount);
  const [status, setStatus] = useState(props.data.status);
  const [description, setDescription] = useState(props.data.description);
  const [productComponent, setListProductComponent] = useState({ ...props.productCompos });
  const [listComponentActive, setComponentList] = useState([]);
  const [componentActive, setComponentChoose] = useState('');
  const [componentAmount, setComponentProductAmount] = useState(0);

  const [curImg, setCurImg] = useState('');

  useEffect(() => {
    setCurImg("https://firebasestorage.googleapis.com/v0/b/gspspring2022.appspot.com/o/Images%2F" + props.data.imageUrl);
  }, [props.data.imageUrl])

  useEffect(() => {
    setProductImage(props.data.imageUrl);
  }, [props.data.imageUrl])

  useEffect(() => {
    setProductID(props.data.productId);
  }, [props.data.productId])

  useEffect(() => {
    setProductName(props.data.productName);
  }, [props.data.productName])

  useEffect(() => {
    setProductPrice(props.data.price);
  }, [props.data.price])

  useEffect(() => {
    setProductAmount(props.data.amount);
  }, [props.data.amount])

  useEffect(() => {
    setStatus(props.data.status);
  }, [props.data.status])

  useEffect(() => {
    setDescription(props.data.description);
  }, [props.data.description])

  useEffect(() => {
    setListProductComponent(props.productCompos);
  }, [props.productCompos])

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}getComponents/Active`).then((res) => {
      setComponentList(res.data);
    });
  }, []);

  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");

  const handlePreviewAvatar = (e) => {
    console.log(e.target.value);
    const file = e.target.files[0];
    file.preview = URL.createObjectURL(file);
    setCurImg(file.preview);
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
    console.log(file.preview);
  };

  const createMD = () => {
    let compMate = []
    productComponent.map((item) =>
      compMate.push({
        "productId": productID,
        "componentId": item.componentId,
        "amount": +item.amount,
      })
    )
    return compMate;
  }
  const changeData = (e) => {
    e.preventDefault();
    const jsonObj = createMD();
    const formData = new FormData();
    formData.append("productId", productID);
    formData.append("productName", productName);
    formData.append("imageUrl", imageUrl);
    formData.append("amount", amount);
    formData.append("price", price);
    formData.append("status", status);
    formData.append("description", description == undefined ? '' : description);
    formData.append("productComponents", JSON.stringify(jsonObj));
    formData.append("file", file);
    axios
      .put(`${process.env.REACT_APP_API_URL}updateProduct`, formData)
      .then((res) => {
        swal("Success", "Update product successfully", "success", {
          button: false,
          timer: 2000,
        });
      })
      .catch((err) => {
        swal("Error", "Update product failed", "error", {
          button: false,
          timer: 2000,
        })
      }).finally(() => {
        handleCancelClick();
        delay(function () { window.location.reload(); }, 1000);
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
    props.setOpen(false);
    delay(function () { window.location.reload(); }, 1000);
  };

  const handleCancelClick = () => {
    setProductImage('');
    setProductID(props.data.productId);
    setProductName(props.data.productName);
    setProductPrice(props.data.price);
    setProductAmount(props.data.amount);
    setStatus(props.data.status);
    setListProductComponent(props.productCompos);
    setDescription(props.data.description);
    props.setOpen(false);
  };

  return props.IsOpen ? (
    <div className="popup">
      <div className="popup-inner">
        {props.children}
        <div className="popup-body" style={{ height: '85vh', overflow: 'auto', overflowY: 'scroll', overflowX: 'hidden' }}>
          <form>
            <div className="account-popup">
              <div style={{ fontFamily: 'Muli', fontSize: '18px' }} className='account-imagefield'>
                <div style={{ display: 'inline' }}>
                  <div style={{ display: 'inline-block' }}>
                    <p style={{ marginBottom: '5%' }}>Product Picture</p>
                    <input style={{ fontFamily: 'Muli', fontSize: '18px', width: '100%', display: 'inline-block' }} type="file" onChange={handlePreviewAvatar} />
                  </div>
                  <div style={{ display: 'inline-block', paddingLeft: '2%' }}><img src={curImg} alt='avatar' width="120px" /></div>
                </div>
              </div>
              <div className="idname">
                <div className="idfield">
                  <CssTextField
                    label="Product ID"
                    value={productID}
                    disabled
                    onChange={(e) => setProductID(e.target.value)}
                  />
                </div>
                <div className="namefield">
                  <CssTextField
                    label="Product Name"

                    value={productName}
                    required
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </div>
                <div className="idfield">
                  <CssTextField
                    label="Amount"

                    required
                    value={amount}
                    type={"number"}
                    InputProps={{
                      inputProps: { min: 0, pattern: "[0-9]*" },
                    }}
                    onChange={(e) => setProductAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="idname">
                <div className="txtfield">
                  <CssTextField
                    label="Price"

                    required
                    value={price}
                    type={"number"}
                    InputProps={{
                      inputProps: { min: 0, pattern: "[0-9]*" },
                      endAdornment: <InputAdornment position="end">x1000 VND</InputAdornment>
                    }}
                    onChange={(e) => setProductPrice(e.target.value)}
                  />
                </div>
                <div className="txtfield">
                  <CssTextField
                    label="Status"
                    select

                    required
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    helperText="Choose product status"
                  >
                    {statuses.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </CssTextField>
                </div>
                <div className="product-description">
                  <CssTextField
                    label="Description"
                    value={description == undefined ? '' : description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <hr style={{ borderTop: "1px solid #EEE2DC", marginLeft: '3%', marginRight: '5%', marginTop: '5%' }} />
              <text style={{ fontFamily: 'Muli', fontSize: '18px', width: '100%', display: 'inline-block', paddingTop: '2%' }} className="content_choose">Product Detail</text>
              <div className="product-detail-choose">
                <div className="txtfield_Choose">
                  <CssTextField
                    label="Component"
                    select

                    value={componentActive}
                    onChange={(e) => setComponentChoose(e.target.value)}
                    helperText="Choose Active Component"
                  >
                    {listComponentActive
                      .filter((item) => {
                        return !productComponent.find(
                          (item2) => item2.componentId === item.componentId
                        );
                      })
                      .map((component) => (
                        <MenuItem key={component.componentId} value={component}>
                          {component.componentName}
                        </MenuItem>
                      ))}
                  </CssTextField>
                </div>
                <div className="numfield_choose">
                  <CssTextField
                    label="Amount"

                    value={componentAmount}
                    type={"number"}
                    InputProps={{
                      inputProps: { min: 0, pattern: "[0-9]*" },
                    }}
                    onChange={(e) => setComponentProductAmount(e.target.value)}
                  />
                </div>
                {componentActive != null &&
                  componentAmount != null &&
                  componentAmount > 0 ? (
                  <ImportExcelButton
                    onClick={() => {
                      setListProductComponent((productComponent) => [
                        ...productComponent,
                        createData(
                          componentActive.componentId,
                          componentActive.componentName,
                          componentAmount
                        ),
                      ]);
                      setComponentProductAmount(0);
                      setComponentChoose('');
                    }}
                  >
                    Add
                  </ImportExcelButton>
                )
                  : <ImportExcelButton
                    style={{ backgroundColor: '#909090' }}
                    disable={true}
                  >
                    Add
                  </ImportExcelButton>}
              </div>
              <div className="product-detail-table">
                <MaterialTable
                  data={productComponent}
                  columns={columns}
                  editable={{
                    onRowUpdate: (newData, oldData) =>
                      new Promise((resolve, reject) => {
                        setTimeout(() => {
                          const dataUpdate = [...productComponent];
                          const index = oldData.tableData.id;
                          dataUpdate[index] = newData;
                          setListProductComponent([...dataUpdate]);
                          resolve();
                        }, 1)
                      }),
                    onRowDelete: (oldData) =>
                      new Promise((resolve, reject) => {
                        setTimeout(() => {
                          const dataDelete = [...productComponent];
                          const index = oldData.tableData.id;
                          dataDelete.splice(index, 1);
                          setListProductComponent([...dataDelete]);
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
                  Edit Product
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

export default ProductEditPopup;
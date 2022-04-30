import React, { useState, useEffect } from "react";
import "../../styles/Popup.scss";
import CloseIcon from "@mui/icons-material/Close";
import MaterialTable from "material-table";
import {
  Button,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import axios from "axios";
import swal from "sweetalert";
import { ImportExcelButton } from "../button/ImportExcelButton";

function createData(componentId, componentName, amount) {
  return { componentId, componentName, amount };
}

const columns = [
  {
    title: "ID",
    field: "componentId",
    cellStyle: { fontFamily: "Muli" },
  },
  {
    title: "Component Name",
    field: "componentName",
    cellStyle: { fontFamily: "Muli" },
  },
  {
    title: "Amount",
    field: "amount",
    cellStyle: { fontFamily: "Muli" },
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

function ProductPopup(props) {
  const [productComponent, setListProductComponent] = useState([]);
  const [listComponentActive, setComponentList] = useState([]);
  const [componentActive, setComponentChoice] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}getComponents/Active`).then((res) => {
      setComponentList(res.data);
    });
  }, []);

  const [imageUrl, setProductImage] = useState("");
  const [productID, setProductID] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setProductPrice] = useState("");
  const [amount, setProductAmount] = useState("");
  const [componentAmount, setComponentProductAmount] = useState(null);
  const [status, setStatus] = useState("Active");
  const [description, setDescription] = useState("");

  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");

  const handlePreviewAvatar = (e) => {
    console.log(e.target.value)
    const file = e.target.files[0];
    console.log(file);
    file.preview = URL.createObjectURL(file);
    setProductImage(file);
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

  const postData = (e) => {
    e.preventDefault();
    const jsonObj = createMD();
    const formData = new FormData();
    formData.append("productId", productID);
    formData.append("productName", productName);
    formData.append("amount", amount);
    formData.append("price", price);
    formData.append("status", status);
    formData.append("description", description);
    if (jsonObj.length != 0) {
      formData.append("productComponents", JSON.stringify(jsonObj));
    }
    if (file != null) {
      formData.append("file", file);
    }
    axios
      .post(`${process.env.REACT_APP_API_URL}addProduct`, formData)
      .then(res => {
        swal("Success", "Add new product successfully", "success", {
          buttons: false,
          timer: 2000,
        })
        //reset data
        handleCancelClick();
      }).catch(err => {
        swal("Error", "Add new product failed", "error", {
          buttons: false,
          timer: 2000,
        })
        console.log(err)
      }).finally(() => {
        handleDelay();
      });
  };

  const handleCancelClick = () => {
    setProductID("");
    setProductName("");
    setProductPrice("");
    setProductAmount("");
    setComponentProductAmount("");
    setStatus("Active");
    setDescription("");
    setProductImage("");
    setFile("");
    setFileName("");

    setListProductComponent([]);
    setComponentChoice(null);

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
        {/* <div>
          <button className="close-btn" onClick={() => props.setTrigger(false)}>
            <CloseIcon style={{ color: "white" }} />
          </button>
        </div> */}
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
                  <div style={{ display: 'inline-block', paddingLeft: '2%' }}>{imageUrl ? <img src={imageUrl.preview} alt='avatar' width="120px" /> : null}</div>
                </div>
              </div>
              <div className="idname">
                <div className="idfield">
                  <CssTextField
                    label="Product ID"
                    id="fullWidth"
                    value={productID}
                    required
                    onChange={(e) => setProductID(e.target.value)}
                  />
                </div>
                <div className="namefield">
                  <CssTextField
                    label="Product Name"
                    id="fullWidth"
                    value={productName}
                    required
                    onChange={(e) => setProductName(e.target.value)}
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
                    onChange={(e) => setProductAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="idname">
                <div className="txtfield">
                  <CssTextField
                    label="Price"
                    id="fullWidth"
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
                    id="fullWidth"
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <hr style={{ borderTop: "1px solid #EEE2DC", marginLeft: '3%', marginRight: '5%', marginTop: '5%' }} />
              <text style={{ fontFamily: 'Muli', fontSize: '18px', width: '100%', display: 'inline-block', paddingTop: '2%' }} className="content_choose">Product Detail : </text>
              <div className="product-detail-choose">
                <div className="txtfield_Choose">
                  <CssTextField
                    label="Component"
                    select
                    id="fullWidth"
                    value={componentActive}
                    onChange={(e) => setComponentChoice(e.target.value)}
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
                    id="fullWidth"
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
                      setComponentChoice(null);
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
                  Add Product
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
    </div>
  ) : (
    ""
  );
}

export default ProductPopup;

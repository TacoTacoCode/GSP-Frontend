import React, { useState, useEffect, useRef, useReducer, useCallback } from "react";
import "../../styles/Popup.scss";
import CloseIcon from "@mui/icons-material/Close";
import MaterialTable from "material-table";
import {
  Button,
  InputAdornment,
  makeStyles,
  MenuItem,
  TextField,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import axios from "axios";
import swal from "sweetalert";

const columns = [
  {
    title: "ID",
    field: "productId",
    cellStyle: { fontFamily: "Arial" },
  },
  {
    title: "Amount",
    field: "amount",
    cellStyle: { fontFamily: "Arial" },
  },
  {
    title: "Price (x1000 VND)",
    field: "price",
    cellStyle: { fontFamily: "Arial" },
  },
  {
    title: "Note",
    field: "description",
    cellStyle: { fontFamily: "Arial" },
  },
];

const isShortTerms = [
  {
    value: true,
    label: "True",
  },
  {
    value: false,
    label: "False",
  }
];

const statuses = [
  {
    value: 'inprogress',
    label: 'In Progress'
  },
  {
    value: 'finished',
    label: 'Finished'
  }
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

// function createData(productId, amount, price, description) {
//   return { productId, amount, price, description };
// }

function OrderEditPopup(props) {
  const [customerName, setAccountId] = useState(props.data.customerName);
  const [totalPrice, setTotalPrice] = useState(props.data.totalPrice);
  const [expiryDate, setExpiryDate] = useState(props.data.expiryDate);
  const [status, setStatus] = useState(props.data.status);
  const [note, setNote] = useState(props.data.note);
  const [isShorTerm, setIsShortTerm] = useState(props.data.isShorTerm);

  //combobox

  //select product
  const [orderProduct, setListOrderProduct] = useState({ ...props.orderProducts });

  useEffect(() => {
    setTotalPrice(props.data.totalPrice);
  }, [props.data.totalPrice])

  useEffect(() => {
    setExpiryDate(props.data.expiryDate);
  }, [props.data.expiryDate])

  useEffect(() => {
    setStatus(props.data.status);
  }, [props.data.status])

  useEffect(() => {
    setNote(props.data.note);
  }, [props.data.note])

  useEffect(() => {
    setIsShortTerm(props.data.isShorTerm);
  }, [props.data.isShorTerm])

  useEffect(() => {
    setListOrderProduct(props.orderProducts);
  }, [props.orderProducts])




  const changeData = (e) => {
    e.preventDefault();
    const jsonObj = {
      orderId: props.data.orderId,
      customerName,
      totalPrice,
      expiryDate: new Date(expiryDate).toDateString(),
      status,
      note,
      isShorTerm,
      // orderDetail: orderProduct
      //   ? orderProduct?.map((item) => {
      //     return {
      //       productId: item.productId,
      //       amount: item.amount,
      //       price: item.price,
      //       note: item.description
      //     };
      //   })
      //   : [],
    }
    axios
      .put(`${process.env.REACT_APP_API_URL}updateOrder`, jsonObj)
      .then((res) => {
        swal("Success", "Update order successfully", "success", {
          button: false,
          timer: 2000,
        });
      })
      .catch((err) => {
        swal("Error", "Update order failed", "error", {
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
  };

  const handleCancelClick = () => {
    setAccountId(props.data.customerName);
    setTotalPrice(props.data.totalPrice);
    setExpiryDate(props.data.expiryDate);
    setStatus(props.data.status);
    setNote(props.data.note);
    setIsShortTerm(props.isShorTerm);
    setListOrderProduct(props.orderProducts);
    handleClose();
  };

  return props.IsOpen ? (
    <div className="orderpopup">
      <div className="popup-inner">
        {/* <div>
          <button className="close-btn" onClick={() => props.setOpen(false)}>
            <CloseIcon style={{ color: "white" }} />
          </button>
        </div> */}
        {props.children}
        <div className="popup-body">
          <form>
            <div className="idname">
              <div className="datefield">
                <CssTextField
                  label="Customer"
                  value={props.data.customerName}
                  id="fullWidth"
                  disabled
                  onChange={(e) => setAccountId(e.target.value)}
                >

                </CssTextField>
              </div>
              <div className="idfield">
                <CssTextField
                  label="Total Price"
                  id="fullWidth"
                  value={totalPrice}
                  disabled
                  type={"number"}
                  InputProps={{
                    inputProps: { min: 0, pattern: "[0-9]*" },
                    endAdornment: <InputAdornment position="end">x1000 VND</InputAdornment>
                  }}
                  onChange={(e) => setTotalPrice(e.target.value)}
                />
              </div>
              <div className='datefield'>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Expiry Date"
                    inputFormat="dd/MM/yyyy"
                    minDate={new Date()}
                    required
                    selected={expiryDate}
                    onChange={(e) => {
                      setExpiryDate(e)
                    }}
                    value={expiryDate}
                    // onSelect={(e) => {
                    //   console.log(new Date(e).toISOString())
                    //   setExpiryDate(e)
                    // }}
                    renderInput={(params) => <CssTextField {...params} id="fullWidth" />}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="idname">
              <div className='txtfield'>
                <CssTextField
                  label="Short Term"
                  select
                  value={isShorTerm}
                  id="fullWidth" required
                  onChange={(e) => setIsShortTerm(e.target.value)}
                >
                  {isShortTerms.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </CssTextField>
              </div>
              <div className="namefield">
                <CssTextField
                  label="Note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>
            <br />
            <br />
            <hr style={{ borderTop: "1px solid #EEE2DC", marginLeft: '3%', marginRight: '5%', marginTop: '5%' }} />
            <text style={{ fontFamily: 'Muli', fontSize: '18px', width: '100%', display: 'inline-block', paddingTop: '2%', paddingBottom: '3%' }} className="content_choose">Order Detail : </text>

            <div className="product-detail-table">
              <MaterialTable
                data={orderProduct}
                columns={columns}
                options={{
                  toolbar: false,
                  maxBodyHeight: 200,
                  search: false,
                  paging: false,
                  addRowPosition: "first",
                  actionsColumnIndex: -1,
                  showTitle: false,
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
                Edit Order
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
          </form>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}

export default OrderEditPopup;
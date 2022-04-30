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

function OrderDetailEditPopup(props) {
  const [productId, setProductId] = useState({ ...props.dataDetail.productId });
  const [price, setPrice] = useState({ ...props.dataDetail.price });
  const [amount, setAmount] = useState({ ...props.dataDetail.amount });
  const [note, setNote] = useState({ ...props.dataDetail.note });

  //combobox
  const [productList, setProductList] = useState([{ ...props.customerActive }]);
  const [dataSet, setDataSet] = useState();

  useEffect(() => {
    setProductId(props.dataDetail.productId);
  }, [props.dataDetail.productId])

  useEffect(() => {
    setPrice(props.dataDetail.price);
  }, [props.dataDetail.price])

  useEffect(() => {
    setAmount(props.dataDetail.amount);
  }, [props.dataDetail.amount])

  useEffect(() => {
    setNote(props.dataDetail.note);
  }, [props.dataDetail.note])

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}getProducts/Active`).then((res) => {
      setProductList(res.data);
    });
    console.log(productList);
  }, []);

  const changeData = (e) => {
    e.preventDefault();
    const jsonObj = {
      orderDetailId: props.dataDetail.orderDetailId,
      orderId: props.dataDetail.orderId,
      productId,
      amount,
      price,
      note,
    }
    axios
      .put(`${process.env.REACT_APP_API_URL}updateOrderDetail`, jsonObj)
      .then((res) => {
        swal("Success", "Update order detail successfully", "success", {
          button: false,
          timer: 2000,
        });
      })
      .catch((err) => {
        swal("Error", "Update order detail failed", "error", {
          button: false,
          timer: 2000,
        })
      }).finally(() => {
        handleCancelClick();
        window.location.reload();
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
    props.setOpenDetail(false);
    delay(function () { }, 1000);
  };

  const handleCancelClick = () => {
    setProductId(props.dataDetail.productId);
    setAmount(props.dataDetail.amount);
    setPrice(props.dataDetail.price)
    setNote(props.dataDetail.note);
    setDataSet(null);

    handleClose();
  };

  return props.IsOpenDetail ? (
    <div className="orderpopup">
      <div className="popup-inner">
        {/* <div>
          <button className="close-btn" onClick={() => props.setOpenDetail(false)}>
            <CloseIcon style={{ color: "white" }} />
          </button>
        </div> */}
        {props.children}
        <div className="popup-body" style={{ height: '30vh', overflow: 'auto', overflowY: 'hidden' }}>
          <form>
            <div className="idname">
              <div className="datefield">
                <CssTextField
                  label="Customer"
                  select
                  id="fullWidth"
                  value={productId}
                  required
                  disabled
                  onChange={(e) => setProductId(e.target.value)}
                >
                  {productList.map((option) => (
                    <MenuItem key={option.productId} value={option.productId}>
                      {option.productName}
                    </MenuItem>
                  ))}
                </CssTextField>
              </div>
              <div className='idfield'>
                <CssTextField
                  label="Amount"
                  id="fullWidth"
                  value={amount}
                  required
                  type={"number"}
                  InputProps={{
                    inputProps: { min: 0, pattern: "[0-9]*" },
                  }}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className='idfield'>
                <CssTextField
                  label="Price"
                  id="fullWidth"
                  value={price}
                  required
                  type={"number"}
                  InputProps={{
                    inputProps: { min: 0, pattern: "[0-9]*" },
                    endAdornment: <InputAdornment position="end">x1000 VND</InputAdornment>
                  }}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="txtfield">
                <CssTextField
                  label="Note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>
            <br />
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

export default OrderDetailEditPopup;
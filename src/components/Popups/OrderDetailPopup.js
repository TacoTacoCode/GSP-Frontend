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

function createData(productId, productName, amount, price, description) {
  return { productId, productName, amount, price, description };
}

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

function OrderDetailPopup(props) {
  const [productId, setProductId] = useState("");
  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");

  const [listProductActive, setListProductActive] = useState([]);
  const [productList, setProductList] = useState([]);
  const [productActive, setProductChoose] = useState(null);
  const [orderProductList, setOrderProductList] = useState([]);

  const [checkList, setCheckList] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}getProducts/Active`).then((res) => {
      setProductList(res.data);
    });
  }, []);

  useEffect(() => {
    const getAllOrderDetail = `${process.env.REACT_APP_API_URL}getOrderDetailsOf/ord/` + props.orderId
    //Gọi API bằng axios
    axios.get(getAllOrderDetail).then((res) => {
      setOrderProductList(res.data);
    });
  }, []);


  // console.log(productList);
  // console.log(orderProductList);
  // orderProductList.forEach((data) => {
  //   console.log(data.productId);
  //   if (checkList == null) {
  //     checkList.push(data.productId);
  //   }
  //   else {
  //     const boolCheck = false;
  //     checkList.forEach(element => {
  //       if (element.productId == data.productId) {
  //         boolCheck = true;
  //       }
  //     });
  //     if (boolCheck == false) {
  //       checkList.push(data.productId);
  //     }
  //   }
  // })
  // console.log(checkList);

  const postData = (e) => {
    const jsonObj = {
      orderId: props.orderId,
      productId,
      amount,
      price,
      note,
    }
    axios.post(`${process.env.REACT_APP_API_URL}addOrderDetail`, jsonObj)
      .then(res => {
        swal("Success", "Add new order successfully", "success", {
          buttons: false,
          timer: 2000,
        })
        //reset data
        handleCancelClick();
      }).catch(err => {
        swal("Error", "Add new order failed", "error", {
          buttons: false,
          timer: 2000,
        })
        console.log(err)
      }).finally(() => {
        window.location.reload(true);
      });
  }

  const resetData = () => {
    //reset data
    setProductId("");
    setAmount(0);
    setPrice(0)
    setNote("");
  };

  const handleCancelClick = () => {
    //reset data
    resetData();
    props.setTrigger(false);
  };

  return (props.trigger) ? (
    <div className="orderpopup">
      <div className="popup-inner">
        {/* <div>
          <button className="close-btn" onClick={() => props.setTrigger(false)}>
            <CloseIcon style={{ color: "white" }} />
          </button>
        </div> */}
        {props.children}
        <div className="popup-body" style={{ height: '30vh', overflow: 'auto', overflowY: 'hidden' }}>
          <form>
            <div className="idname">
              <div className="datefield">
                <CssTextField
                  label="Product"
                  select
                  value={productId}
                  required
                  onChange={(e) => {
                    console.log(listProductActive.find(
                      (item2) => item2.productId === productId));
                    // if (productId == )
                    setProductId(e.target.value);
                  }}
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
                onClick={postData}
              >
                Add Order
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

export default OrderDetailPopup;

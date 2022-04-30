import React, { useState, useEffect } from "react";
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
import {styled } from "@mui/material/styles";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import axios from "axios";
import swal from "sweetalert";
import { ImportExcelButton } from "../button/ImportExcelButton";

function createData(productId, productName, amount, price, description) {
  return { productId, productName, amount, price, description };
}

const columns = [
  {
    title: "ID",
    field: "productId",
    cellStyle: { fontFamily: "Arial" },
  },
  {
    title: "Name",
    field: "productName",
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
    title: "Total (x1000 VND)",
    cellStyle: { fontFamily: "Arial" },
    render: rowData =>rowData.amount*rowData.price
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
    borderBottomColor: "black",
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

function OrderPopup(props) {
  const [accountId, setAccountId] = useState("");
  const [customerAddress, setAddress] = useState("");
  const [customerName, setName] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [expiryDate, setExpiryDate] = useState("");
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [isShorTerm, setIsShortTerm] = useState(true);

  //combobox
  const [accountList, setAccountList] = useState([]);

  //select product
  const [orderProduct, setListOrderProduct] = useState([]);
  const [listProductActive, setProductList] = useState([]);
  const [productActive, setProductChoice] = useState('');
  const [productAmount, setOrderProductAmount] = useState(0);
  const [productPrice, setOrderProductPrice] = useState(0);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}getProducts/Active`).then((res) => {
      setProductList(res.data);
    });
    axios.get(`${process.env.REACT_APP_API_URL}getAllAccounts`)
      .then((res) => {
        let accounts = [];
        res.data.map(a => a.roleId == 'CUS' ? accounts.push(a) : null)
        setAccountList(accounts)
      })
      .catch((err) => {
        console.log(err);
        alert("Xảy ra lỗi");
      })
      .finally(() => {
        // console.log(accountList);
      })
  }, []);


  const postData = (e) => {
    e.preventDefault();
    const jsonObj = {
      accountId: accountId,
      totalPrice,
      expiryDate: new Date(expiryDate).toISOString(),
      status,
      note,
      customerAddress,
      customerName,
      isShorTerm,
      orderDetail: orderProduct
        ? orderProduct?.map((item) => {
          return {
            productId: item.productId,
            amount: item.amount,
            price: item.price,
            note: item.description
          };
        })
        : [],
    }
    axios.post(`${process.env.REACT_APP_API_URL}addOrder`, jsonObj)
      .then(res => {
        swal("Success", "Add new order successfully", "success", {
          buttons: false,
          timer: 2000,
        }).then(() => {
          handleCancelClick();
          window.location.reload();
        })
      }).catch(err => {
        swal("Error", "Add new order failed", "error", {
          buttons: false,
          timer: 2000,
        })
        console.log(err)
      })
  }

  const resetData = () => {
    //reset data
    setAccountId("");
    setTotalPrice(0);
    setExpiryDate("");
    setStatus("");
    setNote("");
    setIsShortTerm(true);
    setOrderProductPrice(0);
    setOrderProductAmount(0);
    setListOrderProduct([]);
    setProductChoice('');
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


  return (props.trigger) ? (
    <div className="popup">
      <div className="popup-inner">
        {props.children}
        <div className="popup-body" style={{ height: '85vh', overflow: 'auto', overflowY: 'scroll', overflowX: 'hidden' }}>
          <form>
            <div className="account-popup">
              <div className="idname">
                <div className="datefield">
                  <CssTextField
                    label="Customer"
                    select
                    id="fullWidth"
                    value={accountId}
                    required
                    onChange={(e) => {
                      let account = accountList.filter(a => a.accountId == e.target.value)
                      setName(account[0].name)
                      setAddress(account[0].address)
                      setAccountId(e.target.value)
                    }}
                    helperText="Choose customer"
                  >
                    {accountList.map((option) => (
                      <MenuItem key={option.accountId} value={option.accountId}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </CssTextField>
                </div>
                <div className="idfield">
                  <CssTextField
                    label="Total Price"
                    id="fullWidth"
                    value={totalPrice}
                    required
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
                      required
                      minDate={new Date()}
                      selected={expiryDate}
                      onChange={(e) => setExpiryDate(e)}
                      value={expiryDate}
                      onSelect={(e) => setExpiryDate(e)}
                      renderInput={(params) => <CssTextField {...params} id="fullWidth" />}
                    />
                  </LocalizationProvider>
                </div>
                <br />
                <br />
                <br />
                <div clasName='idname'>
                  <div className="namefield">
                    <CssTextField
                      label="Address"
                      value={customerAddress}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
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
              <hr style={{ borderTop: "1px solid #EEE2DC", marginLeft: '3%', marginRight: '5%', marginTop: '2%' }} />
              <text style={{ fontFamily: 'Muli', fontSize: '18px', width: '100%', display: 'inline-block', paddingTop: '2%' }} className="content_choose">Order Detail</text>
              <div className="product-detail-choose">
                <div className="txtfield_Choose">
                  <CssTextField
                    label="Product List"
                    select
                    id="fullWidth"
                    value={productActive}
                    onChange={(e) => setProductChoice(e.target.value)}
                  >
                    {listProductActive
                      .filter((item) => {
                        return !orderProduct.find(
                          (item2) => item2.productId === item.productId
                        );
                      })
                      .map((product) => (
                        <MenuItem key={product.productId} value={product}>
                          {product.productName}
                        </MenuItem>
                      ))}
                  </CssTextField>
                </div>
                <div className="numfield_choose">
                  <CssTextField
                    label="Amount"
                    id="fullWidth"
                    value={productAmount}
                    type={"number"}
                    InputProps={{
                      inputProps: { min: 0, pattern: "[0-9]*" },
                    }}
                    onChange={(e) => setOrderProductAmount(e.target.value)}
                  />
                </div>
                <div className="numfield_choose">
                  <CssTextField
                    label="Price"
                    id="fullWidth"
                    value={productPrice}
                    type={"number"}
                    InputProps={{
                      inputProps: { min: 0, pattern: "[0-9]*" },
                      endAdornment: <InputAdornment position="end">x1000 VND</InputAdornment>
                    }}
                    onChange={(e) => setOrderProductPrice(e.target.value)}
                  />
                </div>
                {productActive != null &&
                  productAmount > 0 && productPrice > 0 ? (
                  <ImportExcelButton
                    onClick={() => {
                      setListOrderProduct((orderProduct) => [
                        ...orderProduct,
                        createData(
                          productActive.productId,
                          productActive.productName,
                          productAmount,
                          productPrice,
                          ""
                        ),
                      ]);
                      setTotalPrice(totalPrice+productAmount*productPrice)
                      setOrderProductAmount('');
                      setOrderProductPrice('');
                      setProductChoice('');
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
              <div className="order-detail-table">
                <MaterialTable
                  data={orderProduct}
                  columns={columns}
                  editable={{
                    onRowDelete: (oldData) =>
                      new Promise((resolve, reject) => {
                        setTimeout(() => {
                          const dataDelete = [...orderProduct];
                          const index = oldData.tableData.id;
                          let deleteItem = dataDelete.splice(index, 1)[0];
                          let minusPrice = deleteItem.amount*deleteItem.price
                          setTotalPrice(totalPrice-minusPrice)
                          setListOrderProduct([...dataDelete]);
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
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}

export default OrderPopup;

import React, { useState } from "react";
import MaterialTable from "material-table";
import "../../App.css";
import "../../styles/Popup.scss";
import { Typography } from "@mui/material";
import axios from "axios";
import swal from "sweetalert";
import ProductEditPopup from "../Popups/ProductEditPopup";
import { IconContext } from "react-icons";
import Avatar from '@mui/material/Avatar';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';

export const Table = (props) => {
  const { listProduct } = props;
  const array = [];
  let role = localStorage.getItem('currentRole')

  listProduct.forEach((item) => {
    array.push(item);
  });

  function deleteProduct(id) {
    swal({
      title: "Are you sure to delete this product?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          try {
            axios
              .put(`${process.env.REACT_APP_API_URL}delProduct/` + id)
              .then((response) => {
                swal("Success", "Delete Product successfully", "success", {
                  button: false,
                  timer: 2000,
                });
                props.setSubmittedTime();
              })
              .catch((err) => {
                swal("Error", "Delete Product failed", "error", {
                  button: false,
                  time: 2000,
                });
              });
          } catch (error) {
            console.log(error);
          }
          delay(function () { window.location.reload(); }, 1000);
        } else {
          swal({
            title: "Your Product is safe!",
            icon: "info",
          });
        }
      });
  }

  const columns = [
    {
      title: "Product ID",
      field: "productId",
      cellStyle: { fontFamily: "Muli", paddingRight: '4%',  },
      align: "center",
    },
    {
      title: "Product Image",
      field: "imageUrl",
      render: (rowData) => (
        (rowData.imageUrl != null)
          ? <img style={{ height: "80px", width: "80px" }} src={"https://firebasestorage.googleapis.com/v0/b/gspspring2022.appspot.com/o/Images%2F" + rowData.imageUrl} />
          : <Avatar sx={{ width: 80, height: 80 }} variant="square" />
      ),
      cellStyle: { paddingRight: '4%' },
      align: "center",
    },
    {
      title: "Product Name",
      field: "productName",
      cellStyle: { fontFamily: "Muli", paddingRight: '3%',  },
      align: "center",
    },
    {
      title: "Amount",
      field: "amount",
      cellStyle: { fontFamily: "Muli", paddingRight: '3%',  },
      align: "center",
    },
    {
      title: "Price (x1000VND)",
      field: "price",
      cellStyle: { fontFamily: "Muli", paddingRight: '3%',  },
      align: "center",
    },
    {
      title: "Status",
      field: "status",
      align: "center",
      render:
        rowData => (rowData.status == 'Inactive')
          ? <IconContext.Provider value={{ color: "red", className: "global-class-name" }}>
            <div className="cancel">
              <HighlightOffRoundedIcon fontSize="large" />
            </div>
          </IconContext.Provider>
          : <IconContext.Provider value={{ color: "green", className: "global-class-name" }}>
            <div className="check">
              <CheckCircleOutlineRoundedIcon fontSize="large" />
            </div>
          </IconContext.Provider >
    },
  ];

  var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();

  const [editDatas, setEditDatas] = useState(null);
  const [open, setOpen] = useState(false);
  const [newDataSubmitted, setNewDataSubmitted] = useState(1);
  const [productComponent, setListProductComponent] = useState([]);

  const handleEditData = (rowData) => {
    setEditDatas(rowData);
    setOpen(true);
    axios.get(`${process.env.REACT_APP_API_URL}getProCompo/` + rowData.productId).then(
      (res) => setListProductComponent(res.data)
    )
  }

  var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();

  const MyNewTitle = ({ text = "Table Title", variant = "h6" }) => (
    <Typography
      variant={variant}
      style={{ color: '#333C83', fontFamily: 'Muli' }}
    >
      {text}
    </Typography>
  );

  return (
    <React.Fragment>
      {role === 'Admin' ?
        <MaterialTable
          title={<MyNewTitle variant="h6" text="Products List" />}
          data={array}
          columns={columns}
          actions={[
            rowData => ({
              icon: "delete",
              tooltip: "Delete Product",
              onClick: (event, rowData) => {
                deleteProduct(rowData.productId);
              },
              disabled: (rowData.status == 'Inactive')
            }),
            {
              icon: "edit",
              tooltip: "View/Edit this Product",
              onClick: (event, rowData) => {
                handleEditData(rowData);
              },
            },
          ]}
          options={{
            searchFieldVariant: 'outlined',
            searchFieldStyle: {
              fontFamily: 'Muli',
              color: '#0E185F',
              marginTop: '2%',
              marginBottom: '2%',
            },
            addRowPosition: "first",
            actionsColumnIndex: -1,
            exportButton: false,
            headerStyle: { backgroundColor: "#bd162c", color: "#fff",  },
          }}
        /> : <MaterialTable
          title={<MyNewTitle variant="h6" text="Products List" />}
          data={array}
          columns={columns}
          options={{
            searchFieldVariant: 'outlined',
            searchFieldStyle: {
              fontFamily: 'Muli',
              color: '#0E185F',
              marginTop: '2%',
              marginBottom: '2%',
            },
            addRowPosition: "first",
            actionsColumnIndex: -1,
            exportButton: false,
            headerStyle: { backgroundColor: "#bd162c", color: "#fff",  },
          }}
        />}
      {editDatas &&
        <ProductEditPopup
          productCompos={productComponent}
          data={editDatas}
          setData={setEditDatas}
          IsOpen={open}
          setOpen={setOpen}
          setSubmittedTime={() => {
            setNewDataSubmitted((prev) => prev + 1);
          }}
        >
          <h3 className="popuptitle">Edit product : {editDatas.productId} </h3>
        </ProductEditPopup>
      }
    </React.Fragment>
  );
};

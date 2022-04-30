import React, { Fragment, useEffect, useState } from "react";
import MaterialTable from "material-table";
import "../../styles/Popup.scss";
import axios from "axios";
import swal from "sweetalert";
import AccountEditPopup from "../Popups/AccountEditPopup";
import { AiFillCheckCircle, AiFillCloseCircle } from 'react-icons/ai';
import { IconContext } from "react-icons";
import moment from 'moment';
import { Avatar, Typography } from "@mui/material";
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';

export const Table = (props) => {
  const { listAccount } = props;
  const array = [];

  listAccount.forEach((item) => {
    array.push(item);
  }, []);

  function deleteAccount(id) {
    swal({
      title: "Are you sure to delete this account?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          try {
            axios
              .put(`${process.env.REACT_APP_API_URL}delAccount/` + id)
              .then((response) => {
                swal("Success", "Account deleted successfully", "success", {
                  buttons: false,
                  timer: 2000,
                });
              })
              .catch((err) => {
                swal("Error", "Something went wrong", "error", {
                  buttons: false,
                  timer: 2000,
                });
              });
          } catch (error) {
            console.log(error);
          }
          delay(function () { window.location.reload(); }, 1000);
        } else {
          swal({
            title: "This account is safe!",
            icon: "info",
          });
        }
      });
  }

  const [addAccountBtn, setaddAccountBtn] = useState(false);
  const columns = [
    {
      title: "ID",
      field: "accountId",
      cellStyle: { fontFamily: "Muli", paddingRight: '3%' },
      align: "center"
    },
    {
      title: "Employee Name",
      field: "name",
      cellStyle: { fontFamily: "Muli", paddingRight: '3%' },
      align: "center"
    },
    {
      title: "Profile Picture",
      field: "avatarUrl",
      render: (rowData) => (
        (rowData.avatarUrl != null)
          ? <Avatar sx={{ width: 80, height: 80 }} src={"https://firebasestorage.googleapis.com/v0/b/gspspring2022.appspot.com/o/Images%2F" + rowData.avatarUrl} />
          : <Avatar sx={{ width: 80, height: 80 }} />
      ),
      cellStyle: { paddingLeft: '4%' },
      align: "center",
    },
    {
      title: "Gender",
      field: "gender",
      cellStyle: { fontFamily: "Muli", paddingRight: '3%'},
      align: "center",
      render:
        rowData => (rowData.gender == true)
          ? "Male" : "Female"
    },
    {
      title: "Date of Birth",
      field: "dateOfBirth",
      cellStyle: {
        fontFamily: "Muli", paddingRight: '3%'
      },
      align: "center",
      render:
        rowData => moment(rowData.dateOfBirth).format('DD/MM/YYYY'),
    },
    {
      title: "Status",
      field: "status",
      align: "center",
      cellStyle: { paddingRight: '3%'},
      render:
        rowData => (rowData.isActive == false)
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

  const [editDatas, setEditDatas] = useState(null);
  const [open, setOpen] = useState(false);
  const [newDataSubmitted, setNewDataSubmitted] = useState(1);

  const handleEditData = (rowData) => {
    setEditDatas(rowData);
    setOpen(true);
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
      <MaterialTable
        title={<MyNewTitle variant="h6" text="Accounts List" />}
        data={array}
        columns={columns}
        actions={[
          rowData => ({
            icon: "delete",
            tooltip: "Delete User",
            onClick: (event, rowData) => {
              deleteAccount(rowData.accountId);
            },
            disabled: (rowData.isActive == false || rowData.roleId == 'ADM')
          }),
          {
            icon: "edit",
            tooltip: "View/Edit this Account",
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
          headerStyle: { backgroundColor: "#bd162c", color: "#fff" },
        }}
      />
      {editDatas &&
        <AccountEditPopup
          data={editDatas}
          setData={setEditDatas}
          IsOpen={open}
          setOpen={setOpen}
          setSubmittedTime={() => {
            setNewDataSubmitted((prev) => prev + 1);
          }}
        >
          <h3 className="popuptitle">Edit account : {editDatas.name} </h3>
        </AccountEditPopup>
      }
    </React.Fragment>
  );
};
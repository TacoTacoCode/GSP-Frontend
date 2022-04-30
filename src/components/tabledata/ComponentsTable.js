import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import "../../styles/Popup.scss";
import axios from "axios";
import swal from "sweetalert";
import ComponentEditPopup from "../Popups/ComponentEditPopup";
import { AiFillCheckCircle, AiFillCloseCircle } from 'react-icons/ai';
import { IconContext } from "react-icons";
import { Avatar } from "@mui/material";
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import { Typography } from "@mui/material";

export const Table = (props) => {
  const { listComponent } = props;
  const array = [];

  listComponent.forEach((item) => {
    array.push(item);
  });

  const [editDatas, setEditDatas] = useState(null);
  const [open, setOpen] = useState(false);
  const [newDataSubmitted, setNewDataSubmitted] = useState(1);
  const [componentMaterial, setListComponentMaterial] = useState([]);

  function deleteComponent(id) {
    swal({
      title: "Are you sure to delete this component?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          try {
            axios
              .put(`${process.env.REACT_APP_API_URL}delComponent/` + id)
              .then((response) => {
                swal("Success", "Delete Component successfully", "success", {
                  button: false,
                  timer: 2000,
                });
              })
              .catch((err) => {
                swal("Error", "Delete Component failed", "error", {
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
            title: "Your Component is safe!",
            icon: "info",
          });
        }
      });
  }

  const columns = [
    {
      title: "ID",
      field: "componentId",
      cellStyle: { width: '10%', fontFamily: "Muli", paddingRight: '4%'},
      align: "center",
    },
    {
      title: "Component Picture",
      field: "imageUrl",
      render: (rowData) => (
        (rowData.imageUrl != null)
          ? <img style={{ height: "80px", width: "80px" }} src={"https://firebasestorage.googleapis.com/v0/b/gspspring2022.appspot.com/o/Images%2F" + rowData.imageUrl} />
          : <div style={{ paddingRight: '5%' }}><Avatar sx={{ marginLeft: '26%', width: 80, height: 80 }} variant="square" /></div>
      ),
      cellStyle: { width: '17%', paddingRight: '4%'},
      align: "center",
    },
    {
      title: "Component Name",
      field: "componentName",
      cellStyle: { fontFamily: "Muli", paddingRight: '4%' },
      align: "center",
    },
    {
      title: "Amount",
      field: "amount",
      cellStyle: { fontFamily: "Muli", paddingRight: '4%' },
      align: "center",
    },
    {
      title: "Substance",
      field: "substance",
      cellStyle: { fontFamily: "Muli", paddingRight: '4%' },
      align: "center",
    },
    {
      title: "Status",
      field: "status",
      align: "center",
      cellStyle: { fontFamily: "Muli", paddingRight: '3%'},
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

  const handleEditData = (rowData) => {
    setEditDatas(rowData);
    setOpen(true);
    axios.get(`${process.env.REACT_APP_API_URL}getMateByCompoId/` + rowData.componentId).then(
      (res) => setListComponentMaterial(res.data)
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
      <MaterialTable
        title={<MyNewTitle variant="h6" text="Components List" />}
        data={array}
        columns={columns}
        actions={
          localStorage['currentRole'] != 'Admin' ? []
            : [
              rowData => ({
                icon: "delete",
                tooltip: "Delete this component",
                onClick: (event, rowData) => {
                  deleteComponent(rowData.componentId);
                },
                disabled: (rowData.status == 'Inactive')
              }),
              {
                icon: "edit",
                tooltip: "View/Edit this component",
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
          headerStyle: { backgroundColor: "#bd162c", color: "#fff"},
        }}
      />
      {editDatas &&
        <ComponentEditPopup
          compoMates={componentMaterial}
          data={editDatas}
          setData={setEditDatas}
          IsOpen={open}
          setOpen={setOpen}
          setSubmittedTime={() => {
            setNewDataSubmitted((prev) => prev + 1);
          }}
        >
          <h3 className="popuptitle">Edit component : {editDatas.componentId} </h3>
        </ComponentEditPopup>
      }
    </React.Fragment>
  );
};

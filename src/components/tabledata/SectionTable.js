import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { alpha, styled } from "@mui/material/styles";
import "../../App.css";
import "../../styles/Popup.scss";
import {
  TextField, Typography,
} from "@mui/material";
import axios from "axios";
import swal from "sweetalert";
import ProductEditPopup from "../Popups/ProductEditPopup";
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import { IconContext } from "react-icons";
import Avatar from '@mui/material/Avatar';
import SectionEditPopup from "../Popups/SectionEditPopup";
import { fn } from "moment";
import { TextGetSectionLeader } from "../NonSideBarPage/TextGetSectionLeader";

export const Table = (props) => {
  const { listSection } = props;
  const array = [];

  listSection.forEach((item) => {
    array.push(item);
  });

  function deleteSection(id) {
    swal({
      title: "Are you sure to delete this section?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          try {
            axios
              .put(`${process.env.REACT_APP_API_URL}delSection/` + id)
              .then((response) => {
                swal("Success", "Section deleted successfully", "success", {
                  button: false,
                  timer: 2000,
                });
                props.setSubmittedTime();
              })
              .catch((err) => {
                swal("Error", "Section deleting failed", "error", {
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
            title: "Deleting this section cancelled",
            icon: "info",
          });
        }
      });
  }

  const columns = [
    {
      title: "Section ID",
      field: "sectionId",
      cellStyle: { fontFamily: "Muli", paddingRight: '3%' },
      align: 'center',
      
      paddingRight: '5%'
    },
    // muốn lấy tên
    {
      title: "Section Leader",
      field: "sectionLeadId",
      cellStyle: { fontFamily: "Muli", paddingRight: '3%' },
      align: 'center',
      
      render:
        rowData => (rowData.sectionLeadId != null)
          ? <TextGetSectionLeader accountID={rowData.sectionLeadId} />
          : "Unknown User"
    },
    {
      title: "Component",
      field: "componentId",
      cellStyle: { fontFamily: "Muli", paddingRight: '3%' },
      align: 'center',
      
    },
    {
      title: "Worker Amount",
      field: "workerAmount",
      cellStyle: { fontFamily: "Muli", paddingRight: '3%' },
      align: 'center',
      
    },
    {
      title: "State of Assemble",
      field: "isAssemble",
      align: 'center',
      
      cellStyle: { fontFamily: "Muli", paddingRight: '3%' },
      render:
        rowData => (rowData.isAssemble == false)
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
    {
      title: "Status",
      field: "status",
      align: 'center',
      
      cellStyle: { fontFamily: "Muli", paddingRight: '3%' },
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
        title={<MyNewTitle variant="h6" text="Sections List" />}
        data={array}
        columns={columns}
        actions={[
          rowData => ({
            icon: "delete",
            tooltip: "Delete this Section",
            onClick: (event, rowData) => {
              deleteSection(rowData.sectionId);
            },
            disabled: (rowData.status == 'Inactive')
          }),
          {
            icon: "edit",
            tooltip: "View/Edit this Section",
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
      />
      {editDatas &&
        <SectionEditPopup
          data={editDatas}
          setData={setEditDatas}
          IsOpen={open}
          setOpen={setOpen}
          setSubmittedTime={() => {
            setNewDataSubmitted((prev) => prev + 1);
          }}
        >
          <h3 className="popuptitle">Edit section : {editDatas.sectionId} </h3>
        </SectionEditPopup>
      }
    </React.Fragment>
  );
};

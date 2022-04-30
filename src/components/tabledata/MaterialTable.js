import React, {
  useState,
} from "react";
import MaterialTable from "material-table";
import axios from "axios";
import swal from "sweetalert";
import MaterialEditPopup from "../Popups/MaterialEditPopup";
import { AiFillCheckCircle, AiFillCloseCircle } from 'react-icons/ai';
import { IconContext } from "react-icons";
import { Avatar, Typography } from "@mui/material";
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';

export const Table = (props) => {
  const { listMaterial } = props;
  const array = [];
  let role = localStorage.getItem('currentRole')

  listMaterial.forEach((item) => {
    array.push(item);
  });

  function deleteMaterial(id) {
    swal({
      title: "Are you sure to delete this material?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          try {
            axios
              .put(`${process.env.REACT_APP_API_URL}delMaterial/` + id)
              .then((res) => {
                swal("Success", "Delete Material successfully", "success", {
                  button: false,
                  timer: 2000,
                });
              })
              .catch((err) => {
                swal("Error", "Update Material failed", "error", {
                  button: false,
                  timer: 2000,
                });
              });
          } catch (error) {
            console.log(error);
          }
          delay(function () { window.location.reload(); }, 1000);
        } else {
          swal({
            title: "Your Material is safe!",
            icon: "info",
          });
        }
      });
  }

  const columns = [
    {
      title: "Material ID",
      field: "materialId",
      cellStyle: { fontFamily: "Muli", fontSize: "18px", paddingRight: '4%' },
      align: 'center',
    },
    {
      title: "Image",
      field: "imageUrl",
      align: 'center',
      cellStyle: { fontFamily: "Muli", fontSize: "18px", paddingRight: '2%' },
      render: (rowData) => (
        (rowData.imageUrl != null)
          ? <img style={{ height: "80px", width: "80px" }} src={"https://firebasestorage.googleapis.com/v0/b/gspspring2022.appspot.com/o/Images%2F" + rowData.imageUrl} />
          : <Avatar sx={{ width: 80, height: 80 }} variant="square" />
      ),
    },
    {
      title: "Material Name",
      field: "materialName",
      cellStyle: {
        fontFamily: "Muli", fontSize: "18px", paddingRight: '2%'
      },
      align: 'center',
    },
    {
      title: "Unit",
      field: "unit",
      cellStyle: { fontFamily: "Muli", fontSize: "18px", paddingRight: '2%' },
      align: 'center',
    },
    {
      title: "Amount",
      field: "amount",
      cellStyle: { fontFamily: "Muli", fontSize: "18px", paddingRight: '2%' },
      align: 'center',
    },
    {
      title: "Status",
      field: "status",
      align: 'center',
      cellStyle: { fontFamily: "Muli", fontSize: "18px", paddingRight: '2%' },
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
      {role === 'Admin' ? <MaterialTable
        title={<MyNewTitle variant="h6" text="Materials List" />}
        data={array}
        columns={columns}
        actions={[
          rowData => ({
            icon: "delete",
            tooltip: "Delete Material",
            onClick: (event, rowData) => {
              deleteMaterial(rowData.materialId);
            },
            disabled: (rowData.status == 'Inactive')
          }),
          {
            icon: "edit",
            tooltip: "View/Edit this Material",
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
      /> : <MaterialTable
        title={<MyNewTitle variant="h6" text="Materials List" />}
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
          headerStyle: { backgroundColor: "#bd162c", color: "#fff" },
        }}
      />}
      {editDatas &&
        <MaterialEditPopup
          data={editDatas}
          setData={setEditDatas}
          IsOpen={open}
          setOpen={setOpen}
          setSubmittedTime={() => {
            setNewDataSubmitted((prev) => prev + 1);
          }}
        >
          <h3 className="popuptitle">Edit material {editDatas.materialId} </h3>
        </MaterialEditPopup>
      }
    </React.Fragment>
  );
};

import React, { useState, useEffect } from "react";
import "../../../App.css";
import { FaClipboardList, FaPlus } from 'react-icons/fa';
import { AiFillFileExcel } from 'react-icons/ai';
import { ImportExcelButton } from "../../button/ImportExcelButton";
import { Table } from "../../tabledata/ComponentsTable";
import ComponentPopup from "../../Popups/ComponentPopup";
import axios from "axios";
import ImportFilePopup from "../../Popups/ImportFilePopup";

function Components() {
  useEffect(() => {
    document.title = "UFA - Manage Components"
  }, []);

  const [importFile, setImportFile] = useState(false);
  const [addcomponentBtn, setAddcomponentBtn] = useState(false);
  const [newDataSubmitted, setNewDataSubmitted] = useState(1);
  const [listComponent, setListComponent] = useState([]);
  let role = localStorage.getItem('currentRole')

  useEffect(() => {
    const getAllComponents = `${process.env.REACT_APP_API_URL}getAllComponents`;

    //Gọi API bằng axios
    axios
      .get(getAllComponents)
      .then((res) => {
        setListComponent(res.data);
      })
      .catch((err) => {
        console.log(err);
        alert("Xảy ra lỗi");
      });
  }, [newDataSubmitted]);

  return (
    <>
      {localStorage['currentRole'] == 'Admin' ?
        <>
          <ImportExcelButton
            style={{ marginTop: '3%' }}
            type="button"
            onClick={() => {
              setImportFile(true);
            }}
          >
            Import Component File
          </ImportExcelButton>
          <ImportFilePopup
            trigger={importFile}
            setTrigger={setImportFile}
            dataType="component"
          >
            <h3 className="popuptitle">Import Component File</h3>
          </ImportFilePopup>
          <ImportExcelButton
            style={{ marginTop: '3%', marginRight: '1%' }}
            type="button"
            onClick={() => {
              setAddcomponentBtn(true);
            }}
          >
            Add Component
          </ImportExcelButton>
          <ComponentPopup
            trigger={addcomponentBtn}
            setTrigger={setAddcomponentBtn} setSubmittedTime={() => {
              setNewDataSubmitted((prev) => prev + 1);
            }}>
            <h3 className="popuptitle">Add a component</h3>
          </ComponentPopup>
        </> : null}
      <div className="components">
        <Table listComponent={listComponent} setSubmittedTime={() => {
          setNewDataSubmitted((prevState) => prevState + 1);
        }} />
      </div>
    </>
  );
}

export default Components;

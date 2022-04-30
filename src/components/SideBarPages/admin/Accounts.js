import React, { useState, useEffect } from "react";
import "../../../App.css";
import { ImportExcelButton } from "../../button/ImportExcelButton";
import { Table } from "../../tabledata/AccountsTable";
import AccountPopup from "../../Popups/AccountPopup";
import axios from "axios";
import ImportFilePopup from "../../Popups/ImportFilePopup";

function Accounts() {
  useEffect(() => {
    document.title = "UFA - Manage Accounts"
  }, []);

  const [addAccountBtn, setaddAccountBtn] = useState(false);
  const [importFile, setImportFile] = useState(false);
  const [type, setType] = useState('');
  const [newDataSubmitted, setNewDataSubmitted] = useState(1);
  const [listAccount, setListAccount] = useState([]);

  useEffect(() => {
    const getAllAccount = `${process.env.REACT_APP_API_URL}getAllAccounts`;
    axios
      .get(getAllAccount)
      .then((res) => {
        setListAccount(res.data);
      })
      .catch((err) => {
        console.log(err);
        alert("Xảy ra lỗi");
      });
  }, [newDataSubmitted]);
  return (
    <>
      <ImportExcelButton
        style={{ marginTop: '3%' }}
        type="button"
        onClick={() => {
          setType('attendance')
          setImportFile(true);
        }}
      >
        {/* <div>

          <FaClipboardList size={24} style={{ verticalAlign: "middle" }} />
          &ensp;
          <text style={{ verticalAlign: "middle" }}>Attendance List</text>
        </div> */}
        Attendance List</ImportExcelButton>

      <ImportExcelButton
        style={{ marginTop: '3%', marginRight: '1%' }}
        type="button"
        onClick={() => {
          setType('account')
          setImportFile(true);
        }}
      >
        {/* <div>
          <AiFillFileExcel size={24} style={{ verticalAlign: "middle" }} />
          &ensp;
          <text style={{ verticalAlign: "middle" }}>Import Account File</text>
        </div> */}
        Import Account File
      </ImportExcelButton>

      <ImportFilePopup
        trigger={importFile}
        setTrigger={setImportFile}
        dataType={type}
      >
        <h3 className="popuptitle">Import {`${type}`} file</h3>
      </ImportFilePopup>

      <ImportExcelButton
        style={{ marginTop: '3%', marginRight: '1%' }}
        type="button"
        onClick={() => {
          setaddAccountBtn(true);
        }}
      >
        {/* <div>
          <FaPlus size={24} style={{ verticalAlign: "middle" }} />
          &ensp;
          <text style={{ verticalAlign: "middle" }}>Add Account</text>
        </div> */}
        Add Account
      </ImportExcelButton>

      <AccountPopup
        trigger={addAccountBtn}
        setTrigger={setaddAccountBtn}
        setSubmittedTime={() => {
          setNewDataSubmitted((prevState) => prevState + 1);
        }}
      >
        <h3 className="popuptitle">Add an account</h3>
      </AccountPopup>
      <div className="accounts">
        <Table
          listAccount={listAccount}
          setSubmittedTime={() =>
            setNewDataSubmitted((prevState) => prevState + 1)
          }
        />
      </div>
    </>
  );
}

export default Accounts;

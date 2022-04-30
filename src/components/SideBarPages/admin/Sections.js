import React, { useState, useEffect } from "react";
import "../../../App.css";
import { FaClipboardList, FaPlus } from 'react-icons/fa';
import { ImportExcelButton } from "../../button/ImportExcelButton";
import { Table } from "../../tabledata/SectionTable";
import axios from "axios";
import ImportFilePopup from "../../Popups/ImportFilePopup";
import SectionPopup from "../../Popups/SectionPopup";

function Sections() {
  useEffect(() => {
    document.title = "UFA - Manage Sections"
  }, []);

  const [addSectionBtn, setaddSectionBtn] = useState(false);
  const [newDataSubmitted, setNewDataSubmitted] = useState(1);
  const [importFile, setImportFile] = useState(false);
  const [listSection, setListSection] = useState([]);

  useEffect(() => {
    const getAllSections = `${process.env.REACT_APP_API_URL}getAllSections`;
    axios
      .get(getAllSections)
      .then((res) => {
        setListSection(res.data);
      })
      .catch((err) => {
        console.log(err);
        alert("Xảy ra lỗi");
      });
  }, [newDataSubmitted]);

  return (
    <>
      <ImportExcelButton
        style={{ marginTop: '2%', marginRight: '2%' }}
        type="button"
        onClick={() => {
          setaddSectionBtn(true);
        }}
      >
        {/* <div>
          <FaPlus size={24} style={{ verticalAlign: "middle" }} />
          &ensp;
          <text style={{ verticalAlign: "middle" }}>Add Section</text>
        </div> */}
        Add Section
      </ImportExcelButton>
      <SectionPopup
        trigger={addSectionBtn}
        setTrigger={setaddSectionBtn}
        setSubmittedTime={() => {
          setNewDataSubmitted((prev) => prev + 1);
        }}
      >
        <h3 className="popuptitle">Add a section</h3>
      </SectionPopup>
      <div className="sections">
        <Table
          listSection={listSection}
          setSubmittedTime={() => {
            setNewDataSubmitted((prev) => prev + 1);
          }}
        />
      </div>
    </>
  );
}

export default Sections;
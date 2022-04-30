import React, { useState, useEffect } from "react";
import "../../../App.css";
import { FaClipboardList, FaPlus } from 'react-icons/fa';
import { AiFillFileExcel } from 'react-icons/ai';
import { ImportExcelButton } from "../../button/ImportExcelButton";
import { Table } from "../../tabledata/ProductsTable";
import ProductPopup from "../../Popups/ProductPopup";
import axios from "axios";
import ImportFilePopup from "../../Popups/ImportFilePopup";
import MaterialPopup from "../../Popups/MaterialPopup";

function Products() {
  useEffect(() => {
    document.title = "UFA - Manage Products"
  }, []);

  const [addProductBtn, setaddProductBtn] = useState(false);
  const [newDataSubmitted, setNewDataSubmitted] = useState(1);
  const [importFile, setImportFile] = useState(false);
  const [listProduct, setListProduct] = useState([]);
  let role = localStorage.getItem('currentRole')

  useEffect(() => {
    const getAllProducts = `${process.env.REACT_APP_API_URL}getProducts`;

    axios
      .get(getAllProducts)
      .then((res) => {
        setListProduct(res.data);
      })
      .catch((err) => {
        //Trường hợp xảy ra lỗi
        console.log(err);
        alert("Xảy ra lỗi");
      });
  }, [newDataSubmitted]);

  return (
    <>
      {role === 'Admin' ? <><ImportExcelButton
        style={{ marginTop: '3%' }}
        type="button"
        onClick={() => {
          setImportFile(true);
        }}
      >
        {/* <div>
          <AiFillFileExcel size={24} style={{ verticalAlign: "middle" }} />
          &ensp;
          <text style={{ verticalAlign: "middle" }}>Import Product File</text>
        </div> */}
        Import Product File
      </ImportExcelButton>
        <ImportFilePopup
          trigger={importFile}
          setTrigger={setImportFile}
          dataType="product"
        >
          <h3 className="popuptitle">Import Product File</h3>
        </ImportFilePopup>
        <ImportExcelButton
          style={{ marginTop: '3%', marginRight: '1%' }}
          type="button"
          onClick={() => {
            setaddProductBtn(true);
          }}
        >
          {/* <div>
          <FaPlus size={24} style={{ verticalAlign: "middle" }} />
          &ensp;
          <text style={{ verticalAlign: "middle" }}>Add Product</text>
        </div> */}
          Add Product
        </ImportExcelButton>
        <ProductPopup
          trigger={addProductBtn}
          setTrigger={setaddProductBtn}
          setSubmittedTime={() => {
            setNewDataSubmitted((prev) => prev + 1);
          }}
        >
          <h3 className="popuptitle">Add a product</h3>
        </ProductPopup></> : null}
      <div className="products">
        <Table
          listProduct={listProduct}
          setSubmittedTime={() => {
            setNewDataSubmitted((prev) => prev + 1);
          }}
        />
      </div>
    </>
  );
}

export default Products;

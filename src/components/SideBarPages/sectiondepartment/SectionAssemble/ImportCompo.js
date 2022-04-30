import React, { useState } from "react";
import MaterialTable from "material-table";
import { MenuItem, Select, TextField,Tooltip } from "@material-ui/core";
import swal from "sweetalert";
import axios from "axios";
import { Typography } from "@mui/material";


export const ImportCompo = (props) => {
    const datas = JSON.parse(localStorage.getItem('datas'))
    const [tableData, setTableData] = useState([])
    const [secInfo, setSecInfo] = useState(() => JSON.parse(localStorage['currentSectionInfo']));

    const columns = [
        {
            title: "Task",
            field: "taskName",
            cellStyle: { fontFamily: "Muli", textAlign: 'center', paddingRight: '3%', fontSize: '18px' },
            render: (rowData) =>
                <div style={{ width: '80%' }}><Select
                    fullWidth
                    variant="outlined"
                    id="demo-simple-select"
                    value={tableData[rowData.tableData.id].processDetailId}
                    onChange={(e) => handleChangeData(e.target.value, rowData.tableData.id)}
                >
                    {
                        datas.map((e) => (
                            <MenuItem
                                value={e.processDetailId}
                                key={e.processDetailId}
                                alignItems='center'
                            >
                                {e.taskName}
                            </MenuItem>))
                    }
                </Select></div>
        },
        {
            title: "Product Name",
            field: "productName",
            cellStyle: { fontFamily: "Muli", textAlign: 'center', paddingRight: '3%', fontSize: '18px' },
            render: (e) => tableData[e.tableData.id].productName
        },
        {
            title: "Amount",
            field: "amount",
            cellStyle: { fontFamily: "Muli", textAlign: 'center', paddingRight: '3%', fontSize: '18px' },
            render: (rowData) =>
                <Tooltip 
                title={<h3>{tableData[rowData.tableData.id].remaining} remaining</h3>}>
                    <TextField
                    variant="outlined"
                    value={tableData[rowData.tableData.id].amount}
                    type={"number"}
                    InputProps={{
                        disableUnderline: true,
                        inputProps: { min: 0 },
                    }}
                    onChange={(e) => handleChangeAmount(e.target.value, rowData.tableData.id)}
                />
                </Tooltip>

        }
    ]
    const handleAddRow = () => {
        let arr = [...tableData]
        arr.push({
            'processDetailId': '',
            'productName': '',
            'amount': 0,
            'itemId': '',
            'remaining':0,
        })
        setTableData(arr)
    }
    const handleChangeData = (value, index) => {
        let arr = [...tableData]
        const ele = findData(value)
        arr[index].processDetailId = value
        arr[index].productName = ele.product.productName
        arr[index].itemId = ele.product.productId
        arr[index].remaining = ele.remaining
        setTableData(arr)
    }
    const findData = (value) => {
        let result = null
        for (let i = 0; i < datas.length; i++) {
            if (datas[i].processDetailId == value) {
                result = datas[i]
                break;
            }
        }
        return result
    }
    const handleChangeAmount = (value, index) => {
        let arr = [...tableData]
        if (value === '') {
            arr[index].amount = 0
        }
        else {
            let aValue = parseInt(value)
            if (arr[index].maxAmount < aValue) {
                arr[index].amount = arr[index].maxAmount
            }
            else if (0 > aValue) {
                arr[index].amount = 0
            }
            else {
                arr[index].amount = aValue
            }
        }
        setTableData(arr)
    }
    const generateSubmitData = () => {
        if (tableData.length == 0) {
            return []
        } else if (!tableData.every((value) => value.amount > 0 && value.processDetailId.toString().length > 0 && value.itemId.length > 0)) {
            return undefined
        }
        else {
            let arr = []
            tableData.map((value) => {
                let obj = arr.find((e) => (e.processDetailId === value.processDetailId && e.itemId === value.itemId))
                if (obj !== undefined) {
                    obj.amount += value.amount
                } else {
                    arr.push({
                        'processDetailId': value.processDetailId,
                        'amount': value.amount,
                        'itemId': value.itemId,
                    })
                }

            })
            arr = arr.map((e) => {
                return { ...e, 'itemId': e.itemId + 'P' }
            })
            return arr
        }
    }
    const handleSubmit = () => {
        const data = generateSubmitData();

        if (data == undefined) {
            swal("Warning", "Please fill all the field", "warning", {
                buttons: false,
                timer: 1500,
            })
        } else if (data.length == 0) {
            swal("Info", "There is nothing to submit", "info", {
                buttons: false,
                timer: 1500,
            })
        }
        else {
            const submitData = {
                "sectionId": secInfo.sectionId,
                "createdDate": new Date().toLocaleDateString(),
                "itemType": "P",
                'isImport': true,
                "importExportDetails": data
            }
            axios.post(`${process.env.REACT_APP_API_URL}addImEx`, submitData)
                .then(() => {
                    swal("Success", "Submit Data", "success", {
                        buttons: false,
                        timer: 1500,
                    }).then((e) => window.location.href = 'http://localhost:3000/section/processDetail')
                })
        }
    }
    const handleDelete = (index) => {
        let arr = [...tableData]
        arr.splice(index, 1)
        setTableData(arr)
    }

    const MyNewTitle = ({ text = "Table Title", variant = "h6" }) => (
        <Typography
            variant={variant}
            style={{ color: '#333C83', fontFamily: 'Muli' }}
        >
            {text}
        </Typography>
    );


    return (
        <div className="processdetail">
            {datas.length > 0 ?
                <MaterialTable
                    title={<MyNewTitle variant="h6" text="Import Product Form" />}
                    data={tableData}
                    columns={columns}
                    actions={[
                        {
                            icon: 'add',
                            tooltip: 'Add a request',
                            isFreeAction: true,
                            onClick: () => handleAddRow()
                        },
                        {
                            icon: 'check',
                            tooltip: 'Submit this request',
                            isFreeAction: true,
                            onClick: () => handleSubmit()
                        },
                        rowData => ({
                            icon: 'delete',
                            tooltip: 'Delete this item',
                            onClick: () => handleDelete(rowData.tableData.id),
                        })
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
                        search: false,
                        headerStyle: { backgroundColor: "#bd162c", color: "#fff", textAlign: 'center', fontSize: '18px' },
                    }}
                /> : null}
        </div>
    );
}
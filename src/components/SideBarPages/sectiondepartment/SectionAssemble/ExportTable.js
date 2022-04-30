import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import moment from 'moment';
import axios from "axios";
import { Typography } from "@mui/material";

export const ExTable = (props) => {
    const { listProcessDetail } = props;
    const [listProCom, setListProCom] = useState([])

    useEffect(() => {
        if (listProcessDetail) {
            let datas = []
            let promises = listProcessDetail.map((e) =>
                axios.get(`${process.env.REACT_APP_API_URL}getListProCompo/` + e.processId)
            )
            Promise.all(promises)
                .then((e) => e.map((ele, index) => {
                    let obj = {}
                    ele.data.map((element) => {
                        if (!obj['productId']) {
                            obj['productId'] = element.productId
                            obj['product'] = element.product
                            obj['component'] = [{ ...element.component, "amount": element.amount }]
                        } else {
                            obj['component'].push({ ...element.component, "amount": element.amount })
                        }
                    })
                    obj['processDetailId'] = listProcessDetail[index].processDetailId
                    obj['taskName'] = listProcessDetail[index].taskName
                    obj['amount'] = listProcessDetail[index].totalAmount
                    obj['remaining'] = listProcessDetail[index].totalAmount - listProcessDetail[index].finishedAmount
                    datas.push(obj)
                }))
                .then((e) => {
                    localStorage.setItem('datas', JSON.stringify(datas))
                    setListProCom(datas)
                })
        }
    }, [listProcessDetail])

    const columns = [
        {
            title: "Task",
            field: "taskName",
            cellStyle: { fontFamily: "Muli", textAlign: 'center', paddingRight: '3%' },
            render: (e) => `${e.taskName}`

        },
        {
            title: "Product Image",
            field: 'productImage',
            cellStyle: { fontFamily: "Muli", textAlign: 'center', paddingRight: '3%' },
            render: (e) => {
                return listProCom.length > 0 ?
                    <img src={`https://firebasestorage.googleapis.com/v0/b/gspspring2022.appspot.com/o/Images%2F${listProCom[e.tableData.id].product.imageUrl}`}
                        width="100px" height="100px" />
                    : null
            }
        },
        {
            title: "Product Name",
            field: 'productName',
            cellStyle: { fontFamily: "Muli", textAlign: 'center', paddingRight: '3%' },
            render: (e) =>
                listProCom.length > 0 ?
                    `${listProCom[e.tableData.id].product.productName}`
                    : ''
        },
        {
            title: "Finished Amount",
            field: "finishedAmount",
            cellStyle: { fontFamily: "Muli", textAlign: 'center', width: '15%', paddingRight: '3%' },
        },
        {
            title: "Total Amount",
            field: "totalAmount",
            cellStyle: { fontFamily: "Muli", textAlign: 'center', paddingRight: '3%' },
        },
        {
            title: "Average amount per day",
            field: "averageAmount",
            cellStyle: { fontFamily: "Muli", textAlign: 'center', width: '20%', paddingRight: '3%' },
            render:
                rowData => rowData.averageAmount ? rowData.averageAmount : 0,
        },
        {
            title: "Expiry Date",
            field: "expiryDate",
            cellStyle: { fontFamily: "Muli", textAlign: 'center', paddingRight: '3%'},
            render:
                rowData => moment(rowData.expiryDate).format('DD/MM/YYYY'),
        },

    ];
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
                title={<MyNewTitle variant="h6" text="Tasks List" />}
                data={listProcessDetail}
                columns={columns}
                actions={[]}
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
                    search: true,
                    headerStyle: { backgroundColor: "#bd162c", color: "#fff", fontSize: '18px', textAlign: 'center' },
                }}
            />
        </React.Fragment>
    );
};
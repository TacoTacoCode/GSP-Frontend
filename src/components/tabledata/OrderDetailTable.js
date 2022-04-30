import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { useNavigate } from 'react-router-dom';
import { Typography, } from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import swal from "sweetalert";
import OrderDetailEditPopup from "../Popups/OrderDetailEditPopup";
import axios from 'axios';


export const OrderDetailTable = (props) => {
    document.title = "UFA - Order Details"

    function createProcess(orderDetail) {
        axios.post(`${process.env.REACT_APP_API_URL}createProcess`, {
            "orderDetailId": orderDetail.orderDetailId,
            "orderId": orderDetail.orderId,
            "productId": orderDetail.productId,
            "amount": orderDetail.amount,
            "price": orderDetail.price,
            "note": orderDetail.note
        })
            .then((response) => {
                localStorage.setItem('process', JSON.stringify(response.data))
                navigate('/createProcess')
            }
            ).catch((err) => {
                console.log(err);
            })

    };
    let navigate = useNavigate();
    const { listOrderDetail, status } = props;
    const array = [];
    listOrderDetail.forEach(item => {
        array.push(item)
    }, []);

    const columns = [
        {
            title: 'ID', field: 'orderDetailId', cellStyle: { fontFamily: 'Muli',  }, align: 'left'
        },
        {
            title: 'Order ID', field: 'orderId', cellStyle: { fontFamily: 'Muli',  }, align: 'left'
        },
        {
            title: 'Product ID', field: 'productId', cellStyle: { fontFamily: 'Muli',  }, align: 'left'
        },
        {
            title: 'Amount', field: 'amount', cellStyle: { fontFamily: 'Muli',  }, align: 'left'
        },
        {
            title: 'Price(x1000VND)', field: 'price', cellStyle: { fontFamily: 'Muli',  }, align: 'left'
        },
        {
            title: 'Note', field: 'note', cellStyle: { fontFamily: 'Muli',  }, align: 'left'
        },
    ]
    function deleteOrderDetail(id) {
        axios.put(`${process.env.REACT_APP_API_URL}delOrderDetail/` + id)
            .then((response) => {
                swal("Success", "Delete this Order Detail successfully", "success", {
                    button: false,
                    timer: 2000,
                }).then(window.location.reload());
            }).catch((err) => {
                swal("Error", "Delete this Order Detail failed", "error", {
                    button: false,
                    time: 2000,
                }).then(window.location.reload());
            })

    }
    function confirmDelete(id) {
        let countProcess = 0;
        axios.get(`${process.env.REACT_APP_API_URL}getNoProcess/` + id)
            .then((res) => {
                countProcess = res.data
                if (countProcess != 0) {
                    let warning = `This order detail has ${countProcess} process(es)!\n` +
                        'Once deleted, current processes will be shut down'
                    swal({
                        title: "Are you sure to delete this order?",
                        text: warning,
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    }).then((willDelete) => {
                        if (willDelete) {
                            deleteOrderDetail(id)
                        }
                    });
                } else {
                    deleteOrderDetail(id)
                }
            })

    }
    const [editDatasDetail, setEditDatasDetail] = useState(null);
    const [openDetail, setOpenDetail] = useState(false);
    const handleEditData = (rowData) => {
        setEditDatasDetail(rowData);
        setOpenDetail(true);
    }
    function getNoProcess(orderDetailId) {
        let no = 0;
        axios.get(`${process.env.REACT_APP_API_URL}getNoProcess/` + orderDetailId)
            .then((res) => {
                no = res.data
                return no
            })
    }
    const newData = array.map((value) => ({ ...value, No_Process: getNoProcess(value.orderDetailId) }));

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
            <div className='caution-message'>
                <text>*Note: When you want to edit the item of order details, you have to delete this item and add the new one!</text>
            </div>
            <br />

            <MaterialTable title={<MyNewTitle variant="h6" text="Order Details List" />}
                data={newData}
                columns={columns}
                actions={
                    status == 'Completed' || status == 'Delivering' ? [] :
                        [
                            rowData => ({
                                icon: "delete",
                                tooltip: "Delete this item",
                                onClick: (event, rowData) => {
                                    event.preventDefault()
                                    confirmDelete(rowData.orderDetailId);
                                },
                                disabled: (rowData.isActive == false)
                            }),
                            {
                                icon: "edit",
                                tooltip: "View/Edit this order detail",
                                onClick: (event, rowData) => {
                                    event.preventDefault()
                                    handleEditData(rowData);
                                },
                            },
                            {
                                icon: () => <AddBoxIcon />,
                                tooltip: 'Create Plan for this Order Detail',
                                onClick: (event, rowData) => {
                                    event.preventDefault()
                                    createProcess(rowData);
                                }
                            }
                        ]}
                options={{
                    searchFieldVariant: 'outlined',
                    searchFieldStyle: {
                        fontFamily: 'Muli',
                        color: '#0E185F',
                        marginTop: '2%',
                        marginBottom: '2%',
                    },
                    addRowPosition: 'first',
                    actionsColumnIndex: -1,
                    exportButton: false,
                    actionsCellStyle: {
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                    },
                    headerStyle: { backgroundColor: '#bd162c', color: '#fff',  }
                }}
            />

            {editDatasDetail &&
                <OrderDetailEditPopup
                    dataDetail={editDatasDetail}
                    setDataDetail={setEditDatasDetail}
                    IsOpenDetail={openDetail}
                    setOpenDetail={setOpenDetail}
                >
                    <h3 className="popuptitle">Edit order detail : {editDatasDetail.orderDetailId} </h3>
                </OrderDetailEditPopup>
            }
        </React.Fragment>
    )
}
import { Tooltip } from '@material-ui/core';
import { styled } from '@material-ui/styles';
import { TextField } from '@mui/material';
import axios from "axios";
import MaterialTable from 'material-table';
import moment from 'moment';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Bell from "../../img/bell.png";
import "../../styles/notifcation.css";
import OrderEditPopup from '../Popups/OrderEditPopup';

const CssTextField = styled(TextField)({
    width: "100%",
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            border: "none",
        },
    },
});
export const Table = (props) => {
    let navigate = useNavigate();
    const { listOrder } = props;
    const processingOrder = [];
    const waitOrder = [];
    listOrder.forEach(item => {
        if (item.status == "Pending")
            waitOrder.push(item)
        else
            processingOrder.push(item)
    }, []);

    const columns = [
        {
            title: 'ID', field: 'orderId', cellStyle: { fontFamily: 'Arial',  },
        },
        {
            title: 'Customer Name', field: 'customerName', cellStyle: { fontFamily: 'Muli',  },
            // render:
            //     rowData => (rowData.accountId != null)
            //         ? <TextGetSectionLeader accountID={rowData.accountId} />
            //         : "Unknown User"
        },
        {
            title: 'Expiry Date',
            field: 'expiryDate',
            cellStyle: { fontFamily: 'Muli',  },
            render:
                rowData => moment(rowData.expiryDate).format('DD/MM/YYYY'),
        },
        {
            title: 'Total Price(x1000 VND)', field: 'totalPrice', cellStyle: { fontFamily: 'Muli',  },
        },
        {
            title: 'Status', field: 'status', cellStyle: { fontFamily: 'Muli',  },
            render: ((rowData) => {
                switch (rowData.status) {
                    case 'Pending':
                        return <div style={{ fontWeight: "500", marginTop: "0.5%", border: '1px solid #886F6F', backgroundColor: '#886F6F' }} className="text_square">
                            <text style={{ color: 'white', fontWeight: "500" }}>Pending</text>
                        </div>
                    case 'New':
                        return <div style={{ fontWeight: "500", marginTop: "0.5%", border: '1px solid #FF1818', backgroundColor: '#FF1818' }} className="text_square">
                            <text style={{ color: 'white', fontWeight: "500" }}>New</text>
                        </div>
                    case 'Processing':
                        return <div style={{ fontWeight: "500", marginTop: "0.5%", border: '1px solid #F48B29', backgroundColor: '#F48B29' }} className="text_square">
                            <text style={{ color: 'white', fontWeight: "500" }}>Processing</text>
                        </div>
                    case 'Completed':
                        return <div style={{ fontWeight: "500", marginTop: "0.5%", border: '1px solid #333c83', backgroundColor: '#333c83' }} className="text_square">
                            <text style={{ color: 'white', fontWeight: "500" }}>Completed</text>
                        </div>
                    case 'Delivering':
                        return <div style={{ fontWeight: "500", marginTop: "0.5%", border: '1px solid #21BF73', backgroundColor: '#21BF73' }} className="text_square">
                            <text style={{ color: 'white', fontWeight: "500" }}>Delivering</text>
                        </div>
                }
            })
        },
        {
            title: 'Note', field: 'note', cellStyle: { fontFamily: 'Muli',  }
        },
    ]

    const [editDatas, setEditDatas] = useState(null);
    const [open, setOpen] = useState(false);
    const [orderProduct, setListOrderProduct] = useState([]);
    //const [customerList, setCustomerList] = useState([]);
    const [seeWaiting, setSeeWaiting] = useState(false);

    const handleEditData = (rowData) => {
        setEditDatas(rowData);
        setOpen(true);
        axios.get(`${process.env.REACT_APP_API_URL}getOrderDetailsOf/ord/` + rowData.orderId).then(
            (res) => setListOrderProduct(res.data)
        );
    }

    return (<>

        {waitOrder.length > 0 && <div className="icon">
            <Tooltip className="icon" title={`You have ${waitOrder.length} new order(s)`}>
                <img src={Bell} className="iconImg" alt="" onClick={() => setSeeWaiting(prevState => !prevState)} />
            </Tooltip>
            <div className="counter">{waitOrder.length}</div>
        </div>}
        <React.Fragment>
            <MaterialTable title={"List of Orders"}
                data={seeWaiting ? waitOrder : processingOrder}
                columns={columns}
                onRowClick={(event, data) => {
                    localStorage.setItem("orderType", data.isShorTerm)
                    localStorage.setItem("orderId", data.orderId)
                    localStorage.setItem("status", data.status)
                    navigate('/orders/orderdetails');
                }}
                actions={[
                    {
                        icon: "edit",
                        tooltip: "View/Edit this order",
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
                    addRowPosition: 'first',
                    actionsColumnIndex: -1,
                    exportButton: false,
                    headerStyle: { backgroundColor: '#bd162c', color: '#fff',  }
                }} />
            {editDatas &&
                <OrderEditPopup
                    //customerActive={customerList}
                    orderProducts={orderProduct}
                    data={editDatas}
                    setData={setEditDatas}
                    IsOpen={open}
                    setOpen={setOpen}
                >
                    <h3 className="popuptitle">Edit order : {editDatas.orderId} </h3>
                </OrderEditPopup>
            }
        </React.Fragment></>
    )
}
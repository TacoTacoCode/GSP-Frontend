
import { React, useEffect } from 'react'
import '../../../App.css';
import { ImportExcelButton } from '../../button/ImportExcelButton';
import { OrderDetailTable } from '../../tabledata/OrderDetailTable';
import OrderDetailPopup from '../../Popups/OrderDetailPopup';
import { useState } from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function OrderDetails() {
    const [addOrderDetailsBtn, setAddOrderDetailsBtn] = useState(false);
    const location = useLocation();
    const [listOrderDetail, setListOrderDetail] = useState([])
    const [status, setStatus] = useState('')
    const [newDataSubmitted, setNewDataSubmitted] = useState(1);

    useEffect(() => {
        const getAllOrderDetail = `${process.env.REACT_APP_API_URL}getOrderDetailsOf/ord/` + localStorage['orderId']
        //Gọi API bằng axios
        axios.get(getAllOrderDetail).then((res) => {
            setListOrderDetail(res.data);
        }).catch((err) => {
            console.log(err);
            alert("Xảy ra lỗi");
        })
        setStatus(localStorage['status'])
    }, []);

    return (
        <>
            <ImportExcelButton type="button"
                style={{ marginTop: '3%', marginRight: '2%' }}
                onClick={() => {
                    setAddOrderDetailsBtn(true)
                }
                }>Add Order Detail</ImportExcelButton>
            <OrderDetailPopup
                orderId={localStorage['orderId']}
                trigger={addOrderDetailsBtn}
                setTrigger={setAddOrderDetailsBtn}
                setSubmittedTime={() => {
                    setNewDataSubmitted((prevState) => prevState + 1);
                }}>
                <h3 className="popuptitle">Add a Order Detail</h3>
            </OrderDetailPopup>
            <div className='order-details'>
                <OrderDetailTable listOrderDetail={listOrderDetail} status={status} />
            </div></>
    )
}

export default OrderDetails
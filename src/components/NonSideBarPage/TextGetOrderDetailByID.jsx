import React, { useState, useEffect } from 'react'
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import axios from 'axios';

export const TextGetOrderDetailByID = (props) => {
    const [orderDetail, setOrderDetail] = useState([]);

    useEffect(async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}getOrderDetailsOf/ord/` + props.orderID);
        setOrderDetail(res.data);
    }, [])

    return (
        <div>
            {
                (orderDetail.length != 0)
                    ?
                    <div>
                        {
                            orderDetail.map(data => (
                                <div style={{ margin: "1%", width: "95%", marginLeft: "3%" }}>
                                    <Stack
                                        direction="row"
                                        spacing={1}>
                                        <div className="content_orderdetail_content"><text style={{ fontWeight: "500" }}>Product:&nbsp;</text><text>{data.productId}&nbsp;=</text></div>
                                        <div className="content_orderdetail_content"><text style={{ fontWeight: "500" }}>Amount(</text><text>{data.amount})</text>&nbsp;x</div>
                                        <div className="content_orderdetail_content"><text style={{ fontWeight: "500" }}>Price(</text><text>{data.price})</text></div>
                                        <div className="content_orderdetail_content"><text style={{ fontWeight: "500" }}>=</text>&nbsp;<text>{data.price * data.amount} VND</text></div>
                                    </Stack>
                                </div>
                            ))}

                    </div>
                    : <text className="caution-order-details">*Note: There are currently no products in this order!</text>
            }
        </div>
    );
}
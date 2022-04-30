import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import {
    Button,
} from "@mui/material";
import { GetProcessByOrderDetailID } from './GetProcessByOrderDetailID';

export const GetProcessByOrderID = (props) => {
    const [orderDetail, setOrderDetail] = useState([]);
    const [openProcess, setOpenProcess] = useState(false);

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
                                <div>
                                    <Card style={{ border: '1px solid red', marginLeft: "3%", marginBottom: "3%", marginRight: "3%", backgroundColor: "whitesmoke", borderRadius: "10px" }}>
                                        <Stack
                                            direction="column"
                                            divider={<Divider orientation="horizontal" flexItem style={{ border: '1px solid red' }} />}
                                            spacing={0}
                                        >
                                            <div style={{ margin: "1%", width: "95%" }}>
                                                <div className="content_delivery_longterm">
                                                    <text style={{ verticalAlign: 'middle', fontWeight: "500" }}>Product: {data.productId}</text>
                                                    {
                                                        (openProcess)
                                                            ?
                                                            <Button style={{ padding: '0', float: 'right', color: 'red' }} onClick={() => {
                                                                setOpenProcess(!openProcess);
                                                            }}>COLLAPSE</Button>
                                                            :
                                                            <Button style={{ padding: '0', float: 'right', color: 'red' }} onClick={() => {
                                                                setOpenProcess(!openProcess);
                                                            }}>EXPAND</Button>
                                                    }
                                                </div>
                                            </div>
                                            <div style={{ margin: "1%", width: "95%" }}>
                                                <GetProcessByOrderDetailID open={openProcess} orderDetailID={data.orderDetailId} />
                                            </div>
                                        </Stack>
                                    </Card>
                                    <br />
                                </div>
                            ))
                        }

                    </div>
                    : <text className="caution-order-details">*Note: There are currently no product in this order!</text>
            }
        </div>
    );
}
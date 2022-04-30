import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ProcessBar from '../NonSideBarPage/ProcessBar';
import moment from 'moment';
import axios from 'axios';
import swal from "sweetalert";
import {
    Button,
} from "@mui/material";

export const GetProcessByOrderDetailID = (props) => {
    const [curProcess, setProcess] = useState([]);

    useEffect(async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}getProcess/orderDetail/` + props.orderDetailID);
        setProcess(res.data);
    }, [])

    // Order Ready Function
    const orderReady = (e, data) => {
        e.preventDefault();
        console.log(data);
        const jsonObj = {
            processId: data.processId,
            orderDetailId: data.orderDetailId,
            totalAmount: data.totalAmount,
            finishedAmount: data.finishedAmount,
            createdDate: new Date(data.createdDate).toISOString(),
            expiryDate: new Date(data.expiryDate).toISOString(),
            finishedDate: new Date(data.finishedDate).toISOString(),
            expectedFinishDate: new Date(data.expectedFinishDate).toISOString(),
            status: 'Delivering'
        }
        axios
            .put(`${process.env.REACT_APP_API_URL}updateProcess`, jsonObj)
            .then((res) => {
                swal("Success", "This process is accepted to delivery", "success", {
                    button: false,
                    timer: 2000,
                });
            })
            .catch((err) => {
                swal("Error", "Something wrong!", "error", {
                    button: false,
                    timer: 2000,
                })
            }).finally(() => {
                delay(function () { window.location.reload(); }, 1000);
            })
    }

    // Delay function
    var delay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    return (props.open) ? (
        <div>
            {
                (curProcess.length != 0)
                    ?
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                    }}>
                        {
                            curProcess.map((data, index) => (
                                <div>
                                    <Card style={{
                                        border: '1px solid red',
                                        backgroundColor: "white",
                                        borderRadius: "10px",
                                        width: '27.5rem',
                                        marginLeft: "3%", marginBottom: "3%", marginTop: "3%"
                                    }}>
                                        <Stack
                                            direction="column"
                                            divider={<Divider orientation="horizontal" flexItem style={{ border: '1px solid red' }} />}
                                            spacing={0}
                                        >
                                            <div style={{ margin: "1%" }}>
                                                <text className="content_delivery_longterm" style={{ fontWeight: "500", marginTop: "0.5%", float: 'left' }}>Process: {index + 1}</text>
                                                {(() => {
                                                    switch (data.status) {
                                                        case 'New':
                                                            return <div style={{ fontWeight: "500", marginTop: "0.5%", float: 'right', border: '1px solid RED', backgroundColor: 'red' }} className="text_square">
                                                                <text style={{ color: 'white', fontWeight: "500" }}>NEW</text>
                                                            </div>
                                                        case 'Processing':
                                                            return <div style={{ fontWeight: "500", marginTop: "0.5%", float: 'right', border: '1px solid DARKBLUE', backgroundColor: 'DARKBLUE' }} className="text_square">
                                                                <text style={{ color: 'white', fontWeight: "500" }}>PROCESSING</text>
                                                            </div>
                                                        case 'Done':
                                                            return <div style={{ fontWeight: "500", marginTop: "0.5%", float: 'right', border: '1px solid BLUE', backgroundColor: 'BLUE' }} className="text_square">
                                                                <text style={{ color: 'white', fontWeight: "500" }}>COMPLETED</text>
                                                            </div>
                                                        case 'Delivering':
                                                            return <div style={{ fontWeight: "500", marginTop: "0.5%", float: 'right', border: '1px solid #99ff66', backgroundColor: '#99ff66' }} className="text_square">
                                                                <text style={{ color: 'white', fontWeight: "500" }}>DELIVERIED</text>
                                                            </div>
                                                    }
                                                })()
                                                }
                                            </div>
                                            <Stack
                                                direction="row"
                                                divider={<Divider orientation="vertical" flexItem style={{ border: '1px solid red' }} />}
                                                spacing={0}
                                            >
                                                <div style={{ margin: "1%", width: '50%' }}>
                                                    <p className="content_delivery_content" style={{ fontWeight: "450" }}><text>Process ID: </text>&ensp;<text>{data.processId}</text></p>
                                                    <p className="content_delivery_content" style={{ fontWeight: "450" }}><text>Needed Amount: </text>&ensp;<text>{data.neededAmount}</text></p>
                                                    <p className="content_delivery_content" style={{ fontWeight: "450" }}><text>Total Amount: </text>&ensp;<text>{data.totalAmount}</text></p>
                                                    <p className="content_delivery_content" style={{ fontWeight: "450" }}><text>Finished Amount: </text>&ensp;<text>{data.finishedAmount}</text></p>
                                                </div>
                                                <div style={{ margin: "1%", width: '50%' }}>
                                                    <p className="content_delivery_content" style={{ fontWeight: "450" }}><text>Created Date: </text>&ensp;<text>{moment(data.createdDate).format('DD/MM/YYYY')}</text></p>
                                                    <p className="content_delivery_content" style={{ fontWeight: "450" }}><text>Experied Date: </text>&ensp;<text>{moment(data.expiryDate).format('DD/MM/YYYY')}</text></p>
                                                    <p className="content_delivery_content" style={{ fontWeight: "450" }}><text>Finished Date: </text>&ensp;<text>{moment(data.finishedDate).format('DD/MM/YYYY')}</text></p>
                                                    <p className="content_delivery_content" style={{ fontWeight: "450" }}><text>Expected Finished Date: </text>&ensp;<text>{moment(data.expectedFinishDate).format('DD/MM/YYYY')}</text></p>
                                                </div>
                                            </Stack>
                                            <div style={{ margin: "1%" }}>
                                                <text className="content_delivery_content" style={{ fontWeight: "500" }}> Effort: </text>
                                                {
                                                    (data.finishedAmount == 0 && data.totalAmount == 0)
                                                        ?
                                                        <ProcessBar fgcolor="black" bgcolor="#99ff66" progress={0} height={30} />
                                                        :
                                                        <ProcessBar fgcolor="black" bgcolor="#99ff66" progress={(data.finishedAmount / data.totalAmount) * 100} height={30} />
                                                }
                                                <br />
                                                {
                                                    (data.status == 'Done' && ((data.finishedAmount / data.totalAmount) * 100) == 100)
                                                        ? <Button style={{
                                                            fontFamily: "Muli",
                                                            borderRadius: 10,
                                                            backgroundColor: "#bd162c",
                                                            color: "white",
                                                            float: 'right',
                                                        }}
                                                            onClick={(e) => orderReady(e, data)}>Order Ready</Button>
                                                        : ""
                                                }
                                                <br />
                                            </div>
                                        </Stack>
                                    </Card>
                                </div>
                            ))
                        }
                    </div>
                    : <text className="caution-order-details">*Note: There are currently no process in this order!</text>
            }
        </div >
    ) : "";
}
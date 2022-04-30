import { React, useEffect, Fragment } from 'react'
import '../../../App.css';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import {
  Button,
} from "@mui/material";
import { DeliveryButton } from '../../button/DeliveryButton';
import { useState } from 'react'
import axios from 'axios'
import { TextGetAccountByID } from '../../NonSideBarPage/TextGetAccountByID';
import { TextGetOrderDetailByID } from '../../NonSideBarPage/TextGetOrderDetailByID';
import swal from "sweetalert";
import ProcessBar from '../../NonSideBarPage/ProcessBar';
import { GetProcessByOrderID } from '../../NonSideBarPage/GetProcessByOrderID';


function Delivery() {
  useEffect(() => {
    document.title = "UFA - Manage Delivery"
  }, []);

  const [visibleShortTermBtn, setVisibleShortTermBtn] = useState(true);
  const [visibleLongTermBtn, setVisibleLongTermBtn] = useState(false);

  //state list
  const [listOrderShortTerm, setListOrderShortTerm] = useState([]);
  const [listOrderLongTerm, setListOrderLongTerm] = useState([]);

  //count list
  const [countListOrderShortTerm, setCountListOrderShortTerm] = useState(0);
  const [countListOrderLongTerm, setCountListOrderLongTerm] = useState(0);

  // Get listOrderNew
  useEffect(() => {
    const getAllOrders = `${process.env.REACT_APP_API_URL}getAllOrders`
    let shortTerm = []
    let longTerm = []
    axios.get(getAllOrders).then((res) => {
      res.data.map(e => {
        if (e.status != "Pending" && e.status != 'New')
          e.isShorTerm ? shortTerm.push(e) : longTerm.push(e)
      })
      setListOrderShortTerm(shortTerm);
      setCountListOrderShortTerm(shortTerm.length);

      setListOrderLongTerm(longTerm);
      setCountListOrderLongTerm(longTerm.length);
    }).catch((err) => {
      console.log(err);
      alert("Cannot Load List Order");
    })
  }, []);


  // Delay function
  var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();

  // Order Ready Function
  const orderReady = (e, data) => {
    e.preventDefault();
    console.log(data);
    const jsonObj = {
      orderId: data.orderId,
      accountId: data.accountId,
      totalPrice: data.totalPrice,
      expiryDate: new Date(data.expiryDate).toISOString(),
      status: 'Delivering',
      note: data.note,
      isShorTerm: data.isShorTerm,
    }
    axios
      .put(`${process.env.REACT_APP_API_URL}updateOrder`, jsonObj)
      .then((res) => {
        swal("Success", "Order is accepted to delivery", "success", {
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

  return (
    <Fragment>
      <br /><br /><br />
      <div>
        <DeliveryButton type="button"
          onClick={() => {
            setVisibleShortTermBtn(true)
            setVisibleLongTermBtn(false)
          }
          }>
          <Stack
            direction="row"
            spacing={3}
          >
            <div style={{ verticalAlign: "middle", padding: "5px" }}>Short Term</div>
            <div className="number_square">
              {countListOrderShortTerm}
            </div>
          </Stack>
          {
            (visibleShortTermBtn == true) ? <div style={{ marginTop: "10px", backgroundColor: "white", height: "3px" }}></div> : ""
          }
        </DeliveryButton>
        <DeliveryButton type="button"
          onClick={() => {
            setVisibleShortTermBtn(false)
            setVisibleLongTermBtn(true)
          }
          }>
          <Stack
            direction="row"
            spacing={3}
          >
            <div style={{ verticalAlign: "middle", padding: "5px" }}>Long Term</div>
            <div className="number_square">
              {countListOrderLongTerm}
            </div>
          </Stack>
          {
            (visibleLongTermBtn == true) ? <div style={{ marginTop: "10px", backgroundColor: "white", height: "3px" }}></div> : ""
          }</DeliveryButton>
      </div>
      <br /><br /><br /><br />
      <hr style={{ border: '1px solid red', borderRadius: '5px' }} />
      <br /><br />
      {
        (visibleShortTermBtn == true && visibleLongTermBtn == false)
          ? <div>
            {listOrderShortTerm.map(data => (
              <Card style={{ border: '1px solid red', marginLeft: "3%", marginBottom: "3%", marginRight: "3%", backgroundColor: "white", borderRadius: "20px" }}>
                <Stack
                  direction="row"
                  divider={<Divider orientation="vertical" flexItem />}
                  spacing={1}
                >
                  <div style={{ margin: "1%", width: "95%" }}>
                    <text className="content_delivery">Customer</text>
                    <br /><br />
                    <Stack
                      direction="column"
                      divider={<Divider orientation="horizontal" flexItem />}
                      spacing={1}
                    >
                      {/* Customer Details */}
                      <TextGetAccountByID accountID={data.accountId} />
                      {/* Order Details */}
                      <div>
                        <text className="content_delivery">Order </text>
                        <br /><br />
                        <p className="content_delivery_content" style={{ fontWeight: "500" }}><text>ID: </text>&ensp;<text>{data.orderId}</text></p>
                        <p className="content_delivery_content">
                          <text style={{ fontWeight: "500" }}>Status: </text>
                          &ensp;
                          {(() => {
                            switch (data.status) {
                              case 'New':
                                return <text style={{ color: 'RED', fontWeight: "500" }}>NEW</text>
                              case 'Processing':
                                return <text style={{ color: 'DARKBLUE', fontWeight: "500" }}>PROCESSING</text>
                              case 'Completed':
                                return <text style={{ color: 'BLUE', fontWeight: "500" }}>COMPLETED</text>
                              case 'Delivering':
                                return <text style={{ color: 'GREEN', fontWeight: "500" }}>DELIVERING</text>
                            }
                          })()
                          }
                        </p>
                      </div>
                    </Stack>
                  </div>
                  <div style={{ margin: "1%", width: "95%" }}>
                    {/* Product Details */}
                    <text className="content_delivery">Product </text>
                    <br /><br />
                    <Stack
                      direction="column"
                      divider={<Divider orientation="horizontal" flexItem />}
                      spacing={1}
                    >
                      <TextGetOrderDetailByID orderID={data.orderId} />
                      <p className="content_delivery_content" style={{ fontWeight: "500" }}><text>Total Price: </text>&emsp;<text>{data.totalPrice} VND</text></p>
                      {
                        (data.status == 'Completed' && data.totalPrice > 0)
                          ? <Button style={{
                            marginTop: '5%',
                            width: 'fit-content',
                            alignSelf: 'end',
                            fontFamily: "Muli",
                            borderRadius: 10,
                            backgroundColor: "#bd162c",
                            color: "white",
                          }}
                            onClick={(e) => orderReady(e, data)}>Order Ready</Button>
                          : ""
                      }
                    </Stack>
                  </div>
                </Stack>
              </Card>
            ))}
          </div>
          : null
      }

      {
        (visibleShortTermBtn == false && visibleLongTermBtn == true)
          ? <div>
            {listOrderLongTerm.map(data => (
              <Card style={{ border: '1px solid red', marginLeft: "3%", marginBottom: "3%", marginRight: "3%", backgroundColor: "white", borderRadius: "20px" }}>
                <Stack
                  direction="row"
                  divider={<Divider orientation="vertical" flexItem />}
                  spacing={1}
                >
                  <div style={{ margin: "1%", width: "40%" }}>
                    <text className="content_delivery">Customer</text>
                    <br /><br />
                    <Stack
                      direction="column"
                      divider={<Divider orientation="horizontal" flexItem />}
                      spacing={1}
                    >
                      {/* Customer Details */}
                      <TextGetAccountByID accountID={data.accountId} />
                      {/* Order Details */}
                      <div>
                        <text className="content_delivery">Order </text>
                        <br /><br />
                        <p className="content_delivery_content" style={{ fontWeight: "500" }}><text>ID: </text>&ensp;<text>{data.orderId}</text></p>
                        <p className="content_delivery_content">
                          <text style={{ fontWeight: "500" }}>Status: </text>
                          &ensp;
                          {(() => {
                            switch (data.status) {
                              case 'New':
                                return <text style={{ color: 'RED', fontWeight: "500" }}>NEW</text>
                              case 'Processing':
                                return <text style={{ color: 'DARKBLUE', fontWeight: "500" }}>PROCESSING</text>
                              case 'Completed':
                                return <text style={{ color: 'BLUE', fontWeight: "500" }}>COMPLETED</text>
                              case 'Delivery':
                                return <text style={{ color: 'GREEN', fontWeight: "500" }}>DELIVERIED</text>
                            }
                          })()
                          }
                        </p>
                      </div>
                      {/* Product Details */}
                      <text className="content_delivery">Product </text>
                      <Stack
                        direction="column"
                        divider={<Divider orientation="horizontal" flexItem />}
                        spacing={1}
                      >
                        <TextGetOrderDetailByID orderID={data.orderId} />
                        <div style={{ margin: "1%", width: "95%", marginLeft: "3%" }}>
                          <p className="content_orderdetail_content" style={{ fontWeight: "500" }}><text>Total Price: </text>&emsp;<text style={{ float: 'right' }}>{data.totalPrice}x 1000 VND</text></p>
                        </div>
                      </Stack>
                    </Stack>
                  </div>
                  <div style={{ margin: "1%", width: "60%" }}>
                    {/* Long Term Details */}
                    <text className="content_delivery">Long Term Process </text>
                    <br /><br />
                    <GetProcessByOrderID orderID={data.orderId} />
                  </div>
                </Stack>
              </Card>
            ))}
          </div>
          : null
      }

      <br />
    </Fragment>
  )
}

export default Delivery
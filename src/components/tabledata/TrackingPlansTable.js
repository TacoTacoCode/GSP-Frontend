import { styled } from '@material-ui/core';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { TextField, Typography } from '@mui/material';
import axios from 'axios';
import MaterialTable from 'material-table';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

export const TrackingPlansTable = (props) => {
    const navigate = useNavigate();

    const CssTextField = styled(TextField)({
        width: "100%",
        "& .MuiOutlinedInput-root": {
            fontFamily: "Muli",
            fontSize: "18px",

            "& fieldset": {
                border: "none",
            },
        },
        "& .MuiOutlinedInput-input": {
            textAlign: 'center',
            fontFamily: "Muli",
        }
    });

    const { listPlan } = props;
    const array = [];

    listPlan.forEach((item) => {
        array.push(item);
    });

    function deletePlan(id) {
        swal({
            title: "Are you sure to delete this plan?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    try {
                        axios
                            .put(`${process.env.REACT_APP_API_URL}delProcess/` + id)
                            .then((res) => {
                                swal("Success", "Plan deleted successfully", "success", {
                                    button: false,
                                    timer: 2000,
                                });
                            })
                            .catch((err) => {
                                swal("Error", "Plan deleted  failed", "error", {
                                    button: false,
                                    timer: 2000,
                                });
                            });
                    } catch (error) {
                        console.log(error);
                    }
                    delay(function () { window.location.reload(); }, 1000);
                } else {
                    swal({
                        title: "This plan is still available!",
                        icon: "info",
                    });
                }
            });
    }

    var delay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();


    const columns = [
        {
            title: "Plan ID",
            field: "processId",
            cellStyle: { fontFamily: "Muli", fontSize: "18px" },
            align: 'center',
        },
        {
            title: "Order Detail ID",
            field: "orderDetailId",
            cellStyle: { fontFamily: "Muli", fontSize: "18px" },
            align: 'center',
        },
        {
            title: "Needed Amount",
            field: "neededAmount",
            cellStyle: { fontFamily: "Muli", fontSize: "18px" },
            align: 'center',
        },
        {
            title: "Total Amount",
            field: "totalAmount",
            cellStyle: { fontFamily: "Muli", fontSize: "18px" },
            align: 'center',
        },
        {
            title: "Finished Amount",
            field: "finishedAmount",
            cellStyle: { fontFamily: "Muli", fontSize: "18px" },
            align: 'center',
        },
        {
            title: 'Created Date', field: 'createdDate', render:
                rowData => <LocalizationProvider dateAdapter={AdapterDateFns}><DesktopDatePicker
                    disableOpenPicker
                    inputFormat="MM/dd/yyyy"
                    value={array[rowData.tableData.id].createdDate}
                    renderInput={(params) => <CssTextField
                        inputProps={{ readOnly: true }} style={{ width: "fit-content", textAlign: "center" }} disabled {...params} />}
                /></LocalizationProvider>,
            cellStyle: { fontFamily: 'Muli' }, align: "center"
        },
        {
            title: 'Expiry Date', field: 'expiryDate', render:
                rowData => <LocalizationProvider dateAdapter={AdapterDateFns}><DesktopDatePicker
                    disableOpenPicker
                    inputFormat="MM/dd/yyyy"
                    value={array[rowData.tableData.id].expiryDate}
                    renderInput={(params) => <CssTextField
                        inputProps={{ readOnly: true }} style={{ width: "fit-content", textAlign: "center" }} disabled {...params} />}
                /></LocalizationProvider>,
            cellStyle: { fontFamily: 'Muli' }, align: "center"
        },
        {
            title: "Status",
            field: "status",
            cellStyle: { fontFamily: "Muli", fontSize: "18px" },
            align: 'center',
            render:
                ((rowData) => {
                    let color = '#21BF73'
                    if (rowData.status == 'New') {
                        color = '#333C83'
                    }
                    if (rowData.status == 'Inactive') {
                        color = '#E02401'
                    }
                    if (rowData.status == 'Processing') {
                        color = '#F48B29'
                    }
                    if (rowData.status == 'Completed') {
                        color = '#E45826'
                    }
                    return <div style={{ marginLeft: '18%', fontWeight: "500", marginTop: "0.5%", border: `1px solid ${color}`, backgroundColor: `${color}` }} className="text_square">
                        <text style={{ color: 'white', fontWeight: "500" }}>{rowData.status}</text>
                    </div>
                }),
        },
    ]

    const MyNewTitle = ({ text = "Table Title", variant = "h6" }) => (
        <Typography
            variant={variant}
            style={{ color: '#333C83', fontFamily: 'Muli' }}
        >
            {text}
        </Typography>
    );

    function getPlanTasks(processId) {
        localStorage.setItem('processId', processId)
        navigate('/manufacturer/process/processDetail'
        )

    };

    return (
        <MaterialTable
            title={<MyNewTitle variant="h6" text="Plans List" />}
            data={array}
            columns={columns}
            actions={localStorage['currentRole'] === 'Section Department' ? [] : [
                rowData => ({
                    icon: "delete",
                    tooltip: "Delete Plan",
                    onClick: (event, rowData) => {
                        deletePlan(rowData.processId);
                    },
                    disabled: (rowData.status == 'Inactive')
                }),
            ]}
            onRowClick={(event, rowData) => {
                getPlanTasks(rowData.processId)
            }
            }
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
                headerStyle: { backgroundColor: "#bd162c", color: "#fff" },
            }}
        />
    )
}

export default TrackingPlansTable
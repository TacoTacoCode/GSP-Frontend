import React, { useEffect, useState } from 'react'
import { TextField } from "@material-ui/core";
import './process.css'
import { InputAdornment, Typography } from '@mui/material';
import { styled } from '@material-ui/styles';
import '../button/button.css'
import { ImportExcelButton } from '../button/ImportExcelButton';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import DivideProcessPopup from '../Popups/DivideProcessPopup';
import axios from 'axios';
import MaterialTable from 'material-table';
import moment from 'moment';
import swal from 'sweetalert';
function CreateProcess() {

    const CssTextField = styled(TextField)({
        width: "100%",
        "& label.Mui-focused": {
            color: "black",
        },
        "& .MuiInput-underline:after": {
            borderBottomColor: "#bd162c",
        },
        "& .MuiOutlinedInput-root": {
            "& fieldset": {
                borderColor: "black",
            },
            "&:hover fieldset": {
                borderColor: "#ff4747",
            },
            "&.Mui-focused fieldset": {
                borderColor: "#bd162c",
            },
        },
    });

    var curProcess = JSON.parse(localStorage.getItem('process'))
    const [tableData, setTableData] = useState([])


    useEffect(() => {
        const processDetail = curProcess.processDetails;
        let datas = []
        let compos = {}
        let promises = processDetail.map((e) => {
            datas.push({ ...e })
            return axios.get(`${process.env.REACT_APP_API_URL}getCompos/sec/` + e.sectionId)
        })
        Promise.all(promises).then((e) =>
            e.map((ele, index) => {
                datas[index].componentName = ele.data.componentName ?? 'Assemble Section'
                datas[index].componentImg = ele.data.imageUrl ?? 'no-image.jpg?alt=media&token=c45f5852-28eb-4b4d-87a8-2caefb10df12'
                compos[processDetail[index].sectionId] = {
                    "componentName": ele.data.componentName ?? 'Assemble Section',
                    "componentImg": ele.data.imageUrl ?? 'no-image.jpg?alt=media&token=c45f5852-28eb-4b4d-87a8-2caefb10df12'
                }
            })
        ).then(() => {
            localStorage.setItem('listComponent', JSON.stringify(compos))
            setTableData(datas)
        })
    }, [])

    const orderDetailId = curProcess.orderDetailId
    const processId = curProcess.processId


    const [totalAmount, setTotalAmount] = useState(curProcess.totalAmount)
    const [finishedAmount, setFinishedAmount] = useState(curProcess.finishedAmount)
    const [neededAmount, setNeededAmount] = useState(curProcess.neededAmount)
    const [createdDate, setCreatedDate] = useState(curProcess.createdDate)
    const [expectedFinishDate, setExpectedFinishDate] = useState(curProcess.expectedFinishDate)
    const [expiryDate, setExpiryDate] = useState(curProcess.expiryDate)
    const [status,] = useState(curProcess.status)
    const [divideProcess, setDivideProcess] = useState(false);

    const listProcess = [
        {
            orderDetailId,
            processId,
            totalAmount,
            finishedAmount,
            neededAmount,
            createdDate,
            expectedFinishDate,
            expiryDate,
            status
        }
    ]
    const generateData = () => {
        let tmp = [...listProcess]
        tmp[0].processDetails = [...tableData]
        return tmp
    }
    const handleSave = (e) => {
        e.preventDefault();
        let datass = generateData()
        axios({
            url: `${process.env.REACT_APP_API_URL}addProcessList`,
            method: 'POST',
            data: datass
        }).then((response) => {
            swal("Success", "Submit Data", "success", {
                buttons: false,
                timer: 1500,
            }).then((e) => window.location.href = 'http://localhost:3000/orders')
        }).catch((err) => {
            alert('System error, try again later')
        })
    };
    const columns = [
        {
            title: 'Component Name', field: 'componentName', editable: 'false',
            cellStyle: { fontFamily: 'Muli', width: "18%"}, align: 'center'
        },
        {
            title: "Image", field: 'componentImg', align: 'center',
            cellStyle: { fontFamily: "Muli",  width: '10%' }, editable: 'false',
            render: (rowData) =>
                <img src={`https://firebasestorage.googleapis.com/v0/b/gspspring2022.appspot.com/o/Images%2F${rowData.componentImg}`}
                    width="100px" height="100px" />
        },
        {
            title: 'Total Amount', field: 'totalAmount', editable: 'false',
            cellStyle: { fontFamily: 'Muli', width: "14%", paddingRight: '3%' }, align: 'center'
        },
        {
            title: 'Average Amount', field: 'averageAmount', editable: 'false',
            cellStyle: { fontFamily: 'Muli', width: "16%", paddingRight: '3%' }, align: 'center'
        },
        {
            title: 'Expected Finished Date', field: 'expectedFinishDate', editable: 'false',
            cellStyle: { fontFamily: 'Muli', width: "16%" }, align: 'center',
            render: rowData => moment(rowData.expectedFinishDate).format('MM/DD/YYYY')
        },
        {
            title: 'Expiry Date', field: 'expiryDate',
            cellStyle: { fontFamily: 'Muli', width: "16%"},
            align: 'center', type: 'date', editComponent: props => (
                < LocalizationProvider dateAdapter={AdapterDateFns} >
                    <DatePicker
                        inputFormat="MM/dd/yyyy"
                        value={props.rowData.expiryDate}
                        minDate={new Date(createdDate)}
                        maxDate={expiryDate == null ? null : new Date(expiryDate)}
                        onChange={(date) => {
                            let dateFm = moment(date).format('MM/DD/YYYY')
                            props.onChange(dateFm)
                        }}
                        renderInput={(params) =>
                            <CssTextField color='secondary' className='datefield' {...params} />}
                    /></LocalizationProvider >
            )
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

    return (
        <>
            <div className='boxprocess'
                component="form"
                noValidate
                autoComplete="off"
            >
                <form className='formm'>
                    <div style={{ display: 'block', marginBottom: '5%' }}>
                        <h3 className='h3'>Create Plan(s) for Order Detail {curProcess.orderDetailId}</h3>
                        {localStorage.getItem("orderType") == 'false' ?
                            <><ImportExcelButton type="button"
                                onClick={() => {
                                    localStorage.setItem('orderDetail', JSON.stringify(listProcess[0]));
                                    setDivideProcess(true);
                                }
                                }>Divide Plan</ImportExcelButton>
                                <DivideProcessPopup
                                    listProcess={listProcess}
                                    trigger={divideProcess}
                                    setTrigger={setDivideProcess}
                                >
                                    <h3 className="popuptitle1">Enter the total amount for each plan, separated by comma.</h3>
                                </DivideProcessPopup></>
                            : <ImportExcelButton type="submit"
                                onClick={(e) => handleSave(e)}>Submit</ImportExcelButton>}

                    </div>
                    <div className='mid2'>
                        <div className='divprocess'>
                            <TextField
                                fullWidth
                                type='number'
                                className='processfield'
                                label="Total Amount"
                                variant="outlined"
                                defaultValue={totalAmount}
                                onChange={(e) => {
                                    let tmp = [...tableData]
                                    tmp.map((el) => {
                                        let x = el.totalAmount / totalAmount
                                        el.totalAmount = x * e.target.value
                                        if (el.averageAmount > 0) {
                                            var date = new Date(createdDate)
                                            let datePass = Math.floor(el.totalAmount / el.averageAmount)
                                            date.setDate(date.getDate() + datePass)
                                            el.expectedFinishDate = moment(date).format('MM-DD-YYYY')
                                            if (el.componentName == 'Assemble Section')
                                                setExpectedFinishDate(el.expectedFinishDate)
                                        }
                                    })
                                    setTableData(tmp)
                                    setTotalAmount(e.target.value)
                                }}
                                value={totalAmount}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">Unit</InputAdornment>,
                                }}
                            />
                        </div>
                        <div className='divprocess'>
                            <TextField
                                fullWidth
                                type='number'
                                className='processfield'
                                label="Needed Amount"
                                variant="outlined"
                                defaultValue={neededAmount}
                                onChange={(e) => {
                                    setNeededAmount(e.target.value)
                                }}
                                value={neededAmount}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">Unit</InputAdornment>,
                                }} />
                        </div>
                        <div className='divprocess' style={{ visibility: 'hidden' }}>
                            <TextField
                                fullWidth
                                key={'finishedAmount'}
                                type='number'
                                className='processfield'
                                label="Finished Amount"
                                variant="outlined"
                                //value={finishedAmount}
                                defaultValue={finishedAmount}
                                onChange={(e) => {
                                    setFinishedAmount(e.target.value)
                                }}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">Unit</InputAdornment>,
                                }} />
                        </div>

                    </div>
                    <div className='date'>
                        <div className='divprocess'>
                            <LocalizationProvider dateAdapter={AdapterDateFns}><DatePicker
                                inputFormat="MM/dd/yyyy"
                                defaultValue={createdDate}
                                value={createdDate}
                                onChange={date => setCreatedDate(date)}
                                renderInput={(params) => <CssTextField color='secondary' className='datefield' helperText="Created Date"
                                    variant="outlined" {...params} />}
                            /></LocalizationProvider>
                        </div>
                        <div className='divprocess'>
                            <LocalizationProvider dateAdapter={AdapterDateFns}><DatePicker
                                inputFormat="MM/dd/yyyy"
                                defaultValue={expiryDate}
                                value={expiryDate}
                                minDate={new Date(createdDate)}
                                onChange={date => setExpiryDate(date)}
                                renderInput={(params) => <CssTextField type='date' color='secondary' className='datefield' helperText="Expiry Date"
                                    variant="outlined" {...params} />}
                            /></LocalizationProvider>
                        </div>
                        <div className='divprocess'>
                            <LocalizationProvider dateAdapter={AdapterDateFns}><DatePicker
                                disableOpenPicker
                                inputFormat="MM/dd/yyyy"
                                defaultValue={expectedFinishDate}
                                value={expectedFinishDate}
                                onChange={date => setExpectedFinishDate(date)}
                                renderInput={(params) => <CssTextField color='secondary' className='datefield' helperText="Expected Finished Date"
                                    variant="outlined" {...params} />}
                            /></LocalizationProvider>
                        </div>

                    </div>
                    <div className='processDetailTable'>
                        <MaterialTable title={<MyNewTitle variant="h6" text="Tasks List" />}
                            data={tableData}
                            columns={columns}
                            editable={{
                                onBulkUpdate: changes =>
                                    new Promise((resolve, reject) => {
                                        setTimeout(() => {
                                            {
                                                let arr = [...tableData]
                                                Object.keys(changes).map((key) => {
                                                    arr[parseInt(key)] = changes[key].newData
                                                })
                                                setTableData(arr)
                                            }
                                            resolve();
                                        }, 500);
                                    }),
                                onRowUpdate: (newData, oldData) =>
                                    new Promise((resolve, reject) => {
                                        setTimeout(() => {
                                            {
                                                let arr = [...tableData]
                                                const indexDetail = oldData.tableData.id;
                                                arr[indexDetail] = newData
                                                setTableData(arr)
                                            }
                                            resolve();
                                        }, 500);
                                    }),
                            }}
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
                                headerStyle: { backgroundColor: '#bd162c', color: '#fff'}
                            }} />
                    </div>
                </form>
            </div >
        </>
    )
}

export default CreateProcess
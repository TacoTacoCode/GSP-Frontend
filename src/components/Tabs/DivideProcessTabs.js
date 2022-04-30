import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import '../NonSideBarPage/process.css'
import { TextField } from '@material-ui/core';
import { InputAdornment, Typography } from '@mui/material';
import { ImportExcelButton } from '../button/ImportExcelButton';
import axios from 'axios';
import { styled } from '@material-ui/styles';
import 'react-tabs/style/react-tabs.css';
import '../Tabs/tabs.css'
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import MaterialTable from 'material-table';
import moment from 'moment';
import swal from 'sweetalert';
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
function DivideProcessTabs() {


    const location = useLocation();
    const arr = location.state;
    var curProcess = JSON.parse(localStorage['process'])
    var orderDetail = JSON.parse(localStorage.getItem('orderDetail'))
    var listComponent = JSON.parse(localStorage.getItem('listComponent'))

    const [listProcess, setListProcess] = useState([]);

    const [toggleState, setToggleState] = useState(1);
    const toggleTab = (index) => setToggleState(index)

    const updateTotalAmountChanged = (e, index) => {
        let aValue = parseInt(e.target.value);
        var newArr = [...listProcess];

        let tables = [...tableData]
        tables[index].map(pd => {
            let mul = pd.totalAmount / newArr[index].totalAmount
            pd.totalAmount = mul * aValue
            if (pd.averageAmount > 0) {
                var date = new Date(newArr[index].createdDate)
                let datePass = Math.floor(pd.totalAmount / pd.averageAmount)
                date.setDate(date.getDate() + datePass)
                pd.expectedFinishDate = moment(date).format('MM-DD-YYYY')
                if (pd.componentName == 'Assemble Section')
                    newArr[index].expectedFinishDate = pd.expectedFinishDate
            }
        })
        setTableData(tables)
        newArr[index].totalAmount = aValue
        setListProcess(newArr);
    }

    const updateNeededAmountChanged = (e, index) => {
        var newArr = [...listProcess];
        newArr[index].neededAmount = parseInt(e.target.value);
        setListProcess(newArr);
    }

    const updateFinishedAmountChanged = (e, index) => {
        var newArr = [...listProcess];
        newArr[index].finishedAmount = parseInt(e.target.value);
        setListProcess(newArr);
    }

    const updateCreatedDateChanged = (index, date) => {
        let dateFm = moment(date).format('MM-DD-YYYY')
        console.log(dateFm)
        var newArr = [...listProcess];
        newArr[index].createdDate = dateFm;
        setListProcess(newArr);
    }

    const updateExpiryDateChanged = (index, date) => {
        let dateFm = moment(date).format('MM-DD-YYYY')
        var newArr = [...listProcess];
        newArr[index].expiryDate = dateFm
        setListProcess(newArr);
    }


    const updateExpectedFinishDateChanged = (index, date) => {
        let dateFm = moment(date).format('MM-DD-YYYY')
        var newArr = [...listProcess];
        newArr[index].expectedFinishDate = dateFm
        setListProcess(newArr);
    }

    const [tableData, setTableData] = useState([])

    useEffect(() => {
        axios.post(`${process.env.REACT_APP_API_URL}distribute`, {
            "process": curProcess,
            "ProcessAmmounts": arr,
        })
            .then((response) => {
                setListProcess(response.data)
                let datas = []
                response.data.map((e) => {
                    let details = []
                    e.processDetails.map((el) => {
                        details.push({
                            ...el,
                            'componentName': listComponent[el.sectionId].componentName,
                            'componentImg': listComponent[el.sectionId].componentImg,
                        })
                    })
                    datas.push(details)
                })
                setTableData(datas)
            }
            ).catch((err) => {
                console.log(err);
            })
    }, [])

    const generateData = () => {
        let tmp = [...listProcess]
        tmp.map((e, index) => {
            e.processDetails = tableData[index]
        })
        console.log(tmp)
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
            }).then((e) => window.location.href = 'http://localhost:3000/orders/')
        }).catch((err) => {
            alert('System error, try again later')
        })
    };



    const columns = [
        {
            title: 'Component Name', field: 'componentName', editable: 'false',
            cellStyle: { fontFamily: 'Muli', width: "18%" }, align: 'center'
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
            cellStyle: { fontFamily: 'Muli', width: "14%",  paddingRight: '3%' }, align: 'center'
        },
        {
            title: 'Average Amount', field: 'averageAmount', editable: 'false',
            cellStyle: { fontFamily: 'Muli', width: "16%",  paddingRight: '3%' }, align: 'center'
        },
        {
            title: 'Expected Finished Date', field: 'expectedFinishDate', editable: 'false',
            cellStyle: { fontFamily: 'Muli', width: "15%" }, align: 'center',
            render: rowData => moment(rowData.expectedFinishDate).format('MM/DD/YYYY')
        },
        {
            title: 'Expiry Date', field: 'expiryDate',
            cellStyle: { fontFamily: 'Muli', width: "16%" },
            align: 'center', type: 'date', editComponent: props => (
                < LocalizationProvider dateAdapter={AdapterDateFns} >
                    <DatePicker
                        inputFormat="MM/dd/yyyy"
                        value={props.rowData.expiryDate}
                        minDate={listProcess[toggleState - 1].createdDate == null ? null : new Date(listProcess[toggleState - 1].createdDate)}
                        maxDate={listProcess[toggleState - 1].expiryDate == null ? null : new Date(listProcess[toggleState - 1].expiryDate)}
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
            <div style={{ marginBottom: '1%', marginTop: '1%' }}><ImportExcelButton type='submit' onClick={(e) => handleSave(e)}>Submit</ImportExcelButton></div>
            <div className="container">
                <div className="bloc-tabs">
                    {arr.map((e, index) => (
                        <button
                            className={toggleState === (index + 1) ? "tabs active-tabs" : "tabs"}
                            onClick={() => toggleTab(index + 1)}
                        >
                            Plan {index + 1}
                        </button>
                    ))}
                </div>

                <div className="content-tabs">
                    {arr.map((e, index) => (
                        <div
                            className={toggleState === (index + 1) ? "content  active-content" : "content"}
                        >
                            <h2>Plan {index + 1}</h2>
                            <hr />
                            <div className='number'>
                                <div className='divprocess'>
                                    <CssTextField variant="outlined" className='numberfield' type='number' label={'Total Amount'}
                                        value={listProcess[index] === undefined ? 0 : listProcess[index].totalAmount}
                                        onChange={(e) =>
                                            updateTotalAmountChanged(e, index)
                                        }
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">Unit</InputAdornment>,
                                        }}
                                    /></div>
                                <div className='divprocess'>
                                    <CssTextField variant="outlined" className='numberfield' type='number' label={'Needed Amount'}
                                        value={listProcess[index] === undefined ? 0 : listProcess[index].neededAmount}
                                        onChange={(e) =>
                                            updateNeededAmountChanged(e, index)
                                        }
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">Unit</InputAdornment>,
                                        }}
                                    /></div>
                                <div className='divprocess' style={{ visibility: 'hidden' }}>
                                    <CssTextField variant="outlined" color='secondary' className='numberfield' type='number' label={'Finished Amount'}
                                        value={listProcess[index] === undefined ? 0 : listProcess[index].finishedAmount}
                                        onChange={(e) =>
                                            updateFinishedAmountChanged(e, index)
                                        }
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">Unit</InputAdornment>,
                                        }}
                                    />
                                </div>
                            </div>
                            <div className='date'>
                                <div className='divprocess'>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}><DatePicker
                                        inputFormat="MM/dd/yyyy"
                                        value={listProcess[index] === undefined ? 0 : listProcess[index].createdDate}
                                        minDate={new Date()}
                                        onChange={(date) => updateCreatedDateChanged(index, date)}
                                        renderInput={(params) => <CssTextField color='secondary' className='datefield' helperText="Created Date"
                                            variant="outlined" {...params} />}
                                    /></LocalizationProvider>
                                </div>
                                <div className='divprocess'>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}><DatePicker
                                        inputFormat="MM/dd/yyyy"
                                        value={listProcess[index] === undefined ? null : listProcess[index].expiryDate}
                                        minDate={listProcess[index] === undefined ? null : new Date(listProcess[index].createdDate)}
                                        onChange={(date) => updateExpiryDateChanged(index, date)}
                                        renderInput={(params) => <CssTextField color='secondary' className='datefield' helperText="Expiry Date"
                                            variant="outlined" {...params} />}
                                    /></LocalizationProvider>
                                </div>
                                <div className='divprocess'>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}><DatePicker
                                        disableOpenPicker
                                        inputFormat="MM/dd/yyyy"
                                        value={listProcess[index] === undefined ? null : listProcess[index].expectedFinishDate}
                                        minDate={listProcess[index] === undefined ? null : new Date(listProcess[index].createdDate)}
                                        onChange={(date) => updateExpectedFinishDateChanged(index, date)}
                                        renderInput={(params) => <CssTextField color='secondary' className='datefield' helperText="Expected Finished Date"
                                            variant="outlined" {...params} />}
                                    /></LocalizationProvider>
                                </div>
                            </div>
                            <div className='processDetailTable'>
                                {listProcess[index] &&
                                    <MaterialTable title={<MyNewTitle variant="h6" text="Tasks List" />}
                                        data={tableData[index]}
                                        columns={columns}
                                        editable={{
                                            onBulkUpdate: changes =>
                                                new Promise((resolve, reject) => {
                                                    setTimeout(() => {
                                                        {
                                                            let arr = [...tableData]
                                                            Object.keys(changes).map((key) => {
                                                                arr[index][parseInt(key)] = changes[key].newData
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
                                                            arr[index][indexDetail] = newData
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
                                            headerStyle: { backgroundColor: '#bd162c', color: '#fff' }
                                        }}
                                    />}
                            </div>
                        </div>

                    ))}
                </div>
            </div>

        </>
    )
}


export default DivideProcessTabs
import React, { useState } from 'react';
import MaterialTable from 'material-table';
import '../tabledata/TableDesign.css'
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { styled } from '@material-ui/styles';
import { TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Table = (props) => {

    const navigate = useNavigate();
    const { listRequestComponents } = props;
    const array = [];

    listRequestComponents.forEach(item => {
        array.push(item)
    }, []);
    const CssTextField = styled(TextField)({
        width: "100%",
        "& .MuiOutlinedInput-root": {
            "& fieldset": {
                border: "none",
            },
        },
    });

    function getImExDetail(importExportId, itemType) {
        localStorage.setItem('itemType', itemType)
        localStorage.setItem('importExportId', importExportId)
        navigate('/manufacturer/requestDetail')

    };

    const columns = [
        {
            title: 'Request ID', field: 'importExportId', cellStyle: { fontFamily: 'Muli', paddingRight: '3%',  }, align: "center"
        },
        {
            title: 'Section Id', field: 'sectionId', cellStyle: { fontFamily: 'Muli', paddingRight: '3%',  }, align: "center"
        },
        {
            title: 'Section Leader', field: 'sectionLeader', cellStyle: { fontFamily: 'Muli', paddingRight: '3%', fontSize: '18px' }, align: "center"
        },
        {
            title: 'Created Date', field: 'createdDate', render:
                rowData => <LocalizationProvider dateAdapter={AdapterDateFns}><DesktopDatePicker
                    disableOpenPicker
                    inputFormat="MM/dd/yyyy"
                    value={array[rowData.tableData.id].createdDate}
                    renderInput={(params) => <CssTextField inputProps={{ readOnly: true }} style={{ width: "50%" }} disabled {...params} />}
                /></LocalizationProvider>,
            cellStyle: { fontFamily: 'Muli', paddingLeft: '3%',  }, align: "center"
        },
        {
            title: 'Status', field: 'status', cellStyle: { fontFamily: 'Muli',  },
            render:
                ((rowData) => {
                    let color = '#FF1818'
                    if(rowData.status == 'New') {
                        color = '#333C83'
                    }
                    if (rowData.status == 'Done') {
                        color = '#21BF73'
                    }
                    return <div style={{ fontWeight: "500", marginTop: "0.5%", border: `1px solid ${color}`, backgroundColor: `${color}` }} className="text_square">
                        <text style={{ color: 'white', fontWeight: "500" }}>{rowData.status}</text>
                    </div>
                }),
            defaultSort: 'desc',

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
        <div>
            <MaterialTable title={<MyNewTitle variant="h6" text="Component Requestings List" />}
                data={array}
                columns={columns}
                onRowClick={(event, rowData) => {
                    getImExDetail(rowData.importExportId, rowData.itemType)
                    // navigate("/requestDetail") 
                    // , { state: rowData }
                }
                }
                // actions={[
                //     {
                //         icon: 'check',
                //         tooltip: 'Accept this Request',
                //         onClick: (event, rowData) => {
                //             // deleteComponent(rowData.componentId);
                //             // window.location.reload();
                //         }
                //     }

                // ]}
                options={{
                    sorting: true,
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
        </div>
    )
}
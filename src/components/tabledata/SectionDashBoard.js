import React, { } from "react";
import MaterialTable from "material-table";
import "../../App.css";
import "../../styles/Popup.scss";
import moment from 'moment';

export const Table = (props) => {
    const { listProcessDetail } = props;

    const columns = [
        {
            title: "Task",
            field: "taskName",
            cellStyle: { fontFamily: "Muli", textAlign: 'center', paddingRight: '3%', fontSize: '18px' },
            render: (e) => `${e.taskName}`
        },
        {
            title: "Finished Amount",
            field: "finishedAmount",
            cellStyle: { fontFamily: "Muli", textAlign: 'center', width: '15%', paddingRight: '3%', fontSize: '18px' },
        },
        {
            title: "Total Amount",
            field: "totalAmount",
            cellStyle: { fontFamily: "Muli", textAlign: 'center', paddingRight: '3%', fontSize: '18px' },
        },
        {
            title: "Average amount per day",
            field: "averageAmount",
            cellStyle: { fontFamily: "Muli", textAlign: 'center', width: '20%', paddingRight: '3%', fontSize: '18px' },
            render:
                rowData => rowData.averageAmount ? rowData.averageAmount : 0,
        },
        {
            title: "Expiry Date",
            field: "expiryDate",
            cellStyle: { fontFamily: "Muli", textAlign: 'center', paddingRight: '3%', fontSize: '18px' },
            render:
                rowData => moment(rowData.expiryDate).format('DD/MM/YYYY'),
        },

    ];
    return (
        <React.Fragment>
            <MaterialTable
                title={"List of Task"}
                data={listProcessDetail}
                columns={columns}
                actions={[]}
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
                    search: true,
                    headerStyle: { backgroundColor: "#bd162c", color: "#fff", fontSize: '18px', textAlign: 'center' },
                }}
            />
        </React.Fragment>
    );
};
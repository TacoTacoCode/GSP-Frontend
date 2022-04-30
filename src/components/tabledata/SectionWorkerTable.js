import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import "../../styles/Popup.scss";
import moment from 'moment';
import { Avatar } from "@mui/material";

export const Table = (props) => {
    const { listAccount } = props;
    const array = [];
    listAccount.forEach((item) => {
        array.push(item);
    }, []);


    const columns = [
        {
            title: "ID",
            field: "accountId",
            cellStyle: { fontFamily: "Arial", textAlign: 'center' },
        },
        {
            title: "Worker Name",
            field: "name",
            cellStyle: { fontFamily: "Arial", textAlign: 'center' },
        },
        {
            title: "Avatar",
            field: "avatarUrl",
            render: (rowData) => (
                (rowData.avatarUrl != null)
                    ? <img style={{ width: 100, height: 100, textAlign: 'center' }} alt="Avatar"
                        src={"https://firebasestorage.googleapis.com/v0/b/gspspring2022.appspot.com/o/Images%2F" + rowData.avatarUrl} />
                    : <Avatar sx={{ width: 100, height: 100, textAlign: 'center' }} />
            ),
            cellStyle: { textAlign: 'center' },
        },
        {
            title: "Gender",
            field: "gender",
            cellStyle: { fontFamily: "Arial", textAlign: 'center' },
            render:
                rowData => (rowData.gender === true)
                    ? "Male" : "Female"
        },
        {
            title: "Date of Birth",
            field: "dateOfBirth",
            cellStyle: { fontFamily: "Arial", textAlign: 'center' },
            render:
                rowData => moment(rowData.dateOfBirth).format('DD MMM, YYYY'),
        },
    ];

    return (
        <MaterialTable
            title={"List of Accounts"}
            data={array}
            columns={columns}
            onRowClick={(event, rowData) => {
                localStorage.setItem('choiceUser', JSON.stringify(rowData))
                window.location.href = '/section/attendance'
            }}
            actions={[
            ]}
            options={{
                addRowPosition: "first",
                actionsColumnIndex: -1,
                exportButton: false,
                headerStyle: { backgroundColor: "#AD1115", color: "#fff", textAlign: "center" },
            }}
        />
    );
};
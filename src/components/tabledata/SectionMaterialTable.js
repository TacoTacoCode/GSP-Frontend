import React, { useState, } from "react";
import MaterialTable from "material-table";
import { Avatar } from "@mui/material";

export const Table = (props) => {
    const { listMaterial } = props;
    const array = [];

    listMaterial.forEach((item) => {
        array.push(item.material);
    });


    const columns = [
        {
            title: "Material ID",
            field: "materialId",
            cellStyle: { fontFamily: "Arial", fontSize: "20px", textAlign: 'center' },
        },
        {
            title: "Image",
            field: "imageUrl",
            render: (rowData) => (
                (rowData.imageUrl != null)
                    ? <img style={{ height: "100px", width: "100px", textAlign: 'center' }}
                        src={"https://firebasestorage.googleapis.com/v0/b/gspspring2022.appspot.com/o/Images%2F" + rowData.imageUrl} />
                    : <Avatar sx={{ width: 100, height: 100 }} variant="circular" />
            ),
            cellStyle: { textAlign: 'center' },
        },
        {
            title: "Material Name",
            field: "materialName",
            cellStyle: { fontFamily: "Arial", fontSize: "20px", textAlign: 'center' },
        },
        {
            title: "Amount/Component",
            field: "amount",
            cellStyle: { fontFamily: "Arial", fontSize: "20px", textAlign: 'center' },
        },
        {
            title: "Unit",
            field: "unit",
            cellStyle: { fontFamily: "Arial", fontSize: "20px", fontWeight: "500", textAlign: 'center' },
        },
    ];


    return (
        <React.Fragment>
            <MaterialTable
                title={"List of Materials"}
                data={array}
                columns={columns}
                actions={[]}
                options={{
                    addRowPosition: "first",
                    actionsColumnIndex: -1,
                    exportButton: false,
                    headerStyle: { backgroundColor: "#bd162c", color: "#fff", textAlign: "center"},
                }}
            />
        </React.Fragment>
    );
};

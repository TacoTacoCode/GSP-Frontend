import React, { useState, } from "react";
import MaterialTable from "material-table";
import { Avatar, Typography } from "@mui/material";
import { IconContext } from "react-icons";
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';

export const SectionComponentTable = (props) => {
    const { component } = props;
    const array = [];

    // component.forEach((item) => {
    array.push(component);
    // });


    const columns = [
        {
            title: "ID",
            field: "componentId",
            cellStyle: { width: '10%', fontFamily: "Muli", paddingRight: '4%',  },
            align: "center",
        },
        {
            title: "Component Picture",
            field: "imageUrl",
            render: (rowData) => (
                (rowData.imageUrl != null)
                    ? <img style={{ height: "80px", width: "80px" }} src={"https://firebasestorage.googleapis.com/v0/b/gspspring2022.appspot.com/o/Images%2F" + rowData.imageUrl} />
                    : <Avatar sx={{ width: 80, height: 80 }} variant="square" />
            ),
            cellStyle: { width: '17%', paddingRight: '4%',  },
            align: "center",
        },
        {
            title: "Component Name",
            field: "componentName",
            cellStyle: { fontFamily: "Muli", paddingRight: '4%',  },
            align: "center",
        },
        {
            title: "Amount",
            field: "amount",
            cellStyle: { fontFamily: "Muli", paddingRight: '4%',  },
            align: "center",
        },
        {
            title: "Substance",
            field: "substance",
            cellStyle: { fontFamily: "Muli", paddingRight: '4%',  },
            align: "center",
        },
        {
            title: "Status",
            field: "status",
            align: "center",
            cellStyle: { fontFamily: "Muli", paddingRight: '3%',  },
            render:
                rowData => (rowData.status == 'Inactive')
                    ? <IconContext.Provider value={{ color: "red", className: "global-class-name" }}>
                        <div className="cancel">
                            <HighlightOffRoundedIcon fontSize="large" />
                        </div>
                    </IconContext.Provider>
                    : <IconContext.Provider value={{ color: "green", className: "global-class-name" }}>
                        <div className="check">
                            <CheckCircleOutlineRoundedIcon fontSize="large" />
                        </div>
                    </IconContext.Provider >
        },
    ];

    const MyNewTitle = ({ text = "Table Title", variant = "h6" }) => (
        <Typography
            variant={variant}
            style={{ color: '#333C83', fontFamily: 'Muli' }}
        >
            {text}
        </Typography>
    );

    return (
        <React.Fragment>
            <MaterialTable
                title={<MyNewTitle variant="h6" text="Component Producting" />}
                data={array}
                columns={columns}
                actions={[]}
                options={{
                    search: false,
                    addRowPosition: "first",
                    actionsColumnIndex: -1,
                    exportButton: false,
                    headerStyle: { backgroundColor: "#bd162c", color: "#fff", textAlign: "center",  },
                }}
            />
        </React.Fragment>
    );
};

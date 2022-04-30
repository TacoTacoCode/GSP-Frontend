import MaterialTable from 'material-table'
import React from 'react'

function ProcessDetailTable(props) {

    const { listProcessDetail } = props

    // const array = [];

    // listProcessDetail.forEach((item) => {
    //     array.push(item);
    // }, []);


    const columns = [
        {
            title: 'Component Name', field: 'componentName', cellStyle: { fontFamily: 'Muli', width: "10%" }, align: 'left'
        },
        {
            title: 'Total Amount', field: 'totalAmount', cellStyle: { fontFamily: 'Muli', width: "10%" }, align: 'left'
        },
        {
            title: 'Expiry Date', field: 'expiryDate', cellStyle: { fontFamily: 'Muli', width: "15%" }, align: 'left'
        },
    ]
    return (
        <div><MaterialTable title={"Process Details"}
            data={listProcessDetail}
            columns={columns}
            options={{
                addRowPosition: 'first',
                actionsColumnIndex: -1,
                exportButton: false,
                headerStyle: { backgroundColor: '#AD1115', color: '#fff' }
            }} /></div>
    )
}

export default ProcessDetailTable
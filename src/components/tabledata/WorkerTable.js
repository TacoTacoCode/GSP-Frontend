import React, { useState } from 'react';
import MaterialTable from 'material-table';


export const Table = () => {
    const [data, setData] = useState([
        { id: '123', productname: 'Hieu', productimg: 'https://cdn-icons-png.flaticon.com/512/3100/3100641.png', amount: '100',  price: '100' },
        { id: '124', productname: 'Taco', productimg: 'https://cdn-icons-png.flaticon.com/512/3100/3100641.png', amount: '200',  price: '200' },
        { id: '125', productname: 'Bò', productimg: 'https://cdn-icons-png.flaticon.com/512/3100/3100641.png', amount: '400',  price: '300' },
        { id: '126', productname: 'Trung', productimg: 'https://cdn-icons-png.flaticon.com/512/3100/3100641.png', amount: '600',  price: '400' },
    ])
    const columns = [
        {
            title: 'ID', field: 'id', cellStyle: {fontFamily: 'Muli'}
        },
        {
            title: 'Product Name', field: 'productname', cellStyle: {fontFamily: 'Muli'}
        },
        {
            title: 'Image', field: 'productimg',render: rowData => <img style={{height:'60px',width:'60px'}} src={rowData.productimg} /> ,cellStyle: {fontFamily: 'Muli'}
        },
        {
            title: 'Amount', field: 'amount', cellStyle: {fontFamily: 'Muli'}
        },
        {
            title: 'Price', field: 'price', cellStyle: {fontFamily: 'Muli'}
        },
    ]
    return (
        <div>
            <MaterialTable title={"List of Products"}
                data={data}
                columns={columns}
                editable={{
                    onRowUpdate: (newRow,oldRow) => new Promise((resolve,reject) =>{
                        const updatedData=[...data]
                        updatedData[updatedData.indexOf(oldRow)] = newRow
                        setData(updatedData)
                        setTimeout(() => resolve(), 500)
                    }),
                    onRowDelete:(selectedRow)=>new Promise((resolve, reject) => {
                        const updatedData = [...data]
                        updatedData.splice(updatedData.indexOf(selectedRow), 1)
                        setData(updatedData)    
                        setTimeout(() => resolve(), 1000)
                    }
                    )
                }
                }
                options={{
                    addRowPosition: 'first',
                    actionsColumnIndex: -1,
                    exportButton: false,
                    headerStyle: { backgroundColor: '#AD1115', color: '#fff', }
                }} />
        </div>
    )
}
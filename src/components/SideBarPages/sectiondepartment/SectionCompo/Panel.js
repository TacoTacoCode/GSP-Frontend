import React, { useEffect, useState } from "react";
import PointPanel from "./pointPanel";
import axios from "axios";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { ImportExcelButton } from "../../../button/ImportExcelButton";
import swal from "sweetalert";

const TransportFlow = () => {
    const [listCompoMate, setListCompoMate] = useState([]);
    const [secInfo, setSecInfo] = useState(() => JSON.parse(localStorage['currentSectionInfo']));
    const [listProcessDetail, setListProcessDetail] = useState(() => JSON.parse(localStorage['listProcessDetail']));
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}getMateByCompoId/${secInfo.componentId}`)
            .then((response) => {
                setListCompoMate(response.data)
            }).catch((error) => {
                alert("Error at listCompoMate")
            });
        let submitData = []
        listProcessDetail.map((e) => {
            listCompoMate.map((ele) => {
                submitData.push({
                    processDetailId: e.processDetailId,
                    itemId: ele.material.materialId,
                    amount: 0,
                    maxAmount: e.totalAmount * ele.amount
                }
                )
            })
        })
        localStorage.setItem('imExDetails', JSON.stringify(submitData))
    }, [])

    const [values, setValues] = useState([]);
    const addPoint = () => {
        let arr = [...values]
        arr.push('')
        setValues(arr)
    };

    const deleteItem = (index) => {
        let points = [...values]
        points.splice(index, 1)
        setValues(points)
    }
    const generateSubmitData = () => {
        if (values[0].length == 0) {
            return undefined
        } else {
            let arr = []
            values.map((value, index) => {
                let tmp = JSON.parse(localStorage.getItem(`currItem${index}`))
                tmp.map((ele) => {
                    if (ele.amount != 0 && ele.amount != null) {
                        let obj = arr.find((e) => (e.processDetailId === ele.processDetailId && e.itemId === ele.itemId))
                        if (obj !== undefined) {
                            obj.amount += ele.amount
                            if (obj.amount > obj.maxAmount) {
                                alert(`Total amount of ${obj.itemName} exceed required (${obj.maxAmount})`)
                            }
                        } else {
                            arr.push(ele)

                        }
                    }

                })
                localStorage.removeItem(`currItem${index}`)
            })
            arr = arr.map((e) => {
                return { ...e, 'itemId': e.itemId + 'M' }
            })
            return arr
        }
    }
    const submitAll = () => {
        const data = generateSubmitData();
        if (data !== undefined) {
            const submitData = {
                "sectionId": secInfo.sectionId,
                "createdDate": new Date().toLocaleDateString(),
                "itemType": secInfo.isAssemble ? "C" : "M",
                'isImport': false,
                "importExportDetails": data
            }
            axios.post(`${process.env.REACT_APP_API_URL}addImEx`, submitData)
                .then(() => {
                    swal("Success", "Submit Data", "success", {
                        buttons: false,
                        timer: 1500,
                    }).then((e) => window.location.href = 'http://localhost:3000/section/processDetail')
                })
        } else {
            swal("Warning", "No Information", "warning", {
                buttons: false,
                timer: 1500,
            })
        }
    }
    return (
        <div className="flow" style={{ margin: "50px 30%" }}>
            <h2 style={{ textAlign: 'center', marginBottom: '32px' }}>{secInfo.isAssemble ? 'Components Request Form' : 'Materials Request Form'}</h2>
            {values.map((element, index) => <>
                <PointPanel
                    index={index}
                    sumaryItem={listProcessDetail}
                    detailItem={listCompoMate}
                    handleChangePoint={setValues}
                    value={values[index]}
                />
                <IconButton
                    aria-label="delete" size="large"
                    onClick={() => {
                        deleteItem(index)
                    }}
                >
                    <DeleteIcon fontSize="inherit" style={{ alignItems: 'right' }} />
                </IconButton>
            </>
            )}
            <div>
                <ImportExcelButton
                    onClick={() => addPoint()}
                >
                    Add
                </ImportExcelButton>
                {values.length > 0 ? <ImportExcelButton
                    onClick={() => submitAll()}
                >
                    Submit
                </ImportExcelButton> : <ImportExcelButton
                    onClick={() => window.location.href = 'http://localhost:3000/section/processDetail'}
                >
                    Back
                </ImportExcelButton>}
            </div>
        </div>
    );
};

export default TransportFlow;

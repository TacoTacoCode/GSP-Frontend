import React, { useState, useEffect } from "react";
import "../../../../App.css";
import { ImportExcelButton } from "../../../button/ImportExcelButton";
import { Table } from "../../../tabledata/SectionDashBoard";
import { ExTable } from "../SectionAssemble/ExportTable";
import axios from "axios";

function ProcessDetail() {
    const [listProcessDetail, setListProcessDetail] = useState([])
    const [curSectionInfo, setCurSectionInfo] = useState(null)
    const sectionLeadId = localStorage.getItem('currentId');
    useEffect(() => {
        let promises = []
        document.title = "Section Dashboard";
        axios.get(`${process.env.REACT_APP_API_URL}getSectionBySectionLeadId/${sectionLeadId}`)
            .then((res) => {
                localStorage.setItem('currentSectionInfo', JSON.stringify(res.data));
                setCurSectionInfo(res.data);
                axios.get(`${process.env.REACT_APP_API_URL}getListProcessDetail/${res.data.sectionId}`)
                    .then((response) => {
                        localStorage.setItem('listProcessDetail', JSON.stringify(response.data))
                        response.data.map((ele) => {
                            promises.push(axios.get(`${process.env.REACT_APP_API_URL}getTaskName/${ele.processId}`))
                        })
                    }).catch((error) => {
                        localStorage.setItem('listProcessDetail', JSON.stringify(listProcessDetail))
                        alert("Error at get processDetails")
                    }).then(() => {
                        let respList = JSON.parse(localStorage['listProcessDetail'])
                        Promise.all(promises).then(re => re.map((item, index) => {
                            let tmp = respList[index];
                            respList[index] = {
                                ...tmp,
                                'taskName': item.data
                            }
                        }
                        )).then(() => {
                            setListProcessDetail(respList);
                            localStorage.setItem('listProcessDetail', JSON.stringify(respList))
                        })
                    })
            }).catch((err) => {
                alert("Error at get section info");
            })

    }, []);
    return (
        curSectionInfo && <>
            <ImportExcelButton
                style={{ marginTop: '1%', marginRight: '2%' }}
                type="button"
                className='btn-Import'
                buttonStyle={"btn--primary--solid"}
                onClick={() => {
                    return curSectionInfo.isAssemble ?
                        window.location.href = "/section/importCompo" :
                        window.location.href = "/section/importElement";
                }}
            >
                Import {curSectionInfo.isAssemble ? `Product` : 'Component'}
            </ImportExcelButton>
            <ImportExcelButton
                style={{ marginTop: '1%', marginRight: '1%' }}
                type="button"
                className='btn-Export'
                buttonStyle={"btn--primary--solid"}
                onClick={() => {
                    return curSectionInfo.isAssemble ?
                        window.location.href = "/section/exportCompo" :
                        window.location.href = "/section/exportElement";

                }}
            >
                Request {curSectionInfo.isAssemble ? `Component` : 'Material'}
            </ImportExcelButton>
            {curSectionInfo !== null ?
                <div className="processdetail">
                    {
                        curSectionInfo.isAssemble ?
                            <ExTable listProcessDetail={listProcessDetail} />
                            : <Table listProcessDetail={listProcessDetail} />
                    }
                </div>
                : null}
        </>
    );
}

export default ProcessDetail;

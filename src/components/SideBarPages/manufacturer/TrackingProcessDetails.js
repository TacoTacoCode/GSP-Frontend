import axios from 'axios';
import React, { useEffect, useState } from 'react'
import TrackingTaskTable from '../../tabledata/TrackingTaskTable';

function TrackingProcessDetails() {
    useEffect(() => {
        document.title = "UFA - Tracking Plans Tasks"
    }, []);

    let processId = localStorage.getItem('processId')
    const [listTask, getListTask] = useState([]);

    useEffect(() => {
        const getAllTasks = `${process.env.REACT_APP_API_URL}getProcessDetails/` + processId;
        let datas = []
        axios
            .get(getAllTasks)
            .then((res) => {
                let promises = res.data.map((e) => {
                    datas.push({ ...e })
                    return axios.get(`${process.env.REACT_APP_API_URL}getCompos/sec/` + e.sectionId)
                })
                Promise.all(promises).then((e) =>
                    e.map((ele, index) => {
                        datas[index].componentName = ele.data.componentName ?? 'Assemble Section'
                        datas[index].componentImg = ele.data.imageUrl ?? 'no-image.jpg?alt=media&token=c45f5852-28eb-4b4d-87a8-2caefb10df12'
                    })
                ).then(() => {
                    getListTask(datas)
                })

            })
            .catch((err) => {
                //Trường hợp xảy ra lỗi
                console.log(err);
                alert("Xảy ra lỗi");
            });
    }, []);
    return (
        <div className="tracking-plans">
            <TrackingTaskTable
                listTask={listTask}
            />
        </div>
    )
}

export default TrackingProcessDetails
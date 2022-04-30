import axios from 'axios';
import React, { useEffect, useState } from 'react'
import '../../../App.css'
import TrackingPlansTable from '../../tabledata/TrackingPlansTable'

function TrackingProcess() {
    useEffect(() => {
        document.title = "UFA - Tracking Plans"
    }, []);

    const [listPlan, getListPlan] = useState([]);

    useEffect(() => {
        const getAllPlans = `${process.env.REACT_APP_API_URL}getAllProcesss`;

        axios
            .get(getAllPlans)
            .then((res) => {
                getListPlan(res.data);
            })
            .catch((err) => {
                //Trường hợp xảy ra lỗi
                console.log(err);
                alert("Xảy ra lỗi");
            });
    }, []);
    return (
        <div className="tracking-plans">
            <TrackingPlansTable
                listPlan={listPlan}
            />
        </div>
    )
}

export default TrackingProcess
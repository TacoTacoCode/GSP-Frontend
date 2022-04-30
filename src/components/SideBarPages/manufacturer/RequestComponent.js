import React, { useEffect, useState } from 'react'
import { Table } from '../../tabledata/RequestComponentTable';
import '../../../App.css';
import { AiFillFileExcel } from 'react-icons/ai';
import { ImportExcelButton } from '../../button/ImportExcelButton';
import axios from 'axios';

export default function RequestComponent() {
    useEffect(() => {
        document.title = "UFA - Dashboard"
    }, []);

    const [listRequestComponents, setListRequesComponents] = useState([]);

    useEffect(() => {
        let listReqCom = []
        let getRequestComponent = `${process.env.REACT_APP_API_URL}getExByType/C`
        if (localStorage['currentRole'] === 'Section Department') {
            let section = JSON.parse(localStorage['currentSectionInfo'])
            getRequestComponent = `${process.env.REACT_APP_API_URL}getExsOf/sec/` + section.sectionId
        }
        let promises =[]
        axios.get(getRequestComponent).then((res) => {
            res.data.map(e =>{
                listReqCom.push(e)
                promises.push(axios.get(`${process.env.REACT_APP_API_URL}getSectionLeaderById/` + e.sectionId))
            })
            
        }).catch((err) => {
            console.log(err);
            alert("Xảy ra lỗi");
        }).then(()=>{
            Promise.all(promises).then(re => re.map((item, index) =>{
                let tmp = listReqCom[index];
                listReqCom[index] = {
                    ...tmp,
                    'sectionLeader': item.data
                }
            })).then(()=>{
                setListRequesComponents(listReqCom);
            })
        })

    }, []);

    return (
        <div className='sections'>
            <Table listRequestComponents={listRequestComponents} />
        </div>
    );
}

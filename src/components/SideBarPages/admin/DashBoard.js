import React, { useEffect, useState } from 'react'
import { Table } from '../../tabledata/DashboardTable';
import '../../../App.css';
import axios from 'axios';

export default function DashBoard() {
  useEffect(() => {
    document.title = "UFA - Dashboard"
  }, []);

  const [listRequestMaterials, setListRequestMaterials] = useState([]);

  useEffect(() => {
    const getRequestMaterials = `${process.env.REACT_APP_API_URL}getExByType/M`
    let promises =[]
    let listReqMate = []
    axios.get(getRequestMaterials).then((res) => {
      res.data.map(e =>{
      listReqMate.push(e)
      promises.push(axios.get(`${process.env.REACT_APP_API_URL}getSectionLeaderById/` + e.sectionId))
    })
  }).catch((err) => {
      console.log(err);
      alert("Xảy ra lỗi");
    }).then(()=>{
      Promise.all(promises).then(re => re.map((item, index) =>{
          let tmp = listReqMate[index];
          listReqMate[index] = {
              ...tmp,
              'sectionLeader': item.data
          }
      })).then(()=>{
        setListRequestMaterials(listReqMate);
      })
    })
  }, []);

  return (
    <>
      <div className='dashboard'>
        <Table listRequestMaterials={listRequestMaterials} />
      </div>
    </>
  );
}

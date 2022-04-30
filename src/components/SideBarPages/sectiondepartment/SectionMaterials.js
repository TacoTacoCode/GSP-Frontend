import { React, useEffect } from 'react'
import '../../../App.css';
import { ImportExcelButton } from '../../button/ImportExcelButton';
import { Table } from '../../tabledata/SectionMaterialTable';
import MaterialRequest from '../../Popups/MaterialRequest'
import { useState } from 'react'
import axios from 'axios';

function SectionMaterials() {
  const [listMaterial, setListMaterial] = useState([]);
  const [curSectionInfo,] = useState(() => JSON.parse(localStorage['currentSectionInfo']));

  useEffect(() => {
    //Gọi API bằng axios
    axios.get(`${process.env.REACT_APP_API_URL}getMateByCompoId/${curSectionInfo.componentId}`)
      .then((res) => {
        setListMaterial(res.data);
      }).catch((err) => {
        console.log(err);
        alert("Xảy ra lỗi");
      })
  }, [])
  return (
    <div className='materials' style={{ padding: '3% 3%' }}>
      <Table listMaterial={listMaterial} />
    </div>
  )
}

export default SectionMaterials
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { SectionComponentTable } from '../../../tabledata/SectionComponentTable';

function SectionComponents() {
    const [component, setComponent] = useState([]);
    let curSectionInfo =  JSON.parse(localStorage['currentSectionInfo']);

    useEffect(() => {
        //Gọi API bằng axios
        axios.get(`${process.env.REACT_APP_API_URL}getComponent/${curSectionInfo.componentId}`)
            .then((res) => {
                setComponent(res.data);
                console.log(res.data);
            }).catch((err) => {
                console.log(err);
                alert("Xảy ra lỗi");
            })
    }, [])
    return (
        <div className='materials' style={{ padding: '3% 3%' }}>
            <SectionComponentTable component={component} />
        </div>
    )
}

export default SectionComponents
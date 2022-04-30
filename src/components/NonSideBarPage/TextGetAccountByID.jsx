import React, { useState, useEffect } from 'react'
import axios from 'axios';

export const TextGetAccountByID = (props) => {
    const [account, setAccount] = useState([]);

    useEffect(async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}getAccountById/` + props.accountID);
        setAccount(res.data)
    }, [])

    return (
        <div>
            <p className="content_delivery_content"><text style={{ fontWeight: "500" }}>Name: </text>&ensp;<text>{account.name}</text></p>
            <p className="content_delivery_content"><text style={{ fontWeight: "500" }}>Address: </text>&ensp;<text>{account.address}</text></p>
        </div>
    );
}
import React, { useState, useEffect } from 'react'
import axios from 'axios';

export const TextGetSectionLeader = (props) => {
    const [account, setAccount] = useState([]);

    useEffect(async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}getAccountById/` + props.accountID);
        setAccount(res.data)
    }, [])

    return (
        <div>
            <text>{account.name}</text>
        </div>
    );
}
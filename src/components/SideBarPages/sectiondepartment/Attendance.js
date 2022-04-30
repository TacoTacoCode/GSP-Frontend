import { useEffect, useState } from "react"
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import axios from "axios"
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../../styles/style.css";
import { Avatar } from "@material-ui/core";
const locales = {
    "vi": require("date-fns/locale/vi"),
};
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
})
export const Attendance = () => {
    const [, setListAttendace] = useState([]);
    const curAcc = JSON.parse(localStorage.getItem('choiceUser'))
    const [allEvents, setAllEvents] = useState([]);

    useEffect(() => {
        var date = `${new Date().getUTCMonth() + 1}-01-${new Date().getFullYear()}`
        var eve = []
        axios.get(`${process.env.REACT_APP_API_URL}getAttendanceDetails/${curAcc.accountId}/${date}`)
            .then((res) => {
                res.data.map((ele) => {
                    if (ele.note !== '')
                        eve.push({
                            title: ele.note,
                            start: new Date(ele.checkDate),
                            end: new Date(ele.checkDate),
                        })
                })
                setListAttendace(res.data)
            }).catch((e) => console.log(e))
            .then(() => setAllEvents(eve))
    }, [])
    return (<>

        <div className="myCustom" >
            <div className="infor" style={{ textAlign: '-webkit-center', fontSize: 'large', fontFamily: 'Muli' }}>
                <Avatar
                    style={{ width: "100px", height: "100px", marginBottom: "1%" }}
                    src={`https://firebasestorage.googleapis.com/v0/b/gspspring2022.appspot.com/o/Images%2F${curAcc.avatarUrl}`} />
                <span>Name: {curAcc.name}</span><br />
                <span>Id: {curAcc.accountId}</span>
            </div>
            <Calendar
                localizer={localizer}
                events={allEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, margin: "0% 10%" }}
            />
        </div>
    </>
    )
}
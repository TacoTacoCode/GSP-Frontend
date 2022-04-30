import React, { useEffect, useState } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ListItem from "./formMenu";
import CheckboxList from "./listCompo";

const PointPanel = (props) => {
    const [expanded, setExpanded] = useState("");
    const handleChange = (panel) => (evt, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    const [value, setValue] = useState('');
    const [curProcess, setCurProcess] = useState(null);
    const { index, sumaryItem, detailItem, handleChangePoint } = props

    useEffect(() => {
        setValue(props.value)
        let item = sumaryItem.find(e => e.processDetailId == value)
        setCurProcess(item)
    }, [props])

    const handleChangeDrop = (aValue) => {
        setValue(aValue)
        let item = sumaryItem.find(e => e.processDetailId == aValue)
        setCurProcess(item)
        handleChangePoint(prevState => {
            let points = prevState
            points[index] = aValue
            return points
        })
    };

    return (
        <Accordion
            key={`detail${index}`}
            expanded={expanded === index}
            onChange={handleChange(index)}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id={`panel${index}bh-header`}
            >
                <ListItem
                    sumaryItem={sumaryItem}
                    aValue={value}
                    handleFunc={handleChangeDrop}
                />
            </AccordionSummary>
            <AccordionDetails>
                {curProcess && <CheckboxList
                    listCompoMate={detailItem}
                    index={index}
                    task={curProcess} />}
            </AccordionDetails>
        </Accordion>
    );
};

export default PointPanel;

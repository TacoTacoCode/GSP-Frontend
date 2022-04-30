import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Checkbox from '@mui/material/Checkbox';
import { Input } from '@material-ui/core';
import { useEffect, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';

export default function CheckboxList(props) {
    const [listMate, setListMate] = useState([]);
    const [indexer, setIndexer] = useState(0);
    const listCompo = props.listCompoMate;
    const task = props.task;
    useEffect(() => {
        setIndexer(props.index);
    }, [props])
    useEffect(() => {
        if (task) {
            listMate.splice(0, listMate.length)
            listCompo.map((e) => {
                listMate.push({
                    processDetailId: task.processDetailId,
                    itemId: e.material.materialId,
                    amount: 0,
                    itemName: e.material.materialName,
                    maxAmount: (task !== undefined && task) ? task.totalAmount * e.amount : 0
                })
            })
        }

    }, [task])
    const handleInputAmount = (index, newAmount) => {
        let arr = [...listMate]
        if(arr[index].maxAmount < newAmount){
            arr[index].amount = arr[index].maxAmount 
        }   
        else{
           arr[index].amount = parseInt(newAmount) 
        }
            
        setListMate(arr);
        localStorage.setItem(`currItem${indexer}`, JSON.stringify(arr))
    }
    return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {listMate.map((value, index) => {
                const labelId = `${value.itemId}`;
                const maxValue = value.maxAmount
                return (
                    <ListItem
                        key={labelId}
                        disablePadding
                    >
                        {listMate[index] &&
                            <Tooltip title={`Max Value: ${maxValue}`}>
                                <ListItem
                                    style={{ alignItems: 'right' }}
                                    role={undefined} dense>
                                    <Checkbox
                                        style={{ marginLeft: '10%', marginRight: '10%' }}
                                        edge="start"
                                        checked={listMate[index].amount > 0}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                    <div>
                                        <h3>{`${value.itemName}`}</h3>
                                        <Input
                                            value={listMate[index] ? listMate[index].amount : 0}
                                            inputProps={{
                                                step: 1,
                                                min: 0,
                                                max: maxValue,
                                                type: 'number',
                                            }}
                                            onChange={(e) => handleInputAmount(index, e.target.value)}

                                        />
                                    </div>

                                </ListItem>
                            </Tooltip>
                        }
                    </ListItem>
                );
            })}
        </List>
    );
}

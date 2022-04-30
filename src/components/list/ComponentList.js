import React from "react";
import axios from "axios";

export default class ComponentList extends React.Component {
    state = {
        component: []
    };

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_API_URL}getComponents/Active`).then(res => {
            const component = res.data;
            this.setState({ component });
        });
    }

    render() {
        return (
            <select>
                {this.state.component.map(component => <option>{component.componentName} - {component.amount}</option>)}
            </select>
        );
    }
}
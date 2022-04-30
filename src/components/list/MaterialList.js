import React from "react";
import axios from "axios";

export default class MaterialList extends React.Component {
  state = {
    material: []
  };

  componentDidMount() {
    axios.get(`${process.env.REACT_APP_API_URL}getMaterials/Active`).then(res => {
      const material = res.data;
      this.setState({ material });
    });
  }

  render() {
    return (
      <select>
        {this.state.material.map(material => <option>{material.materialName} - {material.amount}</option>)}
      </select>
    );
  }
}
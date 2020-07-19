import React, { Component } from "react";
import { Select } from "antd";
import instance from "../../../instance";
const { Option } = Select;

// NEED TO GET ALL LOCATIONS CONNECTED TO A SPECIFIC SCENE
// NEED TO PUSH A LOCATION INTO A SPECIFIC SCENE

class SelectLocation extends Component {
  state = {
    selectedItem: "",
    options: [],
  };

  componentDidMount() {
    console.log(
      "HI, THE SelectLocation JUST MOUNTED. THESE ARE MY OPTIONS",
      this.props.options
    );

    this.setState({
      options: this.props.options,
    });

    if (this.props.selectedItem) {
      const selectedItem = this.props.selectedItem._id;
      this.setState({
        selectedItem,
      });
    }
  }

  handleChange = (selectedItem) => {
    const { projId, sceneId } = this.props;

    this.setState({
      selectedItem: selectedItem._id,
    });

    console.log(
      "HELLO FROM SelectLocation ONCHANGE! I've selected these items:",
      selectedItem
    );

   if (!selectedItem.length) {
       selectedItem = ""
   }
    instance
      .put(`/projects/${projId}/scenes/${sceneId}/addLocation`, {
        location: selectedItem[selectedItem.length-1],
      })
      .then((response) => {
        console.log("ADDED/REMOVED LOCATION: ", response.data);
        this.props.refreshScenes();
      });
  };

  render() {
    const { selectedItem, options } = this.state;
    console.log("OPTIONS IN RENDER", options);
    // const filteredOptions = options.filter(
    //   (o) => !selectedItem.includes(o)
    // );
    // console.log("CHARACTERS: ", this.props.scene)
    return (
      <Select
        mode="multiple"
        value={selectedItem}
        onChange={this.handleChange}
        style={{
          width: "100%",
        }}
        name="location"
      >
        {options.map((item) => (
          <Select.Option key={item._id} value={item._id}>
            {item.decor}, {item.locale}
          </Select.Option>
        ))}
      </Select>
    );
  }
}

export default SelectLocation;

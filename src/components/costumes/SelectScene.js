import React, { Component } from "react";
import { Select } from "antd";
import instance from "../../instance";

const { Option } = Select;

// NEED TO GET ALL CHARACTERS CONNECTED TO A SPECIFIC SCENE
// NEED TO PUSH A CHARACTER INTO A SPECIFIC SCENE

class SelectScene extends Component {
  state = {
    selectedItems: [],
    options: [],
  };

  componentDidMount() {
    console.log(
      "HI, THE SELECTSCENE JUST MOUNTED. THESE ARE MY OPTIONS",
      this.props.options
    );
    const selectedItems = this.props.selectedItems.map(
      (eachScene) => eachScene._id
    );
    this.setState({
      selectedItems,
      options: this.props.options,
    });
  }

  handleChange = (selectedItems) => {
    const { projId, charId, costId } = this.props;
    selectedItems.map((eachItem) => eachItem._id);
    this.setState({
      selectedItems,
    });

    console.log(
      "HELLO FROM SELECTSCENE ONCHANGE! I've selected these items:",
      selectedItems
    );
    instance
      .put(
        `/projects/${projId}/characters/${charId}/costumes/${costId}/addScenes`,
        {
          scenes: selectedItems,
        }
      )
      .then((response) => {
        console.log("ADDED/REMOVED SCENES: ", response.data);
        this.props.refreshCostume();
      });
  };

  render() {
    const { selectedItems, options } = this.state;
    // const filteredOptions = options.filter(
    //   (o) => !selectedItems.includes(o)
    // );
    // console.log("CHARACTERS: ", this.props.scene)
    return (
      <Select
        mode="multiple"
        placeholder="Inserted are removed"
        value={selectedItems}
        onChange={this.handleChange}
        style={{
          width: "100%",
        }}
        name="scenes"
        disabled={this.props.disabled}
      >
        {options.map((item) => (
          <Select.Option key={item._id} value={item._id}>
            {item.sceneNumber}, {item.storyDayNumber}
          </Select.Option>
        ))}
      </Select>
    );
  }
}

export default SelectScene;

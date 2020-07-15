import React, { Component } from "react";
import { Select, Spin } from "antd";
import debounce from "lodash/debounce";
import instance from "../../instance";
import SceneList from "./SceneList";

const { Option } = Select;

// NEED TO GET ALL CHARACTERS CONNECTED TO A SPECIFIC SCENE
// NEED TO PUSH A CHARACTER INTO A SPECIFIC SCENE


class SelectCharacter extends React.Component {
  state = {
    selectedItems: this.props.scene.characters,
    options: []
  };

  componentDidMount() {
    this.getAllCharacters()
  }

  handleChange = (selectedItems) => {
    console.log(selectedItems)
    const { scene } = this.props;
    const { project, _id } = scene;
    this.setState({
      selectedItems,
    });

    instance
      .put(`/projects/${project}/scenes/${_id}/addCharacters`, {
        characters: selectedItems
      })
      .then(response => {
        console.log("ADDED/REMOVED CHARACTERS: ", response);
        this.props.refreshScenes();
      })
    console.log("selected items", selectedItems);
  };

  getAllCharacters = () => {
    const { scene } = this.props;
    const { project, _id, characters } = scene;
    instance
      .get(`/projects/${project}/characters`)
      .then(response=>{
      console.log("OPTIONS: ", this.props.characters)
      console.log("SELECTED: ", this.props.scene.characters)

      response.data.map(item=>item._id)
        this.setState({
          options: response.data,
          selectedItems: this.props.scene.characters
        }) 
      })
  }

  render() {
    const { selectedItems } = this.state;
    const filteredOptions = this.state.options.filter((o) => !selectedItems.includes(o));
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
        name="characters"
      >
        {filteredOptions.map((item) => (
          <Select.Option key={item._id} value={item._id}>
            {item.actorName} {item.characterName}
          </Select.Option>
        ))}
      </Select>
    );
  }
}

export default SelectCharacter;

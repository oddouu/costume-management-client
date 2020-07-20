import React, { Component } from "react";
import { Select, message, Divider, Input } from "antd";
import instance from "../../../instance";
import NewLocation from "./NewLocation";
import { PlusOutlined } from "@ant-design/icons";
const { Option } = Select;

// NEED TO GET THE LOCATION CONNECTED TO A SPECIFIC SCENE
// NEED TO ATTACH A LOCATION TO A SPECIFIC SCENE

class SelectLocation extends Component {
  state = {
    options: [],
    selected: this.props.scene.location,
    decor: "",
  };

  componentDidMount() {
    this.getAllLocations();
  }

  getAllLocations = () => {
    instance
      .get(`/projects/${this.props.projId}/locations`)
      .then((response) => {
        if (response.data.length >= 1) {
          console.log("ALL LOCATIONS", response.data);
          this.setState({
            options: response.data,
          });
        }
      });
  };

  addNewLocation = () => {
    let { decor } = this.state;

    const project = this.props.projId;

    const newLocation = {
      decor,
    };

    instance
      .post(`/projects/${project}/locations`, newLocation)
      .then((response) => {
        this.setState({ submitState: "Creating location..." });
        console.log("NEW LOCATION", response.data);
        message.success({
          content: "Success!",
        });
        //Lift the state
        this.getAllLocations();
      })
      .catch((err) => {
        if (err.response.status === 403) {
          this.props.history.push("/login");
        }
        message.error(err.response.data.message);
        this.setState({
          submitState: "Create location",
        });
      });
  };

  onNameChange = (event) => {
    this.setState({
      decor: event.target.value,
    });
  };

  onChange = (selectedLocationId) => {
    console.log(`selected ${selectedLocationId}`);

    const { projId, sceneId } = this.props;

    instance
      .put(
        `/projects/${projId}/locations/${selectedLocationId}/addScene/${sceneId}`
      )
      .then((response) => {
        console.log("WOOP WOOP", response.data);
        this.getAllLocations();
      });
  };

  onBlur = () => {
    console.log("blur");
  };

  onFocus = () => {
    console.log("focus");
  };

  onSearch = (val) => {
    console.log("search: ", val);
  };

  render() {
    const { options, decor, selected } = this.state;
    return (
      <Select
        showSearch
        defaultValue={selected}
        style={{ width: 200 }}
        placeholder="Select..."
        optionFilterProp="children"
        onChange={this.onChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onSearch={this.onSearch}
        filterOption={(input, option) =>
          // console.log(option.children, input)
          // option.locale.toLowerCase().includes(input.toLocaleLowerCase()) || option.decor.toLowerCase().includes(input.toLocaleLowerCase())
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        dropdownRender={(menu) => (
          <div>
            {menu}
            <Divider style={{ margin: "4px 0" }} />
            <div style={{ display: "flex", flexWrap: "nowrap", padding: 8 }}>
              <Input
                style={{ flex: "auto" }}
                value={decor}
                onChange={this.onNameChange}
                onClick={() => console.log("CLICKED!")}
              />
              <a
                style={{
                  flex: "none",
                  padding: "8px",
                  display: "block",
                  cursor: "pointer",
                }}
                onClick={this.addNewLocation}
              >
                <PlusOutlined /> Add item
              </a>
            </div>
          </div>
        )}
      >
        {this.state.options.map((eachOption) => (
          <Option key={eachOption._id} value={eachOption._id}>
            {eachOption.decor || ""}
          </Option>
        ))}
      </Select>
    );
  }
}

export default SelectLocation;

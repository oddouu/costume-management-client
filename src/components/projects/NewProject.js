import React, { Component } from "react";
import Axios from "axios";

class NewProject extends Component {
  state = {
    title: "",
    description: "",
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(this.state);
    const newProject = this.state;

    Axios.post("http://localhost:5000/api/projects", newProject)
      .then((response) => {
        console.log(response.data);
        this.setState({ title: "", description: "" });
        // calls function from parent component in order to refresh the DOM
        this.props.refreshProjects();
      })
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleFormSubmit}>
          <label htmlFor="">Title</label>
          <input
            type="text"
            name="title"
            value={this.state.title}
            onChange={this.handleChange}
          />
          <label htmlFor="">Description</label>
          <input
            type="text"
            name="description"
            value={this.state.description}
            onChange={this.handleChange}
          />

          <button>Add new Project</button>
        </form>
      </div>
    );
  }
}

export default NewProject;

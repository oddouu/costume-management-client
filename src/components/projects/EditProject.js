import React, { Component } from "react";
import instance from "../../instance";

class EditProject extends Component {
  state = {
    title: this.props.location.state.title,
    description: this.props.location.state.description
  };

//   componentDidMount() {
//     const { params } = this.props.match;
//     Axios.get(`http://localhost:5000/api/projects/${params.id}`).then(
//       (response) => {
//         this.setState(response.data);
//       }
//     );
//   }

  handleFormSubmit = (e) => {
    const { params } = this.props.match;

    e.preventDefault();
    instance.put(
      `http://localhost:5000/api/projects/${params.id}`,
      this.state
    ).then(() => {
      this.props.history.push("/projects");
    });
  };

  handleChange = (e) => {
    const { value, name } = e.target;
    this.setState({
      [name]: value,
    });
  };

  render() {
    return (
      <div>
        <h3>Edit Form</h3>
        <form action="" onSubmit={this.handleFormSubmit}>
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
          <input type="submit" value="submit" />
        </form>
      </div>
    );
  }
}

export default EditProject;

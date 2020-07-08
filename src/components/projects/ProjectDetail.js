import React, { Component } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import AddTask from "../tasks/AddTask";

class ProjectDetail extends Component {
  state = {};

  componentDidMount() {
    this.getProjectDetail()
  }

  getProjectDetail = () => {
    const { params } = this.props.match;
    Axios.get(`http://localhost:5000/api/projects/${params.id}`).then(
      (response) => {
        this.setState(response.data);
      }
    );
  }

  handleDelete = () => {
    const { params } = this.props.match;
    Axios.delete(`http://localhost:5000/api/projects/${params.id}`).then(
      (response) => {
        console.log(this.props);

        this.props.history.push("/projects");
        //  return <Redirect to='/projects' />
      }
    );
  };

  render() {
    console.log('STATE',this.state)
    const { params } = this.props.match;

    return (
      <div>
        <h1>{this.state.title}</h1>
        <p>{this.state.description}</p>
        {this.props.loggedInUser && 
          (<div><button onClick={this.handleDelete}>Delete Project</button> </div>)
      
        }
        <div>
          <Link
            to={{
              pathname: `/projects/${params.id}/edit`,
              state: {
                title: this.state.title,
                description: this.state.description,
              },
            }}
          >
            Edit Project
          </Link>
        </div>
        <AddTask projectId={this.state._id} refreshTasks={this.getProjectDetail}/>
        <div>
          <b>Tasks: </b>
          <ul>
            {this.state.tasks && this.state.tasks.map((eachTask) => {
              return (
                <li key={eachTask._id}>
                  <p>
                    <b>Title: </b>
                    {eachTask.title}
                  </p>
                  <p>
                    <b>Description: </b>
                    {eachTask.description}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default ProjectDetail;

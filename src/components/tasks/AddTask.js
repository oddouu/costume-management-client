import React, { Component } from 'react';
import Axios from 'axios';

class AddTask extends Component {
    state = {
        title: '',
        description: '',
    }


    handleFormSubmit = (e) => {

        const { title, description } = this.state;
        const project = this.props.projectId;

        e.preventDefault();
        Axios.post(
            `http://localhost:5000/api/tasks`,
            {title, description, project}
        ).then(() => {
            this.setState({title: '', description: ''})
            this.props.refreshTasks();
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
                <h3>Add a Task</h3>
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
        )
    }
}

export default AddTask;
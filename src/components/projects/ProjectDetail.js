
// import React, { Component } from "react";
// import instance from "../../instance";
// import { Link } from "react-router-dom";
// import AddTask from "../tasks/AddTask";

// class ProjectDetail extends Component {
//   state = {};

//   componentDidMount() {
//     this.getProjectDetail()
//   }

//   getProjectDetail = () => {
//     const { params } = this.props.match;
//     instance.get(`http://localhost:5000/api/projects/${params.id}`).then(
//       (response) => {
//         this.setState(response.data);
//       }
//     );
//   }

//   render() {
    
//     const { params } = this.props.match;

//     return (
//       <div>
//         <h1>{this.state.title}</h1>
//         <p>{this.state.description}</p>
//         {this.props.loggedInUser && 
//           (<div><button onClick={this.handleDelete}>Delete Project</button> </div>)
      
//         }
//         <div>
//           <Link
//             to={{
//               pathname: `/projects/${params.id}/edit`,
//               state: {
//                 title: this.state.title,
//                 description: this.state.description,
//               },
//             }}
//           >
//             Edit Project
//           </Link>
//         </div>
//         <AddTask projectId={this.state._id} refreshTasks={this.getProjectDetail}/>
//         <div>
//           <b>Tasks: </b>
//           <ul>
//             {this.state.tasks && this.state.tasks.map((eachTask) => {
//               return (
//                 <li key={eachTask._id}>
//                   <p>
//                     <b>Title: </b>
//                     {eachTask.title}
//                   </p>
//                   <p>
//                     <b>Description: </b>
//                     {eachTask.description}
//                   </p>
//                 </li>
//               );
//             })}
//           </ul>
//         </div>
//       </div>
//     );
//   }
// }

// export default ProjectDetail;

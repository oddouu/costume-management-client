import React, { Component } from "react";
import { Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

import instance from "../../instance";

import "./UploadImage.css";

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
  console.log("READER", reader);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}

class UploadImage extends Component {
  state = {
    name: "",
    file: "",
    feedbackMessage: "",
    loading: false,
  };

  // handleChange = info => {
  //     console.log(info)
  //     if (info.file.status === 'uploading') {
  //         this.setState({ loading: true });
  //         return;
  //     }
  //     if (info.file.status === 'done') {
  //         // Get this url from response in real world.
  //         getBase64(info.file.originFileObj, imageUrl =>
  //             this.setState({
  //                 imageUrl,
  //                 loading: false,
  //             }),
  //         );
  //     }
  // };

  handleChange = (info) => {
    console.log("INFO", info);
    switch (info.file.status) {
      case "uploading":
        this.setState({ loading: true });
        break;
      case "done":
            this.setState({ file: info.file.originFileObj, loading: false });
        this.handleSubmit();
        break;

      default:
        // error or removed
        this.setState({
            file:null,
            loading: false
        })
    }
    console.log("STATE AFTER UPLOADING: ", this.state);
  };

  // handleChange = (event) => {
  //     const { name, value } = event.target;
  //     this.setState({ [name]: value });
  // }

  // handleFileChange = (event) => {
  //     this.setState({ file: event.target.files[0]});
  // }

  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  handleSubmit = () => {
    const uploadData = new FormData();
    uploadData.append("imageUrl", this.state.file);

    console.log("UPLOAD DATA - NEW FORM DATA: ", uploadData);

    instance
      .post(`/projects/${this.props.projId}/upload`, uploadData)
      .then((response) => {
        console.log("image uploaded", response);
        this.setState({
            imageUrl: response.data.imageUrl
        })

        instance
          .post(`/projects/${this.props.projId}/images/create`, {
            name: this.state.name,
            imageUrl: response.data.imageUrl,
          })
          .then((response) => {
            console.log("image created", response);

            if (this.props.charId) {
              instance
                .put(`/projects/${this.props.projId}/characters/${this.props.charId}/addImage/${response.data._id}`)
                .then(response => {
                  console.log("image attached to character",response.data)
                })
            }

            this.setState({
              name: "",
              file: "",
              feedbackMessage: "Image uploaded sucessfully",
            });
          });
      });
  };

  render() {
    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    const { imageUrl } = this.state;
    const {staticImageUrl} = this.props
    console.log("IMAGEURL-UPLOADIMAGE", imageUrl)
    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        customRequest={this.dummyRequest}
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
        withCredentials="true"
      >
        {staticImageUrl ? 
            imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{width: "100%"}} />
            ) : (
          <img src={staticImageUrl} alt="avatar" style={{ width: "100%" }} />
        ) : (
          uploadButton
        )}
      </Upload>
      //   <div>
      //     <h2>New Image</h2>
      //     <form onSubmit={this.handleSubmit}>
      //         <label>Name</label>
      //         <input
      //             type="text"
      //             name="name"
      //             value={ this.state.name }
      //             onChange={this.handleChange} />

      //         <input type="file" onChange={this.handleFileChange} />
      //         <button type="submit">Save new image</button>
      //     </form>
      //     <div>{this.state.feedbackMessage}</div>
      //   </div>
    );
  }
}

export default UploadImage;

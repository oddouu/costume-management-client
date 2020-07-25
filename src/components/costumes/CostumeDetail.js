import React, { Component } from "react";
import { Upload, Modal, Popconfirm, Button } from "antd";
import { PlusOutlined, FileDoneOutlined } from "@ant-design/icons";
import instance from "../../instance";
import { Link } from "react-router-dom";
import "./CostumeDetail.less"

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

class CostumeDetail extends Component {
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
    costumeNumber: "",
    uploadedImageId: "",
  };

  componentDidMount() {
    this.getCostumeImages();
  }

  getCostumeImages = () => {
    const { params } = this.props.match;
    const { projId, charId, costId } = params;
    instance
      .get(`/projects/${projId}/characters/${charId}/costumes/${costId}`)
      .then((response) => {
        console.log("RETRIEVED COSTUME: ", response);
        if (response.data.images) {
          const images = response.data.images.map((eachImage) => ({
            url: eachImage.imageUrl,
            status: 'done',
            uid: eachImage._id,
          }));

          this.setState({
            fileList: images,
          });
        }

        console.log("LIST OF IMG URLs: ", this.state.fileList);
        this.setState({
          costumeNumber: response.data.costumeNumber,
        });
      });
  };

  uploadImage = async (file) => {
    const { params } = this.props.match;
    const { projId, charId, costId } = params;
    let uploadedFile;

    if (!file.url && !file.preview) {
      uploadedFile = await file;
    }

    console.log(uploadedFile);
    const uploadData = new FormData();

    if (uploadedFile) {
      uploadData.append("imageUrl", uploadedFile);

      console.log("UPLOAD DATA - NEW FORM DATA: ", uploadData);

      instance
        .post(`/projects/${projId}/upload`, uploadData)
        .then((response) => {
          console.log("image uploaded", response);
          this.setState({
            imageUrl: response.data.imageUrl,
          });

          instance
            .post(`/projects/${projId}/images/create`, {
              imageUrl: response.data.imageUrl,
            })
            .then((response) => {
              console.log("image created", response);
              this.setState({
                uploadedImageId: response.data._id,
              });

              instance
                .put(
                  `/projects/${projId}/characters/${charId}/costumes/${costId}/addImage/${this.state.uploadedImageId}`
                )
                .then((response) => {
                  console.log("image attached to costume", response.data);
                });
              this.setState({
                name: "",
                feedbackMessage: "Image uploaded sucessfully",
              });
              console.log("LIST OF IMG URLs: ", this.state.fileList);
            });
        });
    }
  };

handleDeleteImage = (item) => {
  const { params } = this.props.match;
  const { projId, charId, costId } = params;
  const imgId = item.uid;
  
  instance
  .delete(`/projects/${projId}/images/${imgId}`)
  .then(response => {
    console.log("DELETED", response);
    this.getCostumeImages();
    })
}

  handleCancel = () => {
    this.setState({ previewVisible: false })};

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };

  handleChange = ({ fileList }) => {
    this.setState({ fileList: [...fileList] });
    // console.log(
    //   "CURRENT UPLOADED FILE",
    //   this.state.fileList[this.state.fileList.length - 1].originFileObj
    // );
  };

  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      this.uploadImage(
        this.state.fileList[this.state.fileList.length - 1].originFileObj
      );

      onSuccess("ok");
    }, 0);
  };

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div
        className="clearfix"
        style={{
          height: "90vh",
          margin: "2rem 5rem 5rem 5rem",
          padding: "2rem 5rem 5rem 5rem",
          width: "100%",
        }}
      >
        <Link to="/projects">
          <Button style={{ marginBottom: "20px" }}>Go back to projects</Button>
        </Link>
        <Upload
          customRequest={this.dummyRequest}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          isImgUrl="true"
          onRemove={this.handleDeleteImage}
        >
          {uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default CostumeDetail;

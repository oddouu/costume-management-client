import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  Component,
} from "react";
import NewScene from "./NewScene";
import instance from "../../instance";
import { Link } from "react-router-dom";
import "./SceneList.css";

import {
  Layout,
  List,
  Skeleton,
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Button,
  Select,
} from "antd";

import SelectCharacter from "./SelectCharacter";
import SelectLocation from "./locations/SelectLocation";
// import NewLocation from "./locations/NewLocation"

const { Option } = Select;
const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  type,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async (e) => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
      >
        <Input type={type} ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  // if (editable && dataIndex === "location") {
  //   childNode = editing ? (
  //     <Form.Item
  //       style={{
  //         margin: 0,
  //       }}
  //       name={dataIndex}
  //     >
  //       <Select ref={inputRef} onSelect={save} onBlur={save} >
  //         <Option value="Create new Location"><Button style={{ width: "100%" }} >Create new Location</Button></Option>
  //         <Option value="EXT">EXT</Option>
  //       </Select>
  //     </Form.Item>
  //   ) : (
  //     <div
  //       className="editable-cell-value-wrap"
  //       style={{
  //         paddingRight: 24,
  //       }}
  //       onClick={toggleEdit}
  //     >
  //       {children}
  //     </div>
  //   );
  // }
  if (editable && dataIndex === "intExt") {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
      >
        <Select ref={inputRef} onSelect={save} onBlur={save}>
          <Option value="INT">INT</Option>
          <Option value="EXT">EXT</Option>
        </Select>
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  if (editable && dataIndex === "timeOfDay") {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
      >
        <Select ref={inputRef} onSelect={save} onBlur={save}>
          <Option value="DAY">DAY</Option>
          <Option value="NIGHT">NIGHT</Option>
        </Select>
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  if (editable && dataIndex === "season") {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
      >
        <Select ref={inputRef} onSelect={save} onBlur={save}>
          <Option value="Spring">Spring</Option>
          <Option value="Summer">Summer</Option>
          <Option value="Autumn">Autumn</Option>
          <Option value="Winter">Winter</Option>
          <Option value="N/A">N/A</Option>
        </Select>
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

class SceneList extends Component {
  state = { characters: [] };

  columns = [
    {
      title: "sceneNumber",
      dataIndex: "sceneNumber",
      editable: true,
    },
    {
      title: "storyDayNumber",
      dataIndex: "storyDayNumber",
      editable: true,
      type: "number",
    },
    {
      title: "timeOfDay",
      dataIndex: "timeOfDay",
      editable: true,
    },
    {
      title: "intExt",
      dataIndex: "intExt",
      editable: true,
    },
    {
      title: "description",
      dataIndex: "description",
      editable: true,
    },
    {
      title: "season",
      dataIndex: "season",
      editable: true,
    },

    {
      title: "location",
      dataIndex: "location",
      render: (text, record) => (
        <SelectLocation
          key={record._id + "sceneNumber"}
          scene={record}
          projId={record.project}
          sceneId={record._id}
          selectedItem={record.location}
          refreshScenes={this.getAllScenes}
        />
      ),
    },
    {
      title: "characters",
      dataIndex: "characters",
      render: (text, record) => (
        <SelectCharacter
          scene={record}
          characters={this.state.characters}
          refreshScenes={this.getAllScenes}
        />
      ),
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (text, record) =>
        this.state.scenes.length >= 1 ? (
          <div>
            <Popconfirm
              title="sure?"
              onConfirm={() => this.handleDelete(record)}
            >
              <Button>Delete</Button>
            </Popconfirm>
          </div>
        ) : null,
    },
  ];


  getAllScenes = () => {

    const { params } = this.props.match;
    instance
      .get(`/projects/${params.projId}/scenes`)
      .then((response) => {
        if (response.data.length) {
          for (let i = 0; i < response.data.length; i++) {
            response.data[i].key = i;
          }
        } else {
          response.data.length = 0;
        }

        this.setState({
          scenes: response.data,
          count: response.data.length,
        });
      })
      .then(() => {
        instance
          .get(`/projects/${params.projId}/characters`)
          .then((response) => {
            this.setState({
              characters: response.data,
            });
          });
      });
  };

  handleDelete = (scene) => {
    instance
      .delete(`/projects/${scene.project}/scenes/${scene._id}`)
      .then((deletedScene) => {
        console.log("DELETED SCENE: ", deletedScene);
        this.getAllScenes();
      });
  };

  handleAdd = () => {
    const { count, scenes } = this.state;
    let sceneNumber;
    if (count) {
      sceneNumber = parseInt(scenes[count - 1].sceneNumber) + 1;
    } else {
      sceneNumber = 1;
    }
    // console.log("COUNT",parseInt(scenes[count-1].sceneNumber))
    const newData = {
      key: count,
      sceneNumber,
    };

    const { params } = this.props.match;
    instance
      .post(`/projects/${params.projId}/scenes`, newData)
      .then((newScene) => {
        console.log("CREATED SCENE: ", newScene);
        this.getAllScenes();
      });
  };

  handleSave = (editedScene) => {
    instance
      .put(
        `projects/${editedScene.project}/scenes/${editedScene._id}`,
        editedScene
      )
      .then((response) => {
        console.log("EDITED SCENE: ", response);
        this.getAllScenes();
      });
  };

  componentDidMount() {
    if (this.props.currentUser) {
      this.getAllScenes();
    }
  }

  render() {
    const { params } = this.props.match;
    const { scenes } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          type: col.type,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Button
          onClick={this.handleAdd}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          Add a row
        </Button>
        {/* <NewLocation projId={params.projId} /> */}

        <Link to="/projects">
          <Button>Go back to projects</Button>
        </Link>

        <Table
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={scenes}
          columns={columns}
        />
      </div>
    );
  }
}

export default SceneList;

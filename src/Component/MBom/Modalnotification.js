import React from "react";
import {
  Form,
  Col,
  Modal,
  Row,
  Input,
  Button,
  notification,
  Table,
  Select,
  Checkbox
} from "antd";
import Context from "../../Data/Context";
import axios from "axios";
import "./style.css";
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 6,
    span: 18,
  },
};

export default function Modalnotification() {
  const {
    stateModalbom,
    setStateModalbom,
    listBom,
    setListBom,
    username,
    datachild,
    setDatachild,
    ulrAPI,
    phanquyen,
    unit, setUnit
  } = React.useContext(Context);
  const columns = [{
    title: "Thời gian",
    dataIndex: "time",
    key: "city",
    width:'200px',
    align:'center'
  },{
    title: "Nội dung",
    dataIndex: "note",
    key: "city"
  }]
  const data = [{
    time: '10-06-2023',
    note: 'Nhập thông tin bom T01'
  }]
  return (
    <Modal
      title={<p style={{color:'red',fontWeight:'bold'}}>THÔNG BÁO</p>}
      centered
      open={false}
      onCancel={() => console.log('')}
      width={1000}
      footer={[<Checkbox>Không hiển thị lại</Checkbox>]}
    >
      <Table
              style={{
                fontFamily: "Tahoma",
                width: "inherit",
              }}
              scroll={{
                y: 240,
              }}
              columns={columns}
              dataSource={data}
              bordered
              pagination={false}
            />
    </Modal>
  );
}

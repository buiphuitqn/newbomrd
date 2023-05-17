import { Col, Form, Input, Row, Popconfirm, notification, Button,Modal } from "antd";
import { EditOutlined, SaveOutlined, SettingOutlined } from "@ant-design/icons";
import banner from "../../Library/images/RD.png";
import React from "react";
import Context from "../../Data/Context";
import axios from "axios";
import "./style.css";
import { useNavigate } from "react-router-dom";

import {
  UserOutlined,
  InfoCircleOutlined,
  KeyOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import Modalpass from "./ModalPass";
import Loadding from "../Loadding";

const Login = () => {
  const [form] = Form.useForm();
  const { username, setUsername, changepass, setChangepass, loading, setLoading,ulrAPI } =
    React.useContext(Context);
  const [stateurl, setStateurl] = React.useState(false)
  let navigate = useNavigate();
  React.useEffect(() => {
    setLoading(false)
  }, [])
  const handleLogin = (values) => {
    setLoading(true)
    let user = values.username;
    let pass = values.password;
    let keycode = values.keycode;
    var url = `${ulrAPI}/api/Login`;
    axios
      .post(url, {
        user: user,
        pass: pass,
      })
      .then((res) => {
        if (res.data.length != 0) {
          var data = res.data[0];
          console.log(data)
          if (data.changepass == 1) {
            delete data.Password
            window.localStorage.setItem("username", JSON.stringify(data));
            setUsername(data);
            navigate("/BOMManager");
            console.log("toi day")
          } else {
            delete data.Password
            setChangepass(true);
            setUsername(data);
          }
        } else {
          notification["error"]({
            message: "Thông báo",
            description: "Thông tin đăng nhập không đúng",
            duration: 2
          });
        }
      })
      .catch((error) => {
        console.log(error)
        notification["error"]({
          message: "Thông báo",
          description: "Không thể truy cập máy chủ",
          duration: 2
        });
      });
  };
  return (
    <div className="login-page">
      <button className="btnsetting" onClick={()=>setStateurl(true)}><SettingOutlined style={{ fontSize: 20 }} /></button>
      <div className="login-box">
        <Form
          name="login-form"
          form={form}
          initialValues={{ remember: true }}
          onFinish={handleLogin}
        >
          <div className="Imgtitle">
            <img src={banner} />
          </div>
          <div className="loginimage">
            <p className="form-title">BOM Manager</p>
            <p>Đăng nhập ứng dụng</p>
          </div>

          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập mã số nhân viên!" },
            ]}
          >
            <Input placeholder="Nhập mã số nhân viên" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
      {loading && <Loadding />}
    </div>
  );
};

export default Login;

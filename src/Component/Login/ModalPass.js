import React from "react";
import {
  Form,
  Col,
  Modal,
  Row,
  Input,
  Button,
  notification,
  Select,
} from "antd";
import Context from "../../Data/Context";
import {
  KeyOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "./style.css";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

export default function Modalpass() {
  const { changepass, setChangepass, username } = React.useContext(Context);
  const [user, setUser] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [pass1, setPass1] = React.useState("");
  const [pass2, setPass2] = React.useState("");
  let navigate = useNavigate();
  React.useEffect(() => {
    username.length != 0 && setUser(username[0].IDMember);
  }, [username]);
  const handlechangepass = () => {
    if (pass1 != pass2)
      notification["error"]({
        message: "Thông báo",
        description: "Mật khẩu không khớp",
      });
    else {
      var url = "https://113.174.246.52:7978/api/Changepass2";
      axios
        .post(url, {
          user: user,
          pass: pass,
          pass1: pass1,
        })
        .then((res) => {
          if (res.data.code == 201)
            notification["error"]({
              message: "Thông báo",
              description: res.data.status,
            });
          else {
            notification["success"]({
              message: "Thông báo",
              description: res.data.status,
            });
            setChangepass(false);
            if (username.length != 0) {
              window.localStorage.setItem("username", JSON.stringify(username));
              navigate("/Homepage");
            }
          }
        })
        .catch((error) => {
          notification["error"]({
            message: "Thông báo",
            description: "Không thể truy cập máy chủ",
            duration:2
          });
        });
    }
  };

  return (
    <Modal
      title="Thay đổi mật khẩu"
      style={{
        fontFamily: "Tahoma",
      }}
      centered
      open={changepass}
      okButtonProps={{
        htmlType: "submit",
      }}
      onCancel={() => setChangepass(false)}
      onOk={handlechangepass}
    >
      <Row>
        <Col span={24}>
          <div>
            <p>Tài khoản</p>
            <Input
              size="large"
              value={user}
              onChange={
                username.length == 0 && ((e) => setUser(e.target.value))
              }
              placeholder="Nhập tài khoản"
              style={{ marginBottom: 15, fontFamily: "Tahoma" }}
              prefix={<UserOutlined className="site-form-item-icon" />}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
            <p>Nhập mật khẩu</p>
            <Input.Password
              size="large"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Nhập mật khẩu"
              style={{ marginBottom: 15, fontFamily: "Tahoma" }}
              prefix={<KeyOutlined className="site-form-item-icon" />}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
            <p>Nhập mật khẩu mới</p>
            <Input.Password
              size="large"
              value={pass1}
              onChange={(e) => setPass1(e.target.value)}
              placeholder="Nhập mật khẩu mới"
              style={{ marginBottom: 15, fontFamily: "Tahoma" }}
              prefix={<KeyOutlined className="site-form-item-icon" />}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
            <p>Xác nhận mật khẩu</p>
            <Input.Password
              size="large"
              value={pass2}
              status={pass1 != pass2 && "error"}
              onChange={(e) => setPass2(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              style={{ marginBottom: 15, fontFamily: "Tahoma" }}
              prefix={<KeyOutlined className="site-form-item-icon" />}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </div>
        </Col>
      </Row>
    </Modal>
  );
}

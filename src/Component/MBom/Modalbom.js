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
import axios from "axios";
import "./style.css";
const { Option } = Select;
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

export default function Modalbom() {
  const {
    stateModalbom,
    setStateModalbom,
    listBom,
    setListBom,
    username,
    datachild,
    setDatachild,
    ulrAPI
  } = React.useContext(Context);
  const [form] = Form.useForm();
  const [unit, setUnit] = React.useState([]);

  const listunit = username.map((en) => en.idunit);
  React.useEffect(() => {
    var url = `${ulrAPI}/api/Loadunit`;
    axios
      .post(url)
      .then((res) => {
        setUnit([]);
        if (res.data.length != 0) {
          var data = res.data;
          data.map((da) => {
            setUnit((unit) => [...unit, da]);
          });
        } else {
          notification["error"]({
            message: "Thông báo",
            description: "Không thể tải dữ liệu",
            duration:2
          });
        }
      })
      .catch((error) => {
        notification["error"]({
          message: "Thông báo",
          description: "Không thể truy cập máy chủ",
          duration:2
        });
      });
  }, []);
  const onFinish = (values) => {
    const check = listBom.filter((da) => da.nobom == values.no);
    if (check.length == 0) {
      var url = `${ulrAPI}/api/CreateBom`;
      axios
        .post(url, {
          IDMember: username[0].IDMember,
          NoBom: values.no,
          NameBom: values.name,
          Unit: values.unit,
        })
        .then((res) => {
          const { insertId } = res.data;
          notification["success"]({
            message: "Thông báo",
            description: `Tạo BOM thành công. Mã số Bom ${insertId}`,
          });
          setListBom([]);
          var url = `${ulrAPI}/api/Bom`;
          axios
            .post(url)
            .then((res) => {
              if (res.data.length != 0) {
                var data = res.data;
                data.map((item, index) => {
                  setListBom((listBom) => [
                    ...listBom,
                    {
                      key: index,
                      ...item,
                    },
                  ]);
                });
              } else {
                notification["error"]({
                  message: "Thông báo",
                  description: "Không thể tải dữ liệu",
                  duration:2
                });
              }
            })
            .catch((error) => {
              notification["error"]({
                message: "Thông báo",
                description: "Không thể truy cập máy chủ",
                duration:2
              });
            });
          setDatachild([]);
          var url = `${ulrAPI}/api/LoadBomchild`;
          axios
            .post(url)
            .then((res) => {
              if (res.data.length != 0) {
                var data = res.data;
                data.map((item, index) => {
                  setDatachild((datachild) => [
                    ...datachild,
                    {
                      key: index,
                      ...item,
                    },
                  ]);
                });
              } else {
                notification["error"]({
                  message: "Thông báo",
                  description: "Không thể tải dữ liệu",
                });
              }
            })
            .catch((error) => {
              notification["error"]({
                message: "Thông báo",
                description: "",
                duration:2
              });
            });
          setStateModalbom(false);
        })
        .catch((error) => {
          notification["error"]({
            message: "Thông báo",
            description: "Không thể truy cập máy chủ",
            duration:2
          });
        });
    } else
      notification["error"]({
        message: "Thông báo",
        description: "Số BOM đã tồn tại. Vui lòng kiểm tra lại",
        duration:2
      });
  };

  return (
    <Modal
      title="Tạo BOM"
      centered
      open={stateModalbom}
      okButtonProps={{
        htmlType: "submit",
      }}
      onCancel={() => setStateModalbom(false)}
      footer={[<p>Vui lòng điền đầy đủ thông tin</p>]}
    >
      <Form {...layout} form={form} onFinish={onFinish} name="control-hooks">
        <Row>
          <Col span={24}>
            <h5>KHAI BÁO THÔNG TIN CHÍNH</h5>
          </Col>
          <Col span={24}>
            <Form.Item
              name="no"
              label="Số hiệu"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số BOM.",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="name"
              label="Tên xe"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên BOM.",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="unit"
              label="Thương hiệu"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn đơn vị.",
                },
              ]}
            >
              <Select>
                {unit.map((da) => (
                  <Option
                    key={da.id}
                    value={da.id}
                    disabled={listunit.includes(da.id) ? false : true}
                  >
                    {da.nameunit}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Xác nhận
              </Button>
              <Button htmlType="button" onClick={() => setStateModalbom(false)}>
                Hủy
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

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
    Checkbox,
    Space
} from "antd";
import Context from "../../Data/Context";
import axios from "axios";
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons'
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

export default function Modalresetpass() {
    const {
        stateModalresetpass, setStateModalresetpass,
        member,
        ulrAPI,
    } = React.useContext(Context);
    const [form] = Form.useForm();
    const [option, setOption] = React.useState([])
    const [listdept, setListdept] = React.useState([])
    const [checkedList, setCheckedList] = React.useState([]);
    const [showadd, setShowadd] = React.useState(false);
    const [namedept, setNamedept] = React.useState('');
    const [unitchange, setUnitchange] = React.useState('');
    React.useEffect(() => {
        console.log(member)
    }, [])


    const onFinish = (values) => {
        if (values.pass === values.passagain) {
            var url = `${ulrAPI}/api/reset_pass`
            var id = member.IDMember
            var pass = values.pass
            axios.post(url, { id: id, pass: pass })
                .then((res) => {
                    if (res.data.code === 200) {
                        notification["success"]({
                            message: "Thông báo",
                            description: res.data.status,
                            duration: 2
                        });
                        form.setFieldsValue({
                            pass:'',
                            passagain:''
                          });
                        setStateModalresetpass(false)
                    }
                    else notification["error"]({
                        message: "Thông báo",
                        description: res.data.status,
                        duration: 2
                    });
                })
                .catch((error) => {
                    notification["error"]({
                        message: "Thông báo",
                        description: "Không thể truy cập máy chủ",
                        duration: 2
                    });
                })
        }
        else {
            notification["error"]({
                message: "Thông báo",
                description: "Mật khẩu không đúng",
                duration: 2
            });
        }
    };

    return (
        <Modal
            title={`Đặt lại mật khẩu người dung: ${member.FullName}`}
            centered
            open={stateModalresetpass}
            okButtonProps={{
                htmlType: "submit",
            }}
            onCancel={() => setStateModalresetpass(false)}
            footer={[<p>Vui lòng nhập đầy đủ thông tin</p>]}
        >
            <Form {...layout} form={form} onFinish={onFinish} name="control-hooks">
                <Row>
                    <Col span={24}>
                        <Form.Item
                            name="pass"
                            label="Mật khẩu"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập mật khẩu.",
                                },
                            ]}
                        >
                            <Input.Password
                                placeholder="Nhập mật khẩu"
                                iconRender={(visible) =>
                                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                                }
                            />
                        </Form.Item>
                        <Form.Item
                            name="passagain"
                            label="Xác nhận"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập lại mật khẩu.",
                                },
                            ]}
                        >
                            <Input.Password
                                placeholder="Nhập lại mật khẩu"
                                iconRender={(visible) =>
                                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                                }
                            />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                                Xác nhận
                            </Button>
                            <Button htmlType="button" onClick={() => setStateModalresetpass(false)}>
                                Hủy
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}

// Bảng quản lý danh sách Enovia

import React from "react";
import {
  DownloadOutlined,
  InboxOutlined,
  SearchOutlined,
  DeleteOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Input,
  Row,
  Upload,
  Table,
  Space,
  Popconfirm,
  notification,
  Layout
} from "antd";
import Context from "../../Data/Context";
import filedownload from "../../Library/file/Enovia.xlsx";
import axios from "axios";
import Highlighter from "react-highlight-words";
import * as XLSX from "xlsx";
import "./style.css";
import { useNavigate } from "react-router-dom";
import Headerpage from "../Headerpage";
import MenuSider from "../MenuSider";
import Footerpage from "../Footerpage";
import Loadding from "../Loadding";
const { Content } = Layout;
const { Dragger } = Upload;
const BOM = () => {
  const { } =
    React.useContext(Context);
  let navigate = useNavigate();
  const { bom, dataSource, enovia, setEnovia, username,loading,setLoading,collapsed ,ulrAPI} =
    React.useContext(Context);
  const [searchText, setSearchText] = React.useState("");
  const [hiden,setHiden] = React.useState(false)
  const [searchedColumn, setSearchedColumn] = React.useState("");
  const searchInput = React.useRef(null);
  React.useEffect(() => {
    setLoading(true)
    var url = `${ulrAPI}/api/Enovia`;
    var id = bom.id;
    var idmember = username.IDMember;
    axios
      .post(url, { id: id, IDMember: idmember })
      .then((res) => {
        setEnovia([]);
        if (res.data.length != 0) {
          var data = res.data;
          data = data.map((da, index) => {
            return { ...da, key: index }
          })
          setEnovia(data);
        }
      })
      .catch((error) => {
        console.log(error);
        notification["error"]({
          message: "Thông báo",
          description: "Không thể truy cập máy chủ",
          duration:2
        });
      });
  }, []);
  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileread = new FileReader();
      fileread.readAsArrayBuffer(file);
      fileread.onload = (e) => {
        const buffarray = e.target.result;
        const wb = XLSX.read(buffarray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };
      fileread.onerror = (error) => {
        reject(error);
      };
    });
    promise.then((d) => {
      d.map((data, index) => {
        setEnovia((enovia) => [
          ...enovia,
          {
            key: index,
            ...data,
            IDMember: username.IDMember,
            state: "new",
          },
        ]);
      });
    });
  };
  const exportEbom = () => {
    setHiden(!hiden)
    var url = `${ulrAPI}/api/Insertenovia`;
    var id = bom.id;
    var idmember = username.IDMember;
    var data = enovia;
    axios
      .post(url, {
        id: id,
        data: data,
        idmember: idmember,
      })
      .then((res) => {
        notification["success"]({
          message: "Thông báo",
          description: "Lưu thành công",
        });
      })
      .catch((error) => {
        notification["error"]({
          message: "Thông báo",
          description: "Không thể truy cập máy chủ",
          duration:2
        });
      });
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters,confirm) => {
    clearFilters();
    setSearchText("");
    confirm();
  };

  const handleDelete = (record) => {
    var url =`${ulrAPI}/api/Deleteenovia`;
    var id = bom.id;
    var idmaterial = record.ID;
    axios
      .post(url, {
        id: id,
        idmaterial: idmaterial,
      })
      .then((res) => {
        notification["success"]({
          message: "Thông báo",
          description: "Xóa thành công",
        });
        const newData = enovia.filter((item) => item.key !== record.key);
        setEnovia(newData);
      })
      .catch((error) => {
        notification["error"]({
          message: "Thông báo",
          description: "Không thể truy cập máy chủ",
          duration:2
        });
      });
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Nhập nội dung`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters,confirm)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Xoá
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: "Level",
      dataIndex: "Level",
      key: "id",
      ...getColumnSearchProps("Level"),
    },
    {
      title: "Mã vật tư",
      dataIndex: "ID",
      key: "name",
      ...getColumnSearchProps("ID"),
    },
    {
      title: "Tên vật tư",
      dataIndex: "Name",
      key: "member",
      ...getColumnSearchProps("Name"),
    },
    {
      title: "Số lượng",
      dataIndex: "Amount",
      key: "member",
    },
    {
      title: "Chức năng",
      key: "address",
      width: "15%",
      render: (record) =>
        bom.status == 0 ? (
          <Space size="middle">
            <Popconfirm
              title="Bạn có muốn xóa không?"
              onConfirm={() => handleDelete(record)}
            >
              <a
                style={{
                  color: "red",
                }}
              >
                Xóa
              </a>
            </Popconfirm>
          </Space>
        ) : (
          (
            <Space size="middle">
              <Popconfirm
                title="Bạn có muốn xóa không?"
                onConfirm={() => handleDelete(record)}
              >
                <a
                  style={{
                    color: "red",
                  }}
                >
                  Xóa
                </a>
              </Popconfirm>
            </Space>
          )
        ),
    },
  ];
  return (
    <Layout className="homelayout">
      <MenuSider />
      <Layout className="site-layout" style={{marginLeft:collapsed?80:200}}>
        <Headerpage />
        <Content
          className="site-layout-background"
          style={{
            margin: 5,
            padding: 5,
            minHeight: 280,
          }}
        >
          <div
            style={{
              width: "-webkit-fill-available",
            }}
          >
            <Row>
              <Col span={18}>
                <Divider orientation="left">
                  <Button
                    type="link"
                    style={{
                      fontFamily: "Tahoma",
                      fontSize: 18,
                      color: "black",
                      fontWeight: "bold",
                    }}
                  >
                    {`${bom.Namebom} - ${bom.namechild}`}
                  </Button>
                </Divider>
              </Col>
              <Col span={6}>
                <Divider orientation="right">
                  {enovia.length != 0 && (
                    <Button
                      type="primary"
                      onClick={exportEbom}
                      style={{
                        marginBottom: 16,
                        display: 'flex'
                      }}>
                      <div>
                        <SaveOutlined
                          style={{ display: "inline-flex", marginRight: "5px" }}
                        />
                      </div>
                      Lưu
                    </Button>
                  )}
                </Divider>
              </Col>
            </Row>
            <Row>
              <Col span={24}></Col>
            </Row>
            <Row>
              <Col span={24}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <a
                    className="logout"
                    style={{
                      marginLeft: "10px",
                      display: "flex",
                      fontFamily: "Tahoma",
                    }}
                    href={filedownload}
                  >
                    <div>
                      <DownloadOutlined
                        style={{ display: "inline-flex", marginRight: "5px" }}
                      />
                    </div>
                    Tải file mẫu
                  </a>
                  {enovia.filter((da) => da.state == "new").length != 0 && (
                    <a
                      className="logout"
                      style={{
                        marginLeft: "10px",
                        display: "flex",
                        fontFamily: "Tahoma",
                      }}
                      onClick={() => {
                        notification["success"]({
                          message: "Thông báo",
                          description: "Xóa thành công",
                        });
                        const newData = enovia.filter((item) => item.state == "old");
                        setEnovia(newData);
                      }}
                    >
                      <div>
                        <DeleteOutlined
                          style={{ display: "inline-flex", marginRight: "5px" }}
                        />
                      </div>
                      Xóa dữ liệu mới
                    </a>
                  )}
                </div>
                <Dragger
                  disabled={enovia.length != 0 ? true : false}
                  onChange={(e) => {
                    const { status } = e.file;
                    if (status == "done") {
                      var file = e.file.originFileObj;
                      delete file["uid"];
                      readExcel(file);
                    }
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Nhập chuột hoặc kéo thả file vào đây
                  </p>
                  <p className="ant-upload-hint">
                    Vui lòng chọn file excel (*.xlsx) và format đúng với file mẫu từ
                    hệ thống!
                  </p>
                </Dragger>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Table
                  className="tbmodifybom"
                  style={{
                    fontFamily: "Tahoma",
                  }}
                  scroll={{
                    y: 240,
                  }}
                  pagination={{
                    defaultPageSize: 50,
                  }}
                  columns={columns}
                  rowClassName={(record, index) =>
                    record.IDMember == username.IDMember ? "green" : "red"
                  }
                  bordered
                  dataSource={enovia}
                />
              </Col>
            </Row>
          </div>
        </Content>
        <Footerpage />
      </Layout>
      {loading&&<Loadding/>}
    </Layout>
  );
};
export default BOM;

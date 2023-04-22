import React from "react";
import { DeleteOutlined, EyeInvisibleOutlined, EyeOutlined, FileMarkdownOutlined, FilePdfOutlined, KeyOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  Space,
  Table,
  Popconfirm,
  Divider,
  Col,
  notification,
  Badge,
  Tooltip,
  Layout,
  Spin
} from "antd";
import {
  EditOutlined
} from "@ant-design/icons";
import axios from "axios";
import Context from "../../Data/Context";
import Highlighter from "react-highlight-words";
import Modalbom from "./Modalbom";
import { useNavigate } from "react-router-dom";
import "./style.css";
import ExportExcel from "./ExportExcel";
import MenuSider from "../MenuSider";
import Headerpage from "../Headerpage";
import Footerpage from "../Footerpage";
import Modalmentions from "./Modalmentions.js";
import Loadding from "../Loadding";
const { Content } = Layout
const MBom = () => {
  const [searchText, setSearchText] = React.useState("");
  const [searchedColumn, setSearchedColumn] = React.useState("");
  const searchInput = React.useRef(null);
  const {
    dataSource,
    setBom,
    setStateModalbom,
    setStateModalmention,
    listBom,
    setListBom,
    username,
    datachild,
    keymenu,
    setParentbom,
    loading,
    setLoading,
    bom,
    collapsed
  } = React.useContext(Context);
  let navigate = useNavigate();
  React.useEffect(() => {
    setLoading(true)
    setListBom([]);
    var url = "https://localhost:7978/api/Bom";
    axios
      .post(url)
      .then((res) => {
        if (res.data.length != 0) {
          var data = res.data;
          console.log(data)
          data = data.map((da, index) => {
            return { ...da, key: index }
          })
          setListBom(data)
        }
      })
      .catch((error) => {
        notification["error"]({
          message: "Thông báo",
          description: "Không thể truy cập máy chủ",
          duration:2
        });
      });
  }, [keymenu]);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleDelete = (record) => {
    var url = "https://localhost:7978/api/DeleteBom";
    axios
      .post(url, {
        NoBom: record.NoBom,
      })
      .then((res) => {
        const { insertId } = res.data;
        notification["success"]({
          message: "Thông báo",
          description: `Xóa BOM thành công`,
          duration:2
        });
        const newData = listBom.filter((item) => item.NoBom !== record.NoBom);
        setListBom(newData);
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
          placeholder={`Search ${dataIndex}`}
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
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
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

  const handleCreateBom = () => {
    setStateModalbom(true);
  };


  const expandedRowRender = (record) => {
    const { Namebom, NoBom, TimeCreate, IDunit } = record;
    const innerColumns = [
      {
        title: "STT",
        dataIndex: "indexchild",
        key: "city"
      },
      {
        title: "Tên Cụm",
        dataIndex: "namechild",
        key: "country"
      }, {
        title: "Trạng thái",
        render: (recordin) =>
          recordin.child.length != 0 ? (
            <span>
              <Badge status="success" />
              Đã cập nhật Enovia
            </span>
          ) : (
            <span>
              <Badge status="warning" />
              Chưa cập nhật Enovia
            </span>
          )
      }, {
        title: "Chức năng",
        render: (recordin) =>
          recordin.child.length != 0 ? (
            <Space size="middle">
              <a onClick={() => {
                setBom({
                  Namebom: Namebom,
                  NoBom: NoBom,
                  TimeCreate: TimeCreate,
                  IDunit: IDunit,
                  ...recordin,
                })
                navigate("/BOMManager/BOM/ennovia");
              }
              }>
                <Tooltip title="Xem dư liệu">
                  <EyeOutlined style={{ fontSize: '18px', color: '#08c' }} />
                </Tooltip>
              </a>
              <a onClick={() => {
                setBom({
                  Namebom: Namebom,
                  NoBom: NoBom,
                  TimeCreate: TimeCreate,
                  IDunit: IDunit,
                  ...recordin,
                })
                setStateModalmention(true)
              }}>
                <Tooltip title="Phân quyền">
                  <KeyOutlined style={{ fontSize: '18px', color: '#08c' }} />
                </Tooltip>
              </a>
            </Space>
          ) : (
            <Space size="middle">
              <a  onClick={() => {
                setBom({
                  Namebom: Namebom,
                  NoBom: NoBom,
                  TimeCreate: TimeCreate,
                  IDunit: IDunit,
                  ...recordin,
                })
                navigate("/BOMManager/BOM/ennovia");
              }
              }>
                <Tooltip title="Cập nhật dữ liệu">
                  <EditOutlined style={{ fontSize: '18px', color: '#08c' }} />
                </Tooltip>
              </a>
              <a onClick={() => {
                setBom({
                  Namebom: Namebom,
                  NoBom: NoBom,
                  TimeCreate: TimeCreate,
                  IDunit: IDunit,
                  ...recordin,
                })
                setStateModalmention(true)
              }}>
                <Tooltip title="Phân quyền">
                  <KeyOutlined style={{ fontSize: '18px', color: '#08c' }} />
                </Tooltip>
              </a>
            </Space>
          )
      }
    ];

    const innerExpandedRowRender = (innerRecord) => {
      const innerInnerColumns = [
        {
          title: "TT",
          dataIndex: "tt",
          key: "name"
        }, {
          title: "Tên cụm",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "Chức năng",
          key: "age",
          render: (record) =>
          (
            <Space size="middle">
              <a onClick={()=>{
                setBom(record)
                navigate("/BOMManager/BOM/Ebom")
              }}>
                <Tooltip title="Nhập dữ liệu">
                  <EditOutlined style={{ fontSize: '18px', color: '#08c' }} />
                </Tooltip>
              </a>
              <a>
                <Tooltip title="Phân quyền">
                  <KeyOutlined style={{ fontSize: '18px', color: '#08c' }} />
                </Tooltip>
              </a>
              <a>
                <Tooltip title="E-Bom Cụm">
                  <FilePdfOutlined style={{ fontSize: '18px', color: '#08c' }} />
                </Tooltip>
              </a>
              <a
                style={{
                  color: "blue",
                }}
              >
                <Tooltip title="M-Bom Cụm">
                  <FileMarkdownOutlined style={{ fontSize: '18px', color: '#08c' }} />
                </Tooltip>
              </a>
            </Space>
          )
        }
      ];
      const datasourceinnerInner = innerRecord.child.map((da, index) => {
        return { ...da, key: index, tt: (index + 1) }
      })
      return (
        <Table
          columns={innerInnerColumns}
          dataSource={datasourceinnerInner}
          bordered
          pagination={false}
          rowKey="key"
        />
      );
    };
    const datasourceinner = record.child.map((da, index) => {
      return { ...da, key: index }
    })
    return (
      <Table
        columns={innerColumns}
        dataSource={datasourceinner}
        bordered
        expandedRowRender={innerExpandedRowRender}
        pagination={false}
        rowKey="key"
      />
    );
  };
  const columns = [
    {
      title: "Số hiệu",
      dataIndex: "nobom",
      key: "id",
      ...getColumnSearchProps("nobom"),
      sorter: (a, b) => a.id.length - b.id.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Tên xe",
      dataIndex: "Namebom",
      key: "name",
      ...getColumnSearchProps("Namebom"),
    },
    {
      title: "Thương hiệu",
      dataIndex: "nameunit",
      key: "member",
      ...getColumnSearchProps("nameunit"),
    },
    {
      title: "Chức năng",
      key: "address",
      width: "15%",
      render: (record) =>
        listBom.length >= 1 ? (
          <Space size="middle">
            <a
              onClick={() => {
                setParentbom(record);
                navigate("/ViewEbom");
              }}
              style={{
                color: "blue",
              }}
            >
              <Tooltip title="E-Bom">
                <FilePdfOutlined style={{ fontSize: '18px', color: '#08c' }} />
              </Tooltip>
            </a>
            <a
              onClick={() => {
                setParentbom(record);
                navigate("/Mbom");
              }}
              style={{
                color: "blue",
              }}
            >
              <Tooltip title="M-Bom">
                <FileMarkdownOutlined style={{ fontSize: '18px', color: '#08c' }} />
              </Tooltip>
            </a>
            <Popconfirm
              title="Bạn có muốn xóa không?"
              onConfirm={() => handleDelete(record)}
            >
              <a
                style={{
                  color: "red",
                }}
              >
                <Tooltip title="Xoá BOM">
                  <DeleteOutlined style={{ fontSize: '18px', color: '#08c' }} />
                </Tooltip>
              </a>
            </Popconfirm>
          </Space>
        ) : null
    }
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
              fontFamily: "Tahoma",
              width: "100%",
            }}
          >
            <p style={{ padding: 10 }}>Quản lý BOM</p>
            <Divider style={{ margin: 5 }} />
            <div>
              <Button
                onClick={handleCreateBom}
                type="primary"
                style={{
                  marginBottom: 16,
                }}
              >
                Tạo BOM
              </Button>
            </div>
            <Table
              className="tblistbom"
              style={{
                fontFamily: "Tahoma",
                width: "inherit",
              }}
              scroll={{
                y: 240,
              }}
              expandable={{ expandedRowRender }}
              pagination={{
                defaultPageSize: 50,
              }}
              columns={columns}
              bordered
              dataSource={listBom}
              rowKey="key"
            />
            <Modalbom />
            <Modalmentions />
          </div>
        </Content>
        <Footerpage />
      </Layout>
      {loading&&<Loadding/>}
    </Layout>

  );
};

export default MBom;

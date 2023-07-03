// Bảng quản lý danh sách BOM

import React from "react";
import { DeleteOutlined, SyncOutlined, EyeOutlined, FileMarkdownOutlined, FilePdfOutlined, KeyOutlined, SearchOutlined, ClockCircleOutlined, CloseCircleOutlined, CheckCircleOutlined, DownloadOutlined } from "@ant-design/icons";
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
  Spin,
  Tag
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
import Modalgroup from "./Modalgroup";
import Modalnotification from "./Modalnotification";
import Modalexport from "./Modalexport";
const { Content } = Layout
const MBom = () => {
  const [searchText, setSearchText] = React.useState("");
  const [searchedColumn, setSearchedColumn] = React.useState("");
  const searchInput = React.useRef(null);
  const {
    setBom,
    setStateModalbom,
    setStateModalmention,
    listBom,
    setListBom,
    keymenu,
    setParentbom,
    loading,
    setLoading,
    collapsed,
    ulrAPI,
    setBomchild,
    phanquyen,
    setStateModalgroup,
    setStateModalexport
  } = React.useContext(Context);
  let navigate = useNavigate();
  const [listdept, setListdept] = React.useState([])
  const [listgroup, setListgroup] = React.useState([])
  React.useEffect(() => {
    console.log(phanquyen)
    setLoading(true)
    setListBom([]);
    var url2 = `${ulrAPI}/api/ds_phong`
    axios.post(url2)
      .then((res) => {
        setListdept([])
        res.data.map((da, index) => {
          setListdept(listdept => [...listdept, {
            key: index,
            value: da.id,
            label: da.ten_phong
          }])
        })
      }).catch((error) => {
        notification["error"]({
          message: "Thông báo",
          description: "Không thể truy cập máy chủ",
          duration: 2
        });
      })
    var url3 = `${ulrAPI}/api/ds_nhom`
    axios.post(url3)
      .then((res) => {
        setListgroup([])
        res.data.map((da, index) => {
          setListgroup(listgroup => [...listgroup, {
            key: index,
            value: da.id,
            label: da.ten_nhom
          }])
        })
      }).catch((error) => {
        notification["error"]({
          message: "Thông báo",
          description: "Không thể truy cập máy chủ",
          duration: 2
        });
      })
    var url = `${ulrAPI}/api/Bom`;
    axios
      .post(url)
      .then((res) => {
        if (res.data.length != 0 && phanquyen.length !== 0) {
          var unit = phanquyen.phong_ban.map(e => e.id)
          var data = res.data.filter(da => unit.includes(da.idunit));
          console.log(data, phanquyen)
          data = data.map((da, index) => {
            return {
              ...da, key: index, status: da.child.filter(ds => ds.status === 0).length === 0 ? <Tag icon={<CheckCircleOutlined />} color="success">
                Đã hoàn thiện</Tag> : da.child.filter(ds => ds.status === 0).length === da.child.length ? <Tag icon={<CloseCircleOutlined />} color="error">
                  Chưa hoàn thiện
                </Tag> : <Tag icon={<ClockCircleOutlined />} color="warning">
                Đang hoàn thiện
              </Tag>
            }
          })
          setListBom(data)
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
  }, [keymenu]);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    setSearchText("");
    confirm();
  };

  const handleDelete = (record) => {
    var url = `${ulrAPI}/api/DeleteBom`;
    axios
      .post(url, {
        NoBom: record.nobom,
      })
      .then((res) => {
        const { insertId } = res.data;
        notification["success"]({
          message: "Thông báo",
          description: `Xóa BOM thành công`,
          duration: 2
        });
        const newData = listBom.filter((item) => item.nobom !== record.nobom);
        setListBom(newData);
      })
      .catch((error) => {
        notification["error"]({
          message: "Thông báo",
          description: "Không thể truy cập máy chủ",
          duration: 2
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
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
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

  const handleCreateBom = () => {
    setStateModalbom(true);
  };


  const expandedRowRender = (record) => {
    const { Namebom, nobom, TimeCreate, idunit } = record;
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
        render: (recordin) => {
          if (recordin.child.length != 0) {
            if (recordin.status === 2)
              return (<Tag icon={<CheckCircleOutlined />} color="success">
                Đã duyệt
              </Tag>)
            else if (recordin.status === 0)
              return (<Tag icon={<CheckCircleOutlined />} color="success">
                Đã có Enovia
              </Tag>)
            else {
              if (recordin.child.filter(re => re.status === 2).length === recordin.child.length)
                return (<Tag icon={<ClockCircleOutlined />} color="warning">
                  Đang phê duyệt
                </Tag>)
              else return (<Tag icon={<ClockCircleOutlined />} color="warning">
                Cần hiệu chỉnh
              </Tag>)
            }
          }
          else
            return (
              <Tag icon={<CloseCircleOutlined />} color="error">
                Chưa cập nhật Enovia
              </Tag>
            )
        }
      }, {
        title: "Phòng quản lý",
        render: (recordp) => {
          return recordp.ma_phong_ban === null ? <Tag icon={<CloseCircleOutlined />} color="error">
            Chưa phân quyền
          </Tag> : listdept.filter(da => da.value === recordp.ma_phong_ban)[0].label
        }
      }, {
        title: "Chức năng",
        render: (recordin) =>
          phanquyen.function[0].trang_thai === 1 ? (
            <a onClick={() => {
              setBom({
                Namebom: Namebom,
                nobom: nobom,
                IDunit: idunit,
                ...recordin,
              })
              setStateModalmention(true)
            }}>
              <Tooltip title="Phân quyền">
                <KeyOutlined style={{ fontSize: '18px', color: '#08c' }} />
              </Tooltip>
            </a>
          ) :
            phanquyen.function[1].trang_thai === 1 && phanquyen.phong_ban.filter(da => da.id === idunit)[0].child.map(da => da.id).includes(recordin.ma_phong_ban) && (
              recordin.child.length != 0 ? ((
                <Space size="middle">
                  <a onClick={() => {
                    setBom({
                      Namebom: Namebom,
                      nobom: nobom,
                      TimeCreate: TimeCreate,
                      IDunit: idunit,
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
                    setBom(recordin)
                    navigate("/BOMManager/BOM/phe-duyet-ebom-cum")
                  }}>
                    <Tooltip title="E-Bom Cụm">
                      <FilePdfOutlined style={{ fontSize: '18px', color: '#08c' }} />
                    </Tooltip>
                  </a>
                </Space>
              )) : (
                <Space size="middle">
                  <a onClick={() => {
                    setBom({
                      Namebom: Namebom,
                      nobom: nobom,
                      TimeCreate: TimeCreate,
                      IDunit: idunit,
                      ...recordin,
                    })
                    navigate("/BOMManager/BOM/ennovia");
                  }
                  }>
                    <Tooltip title="Cập nhật dữ liệu">
                      <EditOutlined style={{ fontSize: '18px', color: '#08c' }} />
                    </Tooltip>
                  </a>
                </Space>
              )
            )
      }
    ];

    const innerExpandedRowRender = (innerRecord) => {
      const { namechild, ma_phong_ban } = innerRecord
      const innerInnerColumns = [
        {
          title: "TT",
          dataIndex: "tt",
          key: "name"
        }, {
          title: "Tên cụm",
          dataIndex: "name",
          key: "name"
        }, {
          title: "Trạng thái",
          dataIndex: "statuschild",
          key: "name"
        }, {
          title: "Nhóm quản lý",
          render: (record) =>
            record.ma_nhom === null ? <Tag icon={<CloseCircleOutlined />} color="error">
              Chưa phân quyền
            </Tag> : listgroup.filter(da => da.value === record.ma_nhom)[0].label
        },
        {
          title: "Chức năng",
          key: "age",
          render: (record) =>
            phanquyen.function[1].trang_thai == 1 && phanquyen.phong_ban.filter(da => da.id === idunit)[0].child.map(da => da.id).includes(ma_phong_ban) ? (
              <a onClick={() => {
                setBomchild({
                  Namebom: Namebom,
                  nobom: nobom,
                  IDunit: idunit,
                  namechild: namechild,
                  ma_phong_ban: ma_phong_ban,
                  ...record,
                })
                setStateModalgroup(true)
              }}>
                <Tooltip title="Phân quyền">
                  <KeyOutlined style={{ fontSize: '18px', color: '#08c' }} />
                </Tooltip>
              </a>
            ) : (phanquyen.function[2].trang_thai == 1 && phanquyen.phong_ban.filter(da => da.id === idunit)[0].child.filter(da => da.id === ma_phong_ban).length !== 0) && phanquyen.phong_ban.filter(da => da.id === idunit)[0].child.filter(da => da.id === ma_phong_ban)[0].child.filter(da => da.id).map(da => da.id).includes(record.ma_nhom) ?
              (
                <Space size="middle">
                  <a onClick={() => {
                    setBom(record)
                    navigate("/BOMManager/BOM/phe-duyet-ebom-con")
                  }}>
                    <Tooltip title="E-Bom Cụm">
                      <FilePdfOutlined style={{ fontSize: '18px', color: '#08c' }} />
                    </Tooltip>
                  </a>
                </Space>
              ) : (phanquyen.function[3].trang_thai == 1 && phanquyen.phong_ban.filter(da => da.id === idunit)[0].child.filter(da => da.id === ma_phong_ban).length !== 0) && phanquyen.phong_ban.filter(da => da.id === idunit)[0].child.filter(da => da.id === ma_phong_ban)[0].child.filter(da => da.id).map(da => da.id).includes(record.ma_nhom) && (
                <Space size="middle">
                  <a onClick={() => {
                    setBom(record)
                    navigate("/BOMManager/BOM/Ebom")
                  }}>
                    <Tooltip title="Nhập dữ liệu">
                      <EditOutlined style={{ fontSize: '18px', color: '#08c' }} />
                    </Tooltip>
                  </a>
                </Space>
              )
        }
      ];
      const datasourceinnerInner = innerRecord.child.map((da, index) => {
        return {
          ...da, key: index, tt: (index + 1), statuschild: da.status === 0 ? <Tag icon={<SyncOutlined spin />} color="processing">
            Đang nhập
          </Tag> : da.status === 1 ? <Tag icon={<ClockCircleOutlined />} color="warning">
            Đang phê duyệt
          </Tag> : da.status === 2 ? <Tag icon={<CloseCircleOutlined />} color="error">
            Từ chối
          </Tag> : <Tag icon={<CheckCircleOutlined />} color="success">
            Đã duyệt
          </Tag>
        }
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
      title: "Mã kiểu loại",
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
    }, {
      title: "Trạng thái",
      dataIndex: "status",
      key: "member",
      ...getColumnSearchProps("status"),
    },
    {
      title: "Chức năng",
      key: "address",
      width: "15%",
      render: (record) => (
        <Space size="middle">
          {
            record.DoneEbom === 1 && <a
              onClick={() => {
                console.log(record)
                setBom(record);
                setStateModalexport(true)
              }}
              style={{
                color: "blue",
              }}
            >
              <Tooltip title="Tải DMVT">
                <DownloadOutlined style={{ fontSize: '18px', color: '#08c' }} />
              </Tooltip>
            </a>
          }
          {
            phanquyen.function[0].trang_thai === 1 && listBom.length >= 1 && (
              <Space size="middle">
                <a
                  onClick={() => {
                    setBom(record);
                    navigate("/BOMManager/BOM/ebom-tong");
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
            )
          }
        </Space>
      )
    }
  ];
  if (phanquyen.length === 0) {
    navigate('/BOMManager')
    return
  }
  return (
    <Layout className="homelayout">
      <MenuSider />
      <Layout className="site-layout" style={{ marginLeft: collapsed ? 80 : 200 }}>
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
              {phanquyen.function[0].trang_thai === 1 && <Button
                onClick={handleCreateBom}
                type="primary"
                style={{
                  marginBottom: 16,
                }}
              >
                Tạo BOM
              </Button>}
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
            <Modalgroup />
            <Modalnotification />
            <Modalexport />
          </div>
        </Content>
        <Footerpage />
      </Layout>
      {loading && <Loadding />}
    </Layout>
  );
};

export default MBom;

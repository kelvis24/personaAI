import React from "react";
import { Layout, Menu, theme } from "antd";
import { Link } from "react-router-dom";
import {
  RightOutlined,
  CalendarOutlined,
  HomeOutlined,
  LeftOutlined,
  MoneyCollectOutlined,
  PlusOutlined,
  MinusOutlined,
  ApartmentOutlined,
  BuildOutlined,
  AuditOutlined,
} from "@ant-design/icons";

const SideNavigation = () => {
  const { Sider } = Layout;
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [isMenuCollapsed, setIsMenuCollpased] = React.useState(false);

  return (
    <Sider
      width={230}
      style={{
        background: colorBgContainer,
        borderRight: "1px solid grey",
        padding: 0,
        marginLeft: 0,
      }}
      collapsible={true}
      collapsed={isMenuCollapsed}
      reverseArrow={false}
      trigger={null}
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        style={{ height: "100%", borderRight: 0 }}
      >
        <Menu.Item
          icon={isMenuCollapsed ? <RightOutlined /> : <LeftOutlined />}
          onClick={() => {
            setIsMenuCollpased(!isMenuCollapsed);
          }}
        >
          {isMenuCollapsed ? "Show" : "Hide"}
        </Menu.Item>
        <Menu.Item icon={<HomeOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.SubMenu key="finance" icon={<AuditOutlined />} title="Finance">
          <Menu.Item key="finance-overview" icon={<MoneyCollectOutlined />}>
            <Link to="/finance">Overview</Link>
          </Menu.Item>
          <Menu.Item key="add-income" icon={<PlusOutlined />}>
            <Link to="/add-income">Add Income</Link>
          </Menu.Item>
          <Menu.Item key="add-expense" icon={<MinusOutlined />}>
            <Link to="/add-expense">Add Expense</Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item icon={<ApartmentOutlined />}>
          <Link to="/property">Property</Link>
        </Menu.Item>
        <Menu.Item icon={<HomeOutlined />}>
          <Link to="/building">Building</Link>
        </Menu.Item>
        <Menu.Item icon={<BuildOutlined />}>
          <Link to="/unit">Unit</Link>
        </Menu.Item>
        <Menu.Item icon={<CalendarOutlined />}>
          <Link to="/service-request">Service Request</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default SideNavigation;

import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";

const AppLayout = ({
  TopNavigation,
  SideNavigation,
  SideAction,
  PageContent,
}: {
  TopNavigation: any;
  SideNavigation: any;
  SideAction: any;
  PageContent: any;
}) => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: "white",
        height: "100%",
      }}
    >
      {TopNavigation}
      <Layout
        style={{
          // padding: "0 24px 24px",
          display: "flex",
          height: "100%",
          // maxHeight: 1000,
          alignContent: "space-between",
          // alignItems: "center",
          backgroundColor: "#f5f5f5",
        }}
        hasSider={true}
      >
        {SideNavigation}
        {/* <Layout
          style={{
            backgroundColor: "white",
            height: "100%",
          }}
        > */}
        <Content
          style={{
            height: "100%",
            overflow: "auto",
            marginRight: "2rem",
            marginLeft: "2rem",
            paddingBottom: 50,
          }}
        >
          {PageContent}
        </Content>
        {/* {SideAction} */}
        {/* </Layout> */}
      </Layout>
    </Layout>
  );
};

export default AppLayout;

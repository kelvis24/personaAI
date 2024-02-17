import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { SignUpForm } from "./components/";
import { Content } from "antd/es/layout/layout";

const SignUpPage = () => {
  return (
    <>
      <Breadcrumb separator=">">
        <Breadcrumb.Item href="/">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>Sign-Up</Breadcrumb.Item>
      </Breadcrumb>
      <Content>
        <SignUpForm />
      </Content>
    </>
  );
};

export default SignUpPage;

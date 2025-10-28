import { ConfigProvider, App as AntdApp } from "antd";

const AppThemeProvider = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#7a2d61", 
        },
        components: {
          Button: {
            colorPrimary: "#7a2d61",
            colorPrimaryHover: "#993873",
            colorPrimaryActive: "#993873",
            colorTextLightSolid: "#ffffff",
          },
          Menu: {
            itemSelectedBg: "#7a2d61",
            itemSelectedColor: "#ffffff",
            itemHoverBg: "#993873",
            itemHoverColor: "#ffffff",
          },
        },
      }}
    >
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
};

export default AppThemeProvider;

import {
  ArrowRightOutlined,
  BarChartOutlined,
  CarOutlined,
  CloseOutlined,
  HomeOutlined,
  LockOutlined,
  MailOutlined,
  ProfileOutlined,
  SolutionOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { Alert, Menu } from "antd";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import logo1 from "../assets/logo-1.png";
import { setShowUpdateDialog } from "../store/auth/versionSlice";
import useFinalUserImage from "./common/Logo";

const getMenuItems = (collapsed, userTypeRaw) => {
  const uType = Number(userTypeRaw);
  const isOnlyuser = uType === 1;
  const eventChildren = [
    { key: "/event", icon: <SolutionOutlined />, label: "Event" },
    { key: "/event-register", icon: <TagsOutlined />, label: "Event Register" },
    { key: "/event-track", icon: <CarOutlined />, label: "Event Track" },
  ];
  const eventReportChildren = [
    { key: "/report-event", icon: <CarOutlined />, label: "Event" },
    {
      key: "/report-event-details",
      icon: <CarOutlined />,
      label: "Event Details",
    },
    {
      key: "/report-register-notscanned",
      icon: <CarOutlined />,
      label: "Registered Not Scanned",
    },
    {
      key: "/report-notregister-notscanned",
      icon: <CarOutlined />,
      label: "Not Registered Not Scanned",
    },
  ];

  if (isOnlyuser) {
    const dashboardItems = [
      { key: "/home", icon: <HomeOutlined />, label: "Dashboard" },
      { key: "/profile", icon: <HomeOutlined />, label: "Profile" },
    ];

    if (collapsed) {
      return dashboardItems;
    }

    return [{ type: "group", label: "Dashboard", children: dashboardItems }];
  }

  const dashboardItems = [
    { key: "/home", icon: <HomeOutlined />, label: "Dashboard" },
  ];
  const olddUserItems = [
    { key: "/old-users", icon: <HomeOutlined />, label: "Old Users" },
  ];

  const managementChildren = [
    { key: "/life-member", icon: <LockOutlined />, label: "Life Membership" },
    {
      key: "/patron",
      icon: <SolutionOutlined />,
      label: "Patron",
    },
    { key: "/dy-patron", icon: <CarOutlined />, label: "Dy Patron" },
  ];

  const fullReportChildren = [
    {
      key: "sales-submenu",
      icon: <ProfileOutlined />,
      label: <span id="report-scroll-anchor">Member</span>,
      children: [
        {
          key: "/report-life-member",
          icon: <ProfileOutlined />,
          label: "Life Membership",
        },
        {
          key: "/report-patron",
          icon: <ProfileOutlined />,
          label: "Patron",
        },
        {
          key: "/report-dy-patron",
          icon: <ProfileOutlined />,
          label: "Dy Patron",
        },
      ],
    },
    ...eventReportChildren,
  ];

  if (collapsed) {
    return [
      ...dashboardItems,
      {
        key: "sub",
        icon: <MailOutlined />,
        label: "Management",
        children: managementChildren,
      },
      ...olddUserItems,
      {
        key: "sub1",
        icon: <MailOutlined />,
        label: "Event",
        children: eventChildren,
      },
      {
        key: "sub2",
        icon: <BarChartOutlined />,
        label: <span id="report-scroll-anchor">Report</span>,
        children: fullReportChildren,
      },
    ];
  }

  return [
    { type: "group", label: "Dashboard", children: dashboardItems },
    { type: "group", label: "Users", children: olddUserItems },
    {
      type: "group",
      label: "Member",
      children: [
        {
          key: "sub",
          icon: <MailOutlined />,
          label: "Member",
          children: managementChildren,
        },
      ],
    },
    {
      type: "group",
      label: "Event",
      children: [
        {
          key: "sub1",
          icon: <MailOutlined />,
          label: "Event",
          children: eventChildren,
        },
      ],
    },
    {
      type: "group",
      label: "Report",
      children: [
        {
          key: "sub2",
          icon: <BarChartOutlined />,
          label: "Report",
          children: fullReportChildren,
        },
      ],
    },
  ];
};

export default function Sidebar({ collapsed, isMobile = false, onClose }) {
  const location = useLocation();
  const selectedKeys = [location.pathname];
  const getOpenKeysFromPath = (path) => {
    if (path.startsWith("/report-")) return ["sub2"];
    return [];
  };
  const userType = useSelector((state) => state.auth?.user?.user_type);
  const [openKeys, setOpenKeys] = useState(() =>
    getOpenKeysFromPath(location.pathname)
  );
  const naviagte = useNavigate();
  const items = getMenuItems(collapsed, Number(userType));
  const dispatch = useDispatch();
  const finalUserImage = useFinalUserImage();
  const [delayedCollapse, setDelayedCollapse] = useState(collapsed);
  const localVersion = useSelector((state) => state.auth?.version);
  const serverVersion = useSelector((state) => state?.version?.version);
  const showDialog = localVersion !== serverVersion ? true : false;
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDelayedCollapse(collapsed);
    }, 150);

    return () => clearTimeout(timeout);
  }, [collapsed]);

  const handleOpenDialog = () => {
    dispatch(
      setShowUpdateDialog({
        showUpdateDialog: true,
        version: serverVersion,
      })
    );
  };
  const rootSubmenuKeys = ["sub", "sub1", "sub2"];
  useEffect(() => {
    if (openKeys.includes("sub2")) {
      const anchor = document.getElementById("report-scroll-anchor");
      const scrollContainer = document.querySelector(".scrollbar-custom");

      if (anchor && scrollContainer) {
        let offset = 0;
        let el = anchor;

        while (el && el !== scrollContainer) {
          offset += el.offsetTop;
          el = el.offsetParent;
        }

        scrollContainer.scrollTo({
          top: offset - 10,
          behavior: "smooth",
        });
        setTimeout(() => {
          scrollContainer.scrollTo({
            top: offset - 10,
            behavior: "smooth",
          });
        }, 200);
      } else {
        console.warn("⚠️ Could not find anchor or scroll container.");
      }
    }
  }, [openKeys]);

  return (
    <motion.aside
      initial={{ width: collapsed ? 95 : 260 }}
      animate={{ width: collapsed ? 95 : 260 }}
      transition={{ duration: 0.3 }}
      className={`h-full bg-white shadow-xl  overflow-hidden flex flex-col font-[Inter] transition-all duration-300
        ${isMobile ? "fixed z-50 h-screen" : "relative"}`}
    >
      <div className="flex items-center justify-center h-14 px-4 !bg-[#ffe1f4] border-b border-b-[#993873]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-start gap-2 w-full"
        >
          <img
            src={logo1}
            alt="Logo"
            className={`object-contain transition-all duration-300 ${
              collapsed ? "w-10 mx-auto" : "w-10"
            }`}
          />

          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="text-[#993873] font-semibold text-[16px]"
            >
              Vaishnavi Samaj
            </motion.span>
          )}
        </motion.div>

        {isMobile && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={onClose}
            className="text-[#993873] hover:text-red-400 transition-colors"
          >
            <CloseOutlined className="text-xl" />
          </motion.button>
        )}
      </div>

      <div className="flex-1  py-2 scrollbar-custom">
        <Menu
          mode="inline"
          inlineCollapsed={delayedCollapse}
          items={items}
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          onOpenChange={(keys) => {
            const latestOpenKey = keys.find(
              (key) => openKeys.indexOf(key) === -1
            );
            if (rootSubmenuKeys.includes(latestOpenKey)) {
              setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
            } else {
              setOpenKeys(keys);
            }
          }}
          onClick={({ key, keyPath }) => {
            if (isMobile && onClose) {
              onClose();
            }
            if (keyPath.length === 1) {
              setOpenKeys([]);
            }
            naviagte(key);
          }}
          className="custom-menu"
        />
      </div>

      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-gray-500 text-center border-t border-[#993873] bg-white"
        >
          {showDialog ? (
            <div
              className="w-full cursor-pointer animate-pulse"
              onClick={handleOpenDialog}
            >
              <Alert
                message={
                  <div className="flex items-center justify-center text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      New Updated: V{localVersion}
                      <ArrowRightOutlined />V{serverVersion}
                    </span>
                  </div>
                }
                type="warning"
                banner
                showIcon={false}
                className="rounded-md !bg-[#ffe1f4] !text-[#993873] !border-[#993873] px-4 py-1"
              />
            </div>
          ) : (
            <Alert
              message={
                <div className="flex flex-col items-center text-center text-xs font-semibold">
                  <div className="flex items-center gap-1">
                    <span className="flex items-center gap-1">
                      Version: {localVersion}
                    </span>
                  </div>
                  <div className="text-[11px] font-normal text-gray-500 mt-1">
                    Updated on: 25-10-2025
                  </div>
                </div>
              }
              type="info"
              banner
              showIcon={false}
              className="rounded-md !bg-[#ffe1f4] !text-[#993873] !border-[#993873] px-4 py-1"
            />
          )}
        </motion.div>
      )}
    </motion.aside>
  );
}

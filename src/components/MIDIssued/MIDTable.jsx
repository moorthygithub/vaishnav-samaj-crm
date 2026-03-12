import { Button, Modal, Input, message } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import AvatarCell from "../common/AvatarCell";
import HighlightText from "../common/HighlightText";
import STTable from "../STTable/STTable";
import { EditOutlined } from "@ant-design/icons";
import { useApiMutation } from "../../hooks/useApiMutation";
import { PANEL_UPDATE_USERS_MID } from "../../api";

const MIDTable = ({ users, imageUrls, fetchUser }) => {
  const { trigger, loading } = useApiMutation();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [midValue, setMidValue] = useState("");

  const openModal = (user) => {
    setCurrentUser(user);
    setMidValue(user.user_mid || "");
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!midValue) {
      message.error("MID cannot be empty");
      return;
    }

    try {
      const res = await trigger({
        url: `${PANEL_UPDATE_USERS_MID}/${currentUser.id}`,
        method: "put",
        data: { user_mid: midValue },
      });

      if (res?.code === 201) {
        message.success(res.message || "MID updated successfully");
        setModalVisible(false);
        fetchUser();
      } else {
        message.error(res.message || "Failed to update MID");
      }
    } catch (error) {
      console.error(error);
      message.error(error?.message || "Error updating MID");
    }
  };

  const columns = [
    {
      title: "",
      key: "member_images",
      render: (_, user) => {
        const memberImageSrc = user.user_image
          ? `${imageUrls.userImageBase}${user.user_image}`
          : imageUrls.noImage;
        const spouseImageSrc = user.spouse_image
          ? `${imageUrls.userImageBase}${user.spouse_image}`
          : imageUrls.noImage;

        return (
          <div className="flex justify-center gap-2">
            <AvatarCell imageSrc={memberImageSrc} />
            {user.user_member_type === "Couple Membership" && (
              <AvatarCell imageSrc={spouseImageSrc} />
            )}
          </div>
        );
      },
    },
    {
      title: "MID",
      dataIndex: "user_mid",
      key: "user_mid",
      render: (_, user) =>
        user.user_mid ? (
          <HighlightText text={user.user_mid} match={user._match} />
        ) : (
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openModal(user)}
          />
        ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, user) => (
        <HighlightText text={user.name} match={user._match} />
      ),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (_, user) => (
        <HighlightText text={user.gender} match={user._match} />
      ),
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      render: (_, user) => (
        <HighlightText text={user.mobile} match={user._match} />
      ),
    },
    {
      title: "DOB",
      dataIndex: "user_dob",
      key: "user_dob",
      render: (_, user) => (
        <HighlightText
          text={dayjs(user.user_dob).format("DD MMM YYYY")}
          match={user._match}
        />
      ),
    },
  ];

  return (
    <>
      <STTable
        data={users}
        columns={columns}
        rowClassName={(record) =>
          record.entry_status === "M" ? "bg-green-100" : ""
        }
      />

      {/* Modal for updating MID */}
      <Modal
        title={`Update MID for ${currentUser?.name || ""}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleSubmit}
          >
            Update
          </Button>,
        ]}
      >
        <Input
          placeholder="Enter MID"
          value={midValue}
          onChange={(e) => setMidValue(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default MIDTable;

import { App, Card, Input, Spin, Tabs } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MEMBER_DATA, UPDATE_USER_STATUS } from "../../api";
import MIDTable from "../../components/MIDIssued/MIDTable";
import { useApiMutation } from "../../hooks/useApiMutation";

const { Search } = Input;

const MIDIssued = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { trigger, loading: isMutating } = useApiMutation();
  const [users, setUsers] = useState([]);
  const [imageUrls, setImageUrls] = useState({
    userImageBase: "",
    noImage: "",
  });

  const fetchUser = async () => {
    const res = await trigger({ url: MEMBER_DATA });
    if (Array.isArray(res.data)) {
      setUsers(res.data);
      const userImageObj = res.image_url?.find(
        (img) => img.image_for === "User",
      );
      const noImageObj = res.image_url?.find(
        (img) => img.image_for === "No Image",
      );

      setImageUrls({
        userImageBase: userImageObj?.image_url || "",
        noImage: noImageObj?.image_url || "",
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const filteredUsers = users
    .map((user) => {
      const flatString = Object.values(user)
        .filter((v) => typeof v === "string" || typeof v === "number")
        .join(" ")
        .toLowerCase();
      const matched = flatString.includes(searchTerm.toLowerCase());
      return matched ? { ...user, _match: searchTerm } : null;
    })
    .filter(Boolean);

  const issuedUsers = filteredUsers.filter((user) => user.user_mid);
  const notIssuedUsers = filteredUsers.filter((user) => !user.user_mid);

  return (
    <Card>
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold heading">MID Issued</h2>
        <div className="flex-1 flex gap-4 sm:justify-end">
          <Search
            placeholder={`Search MID Issued`}
            allowClear
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            className="max-w-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      {isMutating ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <Tabs
          centered
          defaultActiveKey="notIssued"
          items={[
            {
              key: "notIssued",
              label: `MID Not Issued (${notIssuedUsers.length})`,
              children:
                notIssuedUsers.length > 0 ? (
                  <MIDTable
                    imageUrls={imageUrls}
                    users={notIssuedUsers}
                    fetchUser={fetchUser}
                  />
                ) : (
                  <div className="text-center text-gray-500 py-20">
                    No MID Not Issued users.
                  </div>
                ),
            },
            {
              key: "issued",
              label: `MID Issued (${issuedUsers.length})`,
              children:
                issuedUsers.length > 0 ? (
                  <MIDTable imageUrls={imageUrls} users={issuedUsers} />
                ) : (
                  <div className="text-center text-gray-500 py-20">
                    No MID Issued users.
                  </div>
                ),
            },
          ]}
        />
      )}
    </Card>
  );
};

export default MIDIssued;

import React from "react";
import ProfileForm from "../../components/user/ProfileForm";
import { Card } from "antd";
const Profile = () => {
  return (
    <Card
      title={<h2 className="text-2xl font-bold heading">Update Profile</h2>}
    >
      <ProfileForm />
    </Card>
  );
};

export default Profile;

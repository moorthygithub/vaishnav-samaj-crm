import React from "react";
import MemberReport from "./MemberReport";

const PatronReport = () => {
  return (
    <div>
      <MemberReport
        title="Patron"
        userTypeFilter="Patron"
      />
    </div>
  );
};

export default PatronReport;

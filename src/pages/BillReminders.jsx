import React, { useState } from "react";
import BillReminderList from "../components/BillReminders/BillReminderList";

const BillReminders = () => {
  const [refresh, setRefresh] = useState("init");

  const handleRefresh = () => setRefresh(Date.now());

  return (
    <div>
      <BillReminderList refreshTrigger={refresh} onSuccess={handleRefresh} />
    </div>
  );
};

export default BillReminders;

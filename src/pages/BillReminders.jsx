import React, { useState } from "react";
import BillReminderList from "../components/BillReminders/BillReminderList";

const BillReminders = () => {
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => setRefresh((prev) => !prev);

  return (
    <div>
   
      <BillReminderList refreshTrigger={refresh} onSuccess={handleRefresh} />
    </div>
  );
};

export default BillReminders;

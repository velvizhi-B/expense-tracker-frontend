import React, { useState } from "react";
import IncomeList from "../components/Incomes/IncomeList";
import IncomeForm from "../components/Incomes/IncomeForm";

const Incomes = () => {
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleAddClick = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);
  const handleSuccess = () => {
    setShowForm(false);
    setRefresh((prev) => !prev);
  };

  return (
    <div>
      {/* <h2>Incomes</h2> */}
      <IncomeList onAddClick={handleAddClick} refreshTrigger={refresh} />
      {showForm && (
        <IncomeForm onClose={handleCloseForm} onSuccess={handleSuccess} />
      )}
    </div>
  );
};

export default Incomes;

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [incomeForm, setIncomeForm] = useState({
    amount: "",
    source: "",
    received_date: "",
  });

  const [expenseForm, setExpenseForm] = useState({
    title: "",
    amount: "",
    category: "",
    expense_date: "",
  });
  const [reminderForm, setReminderForm] = useState({
    title: "",
    amount: "",
    due_date: "",
    repeat_cycle: "monthly", // default
    status: "pending", // default
    notes: "",
  });
  const [editingIncome, setEditingIncome] = useState(null);
  const [editIncomeForm, setEditIncomeForm] = useState({
    amount: "",
    source: "",
    received_date: "",
  });

  const [editingExpense, setEditingExpense] = useState(null);
  const [editExpenseForm, setEditExpenseForm] = useState({
    title: "",
    amount: "",
    category: "",
    expense_date: "",
  });

  const [editingReminder, setEditingReminder] = useState(null);
  const [editReminderForm, setEditReminderForm] = useState({
    title: "",
    amount: "",
    due_date: "",
    repeat_cycle: "",
    status: "",
    notes: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incomeRes, expenseRes, reminderRes] = await Promise.all([
          api.get("/incomes/"),
          api.get("/expenses/"),
          api.get("/bill-reminders/"),
        ]);
        setIncomes(incomeRes.data);
        setExpenses(expenseRes.data);
        setReminders(reminderRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalIncome = incomes.reduce(
    (sum, income) => sum + Number(income.amount),
    0
  );
  const totalExpense = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );
  const balance = totalIncome - totalExpense;

  const handleIncomeChange = (e) => {
    setIncomeForm({ ...incomeForm, [e.target.name]: e.target.value });
  };

  const handleAddIncome = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/incomes/", incomeForm);
      setIncomes([...incomes, res.data]); // append new income
      setIncomeForm({ amount: "", source: "", received_date: "" }); // reset
    } catch (err) {
      console.error("Failed to add income:", err);
    }
  };

  const handleExpenseChange = (e) => {
    setExpenseForm({ ...expenseForm, [e.target.name]: e.target.value });
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/expenses/", expenseForm);
      setExpenses([...expenses, res.data]);
      setExpenseForm({ title: "", amount: "", category: "", expense_date: "" });
    } catch (err) {
      console.error("Failed to add expense:", err);
    }
  };

  const handleReminderChange = (e) => {
    setReminderForm({ ...reminderForm, [e.target.name]: e.target.value });
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/bill-reminders/", reminderForm);
      setReminders([...reminders, res.data]);
      setReminderForm({
        title: "",
        amount: "",
        due_date: "",
        repeat_cycle: "monthly",
        status: "pending",
        notes: "",
      });
    } catch (err) {
      console.error("Failed to add reminder:", err);
    }
  };

  const handleDeleteIncome = async (id) => {
    try {
      await api.delete(`/incomes/${id}`);
      setIncomes(incomes.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete income failed:", err);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(expenses.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete expense failed:", err);
    }
  };

  const handleDeleteReminder = async (id) => {
    try {
      await api.delete(`/bill-reminders/${id}`);
      setReminders(reminders.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete reminder failed:", err);
    }
  };

  const handleEditIncomeChange = (e) => {
    setEditIncomeForm({ ...editIncomeForm, [e.target.name]: e.target.value });
  };

  const handleUpdateIncome = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/incomes/${editingIncome}`, editIncomeForm);
      setIncomes(
        incomes.map((income) =>
          income.id === editingIncome ? res.data : income
        )
      );
      setEditingIncome(null);
      setEditIncomeForm({ amount: "", source: "", received_date: "" });
    } catch (err) {
      console.error("Failed to update income:", err);
    }
  };

  const handleEditExpenseChange = (e) => {
    setEditExpenseForm({ ...editExpenseForm, [e.target.name]: e.target.value });
  };

  const handleUpdateExpense = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/expenses/${editingExpense}`, editExpenseForm);
      setExpenses(
        expenses.map((expense) =>
          expense.id === editingExpense ? res.data : expense
        )
      );
      setEditingExpense(null);
      setEditExpenseForm({
        title: "",
        amount: "",
        category: "",
        expense_date: "",
      });
    } catch (err) {
      console.error("Failed to update expense:", err);
    }
  };

  const handleEditReminderChange = (e) => {
    setEditReminderForm({
      ...editReminderForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateReminder = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(
        `/bill-reminders/${editingReminder}`,
        editReminderForm
      );
      setReminders(
        reminders.map((r) => (r.id === editingReminder ? res.data : r))
      );
      setEditingReminder(null);
      setEditReminderForm({
        title: "",
        amount: "",
        due_date: "",
        repeat_cycle: "",
        status: "",
        notes: "",
      });
    } catch (err) {
      console.error("Failed to update reminder:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Expense Tracker Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div style={{ padding: "2rem" }}>
          <h2>Welcome, {user?.email}</h2>
          <button onClick={logout}>Logout</button>

          {/* Summary Section */}
          <div
            style={{
              background: "#f3f4f6",
              padding: "1rem",
              borderRadius: "8px",
              marginTop: "2rem",
              maxWidth: "400px",
            }}
          >
            <h3>📊 Summary</h3>
            <p>
              <strong>Total Income:</strong> ₹{totalIncome}
            </p>
            <p>
              <strong>Total Expenses:</strong> ₹{totalExpense}
            </p>
            <p>
              <strong>Balance:</strong> ₹{balance}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Incomes</h2>
            {/* income form*/}
            <h3 style={{ marginTop: "2rem" }}>➕ Add Income</h3>
            <form onSubmit={handleAddIncome} className="space-y-4">
              <input
                type="number"
                name="amount"
                value={incomeForm.amount}
                onChange={handleIncomeChange}
                placeholder="Amount"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                name="source"
                value={incomeForm.source}
                onChange={handleIncomeChange}
                placeholder="Source"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="date"
                name="received_date"
                value={incomeForm.received_date}
                onChange={handleIncomeChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                Add Income
              </button>
            </form>

            {/* Incomes */}
            <h3 style={{ marginTop: "2rem" }}>💰 Incomes</h3>
            {loading ? (
              <p>Loading incomes...</p>
            ) : incomes.length === 0 ? (
              <p>No incomes found.</p>
            ) : (
              <ul>
                {incomes.map((income) =>
                  editingIncome === income.id ? (
                    <form key={income.id} onSubmit={handleUpdateIncome}>
                      <input
                        type="number"
                        name="amount"
                        value={editIncomeForm.amount}
                        onChange={handleEditIncomeChange}
                        required
                      />
                      <input
                        type="text"
                        name="source"
                        value={editIncomeForm.source}
                        onChange={handleEditIncomeChange}
                        required
                      />
                      <input
                        type="date"
                        name="received_date"
                        value={editIncomeForm.received_date}
                        onChange={handleEditIncomeChange}
                        required
                      />
                      <button type="submit">Save</button>
                      <button
                        type="button"
                        onClick={() => setEditingIncome(null)}
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <li key={income.id}>
                      ₹{income.amount} - {income.source} ({income.received_date}
                      )
                      <button
                        onClick={() => {
                          setEditingIncome(income.id);
                          setEditIncomeForm({
                            amount: income.amount,
                            source: income.source,
                            received_date: income.received_date,
                          });
                        }}
                        style={{ marginLeft: "1rem" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteIncome(income.id)}
                        style={{ marginLeft: "0.5rem", color: "red" }}
                      >
                        Delete
                      </button>
                    </li>
                  )
                )}
              </ul>
            )}
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Expenses</h2>
            {/* add Expenses */}
            <h3 style={{ marginTop: "2rem" }}>➕ Add Expense</h3>
            <form
              onSubmit={handleAddExpense}
              style={{ marginBottom: "1.5rem" }}
            >
              <input
                type="text"
                name="title"
                value={expenseForm.title}
                onChange={handleExpenseChange}
                placeholder="Title"
                required
                style={{ marginRight: "1rem" }}
              />
              <input
                type="number"
                name="amount"
                value={expenseForm.amount}
                onChange={handleExpenseChange}
                placeholder="Amount"
                required
                style={{ marginRight: "1rem" }}
              />
              <input
                type="text"
                name="category"
                value={expenseForm.category}
                onChange={handleExpenseChange}
                placeholder="Category"
                required
                style={{ marginRight: "1rem" }}
              />
              <input
                type="date"
                name="expense_date"
                value={expenseForm.expense_date}
                onChange={handleExpenseChange}
                required
                style={{ marginRight: "1rem" }}
              />
              <button type="submit">Add</button>
            </form>

            {/* Expenses */}
            <h3 style={{ marginTop: "2rem" }}>💸 Expenses</h3>
            {loading ? (
              <p>Loading expenses...</p>
            ) : expenses.length === 0 ? (
              <p>No expenses found.</p>
            ) : (
              <ul>
                {expenses.map((expense) =>
                  editingExpense === expense.id ? (
                    <form key={expense.id} onSubmit={handleUpdateExpense}>
                      <input
                        type="text"
                        name="title"
                        value={editExpenseForm.title}
                        onChange={handleEditExpenseChange}
                        required
                      />
                      <input
                        type="number"
                        name="amount"
                        value={editExpenseForm.amount}
                        onChange={handleEditExpenseChange}
                        required
                      />
                      <input
                        type="text"
                        name="category"
                        value={editExpenseForm.category}
                        onChange={handleEditExpenseChange}
                        required
                      />
                      <input
                        type="date"
                        name="expense_date"
                        value={editExpenseForm.expense_date}
                        onChange={handleEditExpenseChange}
                        required
                      />
                      <button type="submit">Save</button>
                      <button
                        type="button"
                        onClick={() => setEditingExpense(null)}
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <li key={expense.id}>
                      {expense.title} - ₹{expense.amount} ({expense.category},{" "}
                      {expense.expense_date})
                      <button
                        onClick={() => {
                          setEditingExpense(expense.id);
                          setEditExpenseForm({
                            title: expense.title,
                            amount: expense.amount,
                            category: expense.category,
                            expense_date: expense.expense_date,
                          });
                        }}
                        style={{ marginLeft: "1rem" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        style={{ marginLeft: "0.5rem", color: "red" }}
                      >
                        Delete
                      </button>
                    </li>
                  )
                )}
              </ul>
            )}
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Bill Reminders</h2>

            {/*add bill remainder*/}

            <h3 style={{ marginTop: "2rem" }}>➕ Add Bill Reminder</h3>
            <form
              onSubmit={handleAddReminder}
              style={{ marginBottom: "1.5rem" }}
            >
              <input
                type="text"
                name="title"
                value={reminderForm.title}
                onChange={handleReminderChange}
                placeholder="Reminder Title"
                required
                style={{ marginRight: "1rem" }}
              />
              <input
                type="number"
                name="amount"
                value={reminderForm.amount}
                onChange={handleReminderChange}
                placeholder="Amount"
                required
                style={{ marginRight: "1rem" }}
              />
              <input
                type="date"
                name="due_date"
                value={reminderForm.due_date}
                onChange={handleReminderChange}
                required
                style={{ marginRight: "1rem" }}
              />
              <select
                name="repeat_cycle"
                value={reminderForm.repeat_cycle}
                onChange={handleReminderChange}
                style={{ marginRight: "1rem" }}
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="yearly">Yearly</option>
                <option value="none">None</option>
              </select>
              <select
                name="status"
                value={reminderForm.status}
                onChange={handleReminderChange}
                style={{ marginRight: "1rem" }}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
              <input
                type="text"
                name="notes"
                value={reminderForm.notes}
                onChange={handleReminderChange}
                placeholder="Notes"
                style={{ marginRight: "1rem" }}
              />
              <button type="submit">Add</button>
            </form>

            {/* Bill Reminders */}
            <h3 style={{ marginTop: "2rem" }}>⏰ Upcoming Bill Reminders</h3>
            {loading ? (
              <p>Loading reminders...</p>
            ) : reminders.length === 0 ? (
              <p>No bill reminders found.</p>
            ) : (
              <ul>
                {reminders.map((reminder) =>
                  editingReminder === reminder.id ? (
                    <form key={reminder.id} onSubmit={handleUpdateReminder}>
                      <input
                        type="text"
                        name="title"
                        value={editReminderForm.title}
                        onChange={handleEditReminderChange}
                        required
                      />
                      <input
                        type="number"
                        name="amount"
                        value={editReminderForm.amount}
                        onChange={handleEditReminderChange}
                        required
                      />
                      <input
                        type="date"
                        name="due_date"
                        value={editReminderForm.due_date}
                        onChange={handleEditReminderChange}
                        required
                      />
                      <select
                        name="repeat_cycle"
                        value={editReminderForm.repeat_cycle}
                        onChange={handleEditReminderChange}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                        <option value="yearly">Yearly</option>
                        <option value="none">None</option>
                      </select>
                      <select
                        name="status"
                        value={editReminderForm.status}
                        onChange={handleEditReminderChange}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                      </select>
                      <input
                        type="text"
                        name="notes"
                        value={editReminderForm.notes}
                        onChange={handleEditReminderChange}
                      />
                      <button type="submit">Save</button>
                      <button
                        type="button"
                        onClick={() => setEditingReminder(null)}
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <li key={reminder.id}>
                      {reminder.title} - ₹{reminder.amount} (Due:{" "}
                      {reminder.due_date}) [{reminder.repeat_cycle}]
                      <button
                        onClick={() => {
                          setEditingReminder(reminder.id);
                          setEditReminderForm({
                            title: reminder.title,
                            amount: reminder.amount,
                            due_date: reminder.due_date,
                            repeat_cycle: reminder.repeat_cycle,
                            status: reminder.status,
                            notes: reminder.notes,
                          });
                        }}
                        style={{ marginLeft: "1rem" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReminder(reminder.id)}
                        style={{ marginLeft: "0.5rem", color: "red" }}
                      >
                        Delete
                      </button>
                    </li>
                  )
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

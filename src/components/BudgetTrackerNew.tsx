import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import '../styles.css'; // Ensure this is included for styles
import AddCategory from './AddCategory';

// Register the components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

const BudgetTracker: React.FC = () => {
  const [categories, setCategories] = useState<string[]>(['Food', 'Transportation', 'Utilities', 'Entertainment']);
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [idealPlan, setIdealPlan] = useState<{ [key: string]: number }>({});
  const [actualExpenses, setActualExpenses] = useState<{ [key: string]: number }>({});
  const [expenseCategory, setExpenseCategory] = useState<string>(categories[0]);
  const [expenseAmount, setExpenseAmount] = useState<number>(0);
  const [expenseMessage, setExpenseMessage] = useState<string>('');
  const [balanceHistory, setBalanceHistory] = useState<number[]>([totalBudget]);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [additionalBudget, setAdditionalBudget] = useState<number>(0);
  const [categoryToDelete, setCategoryToDelete] = useState<string>('');
  const [categoryBudgets, setCategoryBudgets] = useState<{ [key: string]: number }>({});
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);

  useEffect(() => {
    // Set the initial ideal plan when categories or totalBudget changes
    const newIdealPlan = categories.reduce((acc, category) => {
      acc[category] = totalBudget / categories.length;
      return acc;
    }, {} as { [key: string]: number });
    setIdealPlan(newIdealPlan);
  }, [categories, totalBudget]);

  useEffect(() => {
    if (expenseMessage) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        setExpenseMessage('');
      }, 5000); // Close popup after 5 seconds
      return () => clearTimeout(timer); // Cleanup timer if component unmounts or message changes
    }
  }, [expenseMessage]);

  const handleAddCategory = (newCategory: string) => {
    setCategories([...categories, newCategory]);
    setExpenseCategory(newCategory);
    setCategoryBudgets({ ...categoryBudgets, [newCategory]: 0 });
  };

  const handleBudgetSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newIdealPlan = categories.reduce((acc, category) => {
      acc[category] = categoryBudgets[category] || totalBudget / categories.length;
      return acc;
    }, {} as { [key: string]: number });
    setIdealPlan(newIdealPlan);
    setShowUpdateForm(false); // Hide the update form after submission
  };

  const handleExpenseSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActualExpenses((prevExpenses) => {
      const newExpenses = { ...prevExpenses };
      if (!newExpenses[expenseCategory]) {
        newExpenses[expenseCategory] = 0;
      }
      newExpenses[expenseCategory] += expenseAmount;
      return newExpenses;
    });
    setExpenseAmount(0);

    // Update balance history
    setBalanceHistory((prevHistory) => {
      const totalExpenses = Object.values(actualExpenses).reduce((acc, expense) => acc + expense, 0) + expenseAmount;
      return [...prevHistory, totalBudget - totalExpenses];
    });

    displayBudgetStatusMessage();
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setExpenseCategory(event.target.value);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExpenseAmount(parseFloat(event.target.value));
  };

  const displayBudgetStatusMessage = () => {
    const totalExpenses = Object.values(actualExpenses).reduce((acc, expense) => acc + expense, 0);
    const message = totalExpenses <= totalBudget
      ? 'Great! You are still under your budget, good work! 🎉'
      : 'Oh no! You have exceeded your budget, try to save more! 💸';
    setExpenseMessage(message);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    setExpenseMessage('');
  };

  const handleIncreaseBudget = () => {
    setTotalBudget(prevBudget => prevBudget + additionalBudget);
    setAdditionalBudget(0); // Reset additional budget input field
  };

  const handleDeleteCategory = () => {
    setCategories(prevCategories => prevCategories.filter(category => category !== categoryToDelete));
    setCategoryToDelete('');
    setCategoryBudgets(prevBudgets => {
      const newBudgets = { ...prevBudgets };
      delete newBudgets[categoryToDelete];
      return newBudgets;
    });
  };

  const handleCategoryBudgetChange = (event: React.ChangeEvent<HTMLInputElement>, category: string) => {
    setCategoryBudgets({
      ...categoryBudgets,
      [category]: parseFloat(event.target.value)
    });
  };

  const toggleUpdateForm = () => {
    setShowUpdateForm(!showUpdateForm);
  };

  const pieChartData = {
    labels: Object.keys(actualExpenses),
    datasets: [
      {
        data: Object.values(actualExpenses),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }
    ]
  };

  const lineChartData = {
    labels: balanceHistory.map((_, index) => `Expense ${index + 1}`),
    datasets: [
      {
        label: 'Balance Over Time',
        data: balanceHistory,
        fill: false,
        borderColor: '#FF6347', // Brighter color
        pointBackgroundColor: '#FF6347',
        pointBorderColor: '#FF6347',
        pointRadius: 5,
      }
    ]
  };

  return (
    <div>
      <header>
        <h5>Track your expenses seamlessly with our Budget Tracker..</h5>
        <h1>Budget Bliss</h1>
      </header>

      <main>
        <section className="budget-input">
          <h2>Set Your Budget</h2>
          <form onSubmit={handleBudgetSubmit}>
            <label htmlFor="total-budget">Total Budget:</label>
            <input
              type="number"
              id="total-budget"
              value={totalBudget}
              style={{ color: 'white' }}
              onChange={(e) => setTotalBudget(parseFloat(e.target.value))}
              required
            />
            <button type="submit"><b>Set Budget</b></button>
          </form>
        </section>
        <section className="increase-budget">
          <h2>Increase Your Budget</h2>
          <form onSubmit={(event) => {
            event.preventDefault();
            handleIncreaseBudget();
          }}>
            <label htmlFor="additional-budget">Additional Amount:</label>
            <input
              type="number"
              id="additional-budget"
              value={additionalBudget}
              onChange={(e) => setAdditionalBudget(parseFloat(e.target.value))}
              required
              style={{ backgroundColor: "#3b3939", color: "white" }}
            />
            <button type="submit"><b>Increase Budget</b></button>
          </form>
        </section>
        <AddCategory onCategoryAdd={handleAddCategory} />
        <section className="delete-category">
          <h2>Delete Category</h2>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleDeleteCategory();
            }}
          >
            <label htmlFor="category-to-delete">Select Category to Delete:</label>
            <select
              id="category-to-delete"
              value={categoryToDelete}
              onChange={(e) => setCategoryToDelete(e.target.value)}
              style={{ backgroundColor: "#3b3939", color: "white" }}
            >
              <option value="" disabled>Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <button type="submit"><b>Delete Category</b></button>
          </form>
        </section>
        <section className="ideal-plan">
          <h2>Ideal Plan</h2>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Ideal Budget</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category}>
                  <td>{category}</td>
                  <td>${idealPlan[category]?.toFixed(2) || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={toggleUpdateForm}>
            {showUpdateForm ? 'Hide Custom Budgeting' : 'Custom Budgeting'}
          </button>
          {showUpdateForm && (
            <div className="ideal-plan-form">
              <h3>Custom Budgeting</h3>
              <form onSubmit={handleBudgetSubmit}>
                {categories.map((category) => (
                  <div key={category}>
                    <label htmlFor={`budget-${category}`}>{category}:</label>
                    <input
                      type="number"
                      id={`budget-${category}`}
                      value={categoryBudgets[category] || idealPlan[category] || 0}
                      onChange={(e) => handleCategoryBudgetChange(e, category)}
                    />
                  </div>
                ))}
                <button type="submit"><b>Customise</b></button>
              </form>
            </div>
          )}
        </section>
        <section className="actual-expenses">
          <h2>Actual Expenses</h2>
          <form onSubmit={handleExpenseSubmit}>
            <label htmlFor="expense-category">Category:</label>
            <select
              id="expense-category"
              value={expenseCategory}
              onChange={handleCategoryChange}
              style={{ backgroundColor: "#3b3939", color: "white" }}
            >
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <label htmlFor="expense-amount">Amount:</label>
            <input
              type="number"
              id="expense-amount"
              value={expenseAmount}
              onChange={handleAmountChange}
              style={{ backgroundColor: "#3b3939", color: "white" }}
            />
            <button type="submit"><b>Add Expense</b></button>
          </form>
        </section>
        <section className="expense-summary">
          <h2>Expense Summary</h2>
          <Pie data={pieChartData} />
        </section>
        <section className="balance-history">
          <h2>Balance Over Time</h2>
          <Line data={lineChartData} />
        </section>
      </main>

      {showAlert && (
        <div className="alert">
          <span>{expenseMessage}</span>
          <button onClick={handleCloseAlert}>Close</button>
        </div>
      )}
    </div>
  );
};

export default BudgetTracker;

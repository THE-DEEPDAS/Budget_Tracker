import React from 'react';
import './styles.css';
import BudgetTrackerNew from './components/BudgetTrackerNew';
import Navbar from './components/Navbar'; 

const App: React.FC = () => {
  return (
    <div className="App">
      <Navbar /> 
      <main>
        <BudgetTrackerNew />
      </main>
    </div>
  );
};

export default App;

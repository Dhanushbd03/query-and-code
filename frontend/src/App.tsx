import { Routes, Route } from 'react-router-dom';
import Home from '@/app/Home';
import SignUp from './components/Signup';
const App = () => {
  return (
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <SignUp />
      </main>
  );
};

export default App;

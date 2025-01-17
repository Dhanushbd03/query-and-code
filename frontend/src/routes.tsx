import App from './App';
import Home from '@/app/Home';

const routes = [
  {
    path: '/',
    element: <App/>,
    children: [
      { index: true, element: <Home /> },
    ],
  },
];

export default routes;

import React, {createContext, useState} from 'react';
import MainContainer from './screens/MainContainer';

const IdContext = createContext();

const App = () => {
  const [adminKey, setAdminKey] = useState('');

  return (
    <IdContext.Provider value={{ adminKey, setAdminKey }}>
      <MainContainer />
    </IdContext.Provider>
  );
};

export { IdContext }
export default App;

import { createContext } from 'react';
import { Provider } from 'react-redux';
import { store } from './features/store';
import { context } from './features/context';
import Map from './components/Map';
import Control from './components/Control';

export const AppContext = createContext(context);

export default function App() {

  return (
    <Provider store={store}>
      <Map />
      <Control />
    </Provider>
  );
}

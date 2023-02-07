import { createContext } from 'react';
import { Provider } from 'react-redux';
import { store } from './features/store';
import { context } from './features/context';
import MapControl from './components/MapControl';
import PanelControl from './components/PanelControl';
import LoggerControl from './components/LoggerControl';

export const AppContext = createContext(context);

export default function App() {

  return (
    <Provider store={store}>
      <MapControl />
      <PanelControl />
      <LoggerControl />
    </Provider>
  );
}

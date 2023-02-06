import { Provider } from 'react-redux';
import { store } from './features/store';
import Map from './components/Map';
import Control from './components/Control';

export default function App() {

  return (
    <Provider store={store}>
      <Map />
      <Control />
    </Provider>
  );
}

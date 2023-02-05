import { Provider } from 'react-redux';
import store from './features/store';
import Map from './components/Map';

export default function App() {
  return (
    <Provider store={store}>
      <Map />
    </Provider>
  );
}

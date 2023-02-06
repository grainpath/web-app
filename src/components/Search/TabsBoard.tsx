import { Tab, Tabs } from 'react-bootstrap';
import { CountInput } from './CountInput';
import { DistanceInput } from './DistanceInput';

export function TabsBoard() {

  return (
    <Tabs defaultActiveKey='discover' fill className='mb-4 mt-4'>
      <Tab eventKey='discover' title='Discover'>
        <CountInput />
        <DistanceInput />
      </Tab>
      <Tab eventKey='navigate' title='Navigate'>

      </Tab>
    </Tabs>
  );
}
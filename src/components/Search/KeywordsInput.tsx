import { useState, } from 'react';
import { Button, Form, Modal, Spinner, } from 'react-bootstrap';
import { Chip, } from '@mui/material';
import { AddCircleOutline, } from '@mui/icons-material';
import { SimpleButtonProps, } from '../types';
import { useAppDispatch, useAppSelector, } from '../../features/hooks';
import {
  KeywordConstraint,
  deleteKeyword,
} from '../../features/keywordsSlice';

type KeywordChip = {
  keyword: string;
  onDelete: React.MouseEventHandler<HTMLButtonElement>;
};

function AddKeywordButton({ onClick }: SimpleButtonProps): JSX.Element {

  return (
    <button className="standard-button" onClick={onClick} title='Search pane'>
      <AddCircleOutline fontSize="large" />
    </button>
  );
}

function RemovableKeywordChip({ keyword, onDelete }: KeywordChip): JSX.Element {
  return (
    <div style={{ margin: "2px", display: "inline-block" }}>
      <Chip color="primary" label={keyword} onClick={() => {}} onDelete={onDelete} />
    </div>
  );
}

function AddButton({ onClick }: SimpleButtonProps): JSX.Element {

  return (
    <div className='mt-2 mb-2' style={{ display: 'flex', justifyContent: 'center' }}>
      <AddKeywordButton onClick={onClick} />
    </div>
  );
}

type KeywordModalWindowProps = {
  show: boolean;
  onHide: React.MouseEventHandler<HTMLButtonElement>;
}

function KeywordModalWindow({ show, onHide }: KeywordModalWindowProps): JSX.Element {

  const [keyword, setKeyword] = useState<string>('');
  const [constrs, setConstrs] = useState<KeywordConstraint[]>([]);

  const confirm = () => {

    
  };

  console.log(keyword);

  return (
    <Modal show={show} backdrop='static' centered={true} keyboard={false}>
      <Modal.Body>
        <>
          <Form.Control autoFocus={true} defaultValue={keyword} placeholder='camel_case_keyword' onChange={(e) => setKeyword(e.target.value)}></Form.Control>
          {constrs.map((_, i) => 
            <div key={i} style={{ display: 'flex' }}>
              <Form.Select>
                <option value=''></option>
                <option value='name'>name</option>
                <option value='rating'>rating</option>
              </Form.Select>
              <Form.Select disabled={true}>
              </Form.Select>
              <Form.Control type='text' disabled={true} />
            </div>
          )}
          <AddButton onClick={() => { setConstrs([ ...constrs, { label: '' } ]) }} />
        </>
      </Modal.Body>
      <Modal.Footer>
        <Spinner animation='border' />
        <Button variant='secondary' onClick={onHide}>Cancel</Button>
        <Button variant='primary' onClick={confirm}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  );
}

export function KeywordsInput(): JSX.Element {

  const [show, setShow] = useState(false);

  const dispatch = useAppDispatch();
  const keywords = useAppSelector(state => state.keywords.selected.map(obj => obj.keyword));

  return (
    <>
      <Form.Group className='mt-4 mb-4'>
        <Form.Label>Keywords</Form.Label>
        <div id='keywords-container'>
          {keywords.map((keyword, i) => {
            return <RemovableKeywordChip key={i} keyword={keyword} onDelete={() => dispatch(deleteKeyword(i))} />
          })}
        </div>
        <AddButton onClick={() => setShow(true)} />
      </Form.Group>
      <KeywordModalWindow show={show} onHide={() => setShow(false)} />
    </>
  );
}

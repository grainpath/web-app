import { ReactElement, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { Chip } from '@mui/material';
import { AddCircleOutline, Save } from '@mui/icons-material';
import { SimpleButtonProps } from '../types';
import { useAppDispatch, useAppSelector } from '../../features/hooks';
import { deleteKeyword } from '../../features/keywordsSlice';
import { API_BASE_URL, EXISTING_TAGS, TAG_TO_OPERATOR, TAG_TO_TYPE } from '../../utils/const';

const isTagWithOperator = (tag: string): boolean => TAG_TO_OPERATOR.has(tag);

const isTagBoolean = (tag: string): boolean => (TAG_TO_TYPE.get(tag) ?? "") === "boolean";
const isTagCollect = (tag: string): boolean => (TAG_TO_TYPE.get(tag) ?? "") === "collect";
const isTagMeasure = (tag: string): boolean => (TAG_TO_TYPE.get(tag) ?? "") === "measure";
const isTagTextual = (tag: string): boolean => (TAG_TO_TYPE.get(tag) ?? "") === "textual";

type StandardChipProps = {
  label: string;
  onClick: React.MouseEventHandler<HTMLElement>;
  onDelete: React.MouseEventHandler<HTMLElement>;
};

type ButtonContainerProps = { button: ReactElement; }

type KeywordSearchEntry = { label: string };

type KeywordModalWindowProps = {
  show: boolean;
  label: string | undefined;
  onDiscard: React.MouseEventHandler<HTMLElement>;
}

type StandardTypeaheadProps = {
  index: string;
  label: string | undefined;
  set: (arr: string[]) => void;
}

function StandardChip(props: StandardChipProps): JSX.Element {
  return (
    <div style={{ margin: "2px", display: "inline-block" }}>
      <Chip {...props} color="primary" />
    </div>
  );
}

function AddKeywordButton(props: SimpleButtonProps): JSX.Element {

  return (
    <button {...props} className="standard-button" title='add keyword'>
      <AddCircleOutline fontSize="large" />
    </button>
  );
}

function SaveKeywordButton(props: SimpleButtonProps): JSX.Element {

  return(
    <button {...props} className="standard-button" title='save keyword'>
      <Save fontSize="large" />
    </button>
  );
}

function ButtonContainer({ button }: ButtonContainerProps): JSX.Element {

  return (
    <div className='mt-2 mb-2' style={{ display: 'flex', justifyContent: 'center' }}>
      {button}
    </div>
  );
}

function StandardTypeahead({ index, label, set }: StandardTypeaheadProps): JSX.Element {

  const content = "application/json";

  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<KeywordSearchEntry[]>([]);

  const handleSearch = (query: string) => {
    setLoading(true);
    fetch(`${API_BASE_URL + "/autocomplete"}`, {
      method: "POST",
      headers: { "Accept": content, "Content-Type": content },
      body: JSON.stringify({ index: index, count: 3, prefix: query })
    })
    .then((res) => res.json())
    .then((arr: string[]) => setOptions(arr.map((item) => { return { label: item } as KeywordSearchEntry })))
    .catch((err) => alert(err))
    .finally(() => setLoading(false));
  };

  return(
    <AsyncTypeahead
      id="keyword-typeahead-input"
      defaultInputValue={label}
      placeholder="Start typing..."
      disabled={!!label}
      isLoading={loading}
      minLength={1}
      options={options}
      onSearch={handleSearch}
      onChange={(selected) => set((selected as KeywordSearchEntry[]).map((entry) => entry.label))} />
  );
}

function KeywordModalWindow({ show, label, onDiscard }: KeywordModalWindowProps): JSX.Element {

  const [keyword, setKeyword] = useState<string[]>([]);
  const [constrs, setConstrs] = useState(useAppSelector(state => (!!label) ? state.keywords.filter((keyword) => keyword.label === label)[0].constrs : []));

  const [tag, setTag] = useState<string>("");

  const defaultOperator = "";
  const [operator, setOperator] = useState<string>(defaultOperator);
  const operators: string[] = TAG_TO_OPERATOR.get(tag) ?? [];

  const defaultMeasure = 0;
  const defaultTextual = "";
  const defaultBoolean = true;
  const defaultCollect: string[] = [];

  const [b, setBoolean] = useState<boolean>(defaultBoolean);
  const [c, setCollect] = useState<string[]>(defaultCollect);
  const [m, setMeasure] = useState<number>(defaultMeasure);
  const [t, setTextual] = useState<string>(defaultTextual);

  const handleTag = (t: string): void => {
    setTag(t);
    setOperator(defaultOperator);
    setTextual(defaultTextual);
    setBoolean(defaultBoolean);
    setMeasure(defaultMeasure);
    setTextual(defaultTextual);
  }

  const handleOperator = (o: string): void => {
    setOperator(o);
  };

  const confirm = () => { console.log(tag); };

  return (
    <Modal show={show} backdrop="static" centered={true} keyboard={false}>
      <Modal.Body>
        <Form.Group className="mt-2 mb-2">
          <Form.Label>Keyword</Form.Label>
          <StandardTypeahead index="keywords" label={label} set={setKeyword} />
        </Form.Group>
        <Form.Group className="mt-2 mb-2">
          <Form.Label>Constraints</Form.Label>
          <div className="chips-container">
          {
            constrs.map((constr, i) => {
              return <StandardChip key={i} label={[ constr.tag, constr.operator, constr.value ].join(' ')} onClick={() => {}} onDelete={() => {}} />
            })
          }
          </div>
        </Form.Group>
        <Form.Group as={Row} className="mt-2 mb-2">
          <Form.Label xs={3} column>Tag</Form.Label>
          {
            <Col>
              <Form.Select value={tag} onChange={(e) => handleTag(e.target.value)}>
                <option value=""></option>
                {
                  EXISTING_TAGS.map((t, i) => <option key={i} value={t}>{t}</option>)
                }
              </Form.Select>
            </Col>
          }
        </Form.Group>
        <Form.Group as={Row} className="mt-2 mb-2">
          <Form.Label xs={3} column>Operator</Form.Label>
          <Col>
            <Form.Select value={operator} onChange={(e) => handleOperator(e.target.value)} disabled={!isTagWithOperator(tag)}>
              <option value=""></option>
              {
                operators.map((o, i) => <option key={i} value={o}>{o}</option>)
              }
            </Form.Select>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mt-2 mb-2" style={{ alignItems: "center" }}>
          <Form.Label xs={3} column>Value</Form.Label>
          {
            (operator !== "") && <Col>
              {
                isTagBoolean(tag) && <Form.Check type="switch" id="boolean-value" defaultChecked={true} />
              }
              {
                isTagCollect(tag) && <StandardTypeahead index={tag} label={undefined} set={() => {}} />
              }
              {
                isTagMeasure(tag) && <Form.Control type="number" min={0} defaultValue={0} />
              }
              {
                isTagTextual(tag) && <Form.Control type="text" />
              }
            </Col>
          }
        </Form.Group>
        <ButtonContainer button={<SaveKeywordButton onClick={() => {}} />} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onDiscard}>Discard</Button>
        <Button variant='primary' onClick={confirm}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  );
}

export function KeywordsInput(): JSX.Element {

  const [show, setShow] = useState(false);
  const [curr, setCurr] = useState<string | undefined>(undefined);

  const dispatch = useAppDispatch();
  const keywords = useAppSelector(state => state.keywords.map(obj => obj.label));

  const modal = (label: string | undefined) => { setCurr(label); setShow(true); };

  return (
    <>
      <Form.Group className="mt-4 mb-4">
        <Form.Label>Keywords</Form.Label>
        <div className="chips-container">
          {keywords.map((keyword, i) => {
            return <StandardChip key={i} label={keyword} onClick={() => modal(keyword)} onDelete={() => dispatch(deleteKeyword(keyword))} />
          })}
        </div>
        <ButtonContainer button={<AddKeywordButton onClick={() => modal(undefined)} />} />
      </Form.Group>
      <KeywordModalWindow show={show} label={curr} onDiscard={() => setShow(false)} />
    </>
  );
}

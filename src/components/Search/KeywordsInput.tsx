import { ReactElement, useEffect, useMemo, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { AddCircleOutline, Save } from "@mui/icons-material";
import { SimpleButtonProps } from "../types";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import {
  deleteKeyword,
  insertKeyword,
  Keyword,
  KeywordConstraint
} from "../../features/keywordsSlice";
import { EXISTING_TAGS, TagType, TAG_TO_OPERATOR, TAG_TO_TYPE } from "../../utils/const";
import { StandardChip, StandardTypeahead } from "./InputPrimitives";

const isTagWithOperator = (tag: string): boolean => TAG_TO_OPERATOR.has(tag);

const isTagBoolean = (tag: string): boolean => (TAG_TO_TYPE.get(tag) ?? TagType.DEFAULT) === TagType.BOOLEAN;
const isTagCollect = (tag: string): boolean => (TAG_TO_TYPE.get(tag) ?? TagType.DEFAULT) === TagType.COLLECT;
const isTagMeasure = (tag: string): boolean => (TAG_TO_TYPE.get(tag) ?? TagType.DEFAULT) === TagType.MEASURE;
const isTagTextual = (tag: string): boolean => (TAG_TO_TYPE.get(tag) ?? TagType.DEFAULT) === TagType.TEXTUAL;

type ButtonContainerProps = { button: ReactElement; }

type KeywordModalWindowProps = {
  show: boolean;
  label: string | undefined;
  onHide: () => void;
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
    <div className="mt-2 mb-2" style={{ display: "flex", justifyContent: "center" }}>
      {button}
    </div>
  );
}

function KeywordModalWindow({ show, label, onHide }: KeywordModalWindowProps): JSX.Element {

  const dispatch = useAppDispatch();

  const [keyword, setKeyword] = useState<string[]>([]);
  const [validK, setValidK] = useState<boolean>(true);
  const [constrs, setConstrs] = useState(useAppSelector(state => (!!label) ? state.keywords.filter((keyword) => keyword.label === label)[0].constrs : []));

  const defaultTag = "";
  const [tag, setTag] = useState<string>(defaultTag);
  const [validTag, setValidTag] = useState<boolean>(true);

  const defaultOperator = "";
  const [operator, setOperator] = useState<string>(defaultOperator);
  const operators: string[] = TAG_TO_OPERATOR.get(tag) ?? [];

  const defaultBoolean = true;
  const [b, setBoolean] = useState<boolean>(defaultBoolean);

  const defaultCollect: string[] = useMemo(() => [], []);
  const [validC, setValidC] = useState(true);
  const [c, setCollect] = useState<string[]>(defaultCollect);

  const defaultMeasure = 0;
  const [validM, setValidM] = useState(true);
  const [m, setMeasure] = useState<number>(defaultMeasure);

  const defaultTextual = "";
  const [validT, setValidT] = useState<boolean>(false);
  const [t, setTextual] = useState<string>(defaultTextual);

  useEffect(() => {
    const resetTag = () => {
      setValidTag(true);
      setOperator(defaultOperator);
    };
    resetTag();
  }, [tag]);

  useEffect(() => {
    const resetOperator = () => {
      setBoolean(defaultBoolean);
      setValidC(true);
      setCollect(defaultCollect);
      setValidM(true);
      setMeasure(defaultMeasure);
      setValidT(true);
      setTextual(defaultTextual);
    };
    resetOperator();
  }, [operator, defaultBoolean, defaultCollect, defaultMeasure, defaultTextual]);

  const appendConstraint = (constr: KeywordConstraint) => setConstrs([ ...constrs, constr ]);

  const deleteConstraint = (idx: number) => setConstrs([ ...constrs.slice(0, idx), ...constrs.slice(idx + 1) ]);

  const defaultAppender = (v: boolean | number | string): void => {
    const constr = (operator === defaultOperator)
      ? { tag: tag }
      : { tag: tag, operator: operator, value: v }
    appendConstraint(constr as KeywordConstraint);
    setTag(defaultTag);
  }

  const defaultHandler = () => {
    if (tag === defaultTag) { return setValidTag(false); }
    appendConstraint({ tag: tag } as KeywordConstraint);
    setTag(defaultTag);
  };

  const booleanHandler = () => defaultAppender(b);

  const collectHandler = () => {
    if (c.length !== 1) { return setValidC(false); }
    defaultAppender(c[0]);
  };

  const measureHandler = () => {
    if (m < 0) { return setValidM(false); }
    defaultAppender(m);
  };

  const textualHandler = () => {
    if (operator !== defaultOperator && !t.length) { return setValidT(false); }
    defaultAppender(t);
  };

  const save = () => {
    switch (TAG_TO_TYPE.get(tag) ?? TagType.DEFAULT) {
      case TagType.DEFAULT: defaultHandler(); break;
      case TagType.BOOLEAN: booleanHandler(); break;
      case TagType.COLLECT: collectHandler(); break;
      case TagType.MEASURE: measureHandler(); break;
      case TagType.TEXTUAL: textualHandler(); break;
    }
  };

  const confirm = () => {
    if (keyword.length !== 1) { return setValidK(false); }
    dispatch(insertKeyword({ label: keyword[0], constrs: constrs } as Keyword));
    onHide();
  };

  return (
    <Modal show={show} backdrop="static" centered={true} keyboard={false}>
      <Modal.Body>
        <Form.Group className="mt-2 mb-2">
          <Form.Label>Keyword</Form.Label>
          <StandardTypeahead id="keyword-typeahead-input" index="keywords" label={label}
            className={validK ? undefined : "is-invalid"} isInvalid={!validK} set={setKeyword} />
        </Form.Group>
        <Form.Group className="mt-2 mb-2">
          <Form.Label>Constraints</Form.Label>
          <div className="chips-container">
          {
            constrs.map((constr, i) => {
              return (
                <StandardChip
                  key={i} label={[ constr.tag, constr.operator, constr.value ].join(' ')}
                  onClick={() => {}} onDelete={() => deleteConstraint(i)}
                />
              );
            })
          }
          </div>
        </Form.Group>
        <Form.Group as={Row} className="mt-2 mb-2">
          <Form.Label xs={3} column>Tag</Form.Label>
          {
            <Col>
              <Form.Group>
                <Form.Select isInvalid={!validTag} value={tag} onChange={(e) => setTag(e.target.value)}>
                  <option value={defaultTag}></option>
                  {
                    EXISTING_TAGS.map((t, i) => <option key={i} value={t}>{t}</option>)
                  }
                </Form.Select>
                <Form.Control.Feedback type="invalid">Tag should be non-empty.</Form.Control.Feedback>
              </Form.Group>
            </Col>
          }
        </Form.Group>
        <Form.Group as={Row} className="mt-2 mb-2">
          <Form.Label xs={3} column>Operator</Form.Label>
          <Col>
            <Form.Group>
              <Form.Select value={operator} onChange={(e) => setOperator(e.target.value)} disabled={!isTagWithOperator(tag)}>
                <option value={defaultOperator}></option>
                {
                  operators.map((o, i) => <option key={i} value={o}>{o}</option>)
                }
              </Form.Select>
            </Form.Group>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mt-2 mb-2" style={{ alignItems: "center" }}>
          <Form.Label xs={3} column>Value</Form.Label>
          {
            (operator !== defaultOperator) && <Col>
              {
                isTagBoolean(tag) &&
                  <Form.Check id="boolean-value" type="switch" defaultChecked={b} onChange={() => setBoolean(!b)} />
              }
              {
                isTagCollect(tag) &&
                  <StandardTypeahead id={tag + "typeahead-input"} index={tag} label={undefined}
                    className={validC ? undefined : "is-invalid"} isInvalid={!validC} set={(values) => setCollect(values)} />
              }
              {
                isTagMeasure(tag) &&
                  <Form.Group>
                    <Form.Control isInvalid={!validM} type="number" defaultValue={m} onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value)) { setMeasure(value); }
                    }} />
                    <Form.Control.Feedback type="invalid">Number should be non-negative.</Form.Control.Feedback>
                  </Form.Group>
              }
              {
                isTagTextual(tag) &&
                  <Form.Group>
                    <Form.Control isInvalid={!validT} type="text" defaultValue={t} onChange={(e) => setTextual(e.target.value)} />
                    <Form.Control.Feedback type="invalid">Text field should be non-empty.</Form.Control.Feedback>
                  </Form.Group>
              }
            </Col>
          }
        </Form.Group>
        <ButtonContainer button={<SaveKeywordButton onClick={() => save()} />} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => onHide()}>Discard</Button>
        <Button variant="primary" onClick={confirm}>Confirm</Button>
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
      <KeywordModalWindow show={show} label={curr} onHide={() => setShow(false)} />
    </>
  );
}

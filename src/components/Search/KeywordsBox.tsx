import { useContext, useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Paper,
  Radio,
  RadioGroup,
  Slider,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { setBounds } from "../../features/panelSlice";
import {
  KeywordAutoc,
  KeywordCondition,
  KeywordFilterBoolean,
  KeywordFilterCollect,
  KeywordFilterExisten,
  KeywordFilterNumeric,
  KeywordFilterTextual
} from "../../domain/types";
import { AutocAttributes } from "../../utils/helpers";
import { GrainPathFetcher } from "../../utils/grainpath";
import { AppContext } from "../../App";

type AttributeCheckBoxProps = {
  label: string;
  toggle: () => void;
  checked: boolean;
};

/**
 * Represent (un-)selected attributes.
 */
function AttributeCheckBox({ label, toggle, checked }: AttributeCheckBoxProps): JSX.Element {
  return (
    <FormControlLabel
      label={label.replace(/[A-Z]/g, " $1").trim().toLowerCase()}
      control={<Checkbox checked={checked} onChange={toggle} />}
    />
  );
}

type ExistenFieldProps = {
  label: string;
  setter: (v: KeywordFilterExisten | undefined) => void;
  initial: KeywordFilterExisten | undefined;
};

function ExistenField({ label, setter, initial }: ExistenFieldProps): JSX.Element {

  const [check, setCheck] = useState(!!initial);

  const toggle = () => { setCheck(!check); };

  useEffect(() => { setter(check ? {} : undefined) }, [check, setter]);

  return (
    <FormGroup sx={{ display: "inline-block" }}>
      <AttributeCheckBox label={label} checked={check} toggle={toggle} />
    </FormGroup>
  );
}

type BooleanFieldProps = {
  label: string;
  setter: (v: KeywordFilterBoolean | undefined) => void;
  initial: KeywordFilterBoolean | undefined;
};

function BooleanField({ label, setter, initial }: BooleanFieldProps): JSX.Element {

  const flag = initial === undefined;

  const [check, setCheck] = useState(!flag);
  const [value, setValue] = useState((flag || !!initial) ? 1 : 0);

  const toggle = () => { setCheck(!check); };

  useEffect(() => { setter(check ? (!!value) : undefined) }, [check, value, setter]);

  return (
    <Stack direction="row" justifyContent="space-between" flexWrap="wrap">
      <AttributeCheckBox label={label} checked={check} toggle={toggle} />
      <FormControl>
        <RadioGroup row value={value} onChange={(e) => { setValue(parseInt(e.target.value)); }}>
          <FormControlLabel disabled={!check} value={1} control={<Radio />} label="Yes" />
          <FormControlLabel disabled={!check} value={0} control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>
    </Stack>
  );
}

type NumericFieldProps = {
  label: string;
  setter: (v: KeywordFilterNumeric | undefined) => void;
  initial: KeywordFilterNumeric | undefined;
};

function NumericField({ label, setter, initial }: NumericFieldProps): JSX.Element {

  const bound = (useAppSelector(state => state.panel.bounds) as any)[label] as KeywordFilterNumeric;

  const [check, setCheck] = useState(!!initial);
  const [value, setValue] = useState(initial ? [ initial.min, initial.max ] : [ bound.min, bound.max ]);

  const toggle = () => { setCheck(!check); };

  const change = (_: Event, v: number | number[]) => { setValue(v as number[]); };

  useEffect(() => {
    setter(check ? { min: value[0], max: value[1] } : undefined);
  }, [check, value, setter]);

  return (
    <Stack spacing={3}>
      <FormControlLabel
        control={<Checkbox checked={check} onChange={toggle} />}
        label={`${label.replace(/[A-Z]/g, " $1").trim().toLowerCase()} between ${value[0]} and ${value[1]}`}
      />
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Slider
          step={1}
          min={bound.min}
          max={bound.max}
          value={value}
          disabled={!check}
          onChange={change}
          sx={{ width: "94%" }}
          valueLabelDisplay="auto"
        />
      </Box>
    </Stack>
  );
}

type TextualFieldProps = {
  label: string;
  setter: (v: KeywordFilterTextual | undefined) => void;
  initial: KeywordFilterTextual | undefined;
}

function TextualField({ label, setter, initial }: TextualFieldProps) {

  const [check, setCheck] = useState(!!initial);
  const [value, setValue] = useState(initial ?? "");

  const toggle = () => { setCheck(!check); };

  useEffect(() => { setter((check && value.length > 0) ? value : undefined); }, [check, value, setter]);

  return (
    <Stack spacing={1} direction="row">
      <AttributeCheckBox label={label} checked={check} toggle={toggle} />
      <TextField fullWidth size="small" value={value} disabled={!check} onChange={(e) => { setValue(e.target.value); }} />
    </Stack>
  );
}

type CollectAutocompleteProps = {
  label: string;
  value: string[];
  options: string[];
  disabled: boolean;
  onChange: (v: string[]) => void;
};

function CollectAutocomplete({ label, onChange, ...rest }: CollectAutocompleteProps): JSX.Element {
  return (
    <Autocomplete
      {...rest}
      multiple
      fullWidth
      onChange={(_, v) => onChange(v)}
      renderInput={(params) => <TextField {...params} label={label} /> }
    />
  )
}

type CollectFieldProps = {
  label: string;
  setter: (v: KeywordFilterCollect | undefined) => void;
  initial: KeywordFilterCollect | undefined;
}

function CollectField({ label, setter, initial }: CollectFieldProps): JSX.Element {

  const bound = (useAppSelector(state => state.panel.bounds) as any)[label] as string[];

  const [check, setCheck] = useState(!!initial);
  const [includes, setIncludes] = useState(initial ? initial.includes : []);
  const [excludes, setExcludes] = useState(initial ? initial.excludes : []);

  const toggle = () => { setCheck(!check); };

  useEffect(() => {
    setter(check ? { includes: includes, excludes: excludes } : undefined);
  }, [check, includes, excludes, setter]);

  return (
    <Stack spacing={3} direction="column">
      <AttributeCheckBox label={label} checked={check} toggle={toggle} />
      <CollectAutocomplete
        label="Includes"
        value={includes}
        options={bound}
        disabled={!check}
        onChange={(v) => { setIncludes(v); }}
      />
      <CollectAutocomplete
        label="Excludes"
        value={excludes}
        options={bound}
        disabled={!check}
        onChange={(v) => { setExcludes(v); }}
      />
    </Stack>
  );
}

type AttributeListProps = {
  autoc: KeywordAutoc;
  filters: any; // (!)
};

/**
 * Renders five different types of attributes in a `type-unsafe` manner.
 */
function AttributeList({ autoc, filters }: AttributeListProps): JSX.Element {

  const expandIcon = <ExpandMore />

  const { bounds } = useAppSelector(state => state.panel);
  const { es, bs, ns, ts, cs } = AutocAttributes.group(autoc.attributeList);

  return(
    <Box>
      { (es.length > 0) &&
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={expandIcon}>
            <Typography>Should have</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1} direction="row" justifyContent="center" sx={{ flexWrap: "wrap" }}>
              { es.map((e, i) => {
                  return <ExistenField key={i} label={e} setter={(v) => { filters.existens[e] = v; } } initial={filters.existens[e]} />
                })
              }
            </Stack>
          </AccordionDetails>
        </Accordion>
      }
      { (bs.length > 0) &&
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={expandIcon}>
            <Typography>Yes / No</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1}>
              { bs.map((b, i) => {
                  return <BooleanField key={i} label={b} setter={(v) => { filters.booleans[b] = v; } } initial={filters.booleans[b]} />
                })
              }
            </Stack>
          </AccordionDetails>
        </Accordion>
      }
      { (ns.length > 0 && bounds) &&
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={expandIcon}>
            <Typography>Numeric</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={3}>
              { ns.map((n, i) => {
                  return <NumericField key={i} label={n} setter={(v) => { filters.numerics[n] = v; }} initial={filters.numerics[n]} />
                })
              }
            </Stack>
          </AccordionDetails>
        </Accordion>
      }
      { (ts.length > 0) &&
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={expandIcon}>
            <Typography>Contains text</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack>
              { ts.map((t, i) => {
                  return <TextualField key={i} label={t} setter={(v) => { filters.textuals[t] = v; }} initial={filters.textuals[t]} />
                })
              }
            </Stack>
          </AccordionDetails>
        </Accordion>
      }
      { (cs.length > 0 && bounds) &&
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={expandIcon}>
            <Typography>Include any / Exclude all</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack>
              { cs.map((c, i) => {
                  return <CollectField key={i} label={c} setter={(v) => { filters.collects[c] = v; }} initial={filters.collects[c]} />
                })
              }
            </Stack>
          </AccordionDetails>
        </Accordion>
      }
    </Box>
  );
}

type KeywordModalWindowProps = {
  onHide: () => void;
  keywords: Set<string>;
  condition?: KeywordCondition;
  insert: (condition: KeywordCondition) => void;
};

function ConditionDialog({ condition: cond, keywords, onHide, insert }: KeywordModalWindowProps): JSX.Element {

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { autoc } = useContext(AppContext).grain;
  const { bounds } = useAppSelector(state => state.panel);

  const dispatch = useAppDispatch();

  const [input, setInput] = useState("");
  const [mount, setMount] = useState(true);
  const [error, setError] = useState(false);

  const [value, setValue] = useState<KeywordAutoc | null>(cond ?? null);
  const [loading, setLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<KeywordAutoc[]>([]);

  const filters = cond
    ? structuredClone(cond.filters)
    : { existens: {}, booleans: {}, numerics: {}, textuals: {}, collects: {} };

  // hard reset of the attribute component
  useEffect(() => { if (!mount) { setMount(true); } }, [mount]);

  // fetch bounds if not already present
  useEffect(() => {
    if (!bounds) {
      GrainPathFetcher.fetchBounds()
        .then((obj) => { if (obj) { dispatch(setBounds(obj)); } })
        .catch((ex) => alert(ex));
    }
  }, [dispatch, bounds]);

  // fetch autocomplete options based on the user input
  useEffect(() => {
    const prefix = input.toLocaleLowerCase();
    if (!prefix.length) { setOptions(value ? [value] : []); return; }

    const cached = autoc.get(prefix);
    if (cached) { setOptions(cached); return; }

    new Promise((res, _) => { res(setLoading(true)); })
      .then(() => GrainPathFetcher.fetchAutocs(prefix))
      .then((items) => {
        if (items) { autoc.set(prefix, items); setOptions(items); }
      })
      .finally(() => { setLoading(false); });
  }, [input, value, autoc]);

  // store selected keyword with filters
  const confirm = () => {
    if (value) { insert({ ...value, filters: filters }); }
    onHide();
  };

  return (
    <Dialog fullScreen={fullScreen} open>
      <DialogTitle>Add condition</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <DialogContentText>
          Enter a keyword that places should associate with.
        </DialogContentText>
        <Autocomplete
          value={value}
          disabled={!!cond}
          options={options}
          loading={loading}
          filterOptions={(x) => x}
          noOptionsText="No keywords"
          onChange={(_, v) => {
            setValue(v);
            setMount(false);
            setError(!v || keywords.has(v.keyword));
          }}
          onInputChange={(_, v) => { setInput(v); }}
          getOptionLabel={(o) => o.keyword ?? ""}
          renderInput={(params) => {
            return <TextField {...params} error={error} helperText={error ? "Keyword already appears in the box." : undefined} placeholder="Start typing..." />;
          }}
          isOptionEqualToValue={(o, v) => { return o.keyword === v.keyword }}
        />
        <DialogContentText>
          Select (optional) features to customize this condition further.
        </DialogContentText>
        { (!error && mount && value)
          ? (<AttributeList autoc={value} filters={filters} />)
          : (<Alert severity="info">Features are keyword-specific.</Alert>)
        }
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button onClick={() => { onHide(); }} color="error">Discard</Button>
        <Button onClick={confirm} color="primary" disabled={!value || error}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}

type KeywordsBoxProps = {
  conditions: KeywordCondition[];
  deleteCondition: (i: number) => void;
  insertCondition: (condition: KeywordCondition, i: number) => void;
};

export default function KeywordsBox({ conditions, deleteCondition, insertCondition }: KeywordsBoxProps): JSX.Element {

  const [show, setShow] = useState(false);
  const [curr, setCurr] = useState<number>(0);

  const modal = (i: number) => { setCurr(i); setShow(true); };

  return (
    <Box>
      <Paper variant="outlined">
        <Stack direction="row" sx={{ flexWrap: "wrap" }}>
          { conditions.map((condition, i) => {
            return <Chip key={i} color="primary" variant="outlined" sx={{ m: 0.35, color: "black" }}
                    label={condition.keyword} onClick={() => modal(i)} onDelete={() => deleteCondition(i)} />
            })
          }
        </Stack>
        <Button size="large" sx={{ width: "100%" }} onClick={() => { modal(conditions.length); }}>
          Add condition
        </Button>
      </Paper>
      {show &&
        <ConditionDialog
          condition={conditions[curr]}
          onHide={() => setShow(false)}
          keywords={new Set(conditions.map((v) => v.keyword))}
          insert={(condition) => insertCondition(condition, curr)}
        />
      }
    </Box>
  );
}

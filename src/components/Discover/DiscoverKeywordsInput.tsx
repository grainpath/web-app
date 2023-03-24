import { useCallback, useContext, useEffect, useState } from "react";
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
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { deleteCondition, insertCondition, setBounds } from "../../features/discoverSlice";
import {
  AutocFeatures,
  AutocItem,
  BoundItem,
  BoundItemNumeric,
  GrainPathFetcher,
  KeywordCondition,
  KeywordBooleanFilter,
  KeywordCollectFilter,
  KeywordExistenFilter,
  KeywordNumericFilter,
  KeywordTextualFilter,
  KeywordFilters,
} from "../../utils/grainpath";
import { AppContext } from "../../App";
import { ExpandMore } from "@mui/icons-material";

type FeatureCheckBoxProps = {
  label: string;
  toggle: () => void;
  checked: boolean;
};

function FeatureCheckBox({ label, toggle, checked }: FeatureCheckBoxProps): JSX.Element {
  return (
    <FormControlLabel
      label={label.replace("_", " ")}
      control={<Checkbox checked={checked} onChange={toggle} />}
    />
  );
}

type ExistenFieldProps = {
  label: string;
  setter: (v: KeywordExistenFilter | undefined) => void;
  initial: KeywordExistenFilter | undefined;
};

function ExistenField({ label, setter, initial }: ExistenFieldProps): JSX.Element {

  const [check, setCheck] = useState(!!initial);

  const toggle = () => { setCheck(!check); };

  useEffect(() => { setter(check ? {} : undefined) }, [check, setter]);

  return (
    <FormGroup sx={{ display: "inline-block" }}>
      <FeatureCheckBox label={label} checked={check} toggle={toggle} />
    </FormGroup>
  );
}

type BooleanFieldProps = {
  label: string;
  setter: (v: KeywordBooleanFilter | undefined) => void;
  initial: KeywordBooleanFilter | undefined;
};

function BooleanField({ label, setter, initial }: BooleanFieldProps): JSX.Element {

  const flag = initial === undefined;

  const [check, setCheck] = useState(!flag);
  const [value, setValue] = useState((flag || !!initial) ? 1 : 0);

  const toggle = () => { setCheck(!check); };

  useEffect(() => { setter(check ? (!!value) : undefined) }, [check, value, setter]);

  return (
    <Stack direction="row" justifyContent="space-between" flexWrap="wrap">
      <FeatureCheckBox label={label} checked={check} toggle={toggle} />
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
  setter: (v: KeywordNumericFilter | undefined) => void;
  initial: KeywordNumericFilter | undefined;
};

function NumericField({ label, setter, initial }: NumericFieldProps): JSX.Element {

  const bound = (useAppSelector(state => state.discover.bounds) as any)[label] as KeywordNumericFilter;

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
        label={`${label.replace("_", " ")} between ${value[0]} and ${value[1]}`}
        control={<Checkbox checked={check} onChange={toggle} />}
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
  setter: (v: KeywordTextualFilter | undefined) => void;
  initial: KeywordTextualFilter | undefined;
}

function TextualField({ label, setter, initial }: TextualFieldProps) {

  const [check, setCheck] = useState(!!initial);
  const [value, setValue] = useState(initial ?? "");

  const toggle = () => { setCheck(!check); };

  useEffect(() => { setter(check ? value : undefined); }, [check, value, setter]);

  return (
    <Stack spacing={1} direction="row">
      <FeatureCheckBox label={label} checked={check} toggle={toggle} />
      <TextField fullWidth size="small" value={value} disabled={!check} onChange={(e) => { setValue(e.target.value); }} />
    </Stack>
  );
}

type CollectFieldProps = {
  label: string;
  setter: (v: KeywordCollectFilter | undefined) => void;
}

function CollectField({ label, setter }: CollectFieldProps): JSX.Element {

  return (<></>);
}

type FeatureListProps = {
  value: AutocItem;
  filters: any; // (!)
};

/**
 * Renders five different types of features in a `type-unsafe` manner.
 */
function FeatureList({ value, filters }: FeatureListProps): JSX.Element {

  const expandIcon = <ExpandMore />
  const { es, bs, ns, ts, cs } = AutocFeatures.group(value.features);

  const bounds = useAppSelector(state => state.discover.bounds);

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
                  return <ExistenField key={i} label={e} setter={(v) => { filters[e] = v; } } initial={filters[e]} />
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
                  return <BooleanField key={i} label={b} setter={(v) => { filters[b] = v; } } initial={filters[b]} />
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
                  return <NumericField key={i} label={n} setter={(v) => { filters[n] = v; }} initial={filters[n]} />
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
                  return <TextualField key={i} label={t} setter={(v) => { filters[t] = v; }} initial={filters[t]} />
                })
              }
            </Stack>
          </AccordionDetails>
        </Accordion>
      }
      { (cs.length > 0) &&
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={expandIcon}>
            <Typography>Include / Exclude</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack>
              { cs.map((c, i) => {
                  return <CollectField key={i} label={c} setter={(v) => { filters[c] = v; }} />
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
  label?: string;
  onHide: () => void;
};

function KeywordDialog({ label, onHide }: KeywordModalWindowProps): JSX.Element {

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const autoc = useContext(AppContext).grain.autoc;

  const dispatch = useAppDispatch();
  const { bounds, conditions } = useAppSelector(state => state.discover);

  const findCond = useCallback((keyword: string | undefined) => {
    return conditions.find((cond) => cond.keyword === keyword);
  }, [conditions]);

  const ctorFilters = (c: KeywordCondition | undefined): KeywordFilters => {
    return c ? structuredClone(c.filters) : {};
  };

  const [input, setInput] = useState("");
  const [mount, setMount] = useState(true);
  const [error, setError] = useState(false);
  const [value, setValue] = useState<AutocItem | null>(findCond(label) ?? null);
  const [loading, setLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<AutocItem[]>([]);

  const filters = ctorFilters(findCond(value?.keyword));

  // hard reset of the filter component
  useEffect(() => { if (!mount) { setMount(true); } }, [mount]);

  // fetch bounds for numerics and collections
  useEffect(() => {
    if (!bounds) {
      GrainPathFetcher.fetchBound()
        .then((obj) => { if (obj) { dispatch(setBounds(obj)); } });
    }
  }, [dispatch, bounds]);

  // fetch autocomplete options based on the user input
  useEffect(() => {
    const prefix = input.toLocaleLowerCase();
    if (!prefix.length) { setOptions(value ? [value] : []); return; }

    const cached = autoc.get(prefix);
    if (cached) { setOptions(cached); return; }

    new Promise((res, _) => { res(setLoading(true)); })
      .then(() => GrainPathFetcher.fetchAutoc(prefix))
      .then((items) => {
        if (items) { autoc.set(prefix, items); setOptions(items); }
      })
      .finally(() => { setLoading(false); });
  }, [input, value, autoc]);

  // store selected feature with filter
  const confirm = () => {
    if (value) { dispatch(insertCondition({ ...value, filters: filters })); }
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
          disabled={!!label}
          options={options}
          loading={loading}
          filterOptions={(x) => x}
          noOptionsText="No keywords"
          onChange={(_, v) => {
            setValue(v);
            setMount(false);
            setError(!!findCond(v?.keyword));
          }}
          onInputChange={(_, v) => { setInput(v); }}
          getOptionLabel={(o) => o.keyword ?? ""}
          renderInput={(params) => {
            return <TextField {...params} error={error} helperText={error ? "Keyword already appears in the list." : undefined} placeholder="Start typing..." />;
          }}
          isOptionEqualToValue={(o, v) => { return o.keyword === v.keyword }}
        />
        <DialogContentText>
          Select (optional) features to customize this condition further.
        </DialogContentText>
        { (!error && mount && value)
          ? (<FeatureList value={value} filters={filters} />)
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

export default function DiscoverKeywordsInput(): JSX.Element {

  const [show, setShow] = useState(false);
  const [curr, setCurr] = useState<string | undefined>(undefined);

  const dispatch = useAppDispatch();
  const keywords = useAppSelector(state => state.discover.conditions.map(filter => filter.keyword));

  const modal = (label: string | undefined) => { setCurr(label); setShow(true); };

  return (
    <Box>
      <Typography>Plan a route passing through:</Typography>
      <Box sx={{ mt: 2.5 }}>
        <Paper variant="outlined">
          <Stack direction="row" sx={{ flexWrap: "wrap" }}>
            { keywords.map((keyword, i) => {
                return <Chip sx={{ m: 0.35, color: "black" }} key={i} color="primary" variant="outlined" label={keyword} onClick={() => modal(keyword)} onDelete={() => dispatch(deleteCondition(keyword))} />
              })
            }
          </Stack>
          <Button size="large" sx={{ width: "100%" }} onClick={() => { modal(undefined); }}>
            Add condition
          </Button>
        </Paper>
      </Box>
      {show && <KeywordDialog label={curr} onHide={() => setShow(false)} />}
    </Box>
  );
}

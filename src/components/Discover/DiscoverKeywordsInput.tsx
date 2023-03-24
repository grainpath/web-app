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
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { deleteKeyword, insertKeyword } from "../../features/discoverSlice";
import {
  AutocFeatures,
  AutocItem,
  BoundItem,
  BoundItemNumeric,
  grainpathFetch,
  GRAINPATH_AUTOC_URL,
  GRAINPATH_BOUND_URL,
  KeywordFilter,
  KeywordFilterBoolean,
  KeywordFilterCollect,
  KeywordFilterExisten,
  KeywordFilterNumeric,
  KeywordFilterTextual
} from "../../utils/grainpath";
import { AppContext } from "../../App";
import { ExpandMore } from "@mui/icons-material";

type ExistenFieldProps = {
  label: string;
  setter: (v: KeywordFilterExisten | undefined) => void;
};

function ExistenField({ label, setter }: ExistenFieldProps): JSX.Element {

  const [checked, setChecked] = useState(false);
  const toggle = () => { setChecked(!checked); };
  useEffect(() => { setter(checked ? {} : undefined); }, [checked])

  return (
    <FormGroup sx={{ display: "inline-block" }}>
      <FormControlLabel
        label={label.replace("_", " ")}
        control={<Checkbox checked={checked} onChange={toggle} />}
      />
    </FormGroup>
  );
}

type BooleanFieldProps = {
  label: string;
  setter: (v: KeywordFilterBoolean | undefined) => void;
};

function BooleanField({ label, setter }: BooleanFieldProps): JSX.Element {

  const [value, setValue] = useState(0);

  const [check, setCheck] = useState(false);
  const toggle = () => { setCheck(!check); };

  useEffect(() => {
    console.log(value)
  }, [value])

  return (
    <Stack direction="row" justifyContent="space-between" flexWrap="wrap">
      <FormControlLabel
        label={label.replace("_", " ")}
        control={<Checkbox checked={check} onChange={toggle} />}
      />
      <FormControl>
        <RadioGroup row value={value} onChange={(e) => { setValue(parseInt(e.target.value)); }}>
          <FormControlLabel disabled={!check} value={0} control={<Radio />} label="Yes" />
          <FormControlLabel disabled={!check} value={1} control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>
    </Stack>
  );
}

type NumericFieldProps = {
  label: string;
  setter: (v: KeywordFilterNumeric | undefined) => void;
};

function NumericField({ label, setter }: NumericFieldProps): JSX.Element {

  const bound = (useContext(AppContext).grain.bound as any)[label] as BoundItemNumeric;

  const [value, setValue] = useState([bound.min, bound.max]);
  const [check, setCheck] = useState(false);
  const toggle = () => { setCheck(!check); };

  const change = (e: Event, v: number | number[]) => {
    setValue(v as number[]);
  }

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
  setter: (v: KeywordFilterTextual | undefined) => void;
}

function TextualField({ label, setter }: TextualFieldProps) {

  const [check, setCheck] = useState(false);
  const [value, setValue] = useState<string | undefined>(undefined);

  const toggle = () => { setCheck(!check); };

  return (
    <Stack spacing={1} direction="row">
      <FormControlLabel
        label={label.replace("_", " ")}
        control={<Checkbox checked={check} onChange={toggle} />}
      />
      <TextField
        fullWidth
        size="small"
        value={value}
        disabled={!check}
        onChange={(e) => { setValue(e.target.value); }}
      />
    </Stack>
  );
}

type CollectFieldProps = {
  label: string;
  setter: (v: KeywordFilterCollect | undefined) => void;
}

function CollectField({ label, setter }: CollectFieldProps): JSX.Element {

  return (<></>);
}

type FeatureListProps = {
  value: AutocItem;
  filter?: any;
};

function FeatureList({ value, filter }: FeatureListProps): JSX.Element {

  const expandIcon = <ExpandMore />

  return(
    <Box>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={expandIcon}>
          <Typography>Should have</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={1} direction="row" justifyContent="center" sx={{ flexWrap: "wrap" }}>
            { value.features.getExistens().map((e, i) => {
                return <ExistenField key={i} label={e} setter={(v) => { filter.features[e] = v; } } />
              })
            }
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={expandIcon}>
          <Typography>With / Without</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={1}>
            { value.features.getBooleans().map((b, i) => {
                return <BooleanField key={i} label={b} setter={(v) => { filter.features[b] = v; } } />
              })
            }
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={expandIcon}>
          <Typography>Numerical</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={3}>
            { value.features.getNumerics().map((n, i) => {
                return <NumericField key={i} label={n} setter={(v) => { filter.features[n] = v; }} />
              })
            }
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={expandIcon}>
          <Typography>
            Contains
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack>
            { value.features.getTextuals().map((t, i) => {
                return <TextualField key={i} label={t} setter={(v) => { filter.features[t] = v; }} />
              })
            }
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={expandIcon}>
          <Typography>
            Include / Exclude
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack>

          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

type KeywordModalWindowProps = {
  label?: string;
  onHide: () => void;
};

function KeywordDialog({ label, onHide }: KeywordModalWindowProps): JSX.Element {

  const grain = useContext(AppContext).grain;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [input, setInput] = useState("");
  const [value, setValue] = useState<AutocItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<AutocItem[]>([]);

  useEffect(() => {
    if (!grain.bound) {
      grainpathFetch(GRAINPATH_BOUND_URL, {})
        .then((res) => {
          if (!res.ok) {
            throw new Error(`[Fetch error] ${res.status}: ${res.statusText}`);
          }
          return res.json()
        })
        .then((jsn) => { grain.bound = jsn as BoundItem })
        .catch((ex) => { alert(ex); });
    }
  }, [grain]);

  useEffect(() => {
    const prefix = input.toLocaleLowerCase();

    if (!prefix.length) { setOptions(value ? [value] : []); return; }

    const cached = grain.autoc.get(prefix);
    if (cached) { setOptions(cached); return; }

    grainpathFetch(GRAINPATH_AUTOC_URL, { count: 3, prefix: prefix })
      .then((res) => res.json())
      .then((jsn) => {
        return (jsn as { keyword: string; features: string[] }[]).map((item) => {
          return {
            keyword: item.keyword,
            features: new AutocFeatures(new Set(item.features))
          } as AutocItem
        })})
      .then((obj) => {
        grain.autoc.set(prefix, obj);
        setOptions(obj);
      });
  }, [input, grain.autoc, value]);

  const discard = () => { onHide(); };

  const confirm = () => { onHide(); };

  return (
    <Dialog fullScreen={fullScreen} open>
      <DialogTitle>Add condition</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <DialogContentText>
          Enter a keyword that places should associate with.
        </DialogContentText>
        <Autocomplete
          value={value}
          options={options}
          loading={loading}
          noOptionsText="No keywords"
          filterOptions={(x) => x}
          onChange={(_, v) => { setValue(v); }}
          onInputChange={(_, v) => { setInput(v); }}
          getOptionLabel={(o) => o.keyword ?? ""}
          renderInput={(params) => <TextField {...params} placeholder="Start typing..." />}
          isOptionEqualToValue={(o, v) => { return o.keyword === v.keyword }}
        />
        <DialogContentText>
          Select (optional) features to customize condition further.
        </DialogContentText>
        { (value)
          ? (<FeatureList value={value} filter={{ keyword: value.keyword, features: {} }} />)
          : (<Alert severity="info">Features are keyword-specific.</Alert>)
        }
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button onClick={discard} color="error">Discard</Button>
        <Button onClick={confirm} color="primary" disabled={!value}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function DiscoverKeywordsInput(): JSX.Element {

  const [show, setShow] = useState(false);
  const [curr, setCurr] = useState<string | undefined>(undefined);

  const dispatch = useAppDispatch();
  const keywords = useAppSelector(state => state.discover.filters.map(filter => filter.keyword));

  const modal = (label: string | undefined) => { setCurr(label); setShow(true); };

  return (
    <Box>
      <Typography>Plan a route passing through:</Typography>
      <Box sx={{ mt: 2.5 }}>
        <Paper variant="outlined">
          <Stack direction="row" sx={{ flexWrap: "wrap" }}>
            { keywords.map((keyword, i) => {
                return <Chip sx={{ m: 0.35, color: "black" }} key={i} color="primary" variant="outlined" label={keyword} onClick={() => modal(keyword)} onDelete={() => dispatch(deleteKeyword(keyword))} />
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

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useAppSelector } from "../../features/hooks";
import {
  KeywordAutoc,
  KeywordFilterBoolean,
  KeywordFilterCollect,
  KeywordFilterExisten,
  KeywordFilterNumeric,
  KeywordFilterTextual
} from "../../domain/types";
import { AutocAttributes } from "../../utils/helpers";

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

type KeywordAttributeListProps = {
  autoc: KeywordAutoc;
  filters: any; // (!)
};

/**
 * Renders five different types of attributes in a `type-unsafe` manner.
 */
export default function KeywordAttributeList({ autoc, filters }: KeywordAttributeListProps): JSX.Element {

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

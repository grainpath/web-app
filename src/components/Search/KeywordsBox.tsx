import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { setBounds } from "../../features/panelSlice";
import {
  KeywordAutoc,
  KeywordCondition,
} from "../../domain/types";
import { GrainPathFetcher } from "../../utils/grainpath";
import { AppContext } from "../../App";
import KeywordAttributeList from "./KeywordAttributeList";

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
          Select (optional) attributes to customize this condition further.
        </DialogContentText>
        { (!error && mount && value)
          ? (<KeywordAttributeList autoc={value} filters={filters} />)
          : (<Alert severity="info">Attributes are keyword-specific.</Alert>)
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

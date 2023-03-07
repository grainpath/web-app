import { Chip } from "@mui/material";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { grainpathFetch } from "../../utils/grainpath";

type StandardChipProps = {
  label: string;
  onClick: React.MouseEventHandler<HTMLElement>;
  onDelete: React.MouseEventHandler<HTMLElement>;
};

type AutocompleteEntry = { label: string };

type StandardTypeaheadProps = {
  index: string;
  label: string | undefined;
  set: (arr: string[]) => void;
  feedback: string | undefined;
  touch: () => void;
  id: string;
  className: string | undefined;
  isInvalid: boolean;
}

export function StandardChip(props: StandardChipProps): JSX.Element {

  return (
    <div style={{ margin: "2px", display: "inline-block" }}>
      <Chip {...props} color="primary" />
    </div>
  );
}

export function StandardTypeahead({ index, label, set, feedback, touch, ...rest }: StandardTypeaheadProps): JSX.Element {

  const cache: Map<string, AutocompleteEntry[]> = new Map();

  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<AutocompleteEntry[]>([]);

  const handleSearch = (query: string) => {
    touch();
    if (cache.has(query)) { return setOptions(cache.get(query)!); }

    setLoading(true);
    grainpathFetch("/autocomplete", { index: index, count: 3, prefix: query })
    .then((res) => res.json())
    .then((arr: string[]) => {
      cache.set(query, arr.map((item) => { return { label: item } as AutocompleteEntry }));
      setOptions(cache.get(query)!);
    })
    .catch((err) => alert(err))
    .finally(() => setLoading(false));
  };

  return(
    <Form.Group>
      <AsyncTypeahead
        {...rest}
        defaultInputValue={label}
        placeholder="Start typing..."
        disabled={!!label}
        isLoading={loading}
        minLength={1}
        options={options}
        onSearch={handleSearch}
        onChange={(selected) => set((selected as AutocompleteEntry[]).map((entry) => entry.label))} />
      <Form.Control.Feedback type="invalid">{feedback}</Form.Control.Feedback>
    </Form.Group>
  );
}

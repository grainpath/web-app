import { Chip } from "@mui/material";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { API_BASE_URL } from "../../utils/const";

type StandardChipProps = {
  label: string;
  onClick: React.MouseEventHandler<HTMLElement>;
  onDelete: React.MouseEventHandler<HTMLElement>;
};

type AutocompleteEntry = { label: string };

type StandardTypeaheadProps = {
  id: string;
  index: string;
  label: string | undefined;
  className: string | undefined;
  isInvalid: boolean;
  set: (arr: string[]) => void;
}

export function StandardChip(props: StandardChipProps): JSX.Element {

  return (
    <div style={{ margin: "2px", display: "inline-block" }}>
      <Chip {...props} color="primary" />
    </div>
  );
}

export function StandardTypeahead({ index, label, set, ...rest }: StandardTypeaheadProps): JSX.Element {

  const content = "application/json";

  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<AutocompleteEntry[]>([]);

  const handleSearch = (query: string) => {
    setLoading(true);
    fetch(`${API_BASE_URL + "/autocomplete"}`, {
      method: "POST",
      headers: { "Accept": content, "Content-Type": content },
      body: JSON.stringify({ index: index, count: 3, prefix: query })
    })
    .then((res) => res.json())
    .then((arr: string[]) => setOptions(arr.map((item) => { return { label: item } as AutocompleteEntry })))
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
      <Form.Control.Feedback type="invalid">Select option from those appeared.</Form.Control.Feedback>
    </Form.Group>
  );
}

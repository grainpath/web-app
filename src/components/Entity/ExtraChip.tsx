import { Chip } from "@mui/material";

type ExtraChipProps = {
  label: string;
};

export default function ExtraChip(props: ExtraChipProps): JSX.Element {
  return (<Chip size="small" variant="outlined" {...props} />);
}

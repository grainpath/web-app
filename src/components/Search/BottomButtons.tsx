import { Search } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button } from "@mui/material";
import { useAppSelector } from "../../features/hooks";

type BottomButtonsProps = {

  /** */
  disabled: boolean;

  /** */
  onClear: () => void;

  /** */
  onSearch: () => void;
};

export default function BottomButtons({ disabled, onClear, onSearch }: BottomButtonsProps): JSX.Element {

  const { block } = useAppSelector(state => state.panel);

  return (
    <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
      <Button color="error" onClick={onClear}>
        <span>Clear</span>
      </Button>
      <LoadingButton
        size="large"
        variant="contained"
        startIcon={<Search />}
        loadingPosition="start"
        onClick={onSearch}
        loading={block}
        disabled={disabled}
      >
        <span>Search</span>
      </LoadingButton>
    </Box>
  );
}

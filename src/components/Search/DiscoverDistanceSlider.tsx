import { Box, Slider } from "@mui/material";

type DiscoverDistanceSliderProps = {
  max: number;
  seq: number[];
  distance: number;
  dispatch: (value: number) => void;
};

export default function DiscoverDistanceSlider({ max, seq, distance, dispatch }: DiscoverDistanceSliderProps): JSX.Element {

  const marks = seq.map(m => { return { value: m, label: m }; });

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box sx={{ width: "94%" }}>
        <Slider
          min={0}
          max={max}
          step={0.2}
          marks={marks}
          value={distance}
          valueLabelDisplay="auto"
          onChange={(_, value) => { dispatch(value as number); }}
        />
      </Box>
    </Box>
  );
}

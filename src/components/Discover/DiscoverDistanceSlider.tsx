import { Box, Slider } from "@mui/material";

type DiscoverDistanceSliderProps = {
  max: number;
  seq: number[];
  step: number;
  distance: number;
  dispatch: (value: number) => void;
};

export default function DiscoverDistanceSlider({ max, seq, step, distance, dispatch }: DiscoverDistanceSliderProps): JSX.Element {

  const marks = seq.map(m => { return { value: m, label: m }; });

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box sx={{ width: "94%" }}>
        <Slider
          min={0}
          max={max}
          step={step}
          marks={marks}
          value={distance}
          valueLabelDisplay="auto"
          onChange={(_, value) => { dispatch(value as number); }}
        />
      </Box>
    </Box>
  );
}

import { Box, Slider } from "@mui/material";

type DistanceSliderProps = {
  max: number;
  seq: number[];
  step: number;
  distance: number;
  dispatch: (value: number) => void;
};

export default function DistanceSlider({ seq, distance, dispatch, ...rest }: DistanceSliderProps): JSX.Element {
  const marks = seq.map(m => { return { value: m, label: m }; });

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box sx={{ width: "94%" }}>
        <Slider
          {...rest}
          min={0}
          marks={marks}
          value={distance}
          valueLabelDisplay="auto"
          onChange={(_, value) => { dispatch(value as number); }}
        />
      </Box>
    </Box>
  );
}

import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { ENTITY_ADDR } from "../../domain/routing";
import { useAppDispatch } from "../../features/hooks";
import { setBack } from "../../features/entitySlice";

type ListItemLinkProps = {

  /** Menu icon presented to the user. */
  icon: JSX.Element;

  /** Link back to the panel */
  back: string;

  /** Id known by the server. */
  grainId: string;
};

export default function ListItemLink({ icon, back, grainId }: ListItemLinkProps): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(setBack(back));
    navigate(ENTITY_ADDR + "/" + grainId);
  };

  return (
    <IconButton size="small" onClick={onClick}>
      {icon}
    </IconButton>
  );
}

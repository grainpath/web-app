import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { ENTITY_ADDR } from "../../domain/routing";

type ListItemLinkProps = {

  /** Menu icon presented to the user. */
  icon: JSX.Element;

  /** Id known by the server. */
  grainId: string;
};

export default function ListItemLink({ icon, grainId }: ListItemLinkProps): JSX.Element {

  const navigate = useNavigate();
  const onClick = () => { navigate(ENTITY_ADDR + "/" + grainId); };

  return (
    <IconButton size="small" onClick={onClick}>
      {icon}
    </IconButton>
  );
}

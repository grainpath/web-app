import { DeleteButton, FileButton, lineContainerProps, LineLabelField } from "../PanelPrimitives";

type ListItemProps = {
  label: string;
  onDelete: () => void;
  onDetail: () => void;
};

export default function ListItem({ label, onDelete, onDetail }: ListItemProps): JSX.Element {

  return (
    <div {...lineContainerProps}>
      <FileButton onClick={onDetail} />
      <LineLabelField label={label} />
      <DeleteButton onClick={onDelete} />
    </div>
  );
}

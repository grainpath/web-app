import { DeleteButton, FileButton, lineContainerProps, LineLabelField } from "../PanelPrimitives";

type LockerItemProps = {
  label: string;
  onDelete: () => void;
  onDetail: () => void;
};

export default function LockerItem({ label, onDelete, onDetail }: LockerItemProps): JSX.Element {

  return (
    <div {...lineContainerProps}>
      <FileButton onClick={onDetail} />
      <LineLabelField label={label} />
      <DeleteButton onClick={onDelete} />
    </div>
  );
}

import { DeleteButton, FileButton, lineContainerProps, LineLabelField } from "../PanelPrimitives";

type LockerItemProps = {
  label: string;
  onSee: () => void;
  onDel: () => void;
}

export default function LockerItem({ label, onSee, onDel }: LockerItemProps): JSX.Element {
  
  return (
    <div {...lineContainerProps}>
      <FileButton onClick={onSee} />
      <LineLabelField label={label} />
      <DeleteButton onClick={onDel} />
    </div>
  );
}

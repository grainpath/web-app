import { Link } from "@mui/material";

/**
 * Standard link refering to the `Solid project / Get a pod`.
 */
export default function SolidPodLink(): JSX.Element {
  return (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      href="https://solidproject.org/users/get-a-pod"
    >
      Solid Pod
    </Link>
  );
}

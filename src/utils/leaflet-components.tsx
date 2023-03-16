import * as ReactDOMServer from "react-dom/server";
import { Link } from "@mui/icons-material";
import { Badge } from "react-bootstrap";
import { MaybePlace } from "./grainpath";

type MaybePlacePopupProps = {
  place: MaybePlace;
};

export function MaybePlacePopup({ place }: MaybePlacePopupProps): JSX.Element {
  const id = (place.id) ? `popup-${place.id}` : undefined;

  return (
    <>
      <b>{place.name}</b>
      {
        (place.id) &&
        <>
          <hr style={{opacity: 0.7, margin: "0.25rem 0"}} />
          <div className="mt-2 mb-2" style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
            <button id={id} className="standard-button" style={{ borderRadius: "50%" }}>
              <Link fontSize="large" />
            </button>
            <div className="mt-1 mb-1" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", width: "150px" }}>
              {place.keywords.map((k, i) => <Badge key={i} bg="success" style={{ margin: "0.1rem", display: "block" }} pill>{k}</Badge>)}
            </div>
          </div>
        </>
      }
    </>
  );
}

export class MaybePlacePopupFactory {
  public static getInstance(place: MaybePlace): string {
    return ReactDOMServer.renderToString(<MaybePlacePopup place={place} />);
  }
}

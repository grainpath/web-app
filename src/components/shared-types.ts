export type SteadyModalProps = {
  centered: boolean;
  keyboard: boolean;
  backdrop: true | false | "static";
};

export class SteadyModalPropsFactory {

  static getStandard(): SteadyModalProps {
    return { centered: true, keyboard: false, backdrop: "static" };
  }
}

export interface ISidebarItem {
  icon?: React.ReactElement;
  name?: string | React.ReactElement;
  path?: string;
  element?: React.ReactNode;
  hidden?: boolean;
  children?: ISidebarItem[];
  index?: boolean;
}

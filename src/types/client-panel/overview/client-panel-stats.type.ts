export interface IClientPanelStats {
  title: string;
  growth: string | null;
  value: number | string;
  growth_type: "up" | "down" | undefined | string;
  description?: string;
  link_text?: string;
  icon?: string;
  icon_bg_color?: string;
}

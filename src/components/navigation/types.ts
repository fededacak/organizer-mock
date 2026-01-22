export type FolderColor = "coral" | "blue";

export type FolderItem = {
  id: string;
  name: string;
  href: string;
};

export type FolderData = {
  id: string;
  name: string;
  color: FolderColor;
  items: FolderItem[];
};

export type FolderColorConfig = {
  bg: string;
  tab: string;
  paper: string;
  paperLines: string;
  border: string;
};

export type PageIconColorConfig = {
  bg: string;
  icon: string;
  hoverBorder: string;
};

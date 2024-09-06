import { List } from "@mui/material";
import { ReactNode } from "react";

interface PropertyListProps {
  children: ReactNode;
}

export const PropertyList: React.FC<PropertyListProps> = ({ children }) => {
  return <List disablePadding>{children}</List>;
};

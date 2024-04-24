import { Paper } from "@mui/material";
import styled from "@emotion/styled";

export const StyledContainer = styled.div`
  align-items: center;
  border: 1px dashed rgb(242, 244, 247);
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;
  cursor: pointer;
  justify-content: center;
  padding: 48px;
  outline: none;

  &:hover {
    background-color: rgba(17, 25, 39, 0.04);
    cursor: pointer;
    opacity: 0.5;
  }
`;

export const DocumentPaper = styled(Paper)<{ deleted: boolean }>`
  transition: opacity 0.3s ease;

  ${(props) =>
    props.deleted &&
    `
    opacity: 0.5;
  `}
`;
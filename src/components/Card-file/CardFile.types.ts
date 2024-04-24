export interface ICardFile {
  name: string;
  size: string;
  url: string;
  time: string;
  handleDelete: (name: string) => void;
}
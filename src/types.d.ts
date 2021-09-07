export type CardSuite = {
  name: string;
  sign: string;
  color: 'red' | 'black';
};
export type CardValue = string;
export type Card = {
  suite: CardSuite;
  val: CardValue;
  isOpen?: boolean;
  key: string;
};

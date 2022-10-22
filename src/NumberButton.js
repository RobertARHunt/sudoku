import styled, { css } from 'styled-components';

const Button = styled.button`
  cursor: pointer;
  font-size: 52px;
  background-color: lightgrey;
  margin: 2px;

  ${(props) =>
    props.selected &&
    css`
      background-color: darkblue;
      font-size: 50px;
      border: 5px solid black;
    `};
`;

function NumberButton({ value, selectedValue, setSelectedValue }) {
  return (
    <Button
      selected={selectedValue === value}
      onClick={() => setSelectedValue(value)}
    >
      {value}
    </Button>
  );
}

export default NumberButton;

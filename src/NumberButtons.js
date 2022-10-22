import styled from 'styled-components';
import { useState } from 'react';
import NumberButton from './NumberButton';

function NumberButtons() {
  const [selectedValue, setSelectedValue] = useState('');

  return (
    <StyledContainer>
      {new Array(10).fill().map((_, i) => {
        return (
          <NumberButton
            key={i}
            value={i < 9 ? (i + 1).toString() : 'X'}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
          />
        );
      })}
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  cursor: default;
  margin: 5px;
`;

export default NumberButtons;

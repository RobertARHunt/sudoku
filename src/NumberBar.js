import styled from 'styled-components';
import NumberButton from './NumberButton';

function NumberBar(props) {
  return (
    <StyledContainer>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => {
        return <NumberButton key={n} value={n} {...props} />;
      })}
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  cursor: default;
  margin: 5px;
`;

export default NumberBar;

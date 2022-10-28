import styled, { css } from 'styled-components';

function GridCell({ cell: { value, options, checkered }, onClick }) {
  if (value === 0) {
    const optionsString = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      .map((n) => (options.has(n) ? n : '\u00A0'))
      .join('');

    return (
      <StyledOptions checkered={checkered} onClick={onClick}>
        {optionsString}
      </StyledOptions>
    );
  } else {
    return (
      <StyledValue checkered={checkered} onClick={onClick}>
        {value}
      </StyledValue>
    );
  }
}

const StyledCell = styled.div`
  text-align: center;
  border: 1px solid gray;
  cursor: pointer;

  ${(props) =>
    props.checkered &&
    css`
      background-color: rgba(0, 0, 0, 0.108);
    `}
`;

const StyledOptions = styled(StyledCell)`
  font-size: 15px;
  font-family: monospace;
  vertical-align: top;
  padding-left: 7%;
  overflow-wrap: break-word;
  letter-spacing: 0.5rem;
  opacity: 0.6;
`;

const StyledValue = styled(StyledCell)`
  font-size: 50px;
`;

export default GridCell;

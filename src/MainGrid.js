import styled from 'styled-components';
function MainGrid() {
  return (
    <StyledContainer>
      {new Array(81).fill().map((_, i) => {
        return <GridCell>{i + 1}</GridCell>;
      })}
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  border: 1px solid rgb(199, 45, 45);
  background-color: white;
  height: 501px;
  width: 501px;
  display: grid;
  grid-template-columns: repeat(9, 11.111111111%);
  grid-template-rows: repeat(9, 11.111111111%);
  // position: fixed;
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%);
`;

const GridCell = styled.div`
  text-align: center;
  border: 1px solid gray;
  cursor: pointer;
`;

export default MainGrid;

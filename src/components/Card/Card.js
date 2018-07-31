// @flow

import * as React from 'react';
import { styled } from '../../apis/Style';
import View from '../../primitives/View';

type Props = {
  children?: string,
  style?: any,
};

const Card = ({ children, style }: Props) => {
  return (
    <StyledView selectable style={style}>
      {children}
    </StyledView>
  );
};

Card.defaultProps = {};

export default Card;

const StyledView = styled(View)`
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.16);
  padding: 8px;
  border-radius: 3px;
  background: #fff;
`;

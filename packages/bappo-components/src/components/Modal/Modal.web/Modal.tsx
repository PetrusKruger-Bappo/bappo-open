import React from 'react';
import styled from 'styled-components';

import { DeviceKind, useDeviceKind } from '../../../apis/DeviceKind';
import IconButton from '../../../components/IconButton';
import { ViewLayoutEvent } from '../../../events';
import FlexDiv from '../../../internals/web/FlexDiv';
import { DivViewBase } from '../../../internals/web/ViewBase';
import Overlay from '../../../primitives/Overlay';
import Text from '../../../primitives/Text';
import View from '../../../primitives/View';
import { ModalProps } from '../types';

type Props = ModalProps;
type Layout = {
  height: number;
  width: number;
} | null;

function Modal({
  children,
  hideHeader = false,
  onRequestClose,
  visible,
  placement,
  title,
  renderFooter,
}: Props) {
  const deviceKind = useDeviceKind();
  const [modalContentLayout, setModalContentLayout] = React.useState<Layout>(
    null,
  );
  const modalContentContainerRef = React.useRef<HTMLDivElement>(null);

  const prevVisibleRef = React.useRef(visible);
  React.useEffect(() => {
    if (visible && !prevVisibleRef.current) {
      const domEl = modalContentContainerRef.current;
      if (
        domEl &&
        document.activeElement !== domEl &&
        !domEl.contains(document.activeElement)
      ) {
        // only focus if modal container or its children does not have focus
        domEl.focus();
      }
    }
    prevVisibleRef.current = visible;
  }, [visible]);

  const onModalContentKeyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode === 27) {
      // escape
      event.stopPropagation();
      onRequestClose();
    }
  };

  const onModalContentLayout = (event: ViewLayoutEvent) => {
    setModalContentLayout(event.nativeEvent.layout);
  };

  return (
    <Overlay onPress={onRequestClose} visible={visible}>
      <ModalContentContainer
        $deviceKind={deviceKind}
        ref={modalContentContainerRef}
        layout={modalContentLayout}
        onKeyDown={onModalContentKeyDown}
        onLayout={onModalContentLayout}
        placement={placement}
      >
        {/* There are three condition here
        1. Bydefault the header will not show as older application using previous version modal,
        there has been header there.
        2. When user give a title the new modal will show title in a header
        3. When user don't want a title but a header he will use showHeader
        */}
        {title || !hideHeader ? (
          <ModalHeadr>
            <ModalTitleContainer>
              <ModalTitleText deviceKind={deviceKind}>{title}</ModalTitleText>
            </ModalTitleContainer>
            <ModalCloseIcon name="clear" onPress={onRequestClose} />
          </ModalHeadr>
        ) : null}

        {children}
        {typeof renderFooter === 'function' ? (
          <ModalFooter>{renderFooter()}</ModalFooter>
        ) : null}
      </ModalContentContainer>
    </Overlay>
  );
}

export default Modal;

export const ModalContentContainer = styled(DivViewBase)<{
  $deviceKind: DeviceKind;
  layout: Layout;
  placement: Props['placement'];
}>`
  background-color: white;
  position: absolute;
  border-radius: 4px;
  overflow: hidden;

  &:focus {
    outline: none;
  }

  ${props =>
    props.$deviceKind === 'phone' || props.$deviceKind === 'large-phone'
      ? `
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      border-radius: 0px;
      `
      : desktopStyle(props)}

  ${props =>
    props.$deviceKind === 'desktop' || props.$deviceKind === 'tablet'
      ? `
      @media (max-height: 768px) {
        max-height: 100%;
      }
      `
      : ''};
`;

const ModalHeadr = styled(View)`
  flex: none;
  flex-direction: row;
  justify-content: space-between;
  background-color: white;
  border-bottom: 1px solid #dddbda;
  height: 55px;
`;

export const ModalTitleContainer = styled(View)`
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 70px;
  right: 70px;
`;

const ModalTitleText = styled(Text).attrs(props => ({
  numberOfLines: 2,
}))<{
  deviceKind: DeviceKind;
}>`
  font-size: 20px;
  color: #2b2826;
  line-height: 20px;

  ${props =>
    props.deviceKind === 'phone' || props.deviceKind === 'large-phone'
      ? `
      font-size: 16px;
      color: #2b2826;
      line-height: 16px;
      text-align: center;
      `
      : ''}
`;

const ModalCloseIcon = styled(IconButton)`
  position: absolute;
  right: 20px;
  top: 15px;
`;

const ModalFooter = styled(FlexDiv)`
  flex: none;
  flex-direction: row;
  justify-content: space-between;
  background-color: #f1f1f0;
  border-top: 1px solid #dddbda;
  height: 64px;
  padding: 16px;
`;

const desktopStyle = ({
  layout,
  placement,
}: {
  layout: Layout;
  placement: Props['placement'];
}) => {
  if (
    placement &&
    placement.type === 'dropdown' &&
    placement.align === 'left'
  ) {
    return `
      border-radius: 2px;
      left: ${placement.left}px;
      top: ${placement.top}px;
      height: ${placement.height}px;
      width: ${placement.width}px;        
    `;
  }

  if (
    placement &&
    placement.type === 'dropdown' &&
    placement.align === 'right'
  ) {
    return `
      border-radius: 2px;
      right: ${placement.right}px;
      top: ${placement.top}px;
      height: ${placement.height}px;
      width: ${placement.width}px;        
    `;
  }

  if (placement && placement.type === 'fullscreen') {
    return `
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      border-radius: 0px;
    `;
  }

  return `
    left: 0;
    right: 0;
    margin: auto;
    max-height: 768px;
    min-height: 200px;
    width: 576px;
    ${
      layout
        ? `
          top: calc(50vh - ${Math.ceil(layout.height / 2)}px);
        `
        : `
          opacity: 0;
        `
    };
    `;
};

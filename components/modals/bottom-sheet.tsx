import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {
  useCallback,
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useState,
  useLayoutEffect,
} from 'react';
import { Platform } from 'react-native';
import { View } from 'tamagui';

import { COLORS } from '~/configs/color.config';

type Props = {
  children: React.ReactNode;
  onClose?: () => void;
  onOpen?: () => void;
};

export type BottomSheetRef = {
  open: () => void;
  close: () => void;
};

const ADDITIONAL_SPACING =
  Platform.select({
    ios: 28,
    android: 24,
  }) || 24;

const BottomSheetCustom = forwardRef<BottomSheetRef, Props>(
  ({ children, onClose, onOpen }, ref) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [contentHeight, setContentHeight] = useState(0);
    const [snapPoints, setSnapPoints] = useState<number[]>([1]); // Default height if not calculated

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
      ),
      []
    );

    const open = () => {
      bottomSheetRef.current?.present();
      onOpen?.();
    };

    const close = () => {
      bottomSheetRef.current?.close();
      onClose?.();
    };

    useImperativeHandle(ref, () => ({
      open,
      close,
    }));

    // Measure content height
    useLayoutEffect(() => {
      if (contentHeight > 0) {
        setSnapPoints([contentHeight]);
      }
    }, [contentHeight]);

    return (
      <BottomSheetModal
        backgroundStyle={{ backgroundColor: COLORS.PRIMARY[100] }}
        enablePanDownToClose
        snapPoints={snapPoints}
        ref={bottomSheetRef}
        onChange={(index) => {
          if (index === -1) {
            close();
          }
        }}
        backdropComponent={renderBackdrop}>
        <BottomSheetView>
          <View
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              setContentHeight(height + ADDITIONAL_SPACING);
            }}>
            {children}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

const useBottomSheetMethods = (isOpen?: boolean) => {
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const open = () => {
    bottomSheetRef.current?.open();
  };

  const close = () => {
    bottomSheetRef.current?.close();
  };

  useEffect(() => {
    if (isOpen) {
      open();
    } else {
      close();
    }
  }, [isOpen]);

  return {
    open,
    close,
    bottomSheetRef,
  };
};

export { BottomSheetCustom as BottomSheet, useBottomSheetMethods };

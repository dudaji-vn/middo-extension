import { icons } from 'lucide-react-native';
import { Linking, Platform } from 'react-native';
import { H5, Text, Theme, View, XStack, YStack } from 'tamagui';
import {
  BottomSheet,
  BottomSheetRef,
  useBottomSheetMethods,
} from '~/components/modals/bottom-sheet';

import { COLORS } from '~/configs/color.config';
import { HintType, usePermissionStore } from '~/stores/permission.store';
import { Button } from '~/tamagui.config';

type SheetContent = {
  iconName: keyof typeof icons;
  title: string;
  description: string;
};

const sheetContents: Record<HintType, SheetContent> = {
  camera: {
    iconName: 'Camera',
    title: 'Camera',
    description: 'You will can not use Video Call feature until you allow Camera permission.',
  },
  microphone: {
    iconName: 'Mic',
    title: 'Microphone',
    description:
      'You will can not use Call & Speech-to-Text features until you allow Microphone permission.',
  },
  notification: {
    iconName: 'Bell',
    title: 'Notifications',
    description:
      'You will not get notifications for new message until you allow push notification permission',
  },
  none: {
    iconName: 'AArrowDown',
    title: '',
    description: '',
  },
};

export const PermissionProvider = () => {
  const { hintType, setHintType } = usePermissionStore();
  const { close, bottomSheetRef } = useBottomSheetMethods(hintType !== 'none');
  const contentData = sheetContents[hintType];
  const LucideIcon = icons[contentData.iconName];
  const handleOpenSystemSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
      return;
    }
    Linking.openSettings();
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      onClose={() => {
        setHintType('none');
      }}>
      <YStack p={12} backgroundColor="$blue1" alignItems="center">
        <LucideIcon size={96} color="#3d88ed" />
        <H5 color={COLORS.NEUTRAL[800]} mb={8}>
          Allow {contentData.title}?
        </H5>
        <Text fontSize={16} textAlign="center" color="$gray5">
          {contentData.description}
        </Text>
        <YStack w="100%" mt={32}>
          <StepItem title="Open system settings" number={1} />
          <StepItem title="Go to Middo app settings" number={2} />
          <StepItem title={`Turn on the setting to allow ${contentData.title}`} number={3} />
        </YStack>
        <Theme name="blue_active_Button">
          <Button
            onPress={() => {
              handleOpenSystemSettings();
              close();
            }}
            bg={COLORS.PRIMARY[500]}
            w="100%"
            color="white"
            mt={32}>
            Open system settings
          </Button>
        </Theme>
        <Button onPress={close} w="100%" bg="transparent" color="$gray7" mt={12}>
          Maybe later
        </Button>
      </YStack>
    </BottomSheet>
  );
};

const StepItem = ({ title, number }: { title: string; number: number }) => {
  return (
    <XStack w="100%" gap={8} py={12} backgroundColor="$blue1" alignItems="center">
      <View
        w={40}
        h={40}
        borderRadius={9999}
        bg="white"
        alignItems="center"
        justifyContent="center">
        <Text fontSize={16} color={COLORS.PRIMARY[500]}>
          {number}
        </Text>
      </View>
      <Text fontSize={16} color={COLORS.NEUTRAL[600]}>
        {title}
      </Text>
    </XStack>
  );
};

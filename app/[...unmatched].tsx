import { Link, Stack, router } from 'expo-router';
import { YStack } from 'tamagui';

import { Container, Main, Subtitle, Title } from '../tamagui.config';

export default function NotFoundScreen() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    console.log('Geolocation not supported');
  }

  function success(position: any) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  }

  function error() {
    console.log('Unable to retrieve your location');
  }
  return (
    <Container>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Main>
        <YStack>
          <Title>This screen doesn't exist.</Title>
          <Link href="/spaces">
            <Subtitle>Go to home screen!</Subtitle>
          </Link>
          <Link href="/sign-in">
            <Subtitle>Go back </Subtitle>
          </Link>
        </YStack>
      </Main>
    </Container>
  );
}

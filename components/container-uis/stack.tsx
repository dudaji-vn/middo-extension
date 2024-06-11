import {
  // Import the creation function
  createStackNavigator,
  // Import the types
  StackNavigationOptions,
} from '@react-navigation/stack';
import { withLayoutContext } from 'expo-router';

const { Navigator } = createStackNavigator();

export const Stack = withLayoutContext<StackNavigationOptions, typeof Navigator, any, any>(
  Navigator
);

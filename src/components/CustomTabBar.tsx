import { View, Pressable, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { AntDesign, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const renderTab = (route: any, index: number) => {
    const { options } = descriptors[route.key];
    const label =
      options.tabBarLabel !== undefined
        ? options.tabBarLabel
        : options.title !== undefined
        ? options.title
        : route.name;

    const isFocused = state.index === index;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      }
    };

    const onLongPress = () => {
      navigation.emit({
        type: 'tabLongPress',
        target: route.key,
      });
    };
    
    let iconName = '';
    let IconComponent: any = Ionicons;
    
    if (route.name === 'index') {
      iconName = isFocused ? 'home' : 'home-outline';
      IconComponent = Ionicons;
    } else if (route.name === 'analytics') {
      iconName = 'chart-line';
      IconComponent = FontAwesome5;
    } else if (route.name === 'savings') {
      iconName = isFocused ? 'wallet' : 'wallet-outline';
      IconComponent = Ionicons;
    } else if (route.name === 'wallet') {
      iconName = isFocused ? 'card' : 'card-outline';
      IconComponent = Ionicons;
    }

    return (
      <Pressable
        key={route.key}
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarTestID}
        onPress={onPress}
        onLongPress={onLongPress}
        className="flex-1 items-center justify-center pt-2 pb-1"
      >
        {IconComponent === FontAwesome5 ? (
          <FontAwesome5 name={iconName} size={22} color={isFocused ? '#0284C7' : '#8E8E93'} />
        ) : (
          <IconComponent name={iconName} size={24} color={isFocused ? '#0284C7' : '#8E8E93'} />
        )}
        
        <Text 
          className={`text-[10px] mt-1 ${isFocused ? "text-[#0284C7] font-['Nunito_700Bold']" : "text-[#8E8E93] font-['Nunito_600SemiBold']"}`}
        >
          {label as string}
        </Text>
      </Pressable>
    );
  };

  return (
    <View 
      className="bg-white border-t border-[#E5E5EA] w-full"
      style={{ paddingBottom: insets.bottom }}
    >
      <View className="flex-row h-[60px] items-center px-1">
        
        {state.routes[0] && renderTab(state.routes[0], 0)}
        {state.routes[1] && renderTab(state.routes[1], 1)}
        
        {/* Action Button (Add) in the center */}
        <Pressable 
          onPress={() => navigation.navigate('ai-input')}
          className="bg-[#8B5CF6] w-14 h-14 rounded-full flex-col items-center justify-center -mt-6 shadow-md shadow-[#8B5CF6]/30 mx-1"
        >
          <AntDesign name="plus" size={24} color="#fff" />
        </Pressable>

        {state.routes[2] && renderTab(state.routes[2], 2)}
        {state.routes[3] && renderTab(state.routes[3], 3)}

      </View>
    </View>
  );
}

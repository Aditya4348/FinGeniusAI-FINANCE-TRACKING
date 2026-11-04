import { View, Pressable, Text } from 'react-native';
import { router } from 'expo-router';
import { AntDesign, Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function CustomTabBar(props: any) {
  const { state, descriptors, navigation, emitter, navigateToTab, insets: propInsets } = props;
  const insets = useSafeAreaInsets();
  const bottomInset = propInsets?.bottom ?? insets.bottom;

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
      let event: any = null;

      if (emitter?.emit) {
        event = emitter.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });
      } else if (navigation?.emit) {
        event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });
      }

      if (!isFocused && !event?.defaultPrevented) {
        if (navigateToTab) {
          navigateToTab(route.key);
        } else if (navigation?.navigate) {
          navigation.navigate(route.name, route.params);
        } else {
          router.navigate(`/(tabs)/${route.name}` as any);
        }
      }
    };

    const onLongPress = () => {
      if (emitter?.emit) {
        emitter.emit({
          type: 'tabLongPress',
          target: route.key,
        });
      } else if (navigation?.emit) {
        navigation.emit({
          type: 'tabLongPress',
          target: route.key,
        });
      }
    };
    
    let iconName = '';
    let IconComponent: any = Ionicons;
    
    if (route.name === 'index') {
      iconName = isFocused ? 'home' : 'home-outline';
      IconComponent = Ionicons;
    } else if (route.name === 'history') {
      iconName = isFocused ? 'receipt' : 'receipt-outline';
      IconComponent = Ionicons;
    } else if (route.name === 'wallet') {
      iconName = isFocused ? 'card' : 'card-outline';
      IconComponent = Ionicons;
    } else if (route.name === 'profile') {
      iconName = isFocused ? 'person' : 'person-outline';
      IconComponent = Ionicons;
    }

    return (
      <Pressable
        key={route.key}
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={(options as any).tabBarTestID || options.tabBarButtonTestID}
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
      style={{ paddingBottom: bottomInset }}
    >
      <View className="flex-row h-[60px] items-center px-1">
        
        {state.routes[0] && renderTab(state.routes[0], 0)}
        {state.routes[1] && renderTab(state.routes[1], 1)}
        
        {/* Action Button (Add) in the center */}
        <Pressable 
          onPress={() => router.push('/ai-input')}
          style={{
            shadowColor: '#8B5CF6',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
          className="bg-[#8B5CF6] w-14 h-14 rounded-full flex-col items-center justify-center -mt-6 mx-1"
        >
          <AntDesign name="plus" size={24} color="#fff" />
        </Pressable>

        {state.routes[2] && renderTab(state.routes[2], 2)}
        {state.routes[3] && renderTab(state.routes[3], 3)}

      </View>
    </View>
  );
}

import { View, Pressable, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { AntDesign, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Text } from 'react-native';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <BlurView intensity={80} tint="light" style={styles.blurView}>
        <View style={styles.tabContainer}>
          {state.routes.map((route, index) => {
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
            
            // Map route to icons
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
            }

            return (
              <Pressable
                key={route.key}
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tabButton}
              >
                {IconComponent === FontAwesome5 ? (
                  <FontAwesome5 name={iconName} size={24} color={isFocused ? '#000' : '#8E8E93'} />
                ) : (
                  <IconComponent name={iconName} size={24} color={isFocused ? '#000' : '#8E8E93'} />
                )}
                
                <Text style={[styles.tabLabel, { color: isFocused ? '#000' : '#8E8E93', fontWeight: isFocused ? '700' : '500' }]}>
                  {label as string}
                </Text>
              </Pressable>
            );
          })}
          
          {/* Action Button (Add) */}
          <Pressable style={styles.actionButton}>
            <AntDesign name="plus" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Add</Text>
          </Pressable>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  blurView: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    fontFamily: 'Nunito_600SemiBold',
  },
  actionButton: {
    backgroundColor: '#000',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 10,
    marginTop: 2,
    fontFamily: 'Nunito_700Bold',
  }
});

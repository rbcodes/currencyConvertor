import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import {SvgXml} from 'react-native-svg';

interface DropdownItem {
  label: string;
  value: string;
  image: any; 
}

interface CustomDropdownProps {
  style?: object;
  data: DropdownItem[];
  value: string;
  onChange: (item: DropdownItem) => void;
  placeholder: string;
  searchPlaceholder: string;
  screenPosition: number;
}

const dropdownIconSvg = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 16L6 10H18L12 16Z" fill="#000000"/>
</svg>
`;

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  data,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  screenPosition,
  testID
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const filteredData = data.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase()),
  );
  const selectedItem = data.find(item => item.value === value);

  const windowWidth = Dimensions.get('window').width;

  const ItemDivider = () => <View style={styles.divider} />;

  const handleItemPress = (item: DropdownItem) => {
    onChange(item);
    setSearch(''); 
    setIsVisible(false); 
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.dropdown, styles.shadow]}
        onPress={() => setIsVisible(true)}>
        <View style={styles.selectedItem}>
          {selectedItem && selectedItem.image && <selectedItem.image />}
          <Text testID = {testID} style={styles.selectedText}>
            {selectedItem ? selectedItem.label : placeholder}
          </Text>
          <SvgXml xml={dropdownIconSvg} style={styles.icon} />
        </View>
      </TouchableOpacity>
      <Modal visible={isVisible} transparent animationType="slide">
        <View style={styles.modalOverlay} />
        <View
          style={[
            styles.modalContainer,
            {width: windowWidth - 40, top: screenPosition},
          ]}>
          <TextInput
            style={styles.searchInput}
            placeholder={searchPlaceholder}
            value={search}
            onChangeText={setSearch}
          />
          <FlatList
            data={filteredData}
            keyExtractor={item => item.value}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.item,
                  item.value === value && styles.selectedItemInList,
                ]}
                onPress={() => handleItemPress(item)}>
                {item.image && <item.image />}
                <Text
                  style={[
                    styles.itemText,
                    item.value === value && styles.selectedItemText,
                  ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={ItemDivider}
            style={styles.list}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 12,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
  },
  icon: {
    width: 20,
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContainer: {
    position: 'absolute',
    top: 200, 
    left: 20, 
    borderRadius: 4,
    backgroundColor: 'white',
    maxHeight: 300, 
    padding: 10,
    zIndex: 1000,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 10,
    fontSize: 16,
    color: '#000',
  },
  list: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  itemText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#000',  
  },
  selectedItemInList: {
    backgroundColor: '#4b0082',
  },
  selectedItemText: {
    fontWeight: 'bold', 
    color: '#fff',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc', 
    marginVertical: 5,
  },
});

export default CustomDropdown;

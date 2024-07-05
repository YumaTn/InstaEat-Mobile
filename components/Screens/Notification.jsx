import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 

const Notification = () => {
  const [notifications, setNotifications] = useState([
    { id: 10, message: 'Tường đã để lại 1 bình luận ảnh' },
    { id: 11, message: 'Nam đã để lại 1 bình luận ảnh' },
    { id: 12, message: 'Bảo đã để lại 1 bình luận ảnh' },
    { id: 13, message: 'Huy đã để lại 1 bình luận ảnh' },
    { id: 14, message: 'Tường đã để lại 1 bình luận ảnh' },
    { id: 15, message: 'Nam đã để lại 1 bình luận ảnh' },
    { id: 16, message: 'Bảo đã để lại 1 bình luận ảnh' },
    { id: 17, message: 'Huy đã để lại 1 bình luận ảnh' },
    { id: 18, message: 'Tường đã để lại 1 bình luận ảnh' },
  ]);

  const [deletedNotifications, setDeletedNotifications] = useState([]);

  const handleDeleteNotification = (notificationId) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa thông báo này?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          onPress: () => {
            setNotifications(prevNotifications => prevNotifications.filter(notification => notification.id !== notificationId));
            setDeletedNotifications(prevDeletedNotifications => [...prevDeletedNotifications, notificationId]); 
          },
        },
      ],
      { cancelable: false }
    );  
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Thông Báo:</Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Text style={styles.notificationText}>{item.message}</Text>
            <TouchableOpacity  onPress={() => handleDeleteNotification(item.id)}>
              <Icon name="trash-outline" size={20} color="gray" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    paddingTop: 30,
    backgroundColor: 'purple',
  },
  headerText: {
    padding: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  notificationItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,  
    marginBottom: 5,
  },
  notificationText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default Notification;
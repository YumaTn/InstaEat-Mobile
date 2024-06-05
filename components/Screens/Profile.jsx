import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';

const Profile = ({navigation}) => {
    const styles = StyleSheet.create({
        container: {
            paddingTop: 40,
            paddingLeft: 20,
            paddingBottom: 20,
            backgroundColor: 'purple',
            flexDirection:'row',
            justifyContent:'space-between',
        },
        header: {
            marginLeft: 20,
            color: 'white',
            fontSize: 15,
            textTransform: 'uppercase',
        },
        logout:{
          color:'white',
          marginRight:30,
        },
        information: {
            marginTop: 40,
            marginLeft: 5,
        },
        name: {
            marginLeft: 40,
            marginTop: 20,
        },
        birth: {
            marginLeft: 40,
            marginTop: 10,
        },
        gt: {
            marginTop: 10,
            marginLeft: 40,
        },
        address: {
            marginLeft: 40,
            marginTop: 10,
        },
        number: {
            marginLeft: 40,
            marginTop: 10,
        },
        email: {
            marginTop: 10,
            marginLeft: 40,
        },
        voucher: {
            fontSize: 17,
            marginLeft:10,
        },
        voucherContainer: {
          flexDirection: 'row',
          marginTop: 50,
          paddingBottom:10,
          paddingLeft:10,
          backgroundColor: 'orange',       
          elevation: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
        },
      image:{
        width:30,
        height:30,
        marginLeft: 10,
      },
      arrowRight:{
        marginTop:13,
        width: 20,
        height:20,
      },
      rewardPointerContainer:{
        flexDirection: 'row',
          marginTop: 10,
          paddingBottom:10,
          paddingLeft:10,
          backgroundColor: 'orange',       
          elevation: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
      },
      imagePoint:{
        width:20,
        height:20,
        marginLeft: 10,
      },
      point:{
        marginTop:5,
        marginLeft:15,
        fontSize: 17,
      },
    });

    return (
      <View>
        <View>
            <View style={styles.container}>
                <Text style={styles.header}>Tôi:</Text>
              <Text style={styles.logout}>Log Out</Text>
            </View>
            <Text style={styles.information}>Thông tin:</Text>
            <Text style={styles.name}>Tên:</Text>
            <Text style={styles.birth}>Ngày sinh:</Text>
            <Text style={styles.gt}>Giới tính:</Text>
            <Text style={styles.address}>Địa chỉ:</Text>
            <Text style={styles.number}>Số điện thoại:</Text>
            <Text style={styles.email}>Email:</Text>
            <TouchableOpacity style={styles.voucherContainer}>
                <Text style={styles.voucher}>
                <Image style={styles.image} source={require('../../assets/images/voucher.png')}/>Voucher</Text>
            <Image style={styles.arrowRight} source={require('../../assets/images/arrowright.png')} />  
        </TouchableOpacity>
        <TouchableOpacity style={styles.rewardPointerContainer}>
                <Text style={styles.point}>
                <Image style={styles.imagePoint} source={require('../../assets/images/point.png')}/> Reward Point</Text>
            <Image style={styles.arrowRight} source={require('../../assets/images/arrowright.png')} />  
        </TouchableOpacity>
        </View>
      </View>
    );
}

export default Profile;

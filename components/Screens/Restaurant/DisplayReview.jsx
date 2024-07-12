import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const DisplayReview = ({ review }) => {
  if (!review) {
    return null;
  }

  const countContent = review.content ? 1 : 0;
  const countImages = review.image ? 1 : 0;

  return (
    <View style={styles.reviewContainer}>
      <Text style={styles.content}>{review.content}</Text>
      {review.image && <Image source={{ uri: review.image }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  reviewContainer: {
    marginVertical: 10,
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
});

export default DisplayReview;

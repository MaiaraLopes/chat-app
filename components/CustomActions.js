import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import firebase from "firebase";
import "firebase/firestore";

export default class CustomActions extends React.Component {
  //Choose image from the user's device
  pickImage = async () => {
    //Asking permission to access user's gallery
    const { status } = await ImagePicker.launchImageLibraryAsync();
    try {
      if (status === "granted") {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => {
          console.log(error);
        });

        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //Take a picture with the user's device
  takePhoto = async () => {
    //Asking permission to access user's camera
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    try {
      if (status === "granted") {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
        }).catch((error) => {
          console.log(error);
        });

        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //Upload image to Firestore
  uploadImageFetch = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const imageNameBefore = uri.split("/");
      const imageName = imageNameBefore[imageNameBefore.length - 1];

      const ref = firebase.storage().ref().child(`images/${imageName}`);
      const snapshot = await ref.put(blob);

      //blob.close();

      return await snapshot.ref.getDownloadURL();
    } catch (error) {
      console.log(error);
    }
  };

  //Get user's geolocation
  getLocation = async () => {
    try {
      //Asking permission to access user's location
      const { status } = await Permissions.askAsync(
        Permissions.LOCATION_FOREGROUND
      );
      if (status === "granted") {
        let result = await Location.getCurrentPositionAsync({}).catch(
          (error) => {
            console.log(error);
          }
        );
        const latitude = JSON.stringify(result.coords.latitude);
        const longitude = JSON.stringify(result.coords.longitude);
        if (result) {
          this.props.onSend({
            location: {
              latitude: result.coords.latitude,
              longitude: result.coords.longitude,
            },
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  onActionPress = () => {
    const options = [
      "Choose from Library",
      "Take a Picture",
      "Send Location",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log("user wants to pick an image");
            return this.pickImage();
          case 1:
            console.log("user wants to take a picture");
            return this.takePhoto();
          case 2:
            console.log("user wants to get their location");
            return this.getLocation();
        }
      }
    );
  };

  render() {
    return (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel="More options"
        accessibilityHint="Lets you choose to send an image or your geolocation."
        style={[styles.container]}
        onPress={this.onActionPress}
      >
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginRight: 10,
  },

  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
    marginBottom: 4,
  },

  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};

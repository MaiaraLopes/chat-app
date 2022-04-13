import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "", bgColor: this.colors.yellow };
  }

  //Function to change the background color according to user's choice
  changeBgColor = (newColor) => {
    this.setState({ bgColor: newColor });
  };

  //Options of colors
  colors = {
    option1: "#090C08",
    option2: "#474056",
    option3: "#8A95A5",
    option4: "#B9C6AE",
  };

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/background-image.png")}
          resizeMode="cover"
          style={styles.backgroundImage}
        >
          <View style={styles.titleBox}>
            <Text style={styles.title}>ChatBox</Text>
          </View>

          <View style={styles.box}>
            <View style={styles.inputBox}>
              <Image
                source={require("../assets/icon.png")}
                style={styles.icon}
              />
              <TextInput
                style={styles.inputText}
                onChangeText={(text) => this.setState({ name: text })}
                value={this.state.name}
                placeholder="Your Name"
              />
            </View>

            <View style={styles.colorBox}>
              <Text style={styles.chooseColor}>Choose Background Color: </Text>
            </View>

            <View style={styles.colors}>
              <TouchableOpacity
                onPress={() => this.changeBgColor(this.colors.option1)}
                style={styles.option1}
              />
              <TouchableOpacity
                onPress={() => this.changeBgColor(this.colors.option2)}
                style={styles.option2}
              />
              <TouchableOpacity
                onPress={() => this.changeBgColor(this.colors.option3)}
                style={styles.option3}
              />
              <TouchableOpacity
                onPress={() => this.changeBgColor(this.colors.option4)}
                style={styles.option4}
              />
            </View>

            <Pressable
              style={styles.button}
              onPress={() =>
                this.props.navigation.navigate("Chat", {
                  name: this.state.name,
                  bgColor: this.state.bgColor,
                })
              }
            >
              <Text style={styles.btnText}>Start Chatting</Text>
            </Pressable>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  backgroundImage: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  titleBox: {
    height: "50%",
    width: "88%",
    alignItems: "center",
    paddingTop: 100,
  },

  title: {
    fontSize: 45,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  box: {
    backgroundColor: "white",
    height: "44%",
    width: "88%",
    justifyContent: "space-around",
    alignItems: "center",
  },

  inputBox: {
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 1,
    width: "88%",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: 25,
    height: 25,
    marginLeft: 10,
    marginRight: 5,
  },

  inputText: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 0.5,
    width: "100%",
  },

  colorBox: {
    marginRight: "auto",
    paddingLeft: 15,
    width: "88%",
  },

  chooseColor: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 1,
  },

  colors: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "88%",
    paddingRight: 60,
  },

  option1: {
    backgroundColor: "#090C08",
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  option2: {
    backgroundColor: "#474056",
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  option3: {
    backgroundColor: "#8A95A5",
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  option4: {
    backgroundColor: "#B9C6AE",
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  button: {
    width: "88%",
    height: 70,
    backgroundColor: "#757083",
    alignItems: "center",
    justifyContent: "center",
  },

  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

import React from "react";
import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  LogBox,
} from "react-native";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
const firebase = require("firebase");
require("firebase/firestore");
LogBox.ignoreLogs([
  "Setting a timer",
  "AsyncStorage has been extracted from react-native",
  "Possible Unhandled Promise Rejection",
]);
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

const firebaseConfig = {
  apiKey: "AIzaSyDuygtWlbCPsFf3xQu4mT2iwMpYRkRRnT8",
  authDomain: "test-56849.firebaseapp.com",
  projectId: "test-56849",
  storageBucket: "test-56849.appspot.com",
  messagingSenderId: "44604785481",
};

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: "",
      loggedInText: "",
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    //References the database
    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  componentDidMount() {
    //User name shows at the top of the screen
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    //Checking if the user is online
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        //Authentication
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (user) => {
            if (!user) {
              await firebase.auth().signInAnonymously();
            }

            //Gets updates from collection
            this.unsubscribe = this.referenceChatMessages
              .orderBy("createdAt", "desc")
              .onSnapshot(this.onCollectionUpdate);

            //Update user state with active user data
            this.setState({
              uid: user.uid,
              user: {
                _id: user.uid,
                name: name,
                avatar: "https://placeimg.com/140/140/any",
              },
            });
          });
        console.log("online");
      } else {
        this.setState({ isConnected: false });
        //Get messages from asyncStorage
        this.getMessages();
        console.log("offline");
      }
    });
  }

  componentWillUnmount() {
    if (this.state.isConnected) {
      this.authUnsubscribe();
      this.unsubscribe();
    }
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    //Going through each document of the collection
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
      });
    });

    this.setState(
      {
        messages: messages,
      },
      () => {
        this.saveMessages();
      }
    );
  };

  onSend(messages = []) {
    this.addMessage(messages[0]);
  }

  //Adding messages to the database
  addMessage(message) {
    this.referenceChatMessages.add(message);
  }

  async getMessages() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({ messages: JSON.parse(messages) });
    } catch (error) {
      console.log(error.message);
    }
  }

  //Saving messages asynchronously
  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  //Deleting messages
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
        }}
      />
    );
  }

  renderInputToolbar = (props) => {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  };

  render() {
    //Bakcgorund color changed on Start screen
    const { bgColor } = this.props.route.params;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: bgColor,
        }}
      >
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          renderUsernameOnMessage={true}
          user={this.state.user}
        />
        <Text>{this.state.loggedInText}</Text>

        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}

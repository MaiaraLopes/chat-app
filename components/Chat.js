import React from "react";
import { View, Text, Platform, KeyboardAvoidingView } from "react-native";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
const firebase = require("firebase");
require("firebase/firestore");

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

    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  componentDidMount() {
    //User name shows at the top of the screen
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    //Authentication
    this.unsubscribe = this.referenceChatMessages
      .orderBy("createdAt", "desc")
      .onSnapshopt(this.onCollectionUpdate);

    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().singInAnonymously();
      }

      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
          avatar: "https://placeimg.com/140/140/any",
        },
      });

      this.referenceChatMessages = firebase
        .firestore()
        .collection("messages")
        .where("uid", "==", this.state.uid);
    });
  }

  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
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
    this.setState({
      messages: messages,
    });
  };

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      name: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: this.state.user,
    });
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

  render() {
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
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{ _id: 1 }}
        />
        <Text>{this.state.loggedInText}</Text>

        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}

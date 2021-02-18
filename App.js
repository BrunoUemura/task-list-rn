import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  LogBox,
  Modal,
  TouchableHighlight,
  TextInput,
  AsyncStorage,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function App() {
  LogBox.ignoreAllLogs(true);

  const image = require("./assets/bg.jpg");

  const [tasks, setTasks] = useState([]);

  const [modal, setModal] = useState(false);

  const [currentTask, setCurrentTask] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const taskReading = await AsyncStorage.getItem("tasks");
        if (taskReading == null) {
          setTasks([]);
        } else {
          setTasks(JSON.parse(taskReading));
        }
      } catch (error) {}
    })();
  }, []);

  function removeTask(id) {
    alert(`Task ${id} was successfully deleted`);
    let newTasks = tasks.filter(function (val) {
      return val.id != id;
    });
    setTasks(newTasks);

    (async () => {
      try {
        await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
      } catch (error) {}
    })();
  }

  function addTask() {
    setModal(!modal);
    let id = 0;
    if (tasks.length > 0) {
      id = tasks[tasks.length - 1].id + 1;
    }

    let task = {
      id: id,
      task: currentTask,
    };

    setTasks([...tasks, task]);

    (async () => {
      try {
        await AsyncStorage.setItem("tasks", JSON.stringify([...tasks, task]));
      } catch (error) {}
    })();
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="light" />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              onChangeText={(text) => setCurrentTask(text)}
              autoFocus={true}
            ></TextInput>

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => addTask()}
            >
              <Text style={styles.textStyle}>Add Task</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

      <ImageBackground source={image} style={styles.image}>
        <View style={styles.coverView}>
          <Text style={styles.headerText}>Task List</Text>
        </View>
      </ImageBackground>

      {tasks.map(function (val) {
        return (
          <View style={styles.taskCard}>
            <View style={styles.taskCardText}>
              <Text>{val.task}</Text>
            </View>
            <View style={styles.taskCardRemove}>
              <TouchableOpacity onPress={() => removeTask(val.id)}>
                <AntDesign name="minuscircleo" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      <TouchableOpacity
        style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
        onPress={() => setModal(true)}
      >
        <Text style={styles.textStyle}>Add Task</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 70,
    resizeMode: "cover",
  },
  coverView: {
    width: "100%",
    height: 70,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  headerText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 35,
  },
  // BODY
  taskCard: {
    margin: 10,
    width: "95%",
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 15,
  },
  taskCardText: {
    flex: 1,
    width: "100%",
    padding: 20,
  },
  taskCardRemove: {
    flex: 1,
    alignItems: "flex-end",
    padding: 22,
  },
  //Estilos para nossa modal
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

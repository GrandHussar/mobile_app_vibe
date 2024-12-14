import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import {
  doc,
  collection,
  setDoc,
  updateDoc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "@/firebaseConfig.native";

export default function Dashboard() {
  const [frequency, setFrequency] = useState(0);
  const [acceleration, setAcceleration] = useState(0);
  const [isSimulationActive, setSimulationActive] = useState(false);
  const [sensorData, setSensorData] = useState({
    current_frequency: 0,
    current_intensity: 0,
  });
  const [simulationId, setSimulationId] = useState(null);

  const handleFrequencyChange = (value) => setFrequency(value);
  const handleAccelerationChange = (value) => setAcceleration(value);

  const stopFT232H = async () => {
    try {
      console.log("Stopping FT232H (frequency: 0, acceleration: 0)");
      await setDoc(doc(firestore, "control_updates", "simulation"), {
        frequency: 0,
        acceleration: 0,
        timestamp: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error stopping FT232H:", error);
    }
  };

  const toggleSimulation = async () => {
    try {
      if (isSimulationActive) {
        // Stop the simulation
        await updateDoc(doc(firestore, "simulations", simulationId), {
          status: "completed",
          end_time: Timestamp.now(),
        });
        console.log("Simulation stopped.");
        setSimulationId(null); // Clear the simulation ID
        stopFT232H(); // Trigger stop signal for FT232H
      } else {
        // Start a new simulation
        const simulationRef = await addDoc(collection(firestore, "simulations"), {
          status: "ongoing",
          created_at: Timestamp.now(),
          end_time: null,
          frequency,
          acceleration,
        });
        setSimulationId(simulationRef.id);
        console.log("Simulation started with ID:", simulationRef.id);
      }

      setSimulationActive(!isSimulationActive);
    } catch (error) {
      console.error("Error toggling simulation:", error);
    }
  };

  const updateSimulation = async () => {
    if (!simulationId) return; // Ensure there's an active simulation
    try {
      await updateDoc(doc(firestore, "simulations", simulationId), {
        frequency,
        acceleration,
      });

      // Optionally, add to controls subcollection
      const controlsRef = collection(firestore, `simulations/${simulationId}/controls`);
      await addDoc(controlsRef, {
        current_frequency: frequency,
        current_intensity: acceleration,
        timestamp: Timestamp.now(),
      });

      console.log("Simulation updated with:", { frequency, acceleration });
    } catch (error) {
      console.error("Error updating simulation:", error);
    }
  };

  useEffect(() => {
    if (!simulationId) {
      console.log("No simulationId provided. Cannot fetch sensor data.");
      stopFT232H(); // Stop FT232H if no active simulation
      return;
    }

    console.log("Setting up Firestore listener for simulationId:", simulationId);

    const sensorsRef = collection(firestore, `simulations/${simulationId}/sensors`);
    const sensorsQuery = query(sensorsRef, orderBy("current_timestamp", "desc")); // Get sorted data

    const unsubscribe = onSnapshot(
      sensorsQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          // Fetch all sensor data
          const allData = snapshot.docs.map((doc) => doc.data());

          // Update UI directly with the latest data
          const latestData = allData[0]; // The first item in sorted data
          console.log("Updated sensor data:", latestData);
          setSensorData(latestData); // Update state
        } else {
          console.log("No sensor data found for simulationId:", simulationId);
          setSensorData({
            current_frequency: 0,
            current_intensity: 0,
          }); // Reset if no data is found
        }
      },
      (error) => {
        console.error("Error listening for sensor data:", error);
      }
    );

    return () => {
      console.log("Unsubscribing from Firestore listener for simulationId:", simulationId);
      unsubscribe();
    };
  }, [simulationId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      {/* Input Controls Section */}
      <View style={styles.controlsContainer}>
        {/* Frequency Slider */}
        <View style={styles.sliderContainer}>
          <Text style={styles.label}>Frequency Control:</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={frequency}
            onValueChange={handleFrequencyChange}
            minimumTrackTintColor="#00FF00"
            thumbTintColor="#00FF00"
          />
          <Text style={styles.sliderValue}>{`Frequency Level: ${frequency} Hz`}</Text>
        </View>

        {/* Acceleration Slider */}
        <View style={styles.sliderContainer}>
          <Text style={styles.label}>Acceleration Control:</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={acceleration}
            onValueChange={handleAccelerationChange}
            minimumTrackTintColor="#00FF00"
            thumbTintColor="#00FF00"
          />
          <Text style={styles.sliderValue}>{`Acceleration Level: ${acceleration} m/s²`}</Text>
        </View>

        {/* Simulation Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title={isSimulationActive ? "Stop Simulation" : "Start Simulation"}
            onPress={toggleSimulation}
            color="#00FF00"
          />
          {isSimulationActive && (
            <View style={styles.updateButton}>
              <Button title="Update Simulation" onPress={updateSimulation} color="#00FF00" />
            </View>
          )}
        </View>
      </View>

      {/* Sensor Data Section */}
      <View style={styles.sensorDataContainer}>
        <Text style={styles.sensorTitle}>Lab Data</Text>
        {sensorData ? (
          <>
            <Text style={styles.sensorValue}>
              Frequency: {sensorData.current_frequency || 0} Hz
            </Text>
            <Text style={styles.sensorValue}>
              Intensity: {sensorData.current_intensity || 0} m/s²
            </Text>
          </>
        ) : (
          <Text style={styles.sensorValue}>Waiting for sensor data...</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0D0D0D",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#00FF00",
  },
  controlsContainer: {
    marginBottom: 32,
  },
  sliderContainer: {
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  sliderValue: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
    color: "#FFFFFF",
  },
  buttonContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  updateButton: {
    marginTop: 16,
  },
  sensorDataContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#333333",
  },
  sensorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#00FF00",
  },
  sensorValue: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 4,
    color: "#FFFFFF",
  },
});

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { firestore } from "@/firebaseConfig.native";

export default function Reports() {
  const [simulations, setSimulations] = useState([]);
  const [selectedSimulation, setSelectedSimulation] = useState(null);
  const [dataPoints, setDataPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch the first page of simulations
  const fetchSimulations = async () => {
    setLoading(true);
    try {
      const simulationsRef = collection(firestore, "simulations");
      const simulationsQuery = query(simulationsRef, orderBy("created_at", "desc"));

      const querySnapshot = await getDocs(simulationsQuery);
      const fetchedSimulations = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const duration =
          data.end_time && data.created_at
            ? Math.round((data.end_time.toMillis() - data.created_at.toMillis()) / 60000) // Duration in minutes
            : null;

        return {
          id: doc.id,
          ...data,
          duration, // Add computed duration
        };
      });

      setSimulations(fetchedSimulations);
    } catch (error) {
      console.error("Error fetching simulations:", error);
      Alert.alert("Error", "Failed to load simulations.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch sensor data for a specific simulation
  const fetchSensorData = async (simulationId) => {
    setLoading(true);
    try {
      const sensorDataRef = collection(firestore, `simulations/${simulationId}/sensors`);
      const sensorDataQuery = query(sensorDataRef, orderBy("current_timestamp", "asc"));

      const querySnapshot = await getDocs(sensorDataQuery);
      const fetchedSensorData = querySnapshot.docs.map((doc) => doc.data());

      setDataPoints(fetchedSensorData);
    } catch (error) {
      console.error("Error fetching sensor data:", error);
      Alert.alert("Error", "Failed to load sensor data.");
    } finally {
      setLoading(false);
    }
  };

  // Refresh simulations
  const refreshSimulations = async () => {
    setRefreshing(true);
    setSimulations([]); // Clear the current list
    await fetchSimulations(); // Fetch the first page again
    setRefreshing(false);
  };

  // Generate XML for sensor data
const generateXMLForSensorData = (dataPoints) => {
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  const rootStart = `<SensorData>\n`;
  const rootEnd = `</SensorData>`;
  const dataPointsXML = dataPoints
    .map(
      (point) =>
        `  <DataPoint>\n    <Frequency>${point.current_frequency}</Frequency>\n    <Intensity>${point.current_intensity}</Intensity>\n    <Timestamp>${point.current_timestamp.toDate()}</Timestamp>\n  </DataPoint>\n`
    )
    .join("");
  return xmlHeader + rootStart + dataPointsXML + rootEnd;
};

// Exports sensor data and saves to the device
const exportSensorData = async () => {
  const xmlData = generateXMLForSensorData(dataPoints);
  const fileUri = `${FileSystem.documentDirectory}simulation_${selectedSimulation.id}_data.xml`;

  try {
    await FileSystem.writeAsStringAsync(fileUri, xmlData, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    Alert.alert("Success", "Sensor data exported successfully!");

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      Alert.alert("Sharing Not Available", "XML file saved to your device.");
    }
  } catch (error) {
    Alert.alert("Error", "Failed to export sensor data.");
    console.error(error);
  }
};

  useEffect(() => {
    fetchSimulations();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reports</Text>
      <Button title="Refresh" onPress={refreshSimulations} color="#00FF00" />

      {selectedSimulation ? (
        <View style={styles.detailContainer}>
          <Text style={styles.subtitle}>Simulation ID: {selectedSimulation.id}</Text>
          <FlatList
            data={dataPoints}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.dataPointItem}>
                <Text style={styles.dataPointText}>
                  Frequency: {item.current_frequency || 0} Hz, Intensity:{" "}
                  {item.current_intensity || 0}, Timestamp:{" "}
                  {item.current_timestamp.toDate().toLocaleString()}
                </Text>
              </View>
            )}
            ListEmptyComponent={
              loading ? (
                <ActivityIndicator size="large" color="#00FF00" />
              ) : (
                <Text style={styles.noDataText}>No data points available</Text>
              )
            }
          />
          <Button title="Export Data" onPress={exportSensorData} color="#00FF00" />
          <Button
            title="Back to Simulations"
            onPress={() => {
              setSelectedSimulation(null);
              setDataPoints([]);
            }}
            color="#00FF00"
          />
        </View>
      ) : (
        <>
          {loading ? (
            <ActivityIndicator size="large" color="#00FF00" />
          ) : (
            <FlatList
              data={simulations}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.reportItem}
                  onPress={() => {
                    setSelectedSimulation(item);
                    fetchSensorData(item.id);
                  }}
                >
                  <Text style={styles.reportText}>
                    ID: {item.id}, Status: {item.status}, Duration:{" "}
                    {item.duration || "N/A"} minutes
                  </Text>
                  <Text style={styles.timestamp}>
                    Created At: {item.created_at?.toDate().toLocaleString()}
                  </Text>
                  <Text style={styles.timestamp}>
                    End Time: {item.end_time ? item.end_time.toDate().toLocaleString() : "N/A"}
                  </Text>
                </TouchableOpacity>
              )}
              refreshing={refreshing}
              onRefresh={refreshSimulations}
            />
          )}
        </>
      )}
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
    marginBottom: 8,
    textAlign: "center",
    color: "#00FF00",
  },
  subtitle: {
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
  },
  reportItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#333",
    backgroundColor: "#1A1A1A",
    marginVertical: 4,
    borderRadius: 4,
  },
  reportText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  timestamp: {
    fontSize: 14,
    color: "#00FF00",
  },
  detailContainer: {
    flex: 1,
    width: "100%",
  },
  dataPointItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#333",
    backgroundColor: "#1A1A1A",
  },
  dataPointText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  noDataText: {
    fontSize: 16,
    textAlign: "center",
    color: "#FFFFFF",
  },
});

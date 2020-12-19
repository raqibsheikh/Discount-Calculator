import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, TextInput, Button, Alert} from 'react-native';
import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DataTable } from "react-native-paper";

const Home = ({navigation, route}) => {
  const [Orgprice, setOrgprice] = useState("");
  const [Percentdiscount, setPercentdiscount] = useState("");
  const [Fprice, setFprice] = useState("");
  const [saved, setsaved] = useState("");
  const [dataArray, setdataArray] = useState([]);
  const [disable, setdisable] = useState(true);

  useEffect(() => {
    setdataArray(
      route.params !== undefined ? Object.values(route.params) : []
      );
  }, [route.params]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View>
          <Button title="History" color="red" onPress={() => navigation.navigate('HistoryS', dataArray)}/>
        </View>
      )
    });
  });

  const operations = () => {
    if(Orgprice >= 0){
      setOrgprice(Orgprice);
      if (Percentdiscount >= 0 && Percentdiscount < 100){
        var Finalprice = Orgprice - (Orgprice  * (Percentdiscount / 100));
        setFprice(Finalprice.toFixed(2));
        var Saved = Orgprice - Finalprice;
        setsaved(Saved.toFixed(2));
      }
    }
  };

  const StoringValues = () => {
    setdataArray(
      [...dataArray,
        {
          key: Math.random(),
          OrgPrice: Orgprice,
          Discount: Percentdiscount,
          Calculated: Fprice,
        },
    ]);
  };

  useEffect(() => {
    if (Orgprice !== ""){
      setdisable(false);
    }
    else{
      setdisable(disable);
    }
  }, [Orgprice]); 


  return (
    <View style={styles.container}>
      <Text style={{fontSize: 20, marginBottom: 20}}>Raqib Sheikh - SP18-BCS-181</Text>
      <View style={{flexDirection:"row", justifyContent:"space-between"}}>
        <Text style={{fontSize:20, marginTop: 7}}>Enter Original Price</Text>
        <TextInput keyboardType={"number-pad"} style={{borderWidth: 2, borderRadius: 10, padding: 5, width: 200, fontSize: 20, marginLeft: 5}} value={Orgprice} onChangeText={(Price) => setOrgprice(Price)}/>
      </View>
      <View style={{flexDirection:"row", justifyContent:"space-between", marginTop: 10}}>
        <Text style={{fontSize:20, marginTop: 7}}>Enter Discount (%)</Text>
        <TextInput keyboardType={"number-pad"} style={{borderWidth: 2, borderRadius: 10, padding: 5, width: 200, fontSize: 20, marginLeft: 11}} value={Percentdiscount} onChangeText={(DisPrice) => setPercentdiscount(DisPrice)}/>
      </View>
      <View style={{flexDirection: "row", justifyContent: "space-between"}}>
        <View style={{width: "50%", paddingTop: 10}}>
          <Button title="Calculate" color="red" disabled={disable} onPress={() => operations()}/>
        </View>
      </View>
      <View style={{borderWidth: 1, borderRadius: 10, padding: 5, marginTop: 10, width: "80%"}}>
        <Text style={{fontSize:20, color: "red", marginTop: 10}}>Final Price - {Fprice}</Text>
        <Text style={{fontSize:20, color: "red"}}>Saved - {saved}</Text>
      </View>
      <View style={{flexDirection: "row", justifyContent: "space-between"}}>
        <View style={{width: "40%", paddingTop: 10}}>
          <Button title="Save" color="red" disabled={disable} onPress={() => StoringValues()}/>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const HistoryS = ({navigation, route}) => {
  const [historylist, sethistorylist] = useState(route.params);

  const deleterow = (keys) => {
    let history = historylist.filter((items) => items.key != keys);
    sethistorylist([...history]);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View>
          <Button title="Back" color="red" onPress={() => navigation.navigate('Home', historylist)}/>
        </View>
      )
    });
  });

    return (
      <View>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title numeric >Original Price</DataTable.Title>
            <DataTable.Title numeric >Discount</DataTable.Title>
            <DataTable.Title numeric >Final Price</DataTable.Title>
            <DataTable.Title numeric >Delete Row</DataTable.Title>
          </DataTable.Header>

            <ScrollView>
              {historylist.map((items) => (
                  <DataTable.Row key={items.key}>
                    <DataTable.Cell numeric>
                      {items.OrgPrice}
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      {items.Discount}
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      {items.Calculated}
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      <TouchableOpacity 
                      onPress={() => deleterow(items.key)}
                      >
                        <Button title="X" color="black" />
                      </TouchableOpacity>
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
            </ScrollView>
        </DataTable>
      </View>
    );
};

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{title: 'Calculator', headerStyle: {backgroundColor: "red"},
            headerTitleStyle: {color: "white"}}} />
        <Stack.Screen name="HistoryS" component={HistoryS} options={{title: 'History Screen', headerStyle: { backgroundColor: "red" },
            headerTitleStyle: { color: "white" }}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default App;
import React from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Text as RNText,
  Dimensions
} from 'react-native';
import  {useSharedValue } from 'react-native-reanimated';
import Svg, {Path, G, Text, TSpan } from 'react-native-svg';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import * as d3Shape from 'd3-shape';
import color from 'randomcolor';
import { snap } from '@popmotion/popcorn';

const { width } = Dimensions.get('screen');

const numberOfSegments = 12;
const wheelSize = width * 0.95;
const fontSize = 26;
const oneTurn = 360;
const angleBySegment = oneTurn / numberOfSegments;
const angleOffset = angleBySegment / 2;
const knobFill = color({ hue: 'purple' });


let _angle = new Animated.Value(0);
let angle = 0;


const makeWheel = () => {
  const data = Array.from({ length: numberOfSegments }).fill(1);
  const arcs = d3Shape.pie()(data);
  const colors = color({
    luminosity: 'dark',
    count: numberOfSegments
  });

  return arcs.map((arc, index) => {
    const instance = d3Shape
      .arc()
      .padAngle(0.01)
      .outerRadius(width / 2)
      .innerRadius(20);

    
    return {
      path: instance(arc),
      color: colors[index],
      value: Math.round(Math.random() * 10 + 1) * 200, //[200, 2200]
      centroid: instance.centroid(arc)
    };
  });
};

const _wheelPaths = makeWheel();

//console.log(_wheelPaths[0].value = "TEST");


const _renderKnob = () => {
  const knobSize = 30;
  // [0, numberOfSegments]
  const YOLO = Animated.modulo(
    Animated.divide(
      Animated.modulo(Animated.subtract(_angle, angleOffset), oneTurn),
      new Animated.Value(angleBySegment)
    ),
    1
  );

  return (
    <Animated.View
      style={{
        width: knobSize,
        height: knobSize * 2,
        justifyContent: 'flex-end',
        zIndex: 1,
        transform: [
          {
            rotate: YOLO.interpolate({
              inputRange: [-1, -0.5, -0.0001, 0.0001, 0.5, 1],
              outputRange: ['0deg', '0deg', '35deg', '-35deg', '0deg', '0deg']
            })
          }
        ]
      }}
    >
      <Svg
        width={knobSize}
        height={(knobSize * 100) / 57}
        viewBox={`0 0 57 100`}
        style={{ transform: [{ translateY: 8 }] }}
      >
        <Path
          d="M28.034,0C12.552,0,0,12.552,0,28.034S28.034,100,28.034,100s28.034-56.483,28.034-71.966S43.517,0,28.034,0z   M28.034,40.477c-6.871,0-12.442-5.572-12.442-12.442c0-6.872,5.571-12.442,12.442-12.442c6.872,0,12.442,5.57,12.442,12.442  C40.477,34.905,34.906,40.477,28.034,40.477z"
          fill={knobFill}
        />
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  winnerText: {
    fontSize: 32,
    fontFamily: 'Menlo',
    position: 'absolute',
    bottom: 10
  }
});

_renderSvgWheel = (horseData) => {

  return (
    
    <View style={styles.container}>
      {_renderKnob()}
      
      <Animated.View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          transform: [
            {
              rotate: _angle.interpolate({
                inputRange: [-oneTurn, 0, oneTurn],
                outputRange: [`-${oneTurn}deg`, `0deg`, `${oneTurn}deg`]
              })
            }
          ]
        }}
      >

        <Svg
          width={wheelSize}
          height={wheelSize}
          viewBox={`0 0 ${width} ${width}`}
          style={{ transform: [{ rotate: `-${angleOffset}deg` }] }}
        >
          <G y={width / 2} x={width / 2}>
            {_wheelPaths.map((arc, i) => {
              const [x, y] = arc.centroid;
              const number = arc.value.toString();
             
           
              return (
                <G key={`arc-${i}`}>
                  <Path d={arc.path} fill={arc.color} />
                  <G
                    rotation={(i * oneTurn) / numberOfSegments + angleOffset}
                    origin={`${x}, ${y}`}
                  >
                    <Text
                      x={x}
                      y={y - 70}
                      fill="white"
                      textAnchor="middle"
                      fontSize={fontSize}
                    >
{
//horseData !== null ? horseData.map( function(i,e){  console.log(i.getAttribute("name"));}) : ""
}
{
//console.log(typeof horseData)
}
                      {Array.from({ length: number.length }).map((_, j) => {
                        
                        return (
                          <TSpan
                            x={x}
                            dy={fontSize}
                            key={`arc-${i}-slice-${j}`}
                          >
                            { 
                            //console.log(number)
                            } 
                            {
                            //console.log(number.charAt(j))
                            }
                            {number.charAt(j)}
                          </TSpan>
                        );
                      })}
                    </Text>
                  </G>
                </G>
              );
            })}
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
};

_renderWinner = (winner) => {

  return (
    <RNText style={styles.winnerText}>Winner is: {winner}</RNText>
  );
};

const App = () => {


  const [enabled, setEnabled] = React.useState(true); 
  const [finished, setFinished] = React.useState(false);
  const [winner, setWinner] = React.useState(null);
  const [horseData, setHorseData] = React.useState(null);
  let horseArr;
  
  async function fetchHorseData() {
    let xml;
    const eventID = '28035501.20';
    const bettypeID = '220043768.20';
    

  fetch("https://xml2.betfred.com/horse-racing-uk.xml")
  .then(response => response.text())
  .then(data => {
    const parser = new DOMParser();
    xml = parser.parseFromString(data, "application/xml");
   
    const eventInfo = xml.querySelector(`event[eventid='${eventID}']`);

   if (eventInfo.childNodes[0].getAttribute("bettypeid") === bettypeID) {

    const horses = eventInfo.childNodes[0].children;

    horseArr = Array.from(horses);
    setHorseData(horseArr);
  
    
   // horseArr.map( function(i,e){
     //   console.log(i.getAttribute("name"));
     // });
    // console.log(horseArr);
    }
 
  })
  .catch(console.error);
};




  React.useEffect(() => {
    
    fetchHorseData();

    _angle.addListener(event => {
      if (enabled) {
        setEnabled(false);
        setFinished(false);
      }

      angle = event.value;
    });

  });

  const getWinnerIndex = () => {
    const deg = Math.abs(Math.round(angle % oneTurn));
    // wheel turning counterclockwise
    if(angle < 0) {
      return Math.floor(deg / angleBySegment);
    }
    // wheel turning clockwise
    return (numberOfSegments - Math.floor(deg / angleBySegment)) % numberOfSegments;
  };
  
  const onPan = ({ nativeEvent }) => {
  
    if (nativeEvent.state === State.END) {
      const { velocityY } = nativeEvent;
  
      Animated.decay(_angle, {
        velocity: velocityY / 1000,
        deceleration: 0.999,
        useNativeDriver: true
      }).start(() => {
        _angle.setValue(angle % oneTurn);
        const snapTo = snap(oneTurn / numberOfSegments);
        Animated.timing(_angle, {
          toValue: snapTo(angle),
          duration: 300,
          useNativeDriver: true
        }).start(() => {
          const winnerIndex = getWinnerIndex();
          setEnabled(true);
          setFinished(true);
          setWinner(_wheelPaths[winnerIndex].value);
  
        });
        // do something here;
      });
    }
  };

    return (
      
      <PanGestureHandler onHandlerStateChange={onPan} enabled={enabled} >
        <View style={styles.container}>
          
        {_renderSvgWheel(horseData)}
          {finished && enabled && _renderWinner(winner)}

        </View>
      </PanGestureHandler>
    );
};

export default App;
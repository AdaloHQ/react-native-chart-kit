// import React, {useEffect, useState} from "react";
// import { View, ViewStyle, Text } from "react-native";

// export default function TextWidthFinder( { content }) {
//   const [displayValue, setDisplayValue] = useState('flex')

//   useEffect(() => {
//     console.log('effect')
//   }, [displayValue])

//   const onLayout = e => {
//     console.log(e);
//     console.log(content)
//     setDisplayValue('none')
//   };
//   return (
//     <View onLayout={onLayout} style={{alignSelf: 'flex-start', display: displayValue}}>
//       <Text>{content}</Text>
//     </View>
//   );
// }

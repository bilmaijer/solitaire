import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { decode } from 'html-entities';

import { Card as CardType } from '../../types';
import theme from '../../theme';

const styles = StyleSheet.create({
  base: { width: 42, height: 64 },
  container: {
    backgroundColor: '#f3f3f3',
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingVertical: theme.spacing(0.5),
    paddingHorizontal: theme.spacing(1),
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#3c3333'
  },
  empty: {
    position: 'absolute',
    borderRadius: 2,
    borderColor: theme.colors.shadow,
    borderWidth: 1,
    flex: 1
  },
  rows: {
    flex: 1
  },
  top: {
    fontWeight: 'bold'
  },
  sign: {
    alignSelf: 'center',
    fontSize: 32,
    marginTop: 2
  },
  red: {
    color: theme.colors.red
  },
  black: {
    color: theme.colors.black
  },
  back: {
    backgroundColor: '#009b79',
    flex: 1,
    marginVertical: theme.spacing(1),
    marginHorizontal: theme.spacing(0.5),
    borderRadius: 2
  },
  small: {
    fontSize: 10
  }
});

const Card: React.FC<{
  card: CardType;
}> = ({ card: { suite, val, isOpen } }) => {
  const sign = decode(suite.sign);

  if (!isOpen) {
    return (
      <View style={[styles.base, styles.container, {backgroundColor: '#dedede'}]}>
        <Text style={[styles.top, styles[suite.color]]}>
          {val}
          <Text style={styles.small}>{sign}</Text>
        </Text>
        <View style={styles.back} />
      </View>
    );
  }
console.log('render', suite.name, val)
  return (
    <View style={[styles.base, styles.container]}>
      <View style={styles.rows}>
        <Text style={[styles.top, styles[suite.color]]}>
          {val}
          <Text style={styles.small}>{sign}</Text>
        </Text>
        <Text style={[styles.sign, styles[suite.color]]}>{sign}</Text>
      </View>
    </View>
  );
};

export const Stack: React.FC = ({ children }) => (
  <View style={styles.base}>
    <View style={[styles.base, styles.empty]} />
    {children}
  </View>
);

export default Card;

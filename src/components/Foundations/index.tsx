import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { decode } from 'html-entities';

import { Card as CardType, CardSuite } from '../../types';

import Card, { Stack } from '../Card';
import theme from '../../theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  stack: {
    position: 'relative',
    marginRight: theme.spacing(3)
  },
  card: { position: 'absolute' },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sign: {
    fontSize: 20,
    color: theme.colors.shadow
  }
});

const Foundations: React.FC<{
  decks: { [key: string]: CardType[] };
  suites: CardSuite[];
}> = ({ decks, suites }) => {
  return (
    <View style={styles.container}>
      {suites.map((suite) => {
        const cards = decks[suite.name];
        return (
          <View style={styles.stack} key={suite.name}>
            <Stack>
              <View style={styles.empty}>
                <Text style={styles.sign}>{decode(suite.sign)}</Text>
              </View>
              {cards.map((card) => (
                <View style={[styles.card]} key={card.key}>
                  <Card card={card} />
                </View>
              ))}
            </Stack>
          </View>
        );
      })}
    </View>
  );
};

export default Foundations;

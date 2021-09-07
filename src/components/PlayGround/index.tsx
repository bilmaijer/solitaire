import React, { useEffect } from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';

import { Card as CardType } from '../../types';

import Card, { Stack } from '../Card';
import theme from '../../theme';

const styles = StyleSheet.create({
  container: {
    marginTop: theme.spacing(8),
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between'
  },
  card: {
    position: 'absolute'
  }
});

const PlayGround: React.FC<{
  columns: CardType[][];
  onOpenCard: (key: string, col: number) => void;
  onSelectCard: (card: CardType, col: number, index: number) => void;
}> = ({ columns, onOpenCard, onSelectCard }) => {
  useEffect(() => {
    columns.forEach((column, i) => {
      if (!column.length) {
        return;
      }
      const lastCard = column[column.length - 1];
      if (!lastCard.isOpen) {
        onOpenCard(lastCard.key, i);
      }
    });
  }, [columns, onOpenCard]);

  return (
    <View style={styles.container}>
      {columns.map((column, col) => {
        let firstOpenAt: number;

        return (
          <Stack key={`col-${col}`}>
            {column.map((card: CardType, index: number) => {
              if (card.isOpen && firstOpenAt == null) {
                firstOpenAt = index;
              }

              let top = index * 16;
              if (firstOpenAt != null) {
                top += (index - firstOpenAt) * 10;
              }

              return (
                <View style={[styles.card, { top }]} key={card.key}>
                  <TouchableHighlight
                    onPress={() => onSelectCard(card, col, index)}
                  >
                    <Card card={card} />
                  </TouchableHighlight>
                </View>
              );
            })}
          </Stack>
        );
      })}
    </View>
  );
};

export default PlayGround;

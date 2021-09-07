import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { decode } from 'html-entities';

import { Card as CardType } from '../../types';

import Card, { Stack } from '../Card';
import theme from '../../theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  card: {
    position: 'absolute'
  },
  opened: {
    right: 50
  },
  restartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  restart: { fontSize: 20, color: theme.colors.shadow }
});

const Deck: React.FC<{
  cards: CardType[];
  onOpenCard: (key: string) => void;
  onSelectCard: (card: CardType) => void;
  onRestartDeck: () => void;
}> = ({ cards, onOpenCard, onSelectCard, onRestartDeck }) => {
  const onCardClick = (card: CardType) => {
    if (card.isOpen) {
      onSelectCard(card);
    } else {
      onOpenCard(card.key);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Stack>
          <TouchableHighlight
            style={styles.restartContainer}
            onPress={onRestartDeck}
          >
            <Text style={styles.restart}>{decode('&orarr;')}</Text>
          </TouchableHighlight>
          {cards.map((card: CardType, index: number) => (
            <View
              style={[
                styles.card,
                card.isOpen ? styles.opened : null,
                { zIndex: card.isOpen ? -index : 1 }
              ]}
              key={card.key}
            >
              <TouchableHighlight onPress={() => onCardClick(card)}>
                <Card card={card} />
              </TouchableHighlight>
            </View>
          ))}
        </Stack>
      </View>
    </View>
  );
};

export default Deck;

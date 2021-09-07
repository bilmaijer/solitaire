import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Card, CardValue, CardSuite } from './types';

import Deck from './components/Deck';
import PlayGround from './components/PlayGround';
import Foundations from './components/Foundations';

import theme from './theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor
  },
  spacing: {
    flex: 1,
    padding: theme.spacing(4)
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  reset: {
    alignItems: 'center'
  },
  button: {
    backgroundColor: 'white',
    padding: 12
  }
});

const shuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const suites: CardSuite[] = [
  {
    name: 'hearts',
    sign: '&hearts;',
    color: 'red'
  },
  {
    name: 'diamonds',
    sign: '&diams;',
    color: 'red'
  },
  {
    name: 'spades',
    sign: '&spades;',
    color: 'black'
  },
  {
    name: 'clubs',
    sign: '&clubs;',
    color: 'black'
  }
];

const vals: CardValue[] = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K'
];

const getCards = () =>
  vals.reduce<Card[]>((acc, val) => {
    const cardInSuite = suites.map((suite) => ({
      val,
      suite,
      key: `${suite.name}-${val}`
    }));

    return acc.concat(cardInSuite);
  }, []);

const noOfCols = 7;

const setup = () => {
  const deck = getCards();
  shuffle(deck);
  const columns = [];
  const foundations = suites.reduce<{ [key: string]: Card[] }>((acc, suite) => {
    acc[suite.name] = [];

    return acc;
  }, {});

  for (let i = 1; i < noOfCols + 1; i++) {
    columns.push(deck.splice(0, i));
  }

  return { deck, columns, foundations };
};

const getFitsFoundation = (card: Card, foundation: Card[]) => {
  const first = vals.indexOf(card.val) === 0;
  if (first) {
    return true;
  }

  if (!foundation.length) {
    return false;
  }

  const currentI = vals.indexOf(foundation[foundation.length - 1].val);
  return vals.indexOf(card.val) - 1 === currentI;
};

const handleFoundation = (
  card: Card,
  foundations: { [key: string]: Card[] },
  setFoundations: (foundations: { [key: string]: Card[] }) => void
) => {
  const foundation = foundations[card.suite.name];
  const fitsFoundation = getFitsFoundation(card, foundation);
  if (fitsFoundation) {
    const matchingFoundation = foundations[card.suite.name];
    setFoundations({
      ...foundations,
      [card.suite.name]: [...matchingFoundation, card]
    });

    return true;
  }

  return false;
};

const Board: React.FC = () => {
  const [state, setState] = useState(0);
  const initial = setup();
  const [deck, setDeck] = useState(initial.deck);
  const [columns, setColumns] = useState(initial.columns);
  const [foundations, setFoundations] = useState(initial.foundations);

  const reset = () => {
    const newSetup = setup();
    setDeck(newSetup.deck);
    setColumns(newSetup.columns);
    setFoundations(newSetup.foundations);
    setState(state + 1);
  };

  const openDeckCard = (key: string) => {
    const newDeck = deck.map((card) => {
      if (card.key === key) {
        return { ...card, isOpen: true };
      }
      return card;
    });

    setDeck(newDeck);
  };

  const onRestartDeck = useCallback(() => {
    setDeck([...deck.map((card) => ({ ...card, isOpen: false }))]);
  }, [deck]);

  const handleOpenCardClick = useCallback(
    (card: Card, colNum?: number, at?: number): boolean => {
      const isAlone = colNum == null || columns[colNum].length - 1 === at;
      if (isAlone) {
        if (handleFoundation(card, foundations, setFoundations)) {
          if (colNum != null) {
            const currentCol = columns[colNum];

            const newColumns = [...columns];
            const newColumn = [...currentCol];
            newColumn.pop();
            newColumns[colNum] = newColumn;
            setColumns(newColumns);
          }
          return true;
        }
      }

      const highest = vals.indexOf(card.val) === vals.length - 1;

      const candidateVal = vals[vals.indexOf(card.val) + 1];
      const candidateSuites = suites.filter(
        (suite) => suite.color !== card.suite.color
      );
      const candidates = candidateSuites.map(
        (suite) => `${suite.name}-${candidateVal}`
      );

      return columns.some((column, col) => {
        let match = false;
        if (!column.length) {
          if (!highest) {
            return false;
          }
          match = true;
        }

        if (!match) {
          match = candidates.includes(column[column.length - 1].key);
        }
        if (match) {
          const newColumns = [...columns];
          let cards = [card];
          if (colNum != null && at != null) {
            cards = newColumns[colNum].splice(
              at,
              newColumns[colNum].length - at
            );
          }
          newColumns[col] = newColumns[col].concat(cards);
          setColumns(newColumns);

          return true;
        }

        return false;
      });
    },
    [columns, foundations]
  );

  const onOpenDeckClick = useCallback(
    (card: Card) => {
      if (handleOpenCardClick(card)) {
        setDeck([...deck.filter((c) => c.key !== card.key)]);
      }
    },
    [handleOpenCardClick, deck]
  );

  const onOpenColClick = useCallback(
    (card: Card, colNum: number, at: number) => {
      handleOpenCardClick(card, colNum, at);
    },
    [handleOpenCardClick]
  );

  const openColumnCard = useCallback(
    (key: string, columnIndex: number) => {
      const newColumns = [...columns];
      newColumns[columnIndex] = newColumns[columnIndex].map((card) => {
        if (card.key === key) {
          return { ...card, isOpen: true };
        }
        return card;
      });

      setColumns(newColumns);
    },
    [columns]
  );

  return (
    <SafeAreaView style={styles.container} key={state}>
      <View style={styles.spacing}>
        <View style={styles.top}>
          <Foundations decks={foundations} suites={suites} />
          <Deck
            cards={deck}
            onOpenCard={openDeckCard}
            onSelectCard={onOpenDeckClick}
            onRestartDeck={onRestartDeck}
          />
        </View>
        <PlayGround
          columns={columns}
          onOpenCard={openColumnCard}
          onSelectCard={onOpenColClick}
        />
        <View style={styles.reset}>
          <TouchableOpacity onPress={reset}>
            <Text style={styles.button}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Board;

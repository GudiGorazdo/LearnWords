import { StackNavigationProp } from '@react-navigation/stack';
import { Alert as AlertEL, TAlertButton } from '../../modules/Alert';
import { useEffect, useState } from 'react';
import { ControlOutlined } from '@ant-design/icons';

type TAlertProps = {
  isVisible: boolean;
  isNewWord: boolean;
  isErrors: boolean;
  alertMessage: string;
  close: () => void;
}

export function Alert({
  isVisible,
  isNewWord,
  alertMessage,
  isErrors,
  close,
}: TAlertProps) {

  const getAlertButtons = (): TAlertButton[] => {
    const buttons: TAlertButton[] = [{
      title: 'Закрыть',
      onPress: () => {
        close();
      },
    }];

    if (isErrors) return buttons;

    if (isNewWord) {
      buttons.push({
        title: 'Добавить новое слово',
        onPress: () => {
          close();
          // navigation.push('WordEdit', {
          //   isNewWord: true,
          // });
        },
      });
    }
    buttons.push({
      title: 'Назад',
      onPress: () => {
        close();
        // navigation.goBack();
      },
    });

    buttons.push({
      title: 'К списку слов',
      onPress: () => {
        close();
        // navigation.navigate('WordsList', { groupID: groupID});
      },
    });

    return buttons;
  };
  return (
    <AlertEL
      isVisible={isVisible}
      message={alertMessage}
      buttons={getAlertButtons()}
      onOverlayPress={() => close()}
    />
  );
}

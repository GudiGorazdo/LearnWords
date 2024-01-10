import { StackNavigationProp } from '@react-navigation/stack';
import { Alert as AlertEL, TAlertButton } from '../../modules/Alert';

type TAlertProps = {
  isVisible: boolean;
  isNewWord: boolean;
  isErrors: boolean;
  message: string;
  close: () => void;
}

export function Alert({
  isVisible,
  isNewWord,
  message,
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

    // if (isErrors) return buttons;

    // if (isNewWord) {
    //   buttons.push({
    //     title: 'Добавить новое слово',
    //     onPress: () => {
    //       setAlertVisible(!isVisible);
    //       resetForm();
    //       setStart(true);
    //       navigation.push('WordEdit', {
    //         isNewWord: true,
    //       });
    //     },
    //   });
    // }
    // buttons.push({
    //   title: 'Назад',
    //   onPress: () => {
    //     close();
    //     navigation.goBack();
    //   },
    // });

    // buttons.push({
    //   title: 'К списку слов',
    //   onPress: () => {
    //     close();
    //     navigation.navigate('WordsList', { groupID: groupID});
    //   },
    // });

    return buttons;
  };
  return (
    <AlertEL
      isVisible={isVisible}
      message={message}
      buttons={getAlertButtons()}
      onOverlayPress={() => close()}
    />
  );
}

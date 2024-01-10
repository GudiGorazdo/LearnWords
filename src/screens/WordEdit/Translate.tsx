import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import IconsStrings from '../../assets/awesomeIcons';
import { TTranslate, TContext } from "../../types";
import theme from '../../styles/themeLight';

import {
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';

type TTranslateProps = {
  translateIndex: number;
  data: TTranslate;
  containerStyle: StyleProp<ViewStyle>;
  inputStyle: StyleProp<ViewStyle>;
  removeIcon: boolean;
  onUpdateDataTranslate: (value: string) => void;
  onUpdateDataContext: (value: string, contextIndex: number) => void;
  onLayout: () => void;
  removeGroup: () => void;
  addContext: () => void;
  removeContext: (contextIndex: number) => void;
}
export function Translate({
  translateIndex,
  data,
  containerStyle,
  inputStyle,
  removeIcon,
  onUpdateDataTranslate,
  onUpdateDataContext,
  onLayout,
  removeGroup,
  addContext,
  removeContext,
}: TTranslateProps): JSX.Element {
  return (
    <View style={containerStyle}>
      <Input
        style={inputStyle}
        label="Перевод"
        placeholder="Введите перевод"
        value={data.value}
        onChangeText={translate => onUpdateDataTranslate(translate)}
        onLayout={() => onLayout()}
        icon={
          removeIcon ? {
            type: IconsStrings.remove,
            style: {
              position: 'absolute',
              right: '-12%',
              padding: 10,
            },
            onPress: () => removeGroup(),
          }
            : undefined
        }
      />

      {data.contexts &&
        data.contexts.map((context: TContext, contextIndex: number) => {
          return (
            <Input
              style={inputStyle}
              key={`context-${translateIndex}-${contextIndex}`}
              label="Контекст"
              placeholder="Добавьте контекст"
              value={context.value}
              onChangeText={context => onUpdateDataContext(context, contextIndex)}
              multiline={true}
              icon={{
                type: IconsStrings.cancel,
                style: {
                  fontSize: 24,
                  position: 'absolute',
                  right: '-12%',
                  padding: 10,
                  color: theme.textColor
                },
                onPress: () => removeContext(contextIndex),
              }}
            />
          )
        })}
      <Button
        title="Добавить контекст"
        onPress={() => addContext()}
      />
    </View>
  );
}

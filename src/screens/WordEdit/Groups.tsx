import React, { useEffect, useState } from 'react';
import { TWord, TGroup } from '../../types';
import { useQuery } from '../../store/RealmContext';
import Group from '../../store/models/Group';
import Word from '../../store/models/Word';
import { IndexPath, Select, SelectItem } from '@ui-kitten/components';

type IGroupsProps = {
  word: TWord | Word;
}

export function Groups({ word }: IGroupsProps): JSX.Element {
  const groupsList = useQuery(Group);
  const [multiSelectedIndex, setMultiSelectedIndex] = useState<IndexPath[]>(word?.groups?.map((group: Group) => {
    return new IndexPath(groupsList.indexOf(group));
  }) ?? []);

  return (
    <Select
      multiSelect={true}
      placeholder='Выберите группу'
      value={multiSelectedIndex.map(index => {
        return groupsList[index.row].name;
      }).join(', ')}
      selectedIndex={multiSelectedIndex}
      onSelect={(index: IndexPath[] | IndexPath) => setMultiSelectedIndex(index as IndexPath[])}
    >
      {groupsList.map((group, index) => (
        <SelectItem key={group._id.toString()} title={group.name} />
      ))}
    </Select>
  );
}

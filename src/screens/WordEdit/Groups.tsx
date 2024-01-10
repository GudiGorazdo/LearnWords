import React, { useEffect, useState } from 'react';
import { TWord, TGroup } from '../../types';
import { useQuery } from '../../store/RealmContext';
import Group from '../../store/models/Group';
import Word from '../../store/models/Word';
import { IndexPath, Select, SelectItem } from '@ui-kitten/components';

type IGroupsProps = {
  word: TWord | Word | null;
  onChange: (list: Group[]) => void;
}

export function Groups({ word, onChange }: IGroupsProps): JSX.Element {
  const groupsList = useQuery(Group);
  const [activeList, setActiveList] = useState<Group[]>(word?.groups ?? []);
  const [multiSelectedIndex, setMultiSelectedIndex] = useState<IndexPath[]>(word?.groups?.map((group: Group) => {
    return new IndexPath(groupsList.indexOf(group));
  }) ?? []);

  const syncActiveList = () => {
    // const activeIndexes = multiSelectedIndex.map(ind => ind.row);
    // const newList = groupsList.filter((group, index) => {
    //   return group && activeIndexes.includes(index);
    // });

    // const newList = multiSelectedIndex.map(index => index && groupsList[index[row]]);
    const newList = multiSelectedIndex.map(index => console.log(index));

    // setActiveList(newList);
  }

  return (
    <Select
      multiSelect={true}
      placeholder='Выберите группу'
      value={multiSelectedIndex.map(index => {
        return groupsList[index.row].name;
      }).join(', ')}
      selectedIndex={multiSelectedIndex}
      onSelect={(index: IndexPath[] | IndexPath) => {
        setMultiSelectedIndex(index as IndexPath[]);
        (index instanceof Array) && onChange(index.map(i => groupsList[i.row]));
      }}
    >
      {groupsList.map((group, index) => (
        <SelectItem key={group._id.toString()} title={group.name} />
      ))}
    </Select>
  );
}

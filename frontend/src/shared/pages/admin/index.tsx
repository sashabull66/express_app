import React from 'react';
import { useNavigate } from 'react-router-dom';
import { List } from '@alfalab/core-components/list';
import styles from './index.module.css';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <List tag="ul" marker="•">
      <List.Item>
        <div className={styles.listItem} onClick={(): void => navigate('users')}>
          Операции с пользователями
        </div>
      </List.Item>
      <List.Item>
        <div className={styles.listItem} onClick={(): void => navigate('todos')}>
          Операции с задачами
        </div>
      </List.Item>
      <List.Item>Пример элемента списка</List.Item>
      <List.Item>Пример элемента списка</List.Item>
      <List.Item>Пример элемента списка</List.Item>
    </List>
  );
};

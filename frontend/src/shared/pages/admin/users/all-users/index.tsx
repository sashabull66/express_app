import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { GetAllUsers } from '../../../../../store/admin/action-creators';
import { Button } from '@alfalab/core-components/button';

export const AllUsers: React.FC = () => {
  const { users, error } = useAppSelector((s) => s.admin);
  const dispatch = useAppDispatch();
  const onClickHandler = (): void => {
    dispatch(GetAllUsers());
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (users?.length) {
    return (
      <div>
        {users.map((usr) => (
          <div
            key={usr._id}
          >{`role: ${usr.role}, name: ${usr.name}, email: ${usr.email}, ID: ${usr._id}`}</div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <Button onClick={onClickHandler}>Get users list</Button>
    </div>
  );
};

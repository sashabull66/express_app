import React, { useState } from 'react';
import { Input } from '@alfalab/core-components/input';
import { Button } from '@alfalab/core-components/button';
import { useAppDispatch } from '../../../../../store';
import { RemoveUser } from '../../../../../store/admin/action-creators';

export const RemoveUserForm = () => {
  const dispatch = useAppDispatch();

  const [id, setId] = useState('');

  const onSubmitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    dispatch(RemoveUser(id));
    setId('');
  };

  return (
    <form onSubmit={onSubmitHandler}>
      <Input
        value={id}
        required={true}
        type={'text'}
        block={true}
        label="User id"
        size="xl"
        onChange={(e) => setId(e.target.value)}
      />
      <Button type="submit">Delete</Button>
    </form>
  );
};

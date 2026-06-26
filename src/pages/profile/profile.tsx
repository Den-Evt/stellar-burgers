import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  getUserSelector,
  getUserErrorSelector
} from '../../services/selectors/user';
import { updateUser } from '../../services/slices/user-slice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUserSelector);
  const error = useSelector(getUserErrorSelector);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // Валидация пароля
    if (formValue.password && formValue.password.length < 6) {
      setValidationError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setValidationError('');

    const updateData: { name?: string; email?: string; password?: string } = {};
    if (formValue.name !== user?.name) updateData.name = formValue.name;
    if (formValue.email !== user?.email) updateData.email = formValue.email;
    if (formValue.password) updateData.password = formValue.password;

    if (Object.keys(updateData).length > 0) {
      dispatch(updateUser(updateData))
        .unwrap()
        .then(() => {
          setValidationError('');
        });
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
    setValidationError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));

    // Очищаем ошибку валидации при изменении пароля
    if (e.target.name === 'password') {
      setValidationError('');
    }
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={validationError || error}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};

import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { registerUser, clearError } from '../../services/slices/user-slice';
import { getUserErrorSelector } from '../../services/selectors/user';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const error = useSelector(getUserErrorSelector);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // Клиентская валидация
    if (password.length < 6) {
      return;
    }

    dispatch(clearError());
    dispatch(registerUser({ name: userName, email, password })).then(
      (result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          const from = location.state?.from || { pathname: '/' };
          navigate(from.pathname || '/');
        }
      }
    );
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};

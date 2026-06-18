import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getProfileOrders } from '../../services/slices/profile-orders-slice';
import {
  getProfileOrdersSelector,
  getProfileOrdersLoadingSelector
} from '../../services/selectors/profile-orders';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getProfileOrdersSelector);
  const isLoading = useSelector(getProfileOrdersLoadingSelector);

  useEffect(() => {
    dispatch(getProfileOrders());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};

import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const ProtectedRoute = React.memo(({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && allowedRoles && !allowedRoles.includes(user.role)) {
      if (user.role === 'customer') {
        toast.error('Bu panele erişim yetkiniz yok.');
      } else {
        toast.error('Bu işlem için yetkiniz yok.');
      }
    }
  }, [user, allowedRoles]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'customer') {
      return <Navigate to="/customer" replace />;
    } else {
      return <Navigate to="/user" replace />;
    }
  }

  return children;
});

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;

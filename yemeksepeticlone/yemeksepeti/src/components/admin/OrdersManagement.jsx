import React from 'react';
import OrdersTable from './OrdersTable';

const OrdersManagement = React.memo(({ orders, onStatusChange }) => {
  return (
    <div className="space-y-4">
      <div className="text-left">
        <h3 className="text-xl font-bold text-white">Sipariş Yönetimi</h3>
        <p className="text-gray-400 text-xs mt-1">Sistemdeki tüm siparişlerin durumlarını anlık olarak güncelleyin.</p>
      </div>
      <OrdersTable orders={orders} onStatusChange={onStatusChange} />
    </div>
  );
});

OrdersManagement.displayName = 'OrdersManagement';

export default OrdersManagement;

import React from 'react';
import DataTable from '../common/DataTable';

const OrdersTable = React.memo(({ orders, onStatusChange }) => {
  const columns = [
    { header: 'Sipariş ID', key: 'id' },
    { header: 'Müşteri', key: 'customerName' },
    { header: 'Restoran', key: 'restaurantName' },
    {
      header: 'Tutar',
      key: 'totalPrice',
      render: (item) => <strong className="text-white font-bold">{item.totalPrice} TL</strong>,
    },
    {
      header: 'Durum',
      key: 'status',
      render: (item) => (
        <select
          value={item.status}
          onChange={(e) => onStatusChange(item.id, e.target.value)}
          className="bg-[#0B0B0F] border border-[#2e303a] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#7A1E2C] font-semibold"
        >
          <option value="Hazırlanıyor">Hazırlanıyor</option>
          <option value="Yolda">Yolda</option>
          <option value="Teslim edildi">Teslim edildi</option>
          <option value="İptal edildi">İptal edildi</option>
        </select>
      ),
    },
    { header: 'Tarih', key: 'date' },
  ];

  return (
    <DataTable
      columns={columns}
      data={orders}
      searchPlaceholder="Müşteri veya restoran ara..."
      filterKey="customerName"
    />
  );
});

OrdersTable.displayName = 'OrdersTable';

export default OrdersTable;

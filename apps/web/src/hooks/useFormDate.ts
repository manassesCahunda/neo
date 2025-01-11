interface Transaction {
  expiryDate?: string | null;
  typeInvoice?: string | null;
  unitPrice?: number | null;
  amount?: number | null;
  total?: number | null;
  totalIva?: number | null;
  balanceTotal?: number | null;
  userId?: string | null;
  idFile?: string | null;
  name?: string | null;
}


export const formatData = (data: Transaction[]): Transaction[] => {
  return data.map(item => {
    const formattedItem: Transaction = { ...item };

    const formatValue = (value: any): string => {
      if (value === null || value === undefined) {
        return 'N/A';
      }
      if (typeof value === 'object' && Object.keys(value).length > 0) {
        return Object.values(value).join(', ');
      }
      if (typeof value === 'object' && Object.keys(value).length === 0) {
        return 'N/A';
      }
      return String(value);
    };

    formattedItem.expiryDate = formatValue(item.expiryDate);
    formattedItem.typeInvoice = formatValue(item.typeInvoice);
    formattedItem.unitPrice = formatValue(item.unitPrice);
    formattedItem.amount = formatValue(item.amount);
    formattedItem.total = formatValue(item.total);
    formattedItem.totalIva = formatValue(item.totalIva);
    formattedItem.balanceTotal = formatValue(item.balanceTotal);
    formattedItem.userId = formatValue(item.userId);
    formattedItem.idFile = formatValue(item.idFile);
    formattedItem.name = formatValue(item.name);
    return formattedItem;
  });
};
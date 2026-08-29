import { useState } from 'react';

export function useRupiahInput(initialValue: string = '') {
  const numericOnly = initialValue.replace(/[^0-9]/g, '');
  const initialFormatted = numericOnly ? `Rp ${parseInt(numericOnly, 10).toLocaleString('id-ID')}` : '';

  const [value, setValue] = useState(initialFormatted);
  const [rawValue, setRawValue] = useState(numericOnly);

  const onChangeText = (text: string) => {
    // Hanya ambil angka dari input
    const numericOnly = text.replace(/[^0-9]/g, '');
    setRawValue(numericOnly);

    if (!numericOnly) {
      setValue('');
      return;
    }

    // Format ke dalam bentuk ribuan (contoh: 1.500.000)
    const formatted = parseInt(numericOnly, 10).toLocaleString('id-ID');
    setValue(`Rp ${formatted}`);
  };

  const reset = () => {
    setValue('');
    setRawValue('');
  };

  return { value, rawValue, onChangeText, reset };
}

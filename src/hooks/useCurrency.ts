
import { useState, useCallback } from 'react';

export function useCurrency(initialValue: string = '') {
  const [displayValue, setDisplayValue] = useState(initialValue);
  const [numericValue, setNumericValue] = useState(0);

  const formatCurrency = useCallback((value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    if (!numbers) {
      return '';
    }

    // Converte para número e divide por 100 para ter os centavos
    const amount = parseFloat(numbers) / 100;
    
    // Formata para moeda brasileira
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(amount);
  }, []);

  const handleChange = useCallback((value: string) => {
    const formatted = formatCurrency(value);
    setDisplayValue(formatted);
    
    // Remove caracteres de formatação para ter apenas números
    const numbers = value.replace(/\D/g, '');
    const numeric = numbers ? parseFloat(numbers) / 100 : 0;
    setNumericValue(numeric);
  }, [formatCurrency]);

  const setValue = useCallback((value: number) => {
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(value);
    
    setDisplayValue(formatted);
    setNumericValue(value);
  }, []);

  const reset = useCallback(() => {
    setDisplayValue('');
    setNumericValue(0);
  }, []);

  return {
    displayValue,
    numericValue,
    handleChange,
    setValue,
    reset
  };
}

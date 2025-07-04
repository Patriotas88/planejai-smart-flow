
import { useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useFormatCurrency } from './useFormatCurrency';
import { useApp } from '@/contexts/AppContext';
import { getCurrentLocalDate } from '@/lib/dateUtils';

export function useExportPDF() {
  const { formatCurrency } = useFormatCurrency();
  const { accountType } = useApp();

  const exportToPDF = useCallback(async (
    totalIncome: number,
    totalExpense: number,
    balance: number,
    transactions: any[]
  ) => {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // Título
      pdf.setFontSize(20);
      pdf.text(`Relatório Financeiro ${accountType === 'personal' ? 'Pessoal' : 'Empresarial'}`, 20, 30);
      
      // Data
      pdf.setFontSize(12);
      pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 45);
      
      // Resumo
      pdf.setFontSize(16);
      pdf.text('Resumo Financeiro', 20, 65);
      
      pdf.setFontSize(12);
      pdf.text(`Total de Receitas: ${formatCurrency(totalIncome)}`, 20, 80);
      pdf.text(`Total de Despesas: ${formatCurrency(totalExpense)}`, 20, 95);
      pdf.text(`Saldo Total: ${formatCurrency(balance)}`, 20, 110);
      
      // Transações Recentes
      if (transactions.length > 0) {
        pdf.setFontSize(16);
        pdf.text('Transações Recentes', 20, 135);
        
        let yPosition = 150;
        const recentTransactions = transactions.slice(0, 10); // Últimas 10 transações
        
        recentTransactions.forEach((transaction, index) => {
          if (yPosition > 250) {
            pdf.addPage();
            yPosition = 30;
          }
          
          pdf.setFontSize(10);
          const date = new Date(transaction.date).toLocaleDateString('pt-BR');
          const amount = `${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}`;
          const text = `${date} - ${transaction.title} - ${amount}`;
          
          pdf.text(text, 20, yPosition);
          yPosition += 15;
        });
      }
      
      // Capturar gráficos se existirem
      const chartElements = document.querySelectorAll('.recharts-wrapper');
      if (chartElements.length > 0) {
        pdf.addPage();
        pdf.setFontSize(16);
        pdf.text('Gráficos', 20, 30);
        
        let chartY = 50;
        for (const chartElement of Array.from(chartElements)) {
          try {
            const canvas = await html2canvas(chartElement as HTMLElement, {
              backgroundColor: '#1e293b',
              scale: 0.5
            });
            
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 150;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            if (chartY + imgHeight > 250) {
              pdf.addPage();
              chartY = 30;
            }
            
            pdf.addImage(imgData, 'PNG', 20, chartY, imgWidth, imgHeight);
            chartY += imgHeight + 20;
          } catch (error) {
            console.error('Erro ao capturar gráfico:', error);
          }
        }
      }
      
      // Salvar PDF
      const fileName = `relatorio-${accountType}-${getCurrentLocalDate()}.pdf`;
      pdf.save(fileName);
      
      return true;
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
    }
  }, [formatCurrency, accountType]);

  return { exportToPDF };
}

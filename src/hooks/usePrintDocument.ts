
import { useCallback } from 'react';

export interface PrintOptions {
  title: string;
  styles?: string;
  onBeforePrint?: () => void;
  onAfterPrint?: () => void;
}

export const usePrintDocument = () => {
  const printElement = useCallback((
    element: HTMLElement | string,
    options: PrintOptions
  ) => {
    const { title, styles = '', onBeforePrint, onAfterPrint } = options;
    
    // Chamar callback antes da impressão
    onBeforePrint?.();
    
    // Obter o conteúdo para impressão
    const content = typeof element === 'string' 
      ? element 
      : element.outerHTML;
    
    // Criar janela de impressão
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      console.error('Não foi possível abrir a janela de impressão');
      onAfterPrint?.();
      return;
    }
    
    // HTML da página de impressão
    const printHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <meta charset="utf-8">
          <style>
            /* Reset básico */
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px;
              line-height: 1.4;
            }
            
            /* Estilos para impressão */
            @media print {
              body { margin: 0; }
              .page-break-after { page-break-after: always; }
              .no-print { display: none !important; }
            }
            
            /* Estilos personalizados */
            ${styles}
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `;
    
    // Escrever conteúdo e imprimir
    printWindow.document.write(printHTML);
    printWindow.document.close();
    
    // Aguardar carregamento e imprimir
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        onAfterPrint?.();
      }, 250);
    };
  }, []);

  const printFromSelector = useCallback((
    selector: string,
    options: PrintOptions
  ) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (!element) {
      console.error(`Elemento com seletor "${selector}" não encontrado`);
      return;
    }
    printElement(element, options);
  }, [printElement]);

  return {
    printElement,
    printFromSelector
  };
};

/**
 * SPARKLLEX EXPORT UTILITIES
 * 
 * Provides export functionality for CSV, PDF, and XLSX formats
 * Used in dashboard, history, and operations pages
 */

// ==========================================
// CSV EXPORT
// ==========================================

/**
 * Export data to CSV format
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 * @param {Array} columns - Optional array of column names to include
 */
function exportToCSV(data, filename = 'sparkllex_export', columns = null) {
    if (!data || data.length === 0) {
        alert('No hay datos para exportar / No data to export');
        return;
    }
    
    try {
        // Determine columns
        const allColumns = columns || Object.keys(data[0]);
        
        // Create CSV header
        const csvHeader = allColumns.join(',') + '\n';
        
        // Create CSV rows
        const csvRows = data.map(row => {
            return allColumns.map(col => {
                let value = row[col] || '';
                // Escape commas and quotes
                if (typeof value === 'string') {
                    value = value.replace(/"/g, '""'); // Escape quotes
                    if (value.includes(',') || value.includes('\n') || value.includes('"')) {
                        value = `"${value}"`;
                    }
                }
                return value;
            }).join(',');
        }).join('\n');
        
        const csvContent = csvHeader + csvRows;
        
        // Download
        downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
        
        console.log(`✓ Exported ${data.length} rows to CSV`);
        
    } catch (error) {
        console.error('CSV export error:', error);
        alert('Error al exportar CSV / CSV export error');
    }
}

/**
 * Export table data to CSV directly from HTML table
 * @param {string} tableId - ID of the HTML table element
 * @param {string} filename - Name of the file
 */
function exportTableToCSV(tableId, filename = 'table_export') {
    try {
        const table = document.getElementById(tableId);
        if (!table) {
            alert('Tabla no encontrada / Table not found');
            return;
        }
        
        let csv = [];
        const rows = table.querySelectorAll('tr');
        
        rows.forEach(row => {
            const cols = row.querySelectorAll('td, th');
            const csvRow = Array.from(cols).map(col => {
                let text = col.textContent.trim();
                // Escape commas and quotes
                text = text.replace(/"/g, '""');
                if (text.includes(',') || text.includes('\n')) {
                    text = `"${text}"`;
                }
                return text;
            });
            csv.push(csvRow.join(','));
        });
        
        downloadFile(csv.join('\n'), `${filename}.csv`, 'text/csv;charset=utf-8;');
        
        console.log(`✓ Exported table to CSV`);
        
    } catch (error) {
        console.error('Table CSV export error:', error);
        alert('Error al exportar CSV / CSV export error');
    }
}

// ==========================================
// PDF EXPORT
// ==========================================

/**
 * Export data to PDF format (requires jsPDF library)
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file
 * @param {string} title - Title for the PDF document
 */
function exportToPDF(data, filename = 'sparkllex_export', title = 'Sparkllex Report') {
    // Check if jsPDF is loaded
    if (typeof window.jspdf === 'undefined') {
        console.warn('jsPDF library not loaded. Loading from CDN...');
        
        // Dynamically load jsPDF
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => {
            exportToPDF(data, filename, title); // Retry after loading
        };
        script.onerror = () => {
            alert('Error al cargar librería PDF / Error loading PDF library');
        };
        document.head.appendChild(script);
        return;
    }
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(18);
        doc.setTextColor(0, 128, 128); // Teal color
        doc.text(title, 20, 20);
        
        // Add date
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Fecha / Date: ${new Date().toLocaleDateString()}`, 20, 30);
        
        // Add data
        doc.setFontSize(12);
        doc.setTextColor(0);
        
        let yPosition = 45;
        const lineHeight = 8;
        const pageHeight = doc.internal.pageSize.height;
        
        if (data && data.length > 0) {
            data.forEach((item, index) => {
                // Check if we need a new page
                if (yPosition > pageHeight - 20) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                // Format item data
                const itemText = Object.entries(item)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(' | ');
                
                doc.text(`${index + 1}. ${itemText}`, 20, yPosition);
                yPosition += lineHeight;
            });
        } else {
            doc.text('No hay datos para mostrar / No data to display', 20, yPosition);
        }
        
        // Add footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(
                `© 2026 Sparkllex - Página ${i} de ${pageCount}`,
                doc.internal.pageSize.width / 2,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }
        
        // Save PDF
        doc.save(`${filename}.pdf`);
        
        console.log(`✓ Exported to PDF: ${filename}.pdf`);
        
    } catch (error) {
        console.error('PDF export error:', error);
        alert('Error al exportar PDF / PDF export error');
    }
}

// ==========================================
// XLSX EXPORT (Excel)
// ==========================================

/**
 * Export data to XLSX format (requires SheetJS library)
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file
 * @param {string} sheetName - Name of the worksheet
 */
function exportToXLSX(data, filename = 'sparkllex_export', sheetName = 'Data') {
    // Check if XLSX library is loaded
    if (typeof XLSX === 'undefined') {
        console.warn('SheetJS library not loaded. Loading from CDN...');
        
        // Dynamically load SheetJS
        const script = document.createElement('script');
        script.src = 'https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js';
        script.onload = () => {
            exportToXLSX(data, filename, sheetName); // Retry after loading
        };
        script.onerror = () => {
            alert('Error al cargar librería Excel / Error loading Excel library');
        };
        document.head.appendChild(script);
        return;
    }
    
    try {
        if (!data || data.length === 0) {
            alert('No hay datos para exportar / No data to export');
            return;
        }
        
        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);
        
        // Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        
        // Generate and download
        XLSX.writeFile(workbook, `${filename}.xlsx`);
        
        console.log(`✓ Exported to XLSX: ${filename}.xlsx`);
        
    } catch (error) {
        console.error('XLSX export error:', error);
        alert('Error al exportar Excel / Excel export error');
    }
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Generic file download function
 */
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

/**
 * Format date for export
 */
function formatDateForExport(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

/**
 * Prepare dashboard data for export
 */
function prepareDashboardDataForExport() {
    // This should be called from the dashboard page
    // Returns structured data ready for export
    
    const userData = JSON.parse(localStorage.getItem('sparkllex_user') || '{}');
    
    return {
        memberInfo: {
            name: userData.name || 'N/A',
            email: userData.email || 'N/A',
            plan: userData.plan || 'N/A',
            memberSince: userData.loginTime || new Date().toISOString()
        },
        exportDate: new Date().toISOString(),
        exportedBy: userData.name || 'User'
    };
}

// ==========================================
// EXPORT INTERFACE
// ==========================================

/**
 * Universal export function - detects format and exports accordingly
 * @param {Array} data - Data to export
 * @param {string} format - 'csv', 'pdf', or 'xlsx'
 * @param {string} filename - Base filename
 * @param {object} options - Additional options (title, sheetName, etc.)
 */
function exportData(data, format, filename = 'sparkllex_export', options = {}) {
    const currentLang = localStorage.getItem('sparkllex_language') || 'es';
    const exportingMsg = currentLang === 'es' ? 'Exportando...' : 'Exporting...';
    
    console.log(`${exportingMsg} ${format.toUpperCase()}`);
    
    switch (format.toLowerCase()) {
        case 'csv':
            exportToCSV(data, filename, options.columns);
            break;
        case 'pdf':
            exportToPDF(data, filename, options.title || 'Sparkllex Report');
            break;
        case 'xlsx':
        case 'excel':
            exportToXLSX(data, filename, options.sheetName || 'Data');
            break;
        default:
            alert(`Formato no soportado / Unsupported format: ${format}`);
    }
}

// ==========================================
// EXPORT FOR USE IN HTML
// ==========================================

if (typeof window !== 'undefined') {
    window.SparkllexExport = {
        exportToCSV,
        exportTableToCSV,
        exportToPDF,
        exportToXLSX,
        exportData,
        formatDateForExport,
        prepareDashboardDataForExport
    };
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        exportToCSV,
        exportTableToCSV,
        exportToPDF,
        exportToXLSX,
        exportData,
        formatDateForExport,
        prepareDashboardDataForExport
    };
}

console.log('%c SPARKLLEX Export Utilities Loaded', 'color: #008080; font-size: 12px; font-weight: bold;');
console.log('%c Supported formats: CSV, PDF, XLSX', 'color: #666; font-size: 10px;');

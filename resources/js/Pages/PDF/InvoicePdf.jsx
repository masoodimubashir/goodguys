import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Color Scheme
const colors = {
  primary: '#2c3e50', // Navy Blue
  secondary: '#27ae60', // Green
  accent: '#e67e22', // Orange
  lightBg: '#f8f9fa', // Light Gray
  border: '#dfe6e9', // Light Border
  textDark: '#2d3436', // Dark Text
  textLight: '#636e72' // Gray Text
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    position: 'relative'
  },
  header: {
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 15
  },
  companyInfo: {
    flex: 1
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5
  },
  companyDetails: {
    fontSize: 9,
    color: colors.textLight,
    lineHeight: 1.4
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.secondary,
    textAlign: 'right'
  },
  invoiceInfo: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: colors.lightBg,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  column: {
    width: '48%'
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  label: {
    fontSize: 9,
    color: colors.textLight,
    fontWeight: 'bold'
  },
  value: {
    fontSize: 9,
    color: colors.textDark
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  table: {
    width: '100%',
    marginBottom: 20
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 5
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 6,
    paddingHorizontal: 5,
    minHeight: 25
  },
  col1: { width: '8%', fontSize: 8, paddingRight: 3, color: 'white' },
  col2: { width: '25%', fontSize: 8, paddingRight: 3, color: 'white' },
  col3: { width: '12%', fontSize: 8, paddingRight: 3, color: 'white' },
  col4: { width: '10%', fontSize: 8, paddingRight: 3, textAlign: 'right', color: 'white' },
  col5: { width: '12%', fontSize: 8, paddingRight: 3, textAlign: 'right', color: 'white' },
  col6: { width: '12%', fontSize: 8, paddingRight: 3, textAlign: 'right', color: 'white' },
  col7: { width: '21%', fontSize: 8, color: 'white' },
  dataCol1: { width: '8%', fontSize: 8, paddingRight: 3 },
  dataCol2: { width: '25%', fontSize: 8, paddingRight: 3 },
  dataCol3: { width: '12%', fontSize: 8, paddingRight: 3 },
  dataCol4: { width: '10%', fontSize: 8, paddingRight: 3, textAlign: 'right' },
  dataCol5: { width: '12%', fontSize: 8, paddingRight: 3, textAlign: 'right' },
  dataCol6: { width: '12%', fontSize: 8, paddingRight: 3, textAlign: 'right' },
  totalsSection: {
    width: '100%',
    marginBottom: 20
  },
  totalsHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 5
  },
  totalsRow: {
    flexDirection: 'row',
    backgroundColor: colors.lightBg,
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  totalsLabelCol: {
    width: '70%',
    fontSize: 9,
    textAlign: 'right',
    paddingRight: 10,
    color: 'white'
  },
  totalsValueCol: {
    width: '30%',
    fontSize: 9,
    textAlign: 'right',
    fontWeight: 'bold',
    color: 'white'
  },
  totalsDataLabelCol: {
    width: '70%',
    fontSize: 9,
    textAlign: 'right',
    paddingRight: 10
  },
  totalsDataValueCol: {
    width: '30%',
    fontSize: 9,
    textAlign: 'right',
    fontWeight: 'bold'
  },
  grandTotalRow: {
    backgroundColor: colors.lightBg,
    fontWeight: 'bold'
  },
  bankDetailsSection: {
    marginTop: 30,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    backgroundColor: colors.lightBg
  },
  bankDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  bankDetailsColumn: {
    width: '48%'
  },
  bankInfoItem: {
    flexDirection: 'row',
    marginBottom: 4
  },
  bankInfoLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    width: '40%',
    color: colors.textLight
  },
  bankInfoValue: {
    fontSize: 9,
    width: '60%',
    color: colors.textDark
  },
  signatureSection: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  signatureBox: {
    width: '45%',
    textAlign: 'center'
  },
  signatureImage: {
    width: 100,
    height: 50,
    marginBottom: 5
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 5
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: colors.textLight,
    textAlign: 'center',
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: 10
  },
  watermark: {
    position: 'absolute',
    opacity: 0.05,
    fontSize: 60,
    color: colors.primary,
    transform: 'rotate(-45deg)',
    left: 150,
    top: 400,
    zIndex: -1
  },
  grandTotalBox: {
    backgroundColor: colors.primary,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  grandTotalText: {
    color: 'white',
    fontWeight: 'bold'
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: colors.primary
  },
  taxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingVertical: 3
  }
});

const Header = ({ company_profile }) => (
  <View style={styles.header}>
    <View style={styles.logoSection}>
      {company_profile?.logo && (
        <Image style={styles.logo} src={`/storage/${company_profile.logo}`} />
      )}
      <View style={styles.companyInfo}>
        <Text style={styles.companyName}>
          {company_profile?.company_name || 'Company Name'}
        </Text>
        <Text style={styles.companyDetails}>
          {company_profile?.company_address || 'Company Address'}{'\n'}
          Phone: {company_profile?.company_contact_no || 'N/A'}{'\n'}
          Email: {company_profile?.company_email || 'N/A'}
        </Text>
      </View>
    </View>
    <View>
      <Text style={styles.invoiceTitle}>INVOICE</Text>
    </View>
  </View>
);

const BankDetails = ({ bankAccount }) => {
  if (!bankAccount) return null;

  return (
    <View style={styles.bankDetailsSection}>
      <Text style={styles.sectionTitle}>Bank Details</Text>
      <View style={styles.bankDetailsRow}>
        <View style={styles.bankDetailsColumn}>
          <View style={styles.bankInfoItem}>
            <Text style={styles.bankInfoLabel}>Bank Name:</Text>
            <Text style={styles.bankInfoValue}>{bankAccount.bank_name}</Text>
          </View>
          <View style={styles.bankInfoItem}>
            <Text style={styles.bankInfoLabel}>Account Number:</Text>
            <Text style={styles.bankInfoValue}>{bankAccount.account_number}</Text>
          </View>
          <View style={styles.bankInfoItem}>
            <Text style={styles.bankInfoLabel}>Account Holder:</Text>
            <Text style={styles.bankInfoValue}>{bankAccount.holder_name}</Text>
          </View>
          <View style={styles.bankInfoItem}>
            <Text style={styles.bankInfoLabel}>IFSC Code:</Text>
            <Text style={styles.bankInfoValue}>{bankAccount.ifsc_code}</Text>
          </View>
        </View>
        <View style={styles.bankDetailsColumn}>
          <View style={styles.bankInfoItem}>
            <Text style={styles.bankInfoLabel}>Branch Code:</Text>
            <Text style={styles.bankInfoValue}>{bankAccount.branch_code}</Text>
          </View>
          <View style={styles.bankInfoItem}>
            <Text style={styles.bankInfoLabel}>UPI ID:</Text>
            <Text style={styles.bankInfoValue}>{bankAccount.upi_address}</Text>
          </View>
          <View style={styles.bankInfoItem}>
            <Text style={styles.bankInfoLabel}>SWIFT Code:</Text>
            <Text style={styles.bankInfoValue}>{bankAccount.swift_code}</Text>
          </View>
          <View style={styles.bankInfoItem}>
            <Text style={styles.bankInfoLabel}>Tax Number:</Text>
            <Text style={styles.bankInfoValue}>{bankAccount.tax_number}</Text>
          </View>
        </View>
      </View>
      {bankAccount.qr_code_image && (
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Image
            style={{ width: 100, height: 100, borderWidth: 1, borderColor: colors.border }}
            src={`/storage/${bankAccount.qr_code_image}`}
          />
          <Text style={{ fontSize: 8, marginTop: 5 }}>Scan to Pay</Text>
        </View>
      )}
    </View>
  );
};

const SignatureSection = ({ bankAccount }) => (
  <View style={styles.signatureSection}>
    <View style={styles.signatureBox}>
      {bankAccount?.signiture_image && (
        <Image
          style={styles.signatureImage}
          src={`/storage/${bankAccount.signiture_image}`}
        />
      )}
      <Text style={styles.signatureLine}>Authorized Signature</Text>
    </View>
    <View style={styles.signatureBox}>
      {bankAccount?.company_stamp_image && (
        <Image
          style={styles.signatureImage}
          src={`/storage/${bankAccount?.company_stamp_image}`}
        />
      )}
      <Text style={styles.signatureLine}>Company Stamp</Text>
    </View>
  </View>
);

export const InvoicePdf = ({ client, CompanyProfile, data }) => {
  const currentDate = new Date().toLocaleDateString();
  const invoice = data || {};
  
  // Process invoice data
  const invoiceItems = invoice.products || [];
  let hasVisiblePrices = false;

  let grandSubtotal = 0;
  let grandTotalTax = 0;
  let grandServiceCharge = 0;

  // Flatten all items into a single array
  const allItems = [];
  let serialNo = 1;

  invoiceItems.forEach(product => {
    (product.invoices || []).forEach(item => {
      const quantity = parseFloat(item.count) || 0;
      const price = parseFloat(item.price) || 0;
      const taxRate = parseFloat(item.tax) || 0;
      const serviceRate = parseFloat(item.service_charge) || 0;
      const isVisible = item.is_price_visible;
      
      const itemTotal = quantity * price;
      const itemTax = (itemTotal * taxRate) / 100;
      const itemService = (itemTotal * serviceRate) / 100;
      
      if (isVisible) {
        hasVisiblePrices = true;
        grandSubtotal += itemTotal;
        grandTotalTax += itemTax;
        grandServiceCharge += itemService;
      }

      // Parse dimensions if available
      let dimensions = [];
      try {
        dimensions = JSON.parse(item.additional_description || '[]');
      } catch (e) {
        dimensions = [];
      }

      allItems.push({
        serialNo: serialNo++,
        productName: product.product_name,
        itemName: item.item_name,
        description: item.description,
        dimensions,
        quantity,
        price,
        taxRate,
        serviceRate,
        itemTotal,
        itemTax,
        itemService,
        is_price_visible: isVisible,
        remarks: item.narration || '-'
      });
    });
  });

  const grandTotal = grandSubtotal + grandTotalTax + grandServiceCharge;
  const formattedDate = invoice.created_at 
    ? new Date(invoice.created_at).toLocaleDateString() 
    : currentDate;

  return (
    <Document>
      {/* Main Invoice Page */}
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <Text style={styles.watermark}>INVOICE</Text>

        {/* Header */}
        <Header company_profile={CompanyProfile} />

        {/* Invoice Number */}
        <Text style={[styles.value, { textAlign: 'right', fontSize: 10, marginBottom: 10 }]}>
          No: {invoice.invoice_number || 'N/A'}
        </Text>

        {/* Client and Invoice Information */}
        <View style={styles.invoiceInfo}>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Bill To:</Text>
            <Text style={[styles.value, { fontSize: 11, marginBottom: 3, fontWeight: 'bold' }]}>
              {client?.client_name || 'Client Name'}
            </Text>
            <Text style={styles.value}>{client?.client_address || 'Client Address'}</Text>
            <Text style={styles.value}>
              Phone: {client?.client_phone || 'N/A'}
            </Text>
            <Text style={styles.value}>
              Email: {client?.client_email || 'N/A'}
            </Text>
            <Text style={[styles.value, { marginTop: 5 }]}>
              Site Name: {client?.site_name || 'N/A'}
            </Text>
            <Text style={styles.value}>
              Client Type: {client?.client_type || 'N/A'}
            </Text>
          </View>
          <View style={styles.column}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Invoice Date:</Text>
              <Text style={styles.value}>{formattedDate}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Reference No:</Text>
              <Text style={styles.value}>{invoice.reference_number || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Due Date:</Text>
              <Text style={styles.value}>
                {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Prepared By:</Text>
              <Text style={styles.value}>{CompanyProfile?.company_name || 'Company'}</Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>S.No</Text>
            <Text style={styles.col2}>ITEM</Text>
            <Text style={styles.col3}>DESCRIPTION</Text>
            <Text style={styles.col4}>QTY</Text>
            {hasVisiblePrices && (
              <>
                <Text style={styles.col5}>PRICE</Text>
                <Text style={styles.col6}>TOTAL</Text>
              </>
            )}
          </View>

          {allItems.map((item, itemIndex) => (
            <View
              style={[
                styles.tableRow,
                { backgroundColor: itemIndex % 2 === 0 ? '#fff' : colors.lightBg }
              ]}
              key={itemIndex}
            >
              <Text style={styles.dataCol1}>{item.serialNo}</Text>
              <Text style={styles.dataCol2}>
                {item.productName} - {item.itemName}
                {item.dimensions.length > 0 && (
                  <Text style={{ fontSize: 7, color: colors.textLight }}>
                    {"\n"}
                    {item.dimensions.map((dim, i) => (
                      <Text key={i}>
                        {dim.type}: {dim.value}{dim.si}
                        {i < item.dimensions.length - 1 ? ' | ' : ''}
                      </Text>
                    ))}
                  </Text>
                )}
              </Text>
              <Text style={styles.dataCol3}>{item.description || '-'}</Text>
              <Text style={styles.dataCol4}>{item.quantity}</Text>
              {item.is_price_visible && hasVisiblePrices && (
                <>
                  <Text style={styles.dataCol5}>₹{item.price.toFixed(2)}</Text>
                  <Text style={styles.dataCol6}>₹{item.itemTotal.toFixed(2)}</Text>
                </>
              )}
            </View>
          ))}
        </View>

        {/* Totals Section */}
        {hasVisiblePrices && (
          <View style={styles.totalsSection}>
            <View style={styles.totalsHeader}>
              <Text style={[styles.totalsLabelCol, { width: '70%' }]}>SUMMARY</Text>
              <Text style={[styles.totalsValueCol, { width: '30%' }]}>AMOUNT (₹)</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsDataLabelCol}>Subtotal:</Text>
              <Text style={styles.totalsDataValueCol}>{grandSubtotal.toFixed(2)}</Text>
            </View>
          
            
            <View style={[styles.totalsRow, { backgroundColor: colors.primary }]}>
              <Text style={[styles.totalsDataLabelCol, { color: 'white', fontWeight: 'bold' }]}>
                Grand Total:
              </Text>
              <Text style={[styles.totalsDataValueCol, { color: 'white', fontWeight: 'bold' }]}>
                {grandTotal.toFixed(2)}
              </Text>
            </View>
          </View>
        )}

     

      </Page>

      {/* Bank Details Page */}
      {client?.bank_account && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.watermark}>BANK DETAILS</Text>
          
          <View>
            <Text style={styles.pageTitle}>Bank Details & Authorization</Text>
            
            <BankDetails bankAccount={client.bank_account} />
            <SignatureSection bankAccount={client.bank_account} />
          </View>

          <View style={styles.footer}>
            <Text>Invoice generated on {currentDate} | {CompanyProfile?.company_name || 'Company Name'}</Text>
            <Text>Thank you for your business!</Text>
          </View>
        </Page>
      )}
    </Document>
  );
};
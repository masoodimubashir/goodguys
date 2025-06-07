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
    minHeight: 25,
    fontSize: 10
  },
  col1: { width: '8%', fontSize: 8, paddingRight: 3, color: 'white' },
  col2: { width: '20%', fontSize: 8, paddingRight: 3, color: 'white' },
  col3: { width: '20%', fontSize: 8, paddingRight: 3, color: 'white' }, // Increased description width
  col4: { width: '10%', fontSize: 8, paddingRight: 3, textAlign: 'right', color: 'white' },
  col5: { width: '12%', fontSize: 8, paddingRight: 3, textAlign: 'right', color: 'white' },
  col6: { width: '12%', fontSize: 8, paddingRight: 3, textAlign: 'right', color: 'white' },
  col7: { width: '18%', fontSize: 8, color: 'white' },

  dataCol1: { width: '8%', fontSize: 8, paddingRight: 3 },
  dataCol2: { width: '20%', fontSize: 8, paddingRight: 3 },
  dataCol3: { width: '20%', fontSize: 8, paddingRight: 3 }, // Match header
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








const Header = ({ company_profile, client }) => (
  <>
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
      <View style={styles.invoiceInfo}>
        <View style={styles.column}>
          <Text style={styles.sectionTitle}>Bill To:</Text>
          <Text style={[styles.value, { fontSize: 11, fontWeight: 'bold' }]}>
            {client?.client_name}
          </Text>
          <Text style={styles.value}>{client?.client_address}</Text>
          <Text style={styles.value}>Phone: {client?.client_phone}</Text>
          <Text style={styles.value}>Email: {client?.client_email}</Text>
          <Text style={[styles.value, { marginTop: 5 }]}>Client Type: {client?.client_type}</Text>
        </View>
      </View>
    </View>

  </>
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
        <Image style={styles.signatureImage} src={`/storage/${bankAccount.signiture_image}`} />
      )}
      <Text style={styles.signatureLine}>Authorized Signature</Text>
    </View>
    <View style={styles.signatureBox}>
      {bankAccount?.company_stamp_image && (
        <Image style={styles.signatureImage} src={`/storage/${bankAccount?.company_stamp_image}`} />
      )}
      <Text style={styles.signatureLine}>Company Stamp</Text>
    </View>
  </View>
);


export const InvoicePdf = ({ client, CompanyProfile, BankProfile }) => {
  const groupedModules = {};

  client?.invoice_refrences?.forEach(ref => {
    ref.invoices?.forEach(item => {
      const moduleName = item.invoice_module?.module_name || 'Uncategorized';
      if (!groupedModules[moduleName]) {
        groupedModules[moduleName] = [];
      }
      groupedModules[moduleName].push(item);
    });
  });

  const allItems = Object.entries(groupedModules).flatMap(([moduleName, items]) => [
    { isModuleHeader: true, moduleName },
    ...items,
  ]);

  const ITEMS_PER_PAGE = 20;
  const pages = [];
  for (let i = 0; i < allItems.length; i += ITEMS_PER_PAGE) {
    pages.push(allItems.slice(i, i + ITEMS_PER_PAGE));
  }

  let globalIndex = 0;
  let grandTotal = 0;

  return (
    <Document>
      {pages.map((itemsOnPage, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page} wrap>
          <Text style={styles.watermark}>PROFORMA</Text>
          <Header company_profile={CompanyProfile} client={client} />



          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.col1}>S.No</Text>
              <Text style={styles.col2}>Item</Text>
              <Text style={styles.col3}>Description</Text>
              <Text style={styles.col4}>Qty</Text>
              <Text style={styles.col5}>Price</Text>
              <Text style={styles.col6}>Total</Text>
            </View>
            {itemsOnPage.map((item, idx) => {
              if (item.isModuleHeader) {
                return (
                  <View key={`module-${item.moduleName}-${idx}`} style={styles.tableRow}>
                    <Text style={styles.moduleHeader}>
                      {item.moduleName}
                    </Text>
                  </View>
                );
              }

              const qty = parseFloat(item.count || 0);
              const price = parseFloat(item.price || 0);
              const isVisible = item.is_price_visible;
              const total = qty * price;
              grandTotal += total;
              let dimensions = [];
              try {
                dimensions = JSON.parse(item.additional_description || '[]');
              } catch { }

              globalIndex++;
              return (
                <View key={item.id || globalIndex} style={styles.tableRow}>
                  <Text style={styles.dataCol1}>{globalIndex}</Text>
                  <Text style={styles.dataCol2}>{item.item_name}</Text>
                  <Text style={styles.dataCol3}>
                    {item.description}
                    {dimensions.length > 0 && (
                      <Text>
                        {'\n'}
                        {dimensions.map((d, i) => (
                          <Text key={i}>
                            {d.type}: {d.value}{d.si}
                          </Text>
                        ))}
                      </Text>
                    )}
                  </Text>
                  <Text style={styles.dataCol4}>{qty}</Text>
                  <Text style={styles.dataCol5}>{isVisible ? price.toFixed(2) : '—'}</Text>
                  <Text style={styles.dataCol6}>{isVisible ? total.toFixed(2) : '—'}</Text>
                </View>
              );
            })}
          </View>

          {pageIndex === pages.length - 1 && (
            <View style={styles.totalsSection}>
              <View style={styles.totalsHeader}>
                <Text style={styles.totalsLabelCol}>SUMMARY</Text>
                <Text style={styles.totalsValueCol}>AMOUNT</Text>
              </View>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsDataLabelCol}>Grand Total:</Text>
                <Text style={styles.totalsDataValueCol}>{grandTotal.toFixed(2)}</Text>
              </View>
            </View>
          )}
        </Page>
      ))}

      <Page size="A4" style={styles.page}>
        <BankDetails bankAccount={BankProfile} />
        <SignatureSection bankAccount={BankProfile} />
      </Page>
    </Document>
  );
};






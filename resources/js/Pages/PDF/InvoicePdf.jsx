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

const FONT_SIZES = {
  small: 8,
  medium: 9,
  large: 10,
  xlarge: 12,
  xxlarge: 20,
  title: 28,
};

const styles = StyleSheet.create({
  page1: {
    paddingTop: '15%',
    paddingRight: 40,
    paddingBottom: 40,
    paddingLeft: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  lastpage: {
    paddingTop: '30%',
    paddingRight: 40,
    paddingBottom: 40,
    paddingLeft: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  page2: {
    paddingTop: 40,
    paddingRight: 40,
    paddingBottom: 40,
    paddingLeft: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    position: 'relative',
  },

  header: {
    marginBottom: 30,
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    flexDirection: 'column',
    alignItems: 'center',  
    justifyContent: 'center',  
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',  
  },
  logo: {
    width: 120,  
    height: 120,
    marginBottom: 15,
    borderRadius: 60,  
    borderWidth: 2,
    borderColor: colors.primary,
  },
  companyName: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,  
    textAlign: 'center',
    letterSpacing: 0.5,  
  },
  companyDetails: {
    fontSize: FONT_SIZES.medium,
    color: colors.textLight,
    lineHeight: 1.6,  
    textAlign: 'center',
    marginBottom: 5,  
  },
  clientInfo: {
    marginBottom: 25,
    padding: 20,  
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',  
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    fontSize: 10,
    alignItems: 'center' // ADD THIS LINE - centers all content vertically
  },
  col1: { width: '8%', fontSize: 8, paddingRight: 3, color: 'white' },
  col2: { width: '20%', fontSize: 8, paddingRight: 3, color: 'white' },
  col4: { width: '10%', fontSize: 8, paddingRight: 3, textAlign: 'left', color: 'white' },
  col5: { width: '12%', fontSize: 8, paddingRight: 3, textAlign: 'left', color: 'white' },
  col6: { width: '12%', fontSize: 8, paddingRight: 3, textAlign: 'left', color: 'white' },
  col3: { width: '20%', fontSize: 8, paddingRight: 3, color: 'white' }, // Increased description width


  // For your data columns, just add textAlignVertical:
  dataCol1: { width: '8%', fontSize: 8, paddingRight: 3, textAlignVertical: 'center' },
  dataCol2: { width: '20%', fontSize: 8, paddingRight: 3, textAlignVertical: 'center' },
  dataCol4: { width: '10%', fontSize: 8, paddingRight: 3, textAlign: 'left', textAlignVertical: 'center' },
  dataCol5: { width: '12%', fontSize: 8, paddingRight: 3, textAlign: 'left', textAlignVertical: 'center' },
  dataCol6: { width: '12%', fontSize: 8, paddingRight: 3, textAlign: 'left', textAlignVertical: 'center' },
  dataCol3: { width: '20%', fontSize: 8, paddingRight: 3, textAlign: 'left', textAlignVertical: 'center' },

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
  sectionTitle: {
    marginBottom: 10,
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
  },
  clientInfo: {
    marginBottom: 25,
    paddingBottom: 15,
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  moduleHeader: {
    fontSize: 12,
    marginBottom: 10,

  },
});


const Header = ({ company }) => (
  <View style={styles.header}>
    {company?.logo && <Image style={styles.logo} src={`/storage/${company.logo}`} />}
    <Text style={styles.companyName}>
      {company?.company_name || 'Company Name'}
    </Text>
    <View style={{ width: '100%', alignItems: 'center' }}>  {/* Added width and alignItems */}
      <Text style={styles.companyDetails}>
        {company?.company_address || 'Address'}
      </Text>
      <Text style={styles.companyDetails}>
        Contact: {company?.company_contact_no || 'N/A'} | Email: {company?.company_email || 'N/A'}
      </Text>
    </View>
  </View>
);

const ClientInfo = ({ client, data }) => (
  <View style={styles.clientInfo}>
    <Text style={[styles.companyName, { fontSize: FONT_SIZES.xlarge, marginBottom: 15 }]}>
      Estimate
    </Text>
    <View style={{ width: '100%' }}>
      <Text style={styles.companyDetails}>
        <Text style={{ fontWeight: 'bold' }}>Client:</Text> {client?.client_name}
      </Text>
      <Text style={styles.companyDetails}>
        <Text style={{ fontWeight: 'bold' }}>Address:</Text> {client?.client_address}
      </Text>
      <Text style={styles.companyDetails}>
        <Text style={{ fontWeight: 'bold' }}>Contact:</Text> {client?.client_phone} | {client?.client_email}
      </Text>
      <Text style={styles.companyDetails}>
        <Text style={{ fontWeight: 'bold' }}>Site Type:</Text> {client?.site_name}
      </Text>
      <Text style={[styles.companyDetails, { marginTop: 10 }]}>
        <Text style={{ fontWeight: 'bold' }}>Date:</Text> {new Date(data?.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </Text>
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
            <Text style={styles.bankInfoLabel}>UPI ID:</Text>
            <Text style={styles.bankInfoValue}>{bankAccount.upi_address}</Text>
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
      {bankAccount?.signature_image && (
        <Image style={styles.signatureImage} src={`/storage/${bankAccount.signature_image}`} />
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




export const InvoicePdf = ({ client, CompanyProfile, BankProfile, data }) => {
  const groupedModules = {};

  data.invoices?.forEach(item => {
    const moduleName = item.invoice_module?.module_name || 'Uncategorized';
    if (!groupedModules[moduleName]) {
      groupedModules[moduleName] = [];
    }
    groupedModules[moduleName].push(item);
  });

  let grandTotal = 0;
  let globalIndex = 0;

  // Calculate grand total
  Object.values(groupedModules).forEach(moduleItems => {
    moduleItems.forEach(item => {
      const qty = parseFloat(item.count || 0);
      const price = parseFloat(item.price || 0);
      const total = qty * price;
      grandTotal += item.is_price_visible ? total : 0;
    });
  });

  return (
    <Document>


      <Page size="A4" style={styles.page1}>
        <Text style={styles.watermark}>Quotation</Text>
        <Header company={CompanyProfile} />
        <ClientInfo client={client} data={data} />
      </Page>

      <Page size="A4" style={styles.page2} wrap>


        {Object.entries(groupedModules).map(([moduleName, items]) => (
          <View key={moduleName} style={styles.moduleSection}>
            {/* Module Name Header */}
            <Text style={styles.moduleHeader}>UNIT TYPE: {moduleName}</Text>

            {/* Table for Module Items */}
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={styles.col1}>S.No</Text>
                <Text style={styles.col2}>Module</Text>
                <Text style={styles.col4}>Quantity</Text>
                <Text style={styles.col5}>Price</Text>
                <Text style={styles.col6}>Total</Text>
                <Text style={styles.col3}>Description</Text>
                <Text style={styles.col3}>Dimensions</Text>

              </View>

              {/* Table Rows for Items */}
              {items.map((item, itemIndex) => {
                const qty = parseFloat(item.count || 0);
                const price = parseFloat(item.price || 0);
                const isVisible = item.is_price_visible;
                const total = qty * price;
                let dimensions = [];
                try {
                  dimensions = JSON.parse(item.additional_description || '[]');
                } catch { }

                globalIndex++;
                return (
                  <View key={item.id || globalIndex} style={styles.tableRow}>
                    <Text style={styles.dataCol1}>{itemIndex + 1}</Text>
                    <Text style={styles.dataCol2}>{item.item_name}</Text>
                    <Text style={styles.dataCol4}>{qty}</Text>
                    <Text style={styles.dataCol5}>{isVisible ? price.toFixed(2) : '—'}</Text>
                    <Text style={styles.dataCol6}>{isVisible ? total.toFixed(2) : '—'}</Text>
                    <Text style={styles.dataCol3}>
                      {item.description ? <>{item.description}</> : 'NA'}
                    </Text>
                    {
                      dimensions.length > 0 ? (
                        <Text style={styles.dataCol3}>
                          {dimensions.map((d, i) => (
                            <React.Fragment key={`dim-${i}`}>
                              {d.type}: {d.value}{d.si}
                              {'\n'}
                            </React.Fragment>
                          ))}
                        </Text>
                      ) : (
                        <Text style={styles.dataCol3}>NA</Text>
                      )
                    }
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        {/* Grand Total Section */}
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
      </Page>

      {/* Bank Details and Signature Page */}
      <Page size="A4" style={styles.lastpage}>
        <BankDetails bankAccount={BankProfile} />
        <SignatureSection bankAccount={BankProfile} />
      </Page>
    </Document>
  );
};






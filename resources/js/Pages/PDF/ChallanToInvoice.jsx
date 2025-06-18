import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Constants
const COLORS = {
  primary: '#2c3e50',
  secondary: '#27ae60',
  accent: '#e67e22',
  lightBg: '#f8f9fa',
  border: '#dfe6e9',
  textDark: '#2d3436',
  textLight: '#636e72',
};

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
  table: { width: '100%' },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 5,
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
  colSerial: { width: '8%', fontSize: FONT_SIZES.small },
  colDesc: { width: '18%', fontSize: FONT_SIZES.small },
  colUnit: { width: '15%', fontSize: FONT_SIZES.small },
  colQty: { width: '12%', fontSize: FONT_SIZES.small },
  colPrice: { width: '10%', fontSize: FONT_SIZES.small },
  colTotal: { width: '10%', fontSize: FONT_SIZES.small },
  colRemarks: { width: '34%', fontSize: FONT_SIZES.small },
  totalsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightBg,
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  totalsLabel: { width: '70%', fontSize: FONT_SIZES.medium, textAlign: 'right', paddingRight: 10 },
  totalsValue: { width: '30%', fontSize: FONT_SIZES.medium, textAlign: 'right', fontWeight: 'bold' },
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
    fontSize: FONT_SIZES.small,
    color: COLORS.textLight,
    textAlign: 'center',
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingTop: 10,
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


const ClientInfo = ({ client, serviceCharge, hasPrices }) => (

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
        <Text style={{ fontWeight: 'bold' }}>Date:</Text>
        {new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </Text>
      {hasPrices && <Text style={styles.companyDetails}>Service Charge: {serviceCharge}%</Text>}
    </View>
  </View>
);

const ItemsTable = ({ items, hasPrices }) => (
  <View style={styles.sectionContainer}>
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={[styles.colSerial, { color: 'white' }]}>S.No</Text>
        <Text style={[styles.colDesc, { color: 'white' }]}>DESCRIPTION</Text>
        <Text style={[styles.colUnit, { color: 'white' }]}>UNIT</Text>
        <Text style={[styles.colQty, { color: 'white' }]}>QUANTITY</Text>
        {hasPrices && (
          <>
            <Text style={[styles.colPrice, { color: 'white' }]}>PRICE</Text>
            <Text style={[styles.colTotal, { color: 'white' }]}>TOTAL</Text>
          </>
        )}
        <Text style={[styles.colRemarks, { color: 'white' }]}>REMARKS</Text>
      </View>
      {items.map((item, index) => (
        <View key={index} style={[styles.tableRow, { backgroundColor: index % 2 === 0 ? '#fff' : COLORS.lightBg }]}>
          <Text style={styles.colSerial}>{index + 1}</Text>
          <Text style={styles.colDesc}>
            {item.description || 'NA'}
            {'\n'}
            <Text style={styles.dateText}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </Text>
          <Text style={styles.colUnit}>{item.unit_type || 'NA'}</Text>
          <Text style={styles.colQty}>{item.qty > 1 ? item.qty : 'NA'}</Text>
          {hasPrices && (
            <>
              <Text style={styles.colPrice}>₹{item.price}</Text>
              <Text style={styles.colTotal}>₹{item.total}</Text>
            </>
          )}
          <Text style={styles.colRemarks}>
            {wrapBy5Words(item.narration)}
          </Text>
        </View>
      ))}
    </View>
  </View>
);

const ChallanToInvoice = ({ company_profile, data, client, bankAccount }) => {


  const currentDate = new Date().toLocaleDateString();
  
  const formattedDate = currentDate;

  const serviceCharge = parseFloat(data?.service_charge) || 0;
  
  const rawItems = data?.items || [];

  const tableData = rawItems.filter((item, index, self) => {
    const firstOccurrenceIndex = self.findIndex((i) => {

      return i.description === item.description && i.unit_type === item.unit_type && i.price === item.price && i.qty === item.qty;
    });
    return index === firstOccurrenceIndex;

  });


  // Step 2: Filter out duplicates (keep only first occurrence)
  const filteredItems = rawItems.filter((item, index, self) => {


    const firstOccurrenceIndex = self.findIndex((i) => {

      return i.description === item.description && i.unit_type === item.unit_type && i.price === item.price && i.qty === item.qty;
    });
    return index === firstOccurrenceIndex;
  });



  let subtotal = 0, inTotal = 0, outTotal = 0, returns = 0;

  const items = filteredItems.map((item, index) => {
    const price = parseFloat(item.price) || 0;
    const total = parseFloat(item.total) || 0;

    if (item.payment_flow === 1) {
      inTotal += total;
    } else if (item.payment_flow === 0) {
      outTotal += total;
    } else if (item.payment_flow === null) {
      returns += total;
    }

    if (item.is_price_visible) subtotal += total;

    return { ...item, price, total };
  });

  // Spends exclude returns
  const spends = outTotal - returns;

  // Service charge applies on spends
  const serviceChargeAmount = spends * serviceCharge / 100;
  const outWithServiceCharge = spends + serviceChargeAmount;

  // Final balances
  const remainingBalance = inTotal - outWithServiceCharge;

  // Flag to check if any visible prices exist
  const hasPrices = items.some(i => i.is_price_visible);


  const ITEMS_PER_PAGE = 20;
  const pages = Math.ceil(items.length / ITEMS_PER_PAGE);


  return (
    <Document>

      <Page size="A4" style={[styles.page1, { justifyContent: 'center' }]}>
        <Header company={company_profile} />
        <ClientInfo client={client}  serviceCharge={serviceCharge} hasPrices={hasPrices} />
      </Page>


      {Array.from({ length: pages }).map((_, pageIndex) => {
        const pageItems = items.slice(pageIndex * ITEMS_PER_PAGE, (pageIndex + 1) * ITEMS_PER_PAGE);
        return (
          <Page key={pageIndex} size="A4" style={styles.page2}>
            <ItemsTable items={tableData} hasPrices={hasPrices} />
            {hasPrices && pageIndex === pages - 1 && (
              <View style={styles.sectionContainer}>
                <View style={styles.table}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.totalsLabel, { color: 'white' }]}>BALANCE SUMMARY</Text>
                    <Text style={[styles.totalsValue, { color: 'white' }]}>AMOUNT</Text>
                  </View>
                  <View style={styles.totalsRow}>
                    <Text style={styles.totalsLabel}>Account Total:</Text>
                    <Text style={styles.totalsValue}>{inTotal}</Text>
                  </View>
                  <View style={[styles.totalsRow, { backgroundColor: COLORS.accent }]}>
                    <Text style={[styles.totalsLabel, { color: 'white' }]}>Total Spend:</Text><Text style={[styles.totalsValue, { color: 'white' }]}>{spends}</Text>
                  </View>
                  <View style={styles.totalsRow}><Text style={styles.totalsLabel}>Total Payment (Inclusive Of Service Charge):</Text>
                    <Text style={styles.totalsValue}>{outWithServiceCharge} ({serviceChargeAmount})</Text>
                  </View>
                  <View style={[styles.totalsRow, { backgroundColor: COLORS.accent }]}><Text style={[styles.totalsLabel, { color: 'white' }]}>Remaining Balance:</Text>
                    <Text style={[styles.totalsValue, { color: 'white' }]}>{remainingBalance}</Text>
                  </View>
                </View>
              </View>
            )}
            <View style={styles.footer}>
              <Text>Bill Generated on {currentDate} | {company_profile?.company_name || 'Company Name'}</Text>
              <Text>Thank you for your business!</Text>
            </View>
          </Page>
        );
      })}



      {/* Bank Details and Signature Page */}
      <Page size="A4" style={styles.lastpage}>
        <BankDetails bankAccount={bankAccount} />
        <SignatureSection bankAccount={bankAccount} />
      </Page>


    </Document>
  );
};

export default ChallanToInvoice;




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



const wrapBy5Words = (text) => {
  if (!text) return 'NA';
  const words = text.split(' ');
  const lines = [];
  for (let i = 0; i < words.length; i += 5) {
    lines.push(words.slice(i, i + 5).join(' '));
  }
  return lines.join('\n');
};
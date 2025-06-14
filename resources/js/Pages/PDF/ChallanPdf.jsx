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
    paddingTop: '35%',
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
  lastpage: {
    paddingTop: '30%',
    paddingRight: 40,
    paddingBottom: 40,
    paddingLeft: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  header: {
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  logo: { width: 70, height: 70, marginBottom: 10 },
  companyName: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 3,
    textAlign: 'center',
  },
  companyDetails: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
    lineHeight: 1.5,
    textAlign: 'center',
  },
  sectionContainer: { marginBottom: 20 },
  sectionTitle: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoContainer: {
    padding: 15,
    backgroundColor: COLORS.lightBg,
    borderRadius: 4,
    alignItems: 'center',
  },
  value: { fontSize: FONT_SIZES.medium, color: COLORS.textDark },
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
    borderBottomColor: COLORS.border,
    paddingVertical: 6,
    paddingHorizontal: 5,
    minHeight: 25,
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
    <Text style={styles.companyName}>{company?.company_name || 'Company Name'}</Text>
    <Text style={styles.companyDetails}>
      {company?.company_address || 'Address'}\nPhone: {company?.company_contact_no || 'N/A'}\nEmail: {company?.company_email || 'N/A'}
    </Text>
  </View>
);

const ClientInfo = ({ client, challan, serviceCharge, hasPrices }) => (
  <View style={styles.infoContainer}>
    <Text style={styles.sectionTitle}>Deliver To:</Text>
    <Text style={[styles.value, { fontSize: FONT_SIZES.large, fontWeight: 'bold' }]}>{client?.client_name}</Text>
    <Text style={styles.value}>{client?.client_address}</Text>
    <Text style={styles.value}>Phone: {client?.client_phone}</Text>
    <Text style={styles.value}>Email: {client?.client_email}</Text>
    <Text style={styles.value}>Site Name: {client?.site_name}</Text>
    <Text style={styles.value}>Dated: {challan?.date}</Text>
    {hasPrices && <Text style={styles.value}>Service Charge: {serviceCharge}%</Text>}
  </View>
);

const ItemsTable = ({ items, hasPrices }) => (
  <View style={styles.sectionContainer}>
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={[styles.colSerial, { color: 'white' }]}>S.No</Text>
        <Text style={[styles.colDesc, { color: 'white' }]}>DESCRIPTION</Text>
        <Text style={[styles.colUnit, { color: 'white' }]}>UNIT</Text>
        <Text style={[styles.colQty, { color: 'white' }]}>QTY</Text>
        {hasPrices && <><Text style={[styles.colPrice, { color: 'white' }]}>PRICE</Text><Text style={[styles.colTotal, { color: 'white' }]}>TOTAL</Text></>}
        <Text style={[styles.colRemarks, { color: 'white' }]}>REMARKS</Text>
      </View>
      {items.map((item, index) => (
        <View key={index} style={[styles.tableRow, { backgroundColor: index % 2 === 0 ? '#fff' : COLORS.lightBg }]}>
          <Text style={styles.colSerial}>{index + 1}</Text>
          <Text style={styles.colDesc}>
            {item.description}

            {'\n'}
            <Text style={styles.dateText}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>

          </Text>
          <Text style={styles.colUnit}>{item.unit_type}</Text>
          <Text style={styles.colQty}>{item.qty > 1 ? item.qty : 'NA'}</Text>
          {hasPrices && <><Text style={styles.colPrice}>{item.price}</Text><Text style={styles.colTotal}>{item.total}</Text></>}
          <Text style={styles.colRemarks}>{wrapBy5Words(item.narration)}</Text>
        </View>
      ))}
    </View>
  </View>
);

const ChallanPdf = ({ company_profile, challan, client, bankAccount }) => {
  const currentDate = new Date().toLocaleDateString();
  const formattedDate = challan?.created_at ? new Date(challan.created_at).toLocaleDateString() : currentDate;


  const serviceCharge = parseFloat(challan?.service_charge) || 0;
  const rawItems = challan?.challans || [];
  const hasPrices = rawItems.some(i => i.is_price_visible);

  let subtotal = 0, inTotal = 0, outTotal = 0;
  rawItems.map((item, index) => {
    const price = parseFloat(item.price) || 0;
    const total = item.total;


    if (item.payment_flow === 1) inTotal += total;
    else if (item.payment_flow === 0) outTotal += total;

    if (item.is_price_visible) subtotal += total;

    return { ...item, price, total };
  });

  const serviceChargeAmount = outTotal * serviceCharge / 100;
  const outWithServiceCharge = outTotal + serviceChargeAmount;
  const balance = inTotal - outTotal;  
  const spends = outTotal;             
  const remainingBalance = inTotal - outWithServiceCharge;  


  const ITEMS_PER_PAGE = 20;
  const pages = Math.ceil(rawItems.length / ITEMS_PER_PAGE);

  return (
    <Document>
      <Page size="A4" style={[styles.page1, { justifyContent: 'center' }]}>
        <Header company={company_profile} />
        <ClientInfo client={client} challan={{ ...challan, date: formattedDate }} serviceCharge={serviceCharge} hasPrices={hasPrices} />
      </Page>

      {Array.from({ length: pages }).map((_, pageIndex) => {
        const pageItems = rawItems.slice(pageIndex * ITEMS_PER_PAGE, (pageIndex + 1) * ITEMS_PER_PAGE);
        return (
          <Page key={pageIndex} size="A4" style={styles.page2}>
            <ItemsTable items={pageItems} hasPrices={hasPrices} />
            {hasPrices && pageIndex === pages - 1 && (
              <View style={styles.sectionContainer}>
                <View style={styles.table}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.totalsLabel, { color: 'white' }]}>BALANCE SUMMARY</Text>
                    <Text style={[styles.totalsValue, { color: 'white' }]}>AMOUNT</Text>
                  </View>
                  <View style={styles.totalsRow}>
                    <Text style={styles.totalsLabel}>Account Total:</Text>
                    <Text style={styles.totalsValue}>{inTotal.toFixed(2)}</Text>
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

export default ChallanPdf;


const wrapBy5Words = (text) => {
  if (!text) return 'NA';
  const words = text.split(' ');
  const lines = [];
  for (let i = 0; i < words.length; i += 5) {
    lines.push(words.slice(i, i + 5).join(' '));
  }
  return lines.join('\n');
};


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

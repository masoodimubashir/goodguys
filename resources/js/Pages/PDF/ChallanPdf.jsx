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

const FONT_SIZES = {
  small: 8,
  medium: 9,
  large: 10,
  xlarge: 12,
  xxlarge: 20,
  title: 28,
};

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  header: {
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  companyDetails: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
    lineHeight: 1.4,
  },
  challanTitle: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.secondary,
    textAlign: 'right',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  twoColumnLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    width: '48%',
  },
  infoContainer: {
    padding: 15,
    backgroundColor: COLORS.lightBg,
    borderRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textLight,
    fontWeight: 'bold',
  },
  value: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textDark,
  },
  table: {
    width: '100%',
  },
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
  colDesc: { width: '25%', fontSize: FONT_SIZES.small },
  colUnit: { width: '12%', fontSize: FONT_SIZES.small },
  colQty: { width: '10%', fontSize: FONT_SIZES.small, textAlign: 'right' },
  colPrice: { width: '12%', fontSize: FONT_SIZES.small, textAlign: 'right' },
  colTotal: { width: '12%', fontSize: FONT_SIZES.small, textAlign: 'right' },
  colRemarks: { width: '21%', fontSize: FONT_SIZES.small },
  totalsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightBg,
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  totalsLabel: {
    width: '70%',
    fontSize: FONT_SIZES.medium,
    textAlign: 'right',
    paddingRight: 10,
  },
  totalsValue: {
    width: '30%',
    fontSize: FONT_SIZES.medium,
    textAlign: 'right',
    fontWeight: 'bold',
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
  watermark: {
    position: 'absolute',
    opacity: 0.05,
    fontSize: 60,
    color: COLORS.primary,
    transform: 'rotate(-45deg)',
    left: 150,
    top: 400,
    zIndex: -1,
  },
  pageTitle: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: COLORS.primary,
  },
});

// Components
const Header = ({ company }) => (
  <View style={styles.header}>
    <View style={styles.logoSection}>
      {company?.logo && <Image style={styles.logo} src={`/storage/${company.logo}`} />}
      <View style={styles.companyInfo}>
        <Text style={styles.companyName}>{company?.company_name || 'Company Name'}</Text>
        <Text style={styles.companyDetails}>
          {company?.company_address || 'Address'}{'\n'}
          Phone: {company?.company_contact_no || 'N/A'}{'\n'}
          Email: {company?.company_email || 'N/A'}
        </Text>
      </View>
    </View>
    <Text style={styles.challanTitle}>CHALLAN</Text>
  </View>
);

const ClientInfo = ({ client, challan, serviceCharge, hasPrices }) => (
  <View style={[styles.infoContainer, styles.sectionContainer]}>
    <View style={styles.twoColumnLayout}>
      <View style={styles.column}>
        <Text style={styles.sectionTitle}>Deliver To:</Text>
        <Text style={[styles.value, { fontSize: FONT_SIZES.large, marginBottom: 3, fontWeight: 'bold' }]}>{client?.client_name}</Text>
        <Text style={styles.value}>{client?.client_address}</Text>
        <Text style={styles.value}>Phone: {client?.client_phone}</Text>
        <Text style={styles.value}>Email: {client?.client_email}</Text>
        <Text style={[styles.value, { marginTop: 5 }]}>Site Name: {client?.site_name}</Text>
      </View>
      <View style={styles.column}>
        <View style={styles.infoRow}><Text style={styles.label}>Challan Date:</Text><Text style={styles.value}>{challan?.date}</Text></View>
        {hasPrices && <View style={styles.infoRow}><Text style={styles.label}>Service Charge:</Text><Text style={styles.value}>{serviceCharge}%</Text></View>}
      </View>
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
        <Text style={[styles.colQty, { color: 'white' }]}>QTY</Text>
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
          <Text style={styles.colDesc}>{item.description || 'NA'}</Text>
          <Text style={styles.colUnit}>{item.unit_type || 'NA'}</Text>
          <Text style={styles.colQty}>{item.quantity > 1 ? item.quantity : 'NA' }</Text>
          {hasPrices && (
            <>
              <Text style={styles.colPrice}>₹{item.price}</Text>
              <Text style={styles.colTotal}>₹{item.total}</Text>
            </>
          )}
          <Text style={styles.colRemarks}>{item.narration || '-'}</Text>
        </View>
      ))}
    </View>
  </View>
);

const ChallanPdf = ({ company_profile, challan, client }) => {
  const currentDate = new Date().toLocaleDateString();
  const formattedDate = challan?.created_at ? new Date(challan.created_at).toLocaleDateString() : currentDate;

  const serviceCharge = parseFloat(challan?.service_charge) || 0;
  const rawItems = challan?.challans || [];
  const filteredItems = rawItems.filter(item => item.is_credited === 0);

  let subtotal = 0, inTotal = 0, outTotal = 0;

  const items = filteredItems.map((item, index) => {

    const quantity = parseFloat(item.qty) || 0;
    const price = parseFloat(item.price) || 0;
    const total = quantity > 1 ? quantity * price : price;

    if (item.unit_type === 'in') inTotal += total;
    else if (item.unit_type === 'out') outTotal += total;

    if (item.is_price_visible) subtotal += total;

    return {
      ...item,
      serialNo: index + 1,
      quantity,
      price,
      itemTotal: total,
       price,
       total,
    };
  });

  const serviceChargeAmount = outTotal * serviceCharge / 100;
  const outWithServiceCharge = outTotal + serviceChargeAmount;
  const remainingBalance = inTotal - outWithServiceCharge;
  const hasPrices = items.some(i => i.is_price_visible);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.watermark}>CHALLAN</Text>
        <Header company={company_profile} />
        <Text style={[styles.value, { textAlign: 'right', fontSize: FONT_SIZES.large, marginBottom: 10 }]}>
          No: {challan?.challan_number || 'N/A'}
        </Text>
        <ClientInfo client={client} challan={{ ...challan, date: formattedDate, prepared_by: company_profile?.company_name }} serviceCharge={serviceCharge} hasPrices={hasPrices} />
        <ItemsTable items={rawItems} hasPrices={hasPrices} />

        {hasPrices && (
          <View style={styles.sectionContainer}>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.totalsLabel, { color: 'white' }]}>BALANCE SUMMARY</Text>
                <Text style={[styles.totalsValue, { color: 'white' }]}>AMOUNT (₹)</Text>
              </View>
              <View style={styles.totalsRow}><Text style={styles.totalsLabel}>Total IN:</Text><Text style={styles.totalsValue}>{inTotal.toFixed(2)}</Text></View>
              <View style={styles.totalsRow}><Text style={styles.totalsLabel}>Total OUT + Service ({serviceCharge}%):</Text><Text style={styles.totalsValue}>{outWithServiceCharge.toFixed(2)}</Text></View>
              <View style={[styles.totalsRow, { backgroundColor: COLORS.accent }]}><Text style={[styles.totalsLabel, { color: 'white' }]}>Remaining Balance:</Text><Text style={[styles.totalsValue, { color: 'white' }]}>{remainingBalance.toFixed(2)}</Text></View>
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <Text>Challan generated on {currentDate} | {company_profile?.company_name || 'Company Name'}</Text>
          <Text>Thank you for your business!</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ChallanPdf;
